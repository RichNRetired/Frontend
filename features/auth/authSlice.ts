import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { mergeGuestCartIntoAccount } from "@/lib/cart-auth";
import type { AppDispatch, RootState } from "@/store";
import {
    AuthResponse,
    login as loginApi,
    register as registerApi,
} from "@/services/auth.service";

interface AuthUser {
    name: string | null;
    email: string | null;
    roles: string | string[] | null;
}

interface JwtPayload {
    name?: string;
    fullname?: string;
    sub?: string;
    email?: string;
    roles?: string | string[];
    role?: string;
}

interface SetCredentialsPayload {
    accessToken?: string | null;
    refreshToken?: string | null;
    tokenType?: string | null;
}

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    tokenType?: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    tokenType: null,
};

type AuthThunkConfig = {
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: string;
};

const toBase64 = (value: string) => value.replaceAll('-', '+').replaceAll('_', '/');

const mapDecodedUser = (decoded: JwtPayload): AuthUser => ({
    name: decoded.name || decoded.fullname || decoded.sub || null,
    email: decoded.email || null,
    roles: decoded.roles || decoded.role || null,
});

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
    ) {
        return error.response.data.message;
    }

    return fallback;
};

function decodeJwt(token?: string | null): JwtPayload | null {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        return JSON.parse(atob(toBase64(payload))) as JwtPayload;
    } catch {
        return null;
    }
}

export const registerUser = createAsyncThunk<AuthResponse, { name: string; email: string; password: string }, AuthThunkConfig>(
    "auth/register",
    async (
        data: { name: string; email: string; password: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const res = await registerApi(data);
            localStorage.setItem("accessToken", res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);
            if (res.tokenType) {
                localStorage.setItem("tokenType", res.tokenType);
            }

            try {
                await mergeGuestCartIntoAccount(dispatch);
            } catch (mergeError) {
                console.error("Guest cart merge after registration failed", mergeError);
            }

            return res;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Registration failed"));
        }
    }
);
export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }, AuthThunkConfig>(
    "auth/login",
    async (
        credentials: { email: string; password: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const data = await loginApi(credentials);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            if (data.tokenType) {
                localStorage.setItem("tokenType", data.tokenType);
            }

            try {
                await mergeGuestCartIntoAccount(dispatch);
            } catch (mergeError) {
                console.error("Guest cart merge after login failed", mergeError);
            }

            return data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Invalid credentials"));
        }
    }
);

export const requestOtpThunk = createAsyncThunk<{ message: string }, { identifier: string }, AuthThunkConfig>(
    "auth/requestOtp",
    async (data: { identifier: string }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, '')}/api/auth/request-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                throw new Error('Failed to request OTP');
            }
            return await res.json();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Failed to request OTP"));
        }
    }
);

export const verifyOtpThunk = createAsyncThunk<AuthResponse, { identifier: string; otp: string }, AuthThunkConfig>(
    "auth/verifyOtp",
    async (data: { identifier: string; otp: string }, { dispatch, rejectWithValue }) => {
        try {
            const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, '')}/api/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                throw new Error('Failed to verify OTP');
            }
            const responseData = await res.json();
            localStorage.setItem("accessToken", responseData.accessToken);
            localStorage.setItem("refreshToken", responseData.refreshToken);
            if (responseData.tokenType) {
                localStorage.setItem("tokenType", responseData.tokenType);
            }

            try {
                await mergeGuestCartIntoAccount(dispatch);
            } catch (mergeError) {
                console.error("Guest cart merge after OTP login failed", mergeError);
            }

            return responseData;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Invalid OTP"));
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<SetCredentialsPayload | undefined>) {
            const payload = action.payload || {};
            const accessToken = payload.accessToken || localStorage.getItem('accessToken');
            const refreshToken = payload.refreshToken || localStorage.getItem('refreshToken');
            const tokenType = payload.tokenType || localStorage.getItem('tokenType');

            if (accessToken) localStorage.setItem('accessToken', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            if (tokenType) localStorage.setItem('tokenType', tokenType);

            state.isAuthenticated = true;
            state.tokenType = tokenType ?? state.tokenType;

            const decoded = decodeJwt(accessToken);
            if (decoded) {
                state.user = mapDecodedUser(decoded);
            }
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenType");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isAuthenticated = true;
                state.user = null;
                if (!state.user) {
                    const token = action.payload.accessToken || localStorage.getItem('accessToken');
                    const decoded = decodeJwt(token);
                    if (decoded) {
                        state.user = mapDecodedUser(decoded);
                    }
                }
                state.tokenType = action.payload.tokenType ?? null;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isAuthenticated = true;
                state.user = null;
                if (!state.user) {
                    const token = action.payload.accessToken || localStorage.getItem('accessToken');
                    const decoded = decodeJwt(token);
                    if (decoded) {
                        state.user = mapDecodedUser(decoded);
                    }
                }
                state.tokenType = action.payload.tokenType ?? null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(requestOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestOtpThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(requestOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(verifyOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtpThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isAuthenticated = true;
                state.user = null;
                if (!state.user) {
                    const token = action.payload.accessToken || localStorage.getItem('accessToken');
                    const decoded = decodeJwt(token);
                    if (decoded) {
                        state.user = mapDecodedUser(decoded);
                    }
                }
                state.tokenType = action.payload.tokenType ?? null;
            })
            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
