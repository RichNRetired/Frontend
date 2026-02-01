import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Category {
    id: number;
    name: string;
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const tokenType = typeof window !== 'undefined' ? localStorage.getItem('tokenType') || 'Bearer' : 'Bearer';
                if (token) headers.set('Authorization', `${tokenType} ${token}`);
            } catch (e) {

            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => '/api/categories',
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApi;
