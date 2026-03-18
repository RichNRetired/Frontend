"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { RootState } from "../../store";
import {
  setCart,
  removeItem,
  updateQuantity,
} from "../../features/cart/cartSlice";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Heart,
} from "lucide-react";
import {
  useGetCartQuery,
  useGetCartSummaryQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "../../features/cart/cartApi";

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { data: cartData } = useGetCartQuery();
  const { data: cartSummary, isLoading: isLoadingCart } = useGetCartSummaryQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const toSafeNumber = (value: unknown, fallback = 0) => {
    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : fallback;
  };

  const toOptionalNumber = (value: unknown) => {
    const normalized = Number(value);
    return Number.isFinite(normalized) && normalized > 0 ? normalized : undefined;
  };

  const formatCurrency = (value: unknown) =>
    toSafeNumber(value, 0).toLocaleString();

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "data" in error &&
      typeof (error as { data?: unknown }).data === "object" &&
      (error as { data?: { message?: unknown } }).data !== null
    ) {
      const message = (error as { data?: { message?: unknown } }).data?.message;

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    return fallback;
  };

  useEffect(() => {
    const sourceItems = cartSummary?.items ?? cartData;

    if (sourceItems) {
      dispatch(
        setCart(
          sourceItems.map((item) => ({
            id: String(item.cartItemId), // Use actual cartItemId for backend operations
            productId: item.productId,
            categoryId: toOptionalNumber(item.categoryId ?? item.category?.id),
            variantId: toSafeNumber(item.variantId),
            name: item.productName,
            price: toSafeNumber(item.price, 0),
            quantity: Math.max(1, toSafeNumber(item.quantity, 1)),
            image: item.imageUrl,
            color: item.color,
            size: item.size,
            mrp: item.mrp,
            discountPercentage: item.discountPercentage,
          })),
        ),
      );
    }
  }, [cartData, cartSummary, dispatch]);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) return;
    const cartItem = items.find((item) => item.id === id);
    if (!cartItem) return;

    try {
      await updateCartItem({
        cartItemId: Number(id),
        qty: quantity,
        variantId: cartItem.variantId,
      }).unwrap();
      dispatch(updateQuantity({ id, quantity }));
    } catch (err: unknown) {
      console.error("Failed to update quantity:", err);
      const errorMsg = getErrorMessage(err, "Failed to update quantity");
      alert(errorMsg);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(Number(id)).unwrap();
      dispatch(removeItem(id));
    } catch (err: unknown) {
      console.error("Failed to remove item:", err);
      const errorMsg = getErrorMessage(err, "Failed to remove item");
      alert(errorMsg);
    }
  };

  const subtotal = toSafeNumber(cartSummary?.subtotal);
  const taxAmount = toSafeNumber(cartSummary?.taxAmount);
  const shippingCharges = toSafeNumber(cartSummary?.shippingCharges);
  const discountAmount = toSafeNumber(cartSummary?.discountAmount);
  const total = toSafeNumber(cartSummary?.finalAmount);
  const totalItems = toSafeNumber(cartSummary?.totalItems, items.length);
  const savings = toSafeNumber(cartSummary?.totalSavings);
  const appliedCoupon = cartSummary?.couponApplied ? cartSummary.appliedCoupon : null;

  if (isLoadingCart) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-neutral-400">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="relative mb-8 mt-30">
          <ShoppingBag size={60} strokeWidth={1} className="text-neutral-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neutral-900 rounded-full animate-pulse" />
        </div>
        <h1 className="text-2xl font-light tracking-widest uppercase mb-6 ">
          Your Bag is Empty
        </h1>
        <Link
          href="/"
          className="px-10 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white mt-10 min-h-screen">
      <div className="max-w-350 mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 border-b border-neutral-100 pb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
            Shopping Bag
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            {totalItems} Items reserved for you
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:items-start">
          {/* Items List */}
          <div className="lg:col-span-8">
            <div className="space-y-12">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col sm:flex-row gap-6 md:gap-10 border-b border-neutral-50 pb-12 transition-all"
                >
                  {/* Image with hover effect */}
                  <div className="w-full sm:w-44 h-62.5 sm:h-60 overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={item.name}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm md:text-base font-medium tracking-tight text-neutral-900 mb-1">
                          {item.name}
                        </h3>
                       
                        <p className="text-sm font-semibold italic text-neutral-800">
                          ₹{formatCurrency(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-200 rounded-sm">
                        <button
                          className="p-3 hover:bg-gray-500 text-black transition-colors"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-black text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          className="p-3 hover:bg-gray-500  text-zinc-950 transition-colors"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
                          <Heart size={14} /> Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 bg-neutral-50 p-8 md:p-10 border border-neutral-100">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-900 mb-8 border-b border-neutral-200 pb-4">
                Order Summary
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between text-sm font-light text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">
                    ₹{formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-light text-neutral-600">
                  <span>Tax</span>
                  <span className="font-medium text-neutral-900">
                    ₹{formatCurrency(taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-light text-neutral-600">
                  <span>Shipping</span>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold ${
                      shippingCharges === 0 ? "text-green-600" : "text-neutral-900"
                    }`}
                  >
                    {shippingCharges === 0
                      ? "Complimentary"
                      : `₹${formatCurrency(shippingCharges)}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm font-light text-green-700">
                    <span>Discount</span>
                    <span className="font-medium">
                      -₹{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] uppercase tracking-widest text-emerald-700">
                    Coupon applied: {appliedCoupon}
                  </div>
                )}

                {savings > 0 && (
                  <div className="flex justify-between text-sm font-light text-neutral-600">
                    <span>Total Savings</span>
                    <span className="font-medium text-green-700">
                      ₹{formatCurrency(savings)}
                    </span>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t text-black border-neutral-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-light italic tracking-tight">
                      ₹{formatCurrency(total)}
                    </span>
                    <p className="text-[10px] text-neutral-400">VAT Included</p>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="block mt-10">
                <button className="w-full bg-black text-white py-5 text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-neutral-800 hover:gap-5 transition-all group">
                  Proceed to Checkout{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>

              <div className="mt-8">
                <p className="text-[10px] text-neutral-400 text-center uppercase tracking-widest leading-loose">
                  Secure checkout powered by Stripe <br />
                  Free returns on all orders within 30 days.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
