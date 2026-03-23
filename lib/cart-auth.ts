import type { AppDispatch } from "@/store";
import { cartApi } from "@/features/cart/cartApi";
import { setCart } from "@/features/cart/cartSlice";
import {
  clearGuestCart,
  getGuestCartItems,
  getGuestCartMergePayload,
  mapCartApiItemsToCartItems,
  setGuestCartItems,
} from "@/lib/cart-storage";

export const syncGuestCartToStore = (dispatch: AppDispatch) => {
  dispatch(setCart(getGuestCartItems()));
};

export const syncAuthenticatedCart = async (dispatch: AppDispatch) => {
  const summary = await dispatch(
    cartApi.endpoints.getCartSummary.initiate(undefined, { forceRefetch: true }),
  ).unwrap();

  dispatch(setCart(mapCartApiItemsToCartItems(summary.items)));
};

export const mergeGuestCartIntoAccount = async (dispatch: AppDispatch) => {
  const storedGuestItems = getGuestCartItems();
  const guestItems = getGuestCartMergePayload();

  if (guestItems.length > 0) {
    const mergeResult = await dispatch(
      cartApi.endpoints.mergeCart.initiate(guestItems),
    ).unwrap();

    if (!mergeResult.success) {
      throw new Error(mergeResult.message || "Guest cart merge failed");
    }

    if (mergeResult.failedCount > 0 && mergeResult.failedItems.length > 0) {
      const failedItemKeys = new Set(
        mergeResult.failedItems.map(
          (item) => `${item.productId}:${item.variantId}`,
        ),
      );

      const remainingGuestItems = storedGuestItems.filter((item) =>
        failedItemKeys.has(`${item.productId}:${item.variantId}`),
      );

      setGuestCartItems(remainingGuestItems);
    } else {
      clearGuestCart();
    }
  }

  await syncAuthenticatedCart(dispatch);
};