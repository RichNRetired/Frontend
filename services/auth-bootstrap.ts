'use client';

import { axiosNoIntercept } from './axios';
import { store } from '../store';
import { setCredentials, logout } from '../features/auth/authSlice';
import {
    mergeGuestCartIntoAccount,
    syncGuestCartToStore,
} from '../lib/cart-auth';

function decodeJwt(token?: string | null) {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/')));
        return decoded;
    } catch (error) {
        console.error('Failed to decode auth token during bootstrap', error);
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
    if (!decoded?.exp) return;
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    // refresh 60 seconds before expiry
    const ms = Math.max(expiresAt - now - 60000, 0);
    refreshTimer = setTimeout(() => {
        doRefresh();
    }, ms);
};

export const doRefresh = async () => {
    if (globalThis.window === undefined) return null;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        store.dispatch(logout());
        return null;
    }

    try {
        const res = await axiosNoIntercept.post('/auth/refresh', { refreshToken });
        const data = res.data;
        if (data?.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
        }
        if (data?.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data?.tokenType) {
            localStorage.setItem('tokenType', data.tokenType);
        }
        store.dispatch(setCredentials(data));
        scheduleRefresh(data.accessToken);
        await mergeGuestCartIntoAccount(store.dispatch);
        return data;
    } catch (error) {
        console.error('Token refresh failed', error);
        store.dispatch(logout());
        syncGuestCartToStore(store.dispatch);
        return null;
    }
};

const initAuth = async () => {
    if (globalThis.window === undefined) return;
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken && refreshToken) {
        await doRefresh();
        return;
    }
    if (accessToken?.length) {
        scheduleRefresh(accessToken);
        // ensure store is populated
        store.dispatch(setCredentials({ accessToken }));
        try {
            await mergeGuestCartIntoAccount(store.dispatch);
        } catch (error) {
            console.error('Failed to initialize authenticated cart', error);
        }
        return;
    }

    syncGuestCartToStore(store.dispatch);
};

export default initAuth;
