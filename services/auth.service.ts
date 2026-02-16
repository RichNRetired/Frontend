import axios from "./axios";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export const login = async (credentials: {
    email: string;
    password: string;
}): Promise<AuthResponse> => {
    const res = await axios.post("/auth/customer/login", credentials);
    return res.data;
};

export const register = async (userData: {
    name: string;
    email: string;
    password: string;
}): Promise<AuthResponse> => {
    const res = await axios.post("/auth/register", userData);
    return res.data;
};

export const logout = async () => {
    const res = await axios.post("/auth/logout");
    return res.data;
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
    const res = await axios.post("/auth/refresh", {
        refreshToken: token,
    });
    return res.data;
};
