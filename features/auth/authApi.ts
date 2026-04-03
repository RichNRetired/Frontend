import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${(process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, '')}/api`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const tokenType = typeof window !== 'undefined' ? localStorage.getItem('tokenType') || 'Bearer' : 'Bearer';
                if (token) headers.set('Authorization', `${tokenType} ${token}`);
            } catch (e) {
                // ignore on server
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/customer/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        requestOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/request-otp',
                method: 'POST',
                body: data,
            }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useRequestOtpMutation, useVerifyOtpMutation } = authApi;