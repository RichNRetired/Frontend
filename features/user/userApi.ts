import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User', 'Addresses'],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
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
        // profile
        getProfile: builder.query<any, void>({
            query: () => ({ url: '/api/user/profile', method: 'GET' }),
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<any, Partial<any>>({
            query: (body) => ({ url: '/api/user/profile', method: 'POST', body }),
            invalidatesTags: ['User'],
        }),

        // addresses
        getAddresses: builder.query<any[], void>({
            query: () => ({ url: '/api/user/addresses', method: 'GET' }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }: any) => ({ type: 'Addresses' as const, id })),
                        { type: 'Addresses', id: 'LIST' },
                    ]
                    : [{ type: 'Addresses', id: 'LIST' }],
        }),
        addAddress: builder.mutation<any, Partial<any>>({
            query: (body) => ({ url: '/api/user/addresses', method: 'POST', body }),
            invalidatesTags: [{ type: 'Addresses', id: 'LIST' }],
        }),
        deleteAddress: builder.mutation<void, number | string>({
            query: (id) => ({ url: `/api/user/addresses/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Addresses', id }],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetAddressesQuery,
    useAddAddressMutation,
    useDeleteAddressMutation,
} = userApi;