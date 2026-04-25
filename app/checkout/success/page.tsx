"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { clearCart } from "@/features/cart/cartSlice";
import { useGetOrderDetailsQuery } from "@/features/order/orderApi";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { clearBuyNowState, updateBuyNowStatus } from "@/lib/buy-now";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const orderIdFromUrl = searchParams.get("orderId");
  const orderId = useMemo(() => {
    if (orderIdFromUrl) {
      return orderIdFromUrl;
    }

    if (globalThis.window === undefined) {
      return null;
    }

    return globalThis.sessionStorage.getItem("lastOrderId");
  }, [orderIdFromUrl]);

  const numericOrderId = useMemo(() => {
    const parsed = Number(orderId);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [orderId]);

  const { data: order } = useGetOrderDetailsQuery(numericOrderId ?? 0, {
    skip: !numericOrderId,
  });

  // Clear cart on mount
  useEffect(() => {
    dispatch(clearCart());
    updateBuyNowStatus("completed");
    clearBuyNowState();
  }, [dispatch]);

  // If no orderId in URL, redirect to orders page
  if (!orderId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-neutral-500 mb-6">Redirecting to your orders...</p>
          <Link href="/account/orders">
            <button className="text-black font-medium hover:underline">
              Go to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-linear-to-b from-white to-neutral-50">
      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* Success Icon */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2
              size={48}
              className="text-green-600"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="text-4xl text-black font-light tracking-tight mb-3">
            Order Confirmed
          </h1>
          <p className="text-neutral-800 text-lg">
            Thank you for your purchase!
          </p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b">
              <div>
                <p className="text-sm text-neutral-900 mb-1">Order Number</p>
                <p className="text-2xl text-black font-medium">
                  #{order.orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-900 mb-1">Order Date</p>
                <p className="text-lg text-black font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-4">
                Items ({order.items?.length || 0})
              </p>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.orderItemId ?? `${item.productId}-${item.quantity}`}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-50 border border-neutral-100">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] font-medium uppercase tracking-widest text-neutral-300">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-neutral-900 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-black">
                      ₹
                      {(
                        item.total || item.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-neutral-50 p-6 rounded space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-900">Subtotal</span>
                <span className="font-medium text-black">
                  ₹{(order.subtotal || order.totalAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-900">Shipping</span>
                <span
                  className={
                    order.shippingCharges === 0
                      ? "text-green-600 font-medium"
                      : "font-medium"
                  }
                >
                  {order.shippingCharges === 0
                    ? "Free"
                    : `₹${order.shippingCharges}`}
                </span>
              </div>
              <div className="pt-3 border-t flex justify-between">
                <span className="font-bold text-black">Total</span>
                <span className="text-xl text-black font-medium">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Address (if available) */}
        {order?.deliveryAddress && (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Package size={20} className="text-neutral-600 mt-1" />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-black">
                  Delivery Address
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="font-medium text-black">
                    {order.deliveryAddress.addressLine1}
                  </p>
                  {order.deliveryAddress.addressLine2 && (
                    <p className="text-neutral-600">
                      {order.deliveryAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-neutral-600">
                    {order.deliveryAddress.city}
                    {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`} {order.deliveryAddress.postalCode}
                  </p>
                  <p className="text-neutral-600">
                    {order.deliveryAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 mb-8">
          <h3 className="font-bold u text-black ppercase tracking-widest text-sm mb-4">
            What's Next?
          </h3>
          <ul className="space-y-3 text-sm text-neutral-600">
            <li className="flex gap-3">
              <span className="font-bold text-neutral-900 w-6">1</span>
              <span>You will receive an order confirmation email shortly</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-neutral-900 w-6">2</span>
              <span>Track your order status in your account</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-neutral-900 w-6">3</span>
              <span>Estimated delivery: 5-7 business days</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/account/orders" className="flex-1">
            <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
              <Package size={18} />
              View My Orders
            </button>
          </Link>
          <Link href="/" className="flex-1">
            <button className="w-full border border-black text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-neutral-50 transition-all flex items-center justify-center gap-2">
              Continue Shopping
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-neutral-600 mb-2">
            Need help with your order?
          </p>
          <a
            href="mailto:support@example.com"
            className="text-black font-medium hover:underline"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
