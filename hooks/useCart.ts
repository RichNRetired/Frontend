import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
    useGetCartQuery,
    useGetCartSummaryQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useMergeCartMutation,
} from '../features/cart/cartApi';
import { setCart } from '../features/cart/cartSlice';
import { useEffect } from 'react';

export const useCart = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const { data: cartData, isLoading, error, refetch } = useGetCartQuery();
    const { data: cartSummary, refetch: refetchSummary } = useGetCartSummaryQuery();
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [updateCart, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [mergeCart, { isLoading: isMerging }] = useMergeCartMutation();

    // Sync API cart data with Redux state
    useEffect(() => {
        const sourceItems = cartSummary?.items ?? cartData;

        if (sourceItems) {
            dispatch(
                setCart(
                    sourceItems.map((item) => ({
                        id: String(item.cartItemId),
                        productId: item.productId,
                        categoryId: (() => {
                            const categoryId = Number(item.categoryId ?? item.category?.id);
                            return Number.isFinite(categoryId) && categoryId > 0
                                ? categoryId
                                : undefined;
                        })(),
                        name: item.productName,
                        price: Number(item.price ?? 0),
                        quantity: Number(item.quantity ?? 1),
                        image: item.imageUrl,
                        variantId: item.variantId,
                        color: item.color,
                        size: item.size,
                        mrp: item.mrp,
                        discountPercentage: item.discountPercentage,
                    })),
                ),
            );
        }
    }, [cartData, cartSummary, dispatch]);

    return {
        // State
        cart,
        items: cart.items,
        cartSummary,
        isLoading,
        error,

        // Loading states
        isAdding,
        isUpdating,
        isRemoving,
        isMerging,

        // Mutations with auto state sync
        addToCart: async (productId: number, variantId: number, qty: number) => {
            return addToCart({ productId, variantId, qty }).unwrap();
        },
        updateQuantity: async (cartItemId: number, qty: number, variantId: number) => {
            if (qty <= 0) return;
            return updateCart({ cartItemId, qty, variantId }).unwrap();
        },
        removeFromCart: async (cartItemId: number) => {
            return removeFromCart(cartItemId).unwrap();
        },
        mergeCart: async (items: Array<{ productId: number; variantId: number; quantity: number }>) => {
            return mergeCart(items).unwrap();
        },

        // Utilities
        refetch: async () => {
            await Promise.all([refetch(), refetchSummary()]);
        },
    };
};
