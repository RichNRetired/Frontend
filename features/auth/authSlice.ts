import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginApi } from "@/services/auth.service";
import { register as registerApi } from "@/services/auth.service";

interface AuthState {
    user: any;
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

function decodeJwt(token?: string | null) {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decoded;
    } catch (e) {
        return null;
    }
}
export const registerUser = createAsyncThunk(
    "auth/register",
    async (
        data: { name: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await registerApi(data);
            localStorage.setItem("accessToken", res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);
            if (res.tokenType) {
                localStorage.setItem("tokenType", res.tokenType);
            }

            return res;
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.message || "Registration failed"
            );
        }
    }
);
export const loginUser = createAsyncThunk(
    "auth/login",
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const data = await loginApi(credentials);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            if (data.tokenType) {
                localStorage.setItem("tokenType", data.tokenType);
            }

            return data;
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.message || "Invalid credentials"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action) {
            const payload = action.payload || {};
            const accessToken = payload.accessToken || localStorage.getItem('accessToken');
            const refreshToken = payload.refreshToken || localStorage.getItem('refreshToken');
            const tokenType = payload.tokenType || localStorage.getItem('tokenType');

            if (accessToken) localStorage.setItem('accessToken', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            if (tokenType) localStorage.setItem('tokenType', tokenType);

            state.isAuthenticated = true;
            state.tokenType = tokenType ?? state.tokenType;

            const decoded = decodeJwt(accessToken as string | null);
            if (decoded) {
                state.user = {
                    name: decoded.name || decoded.fullname || decoded.sub || null,
                    email: decoded.email || null,
                    roles: decoded.roles || decoded.role || null,
                };
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
                state.user = (action.payload as any)?.user ?? null;
                if (!state.user) {
                    const token = (action.payload as any)?.accessToken || localStorage.getItem('accessToken');
                    const decoded = decodeJwt(token as string | null);
                    if (decoded) {
                        state.user = {
                            name: decoded.name || decoded.fullname || decoded.sub || null,
                            email: decoded.email || null,
                            roles: decoded.roles || decoded.role || null,
                        };
                    }
                }
                state.tokenType = (action.payload as any)?.tokenType ?? null;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isAuthenticated = true;
                state.user = (action.payload as any)?.user ?? null;
                if (!state.user) {
                    const token = (action.payload as any)?.accessToken || localStorage.getItem('accessToken');
                    const decoded = decodeJwt(token as string | null);
                    if (decoded) {
                        state.user = {
                            name: decoded.name || decoded.fullname || decoded.sub || null,
                            email: decoded.email || null,
                            roles: decoded.roles || decoded.role || null,
                        };
                    }
                }
                state.tokenType = (action.payload as any)?.tokenType ?? null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
