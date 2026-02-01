import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, ProductsResponse } from './productTypes';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('accessToken');
                const tokenType = localStorage.getItem('tokenType') || 'Bearer';

                if (token) {
                    headers.set('Authorization', `${tokenType} ${token}`);
                }
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<ProductsResponse, void>({
            query: () => ({
                url: '/api/products',
            }),
        }),

        getProduct: builder.query<Product, number>({
            query: (id) => `/api/products/${id}`,
        }),
    }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApi;
