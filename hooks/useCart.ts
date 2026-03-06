import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useMergeCartMutation,
    useGetCartSummaryQuery,
} from '../features/cart/cartApi';
import { removeItem, updateQuantity, setCart } from '../features/cart/cartSlice';
import { useEffect } from 'react';

export const useCart = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const { data: cartData, isLoading, error, refetch } = useGetCartQuery();
    // Optionally, get cart summary with pricing
    // const { data: cartSummary } = useGetCartSummaryQuery();
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [updateCart, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [mergeCart, { isLoading: isMerging }] = useMergeCartMutation();

    // Sync API cart data with Redux state
    useEffect(() => {
        if (cartData) {
            dispatch(
                setCart(
                    cartData.map((item: any) => ({
                        id: String(item.cartItemId),
                        productId: item.productId,
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
    }, [cartData, dispatch]);

    return {
        // State
        cart,
        items: cart.items,
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
        refetch,
    };
};
