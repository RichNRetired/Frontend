"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useReorderOrderMutation,
  useLazyTrackOrderQuery,
  useInitiatePaymentMutation,
} from "@/features/order/orderApi";
import type {
  Order,
  OrderItem,
  TrackingLookupResponse,
} from "@/features/order/orderTypes";
import { addItem } from "@/features/cart/cartSlice";
import {
  AlertCircle,
  RefreshCw,
  X,
  Eye,
  CheckCircle2,
  ShoppingBag,
  Package,
  Clock,
  Loader2,
  Truck,
  CreditCard,
} from "lucide-react";
import { sendEvent } from "@/services/analytics.service";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getCurrentUser } from "@/lib/auth";
import { buildInitiatePaymentRequest } from "@/lib/razorpay";

// const getOrderStatusDotClass = (status: string) => {
//   if (status === "PAID") {
//     return "bg-green-500";
//   }

//   if (status === "CANCELLED") {
//     return "bg-red-500";
//   }

//   return "bg-orange-400";
// };

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState<
    number | null
  >(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<{
    orderId: number;
    trackingId: string;
  } | null>(null);

  const { data, isLoading, isError, refetch } = useGetMyOrdersQuery({
    page: 0,
    size: 10,
  });

  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [reorderOrder, { isLoading: reordering }] = useReorderOrderMutation();
  const [trackOrder, { data: trackingData, isFetching: trackingLoading }] =
    useLazyTrackOrderQuery();
  const [initiatePayment] = useInitiatePaymentMutation();
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

  const handleCancelOrder = async (orderId: number) => {
    setPendingCancelOrderId(orderId);
  };

  const confirmCancelOrder = async () => {
    if (pendingCancelOrderId === null) {
      return;
    }

    try {
      setError(null);
      await cancelOrder({ orderId: pendingCancelOrderId }).unwrap();
      setSuccess("Order cancelled successfully");
      sendEvent("order_cancelled", { orderId: pendingCancelOrderId });
      refetch();
      setPendingCancelOrderId(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to cancel order");
    }
  };

  const handleReorderOrder = async (orderId: number, order: Order) => {
    try {
      setError(null);
      setSuccess(null);
      await reorderOrder(orderId).unwrap();
      order.items.forEach((item: OrderItem) => {
        dispatch(
          addItem({
            id: String(item.cartId || item.productId),
            productId: item.productId,
            variantId: Number(item.variantId || 0),
            categoryId:
              Number(item.categoryId ?? item.category?.id) || undefined,
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            image: item.imageUrl,
          }),
        );
      });
      setSuccess("Items added to cart! Redirecting...");
      sendEvent("order_reordered", { orderId });
      setTimeout(() => router.push("/checkout"), 1500);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to reorder");
    }
  };

  const handlePayNow = async (order: Order) => {
    try {
      setError(null);
      setPayingOrderId(order.orderId);
      const currentUser =
        globalThis.window === undefined ? null : getCurrentUser();
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
      sessionStorage.setItem(
        `payment_init_${order.orderId}`,
        JSON.stringify(payResp),
      );
      router.push(`/checkout/payment?orderId=${order.orderId}`);
    } catch (err: any) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Failed to initiate payment. Please try again.",
      );
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleTrackOrder = async (order: Order) => {
    if (!order.trackingId) {
      setError("Tracking is not available for this order yet.");
      return;
    }

    if (
      activeTrackingOrder?.orderId === order.orderId &&
      activeTrackingOrder.trackingId === order.trackingId
    ) {
      setActiveTrackingOrder(null);
      return;
    }

    setError(null);
    setActiveTrackingOrder({
      orderId: order.orderId,
      trackingId: order.trackingId,
    });

    try {
      await trackOrder(order.trackingId).unwrap();
    } catch (err: any) {
      setActiveTrackingOrder(null);
      setError(err?.data?.message || "Failed to load tracking updates");
    }
  };

  const activeTrackingDetails: TrackingLookupResponse | null =
    activeTrackingOrder &&
    trackingData?.trackingId === activeTrackingOrder.trackingId
      ? trackingData
      : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-white rounded-2xl animate-pulse border border-neutral-100"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h1 className="text-xl font-semibold mb-2">Could not load orders</h1>
        <p className="text-neutral-500 text-sm mb-6">
          There was a problem connecting to our servers.
        </p>
        <button
          onClick={() => refetch()}
          className="w-full max-w-xs py-4 bg-black text-white rounded-full font-medium transition-transform active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  const orders = data?.content ?? [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-neutral-300" size={40} />
        </div>
        <h1 className="text-2xl text-black font-bold tracking-tight mb-2">
          No orders yet
        </h1>
        <p className="text-neutral-500 mb-8 max-w-xs">
          When you place an order, it will appear here for you to track.
        </p>
        <Link
          href="/"
          className="w-full max-w-xs py-4 bg-black text-white rounded-full font-medium"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-10">
      {/* Dynamic Toasts */}
      {(success || error) && (
        <div className="fixed top-6 inset-x-6 z-50 flex flex-col gap-3 pointer-events-none">
          {success && (
            <div className="bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto animate-in fade-in slide-in-from-top-4">
              <span className="text-sm font-medium">{success}</span>
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
          )}
          {error && (
            <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto animate-in fade-in slide-in-from-top-4">
              <span className="text-sm font-medium">{error}</span>
              <AlertCircle size={18} />
            </div>
          )}
        </div>
      )}

      {/* Modern Header */}
      <header className="bg-white mt-12 pt-16 pb-8 px-6 border-b border-neutral-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Purchase History
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Track, reorder, or manage your returns
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="p-5 flex items-center justify-between border-b border-neutral-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Package size={20} className="text-neutral-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Order ID
                  </p>
                  <p className="text-sm font-semibold text-neutral-900">
                    #{order.orderId.toString().slice(-6)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Total
                </p>
                <p className="text-sm font-bold text-black">
                  ₹{order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Product Quick View (Horizontal Scroll on Mobile) */}
            <div className="p-5">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex-shrink-0 w-20">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-50 mb-2 p-2">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      ) : null}
                    </div>
                    <p className="text-[10px] font-medium truncate text-neutral-600">
                      {item.productName}
                    </p>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex-shrink-0 w-20 aspect-[3/4] rounded-xl bg-neutral-50 flex items-center justify-center text-xs text-neutral-400 font-medium">
                    +{order.items.length - 3} more
                  </div>
                )}
              </div>
            </div>

            {/* Status & Date */}
            <div className="px-5 pb-5 flex items-center justify-between">
              {/* <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getOrderStatusDotClass(order.status)}`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  {order.status}
                </span>
              </div> */}
              <div className="flex items-center gap-1 text-neutral-400">
                <Clock size={12} />
                <span className="text-[11px] font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="p-3 bg-neutral-50/50 grid grid-cols-2 gap-2">
              <Link
                href={`/account/orders/${order.orderId}`}
                className="col-span-2"
              >
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-neutral-200 text-black rounded-xl text-xs font-bold uppercase tracking-tight hover:bg-neutral-100 transition-colors">
                  <Eye size={16} /> View Order Details
                </button>
              </Link>

              <button
                type="button"
                onClick={() => void handleTrackOrder(order)}
                disabled={
                  trackingLoading &&
                  activeTrackingOrder?.orderId === order.orderId
                }
                className="col-span-2 flex items-center justify-center gap-2 py-3 bg-white border border-neutral-200 text-black rounded-xl text-xs font-bold uppercase tracking-tight hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                {trackingLoading &&
                activeTrackingOrder?.orderId === order.orderId ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Truck size={16} />
                )}
                {activeTrackingOrder?.orderId === order.orderId
                  ? "Hide Tracking"
                  : "Track Order"}
              </button>

              {order.status !== "CANCELLED" && (
                <>
                  {order.requiresPayment && (
                    <button
                      disabled={payingOrderId === order.orderId}
                      onClick={() => void handlePayNow(order)}
                      className="col-span-2 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-tight disabled:opacity-50"
                    >
                      {payingOrderId === order.orderId ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CreditCard size={14} />
                      )}
                      {payingOrderId === order.orderId
                        ? "Loading..."
                        : "Pay Now"}
                    </button>
                  )}

                  <button
                    disabled={reordering}
                    onClick={() => handleReorderOrder(order.orderId, order)}
                    className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-tight disabled:opacity-50"
                  >
                    {reordering ? "..." : "Buy Again"}
                  </button>

                  <button
                    disabled={cancelling}
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-tight border border-red-100 disabled:opacity-50"
                  >
                    {cancelling ? "..." : "Cancel Order"}
                  </button>
                </>
              )}
            </div>

            {activeTrackingOrder?.orderId === order.orderId && (
              <div className="border-t border-neutral-100 bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                      Tracking ID
                    </p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {activeTrackingOrder.trackingId}
                    </p>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    {activeTrackingDetails?.events?.length || 0} updates
                  </span>
                </div>

                {trackingLoading && (
                  <p className="text-sm text-neutral-500">
                    Loading tracking updates...
                  </p>
                )}
                {!trackingLoading &&
                  (activeTrackingDetails?.events?.length ?? 0) > 0 && (
                    <div className="space-y-4">
                      {(activeTrackingDetails?.events ?? []).map(
                        (event, index) => (
                          <div
                            key={`${event.status}-${event.date}-${index}`}
                            className="flex gap-4 border-l border-neutral-200 pl-4"
                          >
                            <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-black" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {event.status}
                              </p>
                              <p className="text-[11px] text-neutral-500 mt-1">
                                {event.date
                                  ? new Date(event.date).toLocaleString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                      },
                                    )
                                  : "Date unavailable"}
                              </p>
                              {event.location ? (
                                <p className="text-sm text-neutral-600 mt-1">
                                  {event.location}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                {!trackingLoading && !activeTrackingDetails?.events?.length && (
                  <p className="text-sm text-neutral-500">
                    No tracking updates are available for this order yet.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </main>

      <ConfirmDialog
        isOpen={pendingCancelOrderId !== null}
        title="Cancel order"
        description="This will cancel the selected order."
        confirmLabel="Cancel Order"
        tone="danger"
        isConfirming={cancelling}
        onClose={() => setPendingCancelOrderId(null)}
        onConfirm={confirmCancelOrder}
      />

      {/* Floating Support Button for Mobile */}
      {/* <div className="fixed bottom-6 right-6 md:hidden">
        <button className="w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-90">
          <AlertCircle size={24} />
        </button>
      </div> */}
    </div>
  );
}
