import { useState } from 'react';
import {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} from '../features/wishlist/wishlistApi';
import { WishlistItem } from '../types/wishlist';

export const useWishlist = (page: number = 0, size: number = 10) => {
    const { data: wishlistData, isLoading, error, refetch } = useGetWishlistQuery({ page, size });
    const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
    const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

    return {
        // State
        wishlist: wishlistData?.content || [],
        totalElements: wishlistData?.totalElements || 0,
        totalPages: wishlistData?.totalPages || 0,
        currentPage: page,
        isLoading,
        error,

        // Loading states
        isAdding,
        isRemoving,

        // Mutations
        addToWishlist: async (productId: number) => {
            return addToWishlist(productId).unwrap();
        },
        removeFromWishlist: async (productId: number) => {
            return removeFromWishlist(productId).unwrap();
        },

        // Utilities
        refetch,
    };
};
