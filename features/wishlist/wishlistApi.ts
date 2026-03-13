import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    WishlistResponse,
    ApiResponse,
    AddWishlistRequest,
    MoveWishlistToCartRequest,
} from '../../types/wishlist';

export const wishlistApi = createApi({
    reducerPath: 'wishlistApi',
    tagTypes: ['Wishlist', 'Cart'],
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

        // POST /api/wishlist - Add product to wishlist
        addToWishlist: builder.mutation<ApiResponse, AddWishlistRequest>({
            query: (body) => ({
                url: 'api/wishlist',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wishlist'],
        }),

        // POST /api/wishlist/move-to-cart - Move multiple items to cart
        moveWishlistToCart: builder.mutation<ApiResponse, MoveWishlistToCartRequest>({
            query: (body) => ({
                url: 'api/wishlist/move-to-cart',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Wishlist', 'Cart'],
        }),

        // DELETE /api/wishlist/{wishlistItemId} - Remove item from wishlist
        removeFromWishlist: builder.mutation<ApiResponse, number>({
            query: (wishlistItemId) => ({
                url: `api/wishlist/${wishlistItemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist'],
        }),

        // DELETE /api/wishlist/clear - Clear entire wishlist
        clearWishlist: builder.mutation<ApiResponse, void>({
            query: () => ({
                url: 'api/wishlist/clear',
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist'],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useMoveWishlistToCartMutation,
    useRemoveFromWishlistMutation,
    useClearWishlistMutation,
} = wishlistApi;
