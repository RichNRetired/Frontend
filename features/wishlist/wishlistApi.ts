import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WishlistItem, WishlistResponse, ApiResponse } from '../../types/wishlist';

export const wishlistApi = createApi({
    reducerPath: 'wishlistApi',
    tagTypes: ['Wishlist'],
    baseQuery: fetchBaseQuery({
        baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, ''),
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
        // GET /api/wishlist - Get all wishlist items with pagination
        getWishlist: builder.query<WishlistResponse, { page?: number; size?: number }>({
            query: ({ page = 0, size = 10 }) => ({
                url: 'api/wishlist',
                method: 'GET',
                params: { page, size },
            }),
            providesTags: ['Wishlist'],
        }),

        // POST /api/wishlist/{productId} - Add product to wishlist
        addToWishlist: builder.mutation<ApiResponse, number>({
            query: (productId) => ({
                url: `api/wishlist/${productId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Wishlist'],
        }),

        // DELETE /api/wishlist/{productId} - Remove product from wishlist
        removeFromWishlist: builder.mutation<ApiResponse, number>({
            query: (productId) => ({
                url: `api/wishlist/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist'],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} = wishlistApi;
