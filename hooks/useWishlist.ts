import {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} from '../features/wishlist/wishlistApi';

export const useWishlist = (page: number = 0, size: number = 10) => {
    const { data: wishlistData, isLoading, error, refetch } = useGetWishlistQuery({ page, size });
    const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
    const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

    const resolveVariantId = async (productId: number, variantId: number) => {
        if (variantId > 0) return variantId;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) return 0;

            const productDetails = await response.json();
            const detailVariants = Array.isArray(productDetails?.variants)
                ? productDetails.variants
                : [];

            const activeVariant = detailVariants.find(
                (variant: any) =>
                    variant?.isActive !== false &&
                    typeof variant?.id === "number" &&
                    Number.isFinite(variant.id) &&
                    variant.id > 0,
            );

            const firstValidVariant = detailVariants.find(
                (variant: any) =>
                    typeof variant?.id === "number" &&
                    Number.isFinite(variant.id) &&
                    variant.id > 0,
            );

            return activeVariant?.id ?? firstValidVariant?.id ?? 0;
        } catch {
            return 0;
        }
    };

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
        addToWishlist: async (productId: number, variantId: number = 0, quantity: number = 1) => {
            const resolvedVariantId = await resolveVariantId(productId, variantId);
            return addToWishlist({ productId, variantId: resolvedVariantId, quantity }).unwrap();
        },
        removeFromWishlist: async (wishlistItemId: number) => {
            return removeFromWishlist(wishlistItemId).unwrap();
        },
        removeFromWishlistByProductId: async (productId: number) => {
            const wishlistItem = wishlistData?.content?.find((item) => item.productId === productId);
            if (!wishlistItem) {
                throw new Error('Wishlist item not found for product');
            }
            return removeFromWishlist(wishlistItem.id).unwrap();
        },

        // Utilities
        refetch,
    };
};
