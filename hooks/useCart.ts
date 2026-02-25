import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useMergeCartMutation,
} from '../features/cart/cartApi';
import { removeItem, updateQuantity, setCart } from '../features/cart/cartSlice';
import { useEffect } from 'react';

export const useCart = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const { data: cartData, isLoading, error, refetch } = useGetCartQuery();
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
                        id: String(item.cartId),
                        productId: item.productId,
                        name: item.productName,
                        price: Number(item.price ?? 0),
                        quantity: Number(item.quantity ?? 1),
                        image: item.imageUrl,
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
        addToCart: async (productId: number, qty: number) => {
            return addToCart({ productId, qty }).unwrap();
        },
        updateQuantity: async (cartId: number, qty: number) => {
            if (qty <= 0) return;
            return updateCart({ cartId, qty }).unwrap();
        },
        removeFromCart: async (cartId: number) => {
            return removeFromCart(cartId).unwrap();
        },
        mergeCart: async (items: Array<{ productId: number; quantity: number }>) => {
            return mergeCart(items).unwrap();
        },

        // Utilities
        refetch,
    };
};
