import axios from './axios';

export const login = async (credentials: { email: string; password: string }) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userData: { name: string; email: string; password: string }) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};

export const logout = async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
};