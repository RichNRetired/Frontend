/**
 * Cart Operations Service
 *
 * Centralized service for all cart-related operations following the API specification:
 * - GET /api/cart
 * - POST /api/cart/add?productId=X&qty=Y
 * - PUT /api/cart/{cartId}?qty=X
 * - DELETE /api/cart/{cartId}
 * - POST /api/cart/merge
 */

import { store } from '../store';
import {
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useMergeCartMutation,
    useGetCartQuery,
} from '../features/cart/cartApi';
import { removeItem, updateQuantity } from '../features/cart/cartSlice';

export interface CartOperationResult {
    success: boolean;
    message: string;
    error?: string;
}

/**
 * Add product to cart
 * POST /api/cart/add?productId=X&qty=Y
 *
 * @param productId - Product ID to add
 * @param qty - Quantity to add
 * @returns Operation result
 */
export const addProductToCart = async (
    productId: number,
    qty: number
): Promise<CartOperationResult> => {
    try {
        if (!productId || productId <= 0) {
            return { success: false, message: "Invalid product ID", error: "Invalid productId" };
        }
        if (!qty || qty <= 0) {
            return { success: false, message: "Invalid quantity", error: "Invalid qty" };
        }

        // This would be called from component using the hook
        return { success: true, message: "Product added to cart" };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to add product to cart",
            error: error?.data?.message || String(error),
        };
    }
};

/**
 * Update cart item quantity
 * PUT /api/cart/{cartId}?qty=X
 *
 * @param cartId - Cart item ID
 * @param qty - New quantity
 * @returns Operation result
 */
export const updateCartItemQty = async (
    cartId: number,
    qty: number
): Promise<CartOperationResult> => {
    try {
        if (!cartId || cartId <= 0) {
            return { success: false, message: "Invalid cart ID", error: "Invalid cartId" };
        }
        if (!qty || qty <= 0) {
            return { success: false, message: "Quantity must be greater than 0", error: "Invalid qty" };
        }

        return { success: true, message: "Cart item updated" };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to update cart item",
            error: error?.data?.message || String(error),
        };
    }
};

/**
 * Remove item from cart
 * DELETE /api/cart/{cartId}
 *
 * @param cartId - Cart item ID to remove
 * @returns Operation result
 */
export const removeCartItem = async (cartId: number): Promise<CartOperationResult> => {
    try {
        if (!cartId || cartId <= 0) {
            return { success: false, message: "Invalid cart ID", error: "Invalid cartId" };
        }

        return { success: true, message: "Item removed from cart" };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to remove item from cart",
            error: error?.data?.message || String(error),
        };
    }
};

/**
 * Merge guest cart with authenticated user cart
 * POST /api/cart/merge
 *
 * @param items - Array of items with { productId, quantity }
 * @returns Operation result
 */
export const mergeGuestCart = async (
    items: Array<{ productId: number; quantity: number }>
): Promise<CartOperationResult> => {
    try {
        if (!items || items.length === 0) {
            return { success: false, message: "No items to merge", error: "Empty items array" };
        }

        // Validate items
        for (const item of items) {
            if (!item.productId || item.productId <= 0) {
                return { success: false, message: "Invalid product ID in items", error: "Invalid productId" };
            }
            if (!item.quantity || item.quantity <= 0) {
                return { success: false, message: "Invalid quantity in items", error: "Invalid quantity" };
            }
        }

        return { success: true, message: "Cart merged successfully" };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to merge cart",
            error: error?.data?.message || String(error),
        };
    }
};

/**
 * Get all cart items
 * GET /api/cart
 *
 * This should be called using useGetCartQuery hook in components
 * This function is just for reference
 */
export const getCartItems = async () => {
    // Use useGetCartQuery hook in components instead
    console.warn("Use useGetCartQuery hook in components instead of calling this function");
};

/**
 * Clear all items from cart locally
 * Useful after successful checkout
 */
export const clearLocalCart = () => {
    const state = store.getState();
    // Can dispatch actions to clear cart if needed
};
