"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useGetOrderDetailsQuery,
  useCancelOrderMutation,
  useGetEligibleReturnItemsQuery,
  useGetOrderTrackingQuery,
  useInitiatePaymentMutation,
} from "@/features/order/orderApi";
import { OrderItem, ReturnReason } from "@/features/order/orderTypes";
import { ReturnForm } from "@/components/returns/ReturnForm";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  MapPin,
  X,
  UndoIcon,
  CreditCard,
  Loader2,
  ShoppingBag,
  RefreshCcw,
} from "lucide-react";
import { sendEvent } from "@/services/analytics.service";
import { formatOrderId } from "@/lib/formatter";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getCurrentUser } from "@/lib/auth";
import { buildInitiatePaymentRequest } from "@/lib/razorpay";

type ReturnableOrderItem = OrderItem & {
  orderItemId?: number;
  availableReasons?: ReturnReason[];
  returnDeadline?: string;
  eligibilityMessage?: string;
  isEligible?: boolean;
};

const getOrderStatusClass = (status: string) => {
  if (status === "PAID") {
    return "bg-green-50 text-green-700";
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700";
  }

  return "bg-neutral-100 text-neutral-600";
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<ReturnableOrderItem | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const {
    data: order,
    isLoading,
    error: orderError,
    refetch,
  } = useGetOrderDetailsQuery(orderId);
  const { data: tracking, isLoading: trackingLoading } = useGetOrderTrackingQuery(orderId, {
    skip: !Number.isFinite(orderId) || orderId <= 0,
  });
  const { data: eligibleReturnItems = [], isLoading: eligibleItemsLoading } =
    useGetEligibleReturnItemsQuery(orderId, {
      skip: !Number.isFinite(orderId) || orderId <= 0,
    });
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [initiatePayment, { isLoading: initiatingPayment }] = useInitiatePaymentMutation();

  const canReturnOrder = order?.status === "DELIVERED";
  const hasTracking = Boolean(trackingLoading || tracking?.trackingId || tracking?.events?.length);

  const getReturnableItem = (item: OrderItem): ReturnableOrderItem | null => {
    if (item.orderItemId) {
      const matchedEligibleItem = eligibleReturnItems.find(
        (eligibleItem) => eligibleItem.orderItemId === item.orderItemId,
      );

      return {
        ...item,
        availableReasons: matchedEligibleItem?.availableReasons,
        returnDeadline: matchedEligibleItem?.returnDeadline,
        eligibilityMessage: matchedEligibleItem?.eligibilityMessage,
        isEligible: matchedEligibleItem?.isEligible,
      };
    }

    const matchedEligibleItem = eligibleReturnItems.find(
      (eligibleItem) => eligibleItem.productName === item.productName,
    );

    if (!matchedEligibleItem) {
      return null;
    }

    return {
      ...item,
      orderItemId: matchedEligibleItem.orderItemId,
      availableReasons: matchedEligibleItem.availableReasons,
      returnDeadline: matchedEligibleItem.returnDeadline,
      eligibilityMessage: matchedEligibleItem.eligibilityMessage,
      isEligible: matchedEligibleItem.isEligible,
    };
  };

  const handleCancelOrder = async () => {
    setIsCancelDialogOpen(true);
  };

  const handlePayNow = async () => {
    if (!order) return;
    try {
      setError(null);
      const currentUser = globalThis.window === undefined ? null : getCurrentUser();
      const payResp = await initiatePayment(
        buildInitiatePaymentRequest({
          orderId: order.orderId,
          amount: order.totalAmount,
          receipt: `order-${order.orderId}-${Date.now()}`,
          orderUserName: order.userName,
          orderUserEmail: order.userEmail,
          orderUserPhone: order.userPhone,
          currentUser,
        }),
      ).unwrap();
      sessionStorage.setItem(`payment_init_${order.orderId}`, JSON.stringify(payResp));
      router.push(`/checkout/payment?orderId=${order.orderId}`);
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "Failed to initiate payment. Please try again.");
    }
  };

  const confirmCancelOrder = async () => {
    try {
      setError(null);
      await cancelOrder({ orderId }).unwrap();
      setSuccess("Order cancelled successfully");
      sendEvent("order_cancelled", { orderId });
      setIsCancelDialogOpen(false);
      setTimeout(() => router.back(), 2000);
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to cancel order";
      setError(errorMsg);
      console.error("Cancel error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-sm uppercase tracking-widest text-neutral-400">
          Loading order details...
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Link
            href="/account/orders"
            className="flex items-center gap-2 text-neutral-500 mb-8 hover:text-black transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Orders</span>
          </Link>

          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-light uppercase tracking-tighter mb-2">
              Order Not Found
            </h1>
            <p className="text-neutral-600 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Link href="/account/orders">
              <button className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all">
                View All Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Notifications */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 z-50 max-w-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
          <p className="text-sm text-green-700">{success}</p>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-600 hover:text-green-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 z-50 max-w-md animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link
          href="/account/orders"
          className="flex items-center gap-2 text-neutral-500 mb-8 hover:text-black transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Orders</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl text-black font-light uppercase tracking-tighter mb-2">
                Order
              </h1>
              <p className="text-sm font-medium tracking-widest text-neutral-500 mb-1">
                {formatOrderId(order.orderId, order.createdAt)}
              </p>
              <p className="text-neutral-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date unavailable"}
              </p>
            </div>
            <span
              className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded ${getOrderStatusClass(order.status)}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} className="text-neutral-400 mt-1 shrink-0" />
                <div>
                  <h2 className="text-sm   text-black font-bold uppercase tracking-[0.15em] mb-3">
                    Delivery Address
                  </h2>
                  <div className="space-y-1 text-sm text-neutral-900">
                    <p className="font-medium text-black">
                      {order.deliveryAddress.addressLine1}
                    </p>
                    {order.deliveryAddress.addressLine2 && (
                      <p>{order.deliveryAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state}
                    </p>
                    <p>{order.deliveryAddress.postalCode}</p>
                    <p>{order.deliveryAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-sm text-black font-bold uppercase tracking-[0.15em] mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              {order.subtotal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-600">
                    ₹{order.subtotal.toLocaleString()}
                  </span>
                </div>
              )}
              {order.shippingCharges !== undefined && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium text-neutral-600">
                    {order.shippingCharges === 0
                      ? "Free"
                      : `₹${order.shippingCharges.toLocaleString()}`}
                  </span>
                </div>
              )}
              {order.discountAmount !== undefined &&
                order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -₹{order.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              <div className="border-t text-black pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-sm">
                <span className="text-neutral-600">Payment</span>
                <div className="flex items-center gap-2">
                  {order.paymentMethod && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-neutral-100 text-neutral-700">
                      {order.paymentMethod}
                    </span>
                  )}
                  {order.paymentStatus && (
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      order.paymentStatus === "SUCCESS" || order.paymentStatus === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "FAILED" || order.paymentStatus === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : order.paymentStatus === "REFUND_PENDING"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-12">
          <h2 className="text-sm  text-black font-bold uppercase tracking-[0.15em] mb-6">
            Items ({order.items?.length || 0})
          </h2>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="space-y-0 divide-y divide-neutral-100">
              {order.items?.map((item) => {
                const returnableItem = getReturnableItem(item);
                const canRequestReturn =
                  canReturnOrder &&
                  Boolean(returnableItem?.orderItemId) &&
                  returnableItem?.isEligible !== false;

                return (
                <div
                  key={
                    item.orderItemId ||
                    `${item.productId}-${item.variantId || "default"}-${item.productName}-${item.quantity}`
                  }
                  className="flex flex-col sm:flex-row items-start gap-4 p-6 hover:bg-neutral-50 transition-colors"
                >
                  {item.imageUrl && (
                    <Link href={`/product/${item.productId}`}>
                      <div className="w-20 h-28 bg-neutral-50 rounded overflow-hidden shrink-0 p-2 hover:opacity-80 transition-opacity">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="flex-1">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-medium text-neutral-900 hover:underline">
                        {item.productName}
                      </h3>
                    </Link>
                    <div className="mt-2 space-y-1 text-sm text-neutral-600">
                      <p>Price: ₹{item.price.toLocaleString()}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p className="font-medium text-neutral-900">
                        Total: ₹
                        {(
                          item.totalPrice ||
                          item.total ||
                          item.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* Buy Again Button (for cancelled orders) */}
                  {order.status === "CANCELLED" && (
                    <Link href={`/product/${item.productId}`}>
                      <button className="whitespace-nowrap px-4 py-2.5 bg-black text-white rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-all flex items-center gap-1.5">
                        <ShoppingBag size={14} />
                        Buy Again
                      </button>
                    </Link>
                  )}
                  {/* Return Button */}
                  {canReturnOrder && (
                    canRequestReturn ? (
                      <button
                        onClick={() => setSelectedItemForReturn(returnableItem)}
                        className="whitespace-nowrap px-4 py-2.5 border border-blue-200 text-blue-600 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-blue-50 transition-all"
                      >
                        <UndoIcon size={14} className="inline mr-1.5" />
                        Return Item
                      </button>
                    ) : (
                      <span className="text-[11px] uppercase tracking-widest text-neutral-400">
                        {eligibleItemsLoading
                          ? "Checking return..."
                          : returnableItem?.eligibilityMessage || "Not eligible for return"}
                      </span>
                    )
                  )}
                </div>
              );})}
            </div>
          </div>
        </div>

        {/* ── Order Status Timeline (dynamic from statusHistory) ─────── */}
        {(() => {
          const STEPS: { key: string; label: string; icon: string; desc: string }[] = [
            { key: "PENDING",   label: "Order Received",      icon: "📋", desc: "We received your order" },
            { key: "PLACED",    label: "Order Confirmed",     icon: "✅", desc: "Your order is confirmed" },
            { key: "PAID",      label: "Payment Verified",    icon: "💳", desc: "Payment successfully verified" },
            { key: "SHIPPED",   label: "Shipped",             icon: "🚚", desc: "Your order is on the way" },
            { key: "DELIVERED", label: "Delivered",           icon: "🎉", desc: "Order delivered successfully" },
          ];

          const historyMap = new Map<string, string>(
            (order.statusHistory || []).map((h) => [h.status, h.changedAt])
          );

          const isCancelled = order.status === "CANCELLED";
          const isReturn    = order.status === "RETURN_REQUESTED";

          // Find the last completed step index
          const lastDoneIdx = STEPS.reduce((acc, s, i) => historyMap.has(s.key) ? i : acc, -1);
          // Current active index (what the order is currently AT)
          const currentIdx = STEPS.findIndex((s) => s.key === order.status);
          const activeIdx  = currentIdx >= 0 ? currentIdx : lastDoneIdx;

          return (
            <div className="mb-12 border border-neutral-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-black">Order Journey</h2>
                {tracking?.trackingId && (
                  <span className="text-[11px] font-semibold text-neutral-500">
                    Tracking: <span className="text-black">{tracking.trackingId}</span>
                  </span>
                )}
              </div>

              <div className="px-6 py-6">
                {/* Horizontal step bar (desktop) */}
                <div className="hidden sm:flex items-start justify-between mb-8">
                  {STEPS.map((step, i) => {
                    const done    = historyMap.has(step.key);
                    const current = step.key === order.status && !isCancelled && !isReturn;
                    const ts      = historyMap.get(step.key);
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {i > 0 && (
                          <div className={`absolute top-[15px] right-1/2 left-[-50%] h-[2px] transition-colors
                            ${historyMap.has(STEPS[i].key) ? "bg-black" : "bg-neutral-200"}`} />
                        )}
                        {/* Circle */}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all
                          ${done ? "bg-black border-2 border-black" : "bg-white border-2 border-neutral-200"}
                          ${current ? "ring-2 ring-offset-2 ring-black" : ""}`}>
                          {done
                            ? <span className="text-sm leading-none">{step.icon}</span>
                            : <div className="w-2 h-2 rounded-full bg-neutral-300" />}
                        </div>
                        {/* Label */}
                        <p className={`text-center text-[10px] leading-tight font-bold uppercase tracking-wide
                          ${done ? "text-black" : "text-neutral-300"}`}>
                          {step.label}
                        </p>
                        {/* Timestamp */}
                        {ts && (
                          <p className="text-[9px] text-neutral-400 mt-0.5 text-center">
                            {new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            <br />
                            {new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Vertical timeline (mobile + detailed view) */}
                <div className="sm:hidden space-y-0">
                  {STEPS.map((step, i) => {
                    const done = historyMap.has(step.key);
                    const current = step.key === order.status && !isCancelled;
                    const ts   = historyMap.get(step.key);
                    const isLast = i === STEPS.length - 1;
                    return (
                      <div key={step.key} className="flex gap-4">
                        {/* Left: dot + line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10
                            ${done ? "bg-black" : "bg-white border-2 border-neutral-200"}
                            ${current ? "ring-2 ring-offset-1 ring-black" : ""}`}>
                            {done
                              ? <span className="text-sm">{step.icon}</span>
                              : <div className="w-2 h-2 rounded-full bg-neutral-300" />}
                          </div>
                          {!isLast && (
                            <div className={`w-[2px] flex-1 min-h-[24px] my-1
                              ${done && historyMap.has(STEPS[i + 1]?.key) ? "bg-black" : "bg-neutral-200"}`} />
                          )}
                        </div>
                        {/* Right: content */}
                        <div className="pb-5 min-w-0">
                          <p className={`text-sm font-bold ${done ? "text-black" : "text-neutral-300"}`}>
                            {step.label}
                          </p>
                          {ts ? (
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              {new Date(ts).toLocaleString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          ) : (
                            <p className="text-[11px] text-neutral-300 mt-0.5">{step.desc}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cancelled / Return banner */}
                {isCancelled && (
                  <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                    <span className="text-xl">❌</span>
                    <div>
                      <p className="text-sm font-bold text-red-700">Order Cancelled</p>
                      <p className="text-xs text-red-500">
                        {order.paymentStatus === "REFUND_PENDING"
                          ? "Refund is being processed and will be credited shortly."
                          : "No payment was captured for this order."}
                      </p>
                    </div>
                  </div>
                )}
                {isReturn && (
                  <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="text-xl">↩️</span>
                    <p className="text-sm font-bold text-blue-700">Return Requested — our team will reach out shortly.</p>
                  </div>
                )}

                {/* Expected Delivery */}
                {order.expectedDelivery && order.status !== "DELIVERED" && !isCancelled && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full text-xs text-green-700 font-semibold">
                    <span>🗓</span>
                    Estimated Delivery:{" "}
                    {new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </div>
                )}

                {/* Live shiprocket events */}
                {trackingLoading && (
                  <p className="text-sm text-neutral-400 mt-4">Loading live tracking updates...</p>
                )}
                {!trackingLoading && (tracking?.events?.length ?? 0) > 0 && (
                  <div className="mt-5 space-y-3 border-t border-neutral-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Live Updates</p>
                    {tracking!.events.map((event, index) => (
                      <div key={`${event.status}-${event.date}-${index}`}
                        className="flex gap-3 border-l-2 border-neutral-200 pl-4">
                        <div>
                          <p className="text-sm font-semibold text-black">{event.status}</p>
                          <p className="text-xs text-neutral-500">
                            {event.date ? new Date(event.date).toLocaleString("en-IN") : "—"}
                          </p>
                          {event.location && (
                            <p className="text-xs text-neutral-500 mt-0.5">📍 {event.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Cancelled — Shop Again CTA */}
        {order.status === "CANCELLED" && (
          <div className="mb-8 flex justify-end">
            <Link href="/shop">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-all">
                <ShoppingBag size={14} />
                Shop Again
              </button>
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {order.requiresPayment && order.status !== "CANCELLED" && (
            <button
              disabled={initiatingPayment}
              onClick={() => void handlePayNow()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initiatingPayment ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CreditCard size={16} />
              )}
              {initiatingPayment ? "Loading..." : "Pay Now"}
            </button>
          )}
          {order.status === "CANCELLED" && order.items && order.items.length > 0 && (
            <Link href={`/product/${order.items[0].productId}`}>
              <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-neutral-800 transition-all">
                <RefreshCcw size={16} />
                Buy Again
              </button>
            </Link>
          )}
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && order.status !== "SHIPPED" && (
            <button
              disabled={cancelling}
              onClick={handleCancelOrder}
              className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
          <Link href="/account/orders">
            <button className="flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-neutral-200 transition-all">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>

      {/* Return Form Modal */}
      {selectedItemForReturn && (
        <ReturnForm
          orderId={order.orderId}
          orderItem={selectedItemForReturn}
          onClose={() => setSelectedItemForReturn(null)}
          onSuccess={() => {
            refetch();
            setSuccess("Return requested successfully!");
            setTimeout(() => setSuccess(null), 3000);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel order"
        description="This will cancel the current order."
        confirmLabel="Cancel Order"
        tone="danger"
        isConfirming={cancelling}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancelOrder}
      />
    </div>
  );
}
