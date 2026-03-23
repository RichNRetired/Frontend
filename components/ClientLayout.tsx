"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import BottomNav from "../components/layout/BottomNav";
import { WhatsAppFloatingIcon } from "../components/ui/WhatsAppFloatingIcon";
import { useEffect } from "react";
import initAuth from "../services/auth-bootstrap";
import { usePathname } from "next/navigation";
import { cartApi } from "../features/cart/cartApi";
import { setCart } from "../features/cart/cartSlice";
import { clearBuyNowState, readBuyNowState } from "../lib/buy-now";
import { mapCartApiItemsToCartItems } from "../lib/cart-storage";

export function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isCheckoutRoute = pathname?.startsWith("/checkout");

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const buyNowState = readBuyNowState();

    if (!buyNowState) {
      return;
    }

    if (buyNowState.status === "completed") {
      clearBuyNowState();
      return;
    }

    if (pathname.startsWith("/checkout") || buyNowState.status !== "restore-pending") {
      return;
    }

    let isCancelled = false;

    void (async () => {
      try {
        await store
          .dispatch(
            cartApi.endpoints.addToCart.initiate({
              productId: buyNowState.item.productId,
              variantId: buyNowState.item.variantId,
              qty: buyNowState.item.quantity,
            }),
          )
          .unwrap();

        if (isCancelled) {
          return;
        }

        const summary = await store
          .dispatch(
            cartApi.endpoints.getCartSummary.initiate(undefined, {
              forceRefetch: true,
            }),
          )
          .unwrap();

        store.dispatch(setCart(mapCartApiItemsToCartItems(summary.items)));
        store.dispatch(cartApi.util.invalidateTags(["Cart"]));
        clearBuyNowState();
      } catch (error) {
        console.error("Failed to restore abandoned buy-now item into cart", error);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  return (
    <Provider store={store}>
      {!isCheckoutRoute && <Header />}
      <main>{children}</main>
      <Footer />
      <BottomNav />
      <WhatsAppFloatingIcon />
    </Provider>
  );
}
