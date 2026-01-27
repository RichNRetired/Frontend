import axios from "axios";
import { store } from "../store";
import { logout, setCredentials } from "../features/auth/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '/';

const instance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

// attach access token
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// helper axios without our interceptors (for refresh)
const axiosNoIntercept = axios.create({ baseURL: API_BASE, withCredentials: true });

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalConfig = err.config;

        if (!originalConfig) return Promise.reject(err);

        if (err.response && err.response.status === 401 && !originalConfig._retry) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                store.dispatch(logout());
                return Promise.reject(err);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalConfig.headers.Authorization = `Bearer ${token}`;
                        return instance(originalConfig);
                    })
                    .catch((e) => Promise.reject(e));
            }

            originalConfig._retry = true;
            isRefreshing = true;

            try {
                const response = await axiosNoIntercept.post('/api/auth/refresh', { refreshToken });
                const data = response.data;
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
                processQueue(null, data.accessToken);
                originalConfig.headers.Authorization = `Bearer ${data.accessToken}`;
                return instance(originalConfig);
            } catch (e) {
                processQueue(e, null);
                store.dispatch(logout());
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default instance;

export { axiosNoIntercept };
