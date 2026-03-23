import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AddToCartInput } from '@/lib/cart-storage';
import {
    addGuestCartItem,
    createGuestCartSummary,
    getGuestCartItems,
    hasStoredAccessToken,
    mapCartApiItemsToCartItems,
    removeGuestCartItem,
    updateGuestCartItemQuantity,
} from '@/lib/cart-storage';
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

export const useCart = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const shouldUseServerCart = isAuthenticated || hasStoredAccessToken();
    const { data: cartData, isLoading: isLoadingCart, error, refetch: refetchCart } = useGetCartQuery(undefined, {
        skip: !shouldUseServerCart,
    });
    const {
        data: cartSummaryData,
        isLoading: isLoadingSummary,
        refetch: refetchSummary,
    } = useGetCartSummaryQuery(undefined, {
        skip: !shouldUseServerCart,
    });
    const [addToCartMutation, { isLoading: isAdding }] = useAddToCartMutation();
    const [updateCartMutation, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeFromCartMutation, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [mergeCartMutation, { isLoading: isMerging }] = useMergeCartMutation();

    useEffect(() => {
        if (!shouldUseServerCart) {
            dispatch(setCart(getGuestCartItems()));
            return;
        }

        const sourceItems = cartSummaryData?.items ?? cartData;

        if (sourceItems) {
            dispatch(setCart(mapCartApiItemsToCartItems(sourceItems)));
        }
    }, [cartData, cartSummaryData, dispatch, shouldUseServerCart]);

    const cartSummary = useMemo(() => {
        if (shouldUseServerCart && cartSummaryData) {
            return cartSummaryData;
        }

        return createGuestCartSummary(cart.items);
    }, [cart.items, cartSummaryData, shouldUseServerCart]);

    return {
        cart,
        items: cart.items,
        cartSummary,
        isLoading: shouldUseServerCart ? isLoadingCart || isLoadingSummary : false,
        error: shouldUseServerCart ? error : undefined,
        isGuestCart: !shouldUseServerCart,

        isAdding,
        isUpdating,
        isRemoving,
        isMerging,

        addToCart: async (input: AddToCartInput) => {
            if (!shouldUseServerCart) {
                const updatedItems = addGuestCartItem(input);
                dispatch(setCart(updatedItems));
                return updatedItems;
            }

            const response = await addToCartMutation({
                productId: input.productId,
                variantId: input.variantId,
                qty: input.qty,
            }).unwrap();

            await Promise.all([refetchCart(), refetchSummary()]);
            return response;
        },
        updateQuantity: async (cartItemId: number | string, qty: number, variantId: number) => {
            if (qty <= 0) return;

            if (!shouldUseServerCart) {
                const updatedItems = updateGuestCartItemQuantity(String(cartItemId), qty);
                dispatch(setCart(updatedItems));
                return updatedItems;
            }

            const response = await updateCartMutation({ cartItemId: Number(cartItemId), qty, variantId }).unwrap();
            await Promise.all([refetchCart(), refetchSummary()]);
            return response;
        },
        removeFromCart: async (cartItemId: number | string) => {
            if (!shouldUseServerCart) {
                const updatedItems = removeGuestCartItem(String(cartItemId));
                dispatch(setCart(updatedItems));
                return updatedItems;
            }

            const response = await removeFromCartMutation(Number(cartItemId)).unwrap();
            await Promise.all([refetchCart(), refetchSummary()]);
            return response;
        },
        mergeCart: async (items: Array<{ productId: number; variantId: number; quantity: number }>) => {
            const response = await mergeCartMutation(items).unwrap();
            await Promise.all([refetchCart(), refetchSummary()]);
            return response;
        },

        refetch: async () => {
            if (!shouldUseServerCart) {
                dispatch(setCart(getGuestCartItems()));
                return;
            }

            await Promise.all([refetchCart(), refetchSummary()]);
        },
    };
};
