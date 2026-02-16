'use client';

import { axiosNoIntercept } from './axios';
import { store } from '../store';
import { setCredentials, logout } from '../features/auth/authSlice';

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

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleRefresh = (accessToken?: string | null) => {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    if (!accessToken) return;
    const decoded = decodeJwt(accessToken);
    if (!decoded || !decoded.exp) return;
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    // refresh 60 seconds before expiry
    const ms = Math.max(expiresAt - now - 60000, 0);
    refreshTimer = setTimeout(() => {
        doRefresh();
    }, ms);
};

export const doRefresh = async () => {
    if (typeof window === 'undefined') return null;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        store.dispatch(logout());
        return null;
    }

    try {
        const res = await axiosNoIntercept.post('/auth/refresh', { refreshToken });
        const data = res.data;
        if (data && data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
        }
        if (data && data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data && data.tokenType) {
            localStorage.setItem('tokenType', data.tokenType);
        }
        store.dispatch(setCredentials(data));
        scheduleRefresh(data.accessToken);
        return data;
    } catch (e) {
        store.dispatch(logout());
        return null;
    }
};

const initAuth = async () => {
    if (typeof window === 'undefined') return;
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken && refreshToken) {
        await doRefresh();
        return;
    }
    if (accessToken) {
        scheduleRefresh(accessToken);
        // ensure store is populated
        store.dispatch(setCredentials({ accessToken }));
    }
};

export default initAuth;
