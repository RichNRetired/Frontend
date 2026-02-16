"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useCheckoutMutation } from "@/features/order/orderApi";
import { useGetAddressesQuery } from "@/features/user/userApi";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { sendEvent } from "@/services/analytics.service";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Address {
  id: number | string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  addressType?: "Home" | "Work";
  default?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [selectedAddressId, setSelectedAddressId] = useState<
    number | string | null
  >(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { data: addresses = [], isLoading: addressesLoading } =
    useGetAddressesQuery();
  const [checkout, { isLoading: checkoutLoading }] = useCheckoutMutation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Auto-select first address or default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = (addresses as Address[]).find((a) => a.default);
      setSelectedAddressId(defaultAddr?.id || (addresses[0] as Address)?.id);
    }
  }, [addresses, selectedAddressId]);

  // Redirect if no items in cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-neutral-400" />
            <h1 className="text-2xl font-light tracking-tight mb-4">
              Your cart is empty
            </h1>
            <p className="text-neutral-500 mb-8">
              Add items to your cart before checking out.
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const shippingCharges = subtotal > 100 ? 0 : 10;
  const totalAmount = subtotal + taxAmount + shippingCharges;

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setOrderError("Please select a delivery address");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setOrderError("Your cart is empty");
      return;
    }

    try {
      setOrderError(null);

      // Validate all items have valid product IDs
      const checkoutPayload = {
        addressId: Number(selectedAddressId),
        items: cartItems.map((item) => {
          const productId = Number(item.productId);
          if (!productId || isNaN(productId)) {
            throw new Error(`Invalid product ID: ${item.productId}`);
          }
          return {
            productId,
            quantity: item.quantity,
          };
        }),
      };

      const result = await checkout(checkoutPayload).unwrap();

      // Send analytics event
      sendEvent("checkout_completed", {
        orderId: result.orderId,
        totalAmount: result.totalAmount,
        itemCount: cartItems.length,
      });

      // Store order details and redirect to success page
      sessionStorage.setItem("lastOrderId", String(result.orderId));
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        "Checkout failed. Please try again.";
      setOrderError(errorMsg);
      console.error("Checkout error:", err);
      sendEvent("checkout_failed", {
        error: errorMsg,
        itemCount: cartItems.length,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <Link
          href="/cart"
          className="flex items-center gap-2 text-neutral-500 mb-8 hover:text-black transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Cart</span>
        </Link>

        <h1 className="text-4xl text-black font-light tracking-tight mb-2">
          Checkout
        </h1>
        <p className="text-neutral-500 mb-12">
          Review your order and select a delivery address
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Delivery Address Section */}
            <div>
              <h2 className="text-sm text-black font-bold uppercase tracking-[0.15em] mb-6">
                Delivery Address
              </h2>

              {addressesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-neutral-400" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-6 border-2 border-dashed border-neutral-200 rounded-lg text-center">
                  <MapPin size={32} className="mx-auto mb-3 text-neutral-300" />
                  <p className="text-neutral-500 mb-3">No saved addresses</p>
                  <Link href="/account/addresses">
                    <button className="px-6 py-2 border border-black text-black text-sm font-medium hover:bg-neutral-50 transition-all">
                      Add Address
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {(addresses as Address[]).map((address) => (
                    <label
                      key={address.id}
                      className={`block p-5 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-black bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={(e) =>
                            setSelectedAddressId(Number(e.target.value))
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-black">
                              {address.addressLine1}
                            </p>
                            {address.default && (
                              <span className="text-[10px] text-black font-bold uppercase tracking-widest bg-neutral-100 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          {address.addressLine2 && (
                            <p className="text-sm text-neutral-500">
                              {address.addressLine2}
                            </p>
                          )}
                          <p className="text-sm text-neutral-600">
                            {address.city}
                            {address.state && `, ${address.state}`}{" "}
                            {address.postalCode}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {address.country}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-sm text-black font-bold uppercase tracking-[0.15em] mb-6">
                Order Items ({cartItems.length})
              </h2>

              <div className="space-y-6 border-t pt-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    {item.image && (
                      <div className="w-20 h-20 bg-neutral-100 rounded overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-neutral-600">
                          Qty:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-900">
                            ₹{item.price.toLocaleString()} each
                          </p>
                          <p className="font-medium text-black">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-neutral-50 p-8 border border-neutral-200 rounded-lg">
              <h2 className="text-sm text-black font-bold uppercase tracking-[0.15em] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-black">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax (8%)</span>
                  <span className="font-medium text-black">
                    ₹{taxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span
                    className={
                      shippingCharges === 0
                        ? "font-medium text-green-600"
                        : "font-medium"
                    }
                  >
                    {shippingCharges === 0 ? "Free" : `₹${shippingCharges}`}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold text-black">Total</span>
                  <span className="text-xl text-black font-medium">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {orderError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {orderError}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || !selectedAddressId}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {checkoutLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {checkoutLoading ? "Processing..." : "Place Order"}
              </button>

              <p className="text-[11px] text-neutral-500 text-center mt-4 leading-relaxed">
                By placing an order, you agree to our terms and conditions.
                <br />
                Secure checkout powered by Next.js API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
