"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useGetOrderDetailsQuery,
  useCancelOrderMutation,
} from "@/features/order/orderApi";
import { addItem } from "@/features/cart/cartSlice";
import { ReturnForm } from "@/components/returns/ReturnForm";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  X,
  RefreshCw,
  UndoIcon,
} from "lucide-react";
import { sendEvent } from "@/services/analytics.service";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const orderId = Number(params.id);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<any>(null);

  const {
    data: order,
    isLoading,
    error: orderError,
    refetch,
  } = useGetOrderDetailsQuery(orderId);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setError(null);
      await cancelOrder(orderId).unwrap();
      setSuccess("Order cancelled successfully");
      sendEvent("order_cancelled", { orderId });
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
                Orders #{order.orderId}
              </h1>
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
              className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded ${
                order.status === "PAID"
                  ? "bg-green-50 text-green-700"
                  : order.status === "CANCELLED"
                    ? "bg-red-50 text-red-700"
                    : "bg-neutral-100 text-neutral-600"
              }`}
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
                  <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-3">
                    Delivery Address
                  </h2>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <p className="font-medium text-neutral-900">
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
                  <span className="font-medium">
                    ₹{order.subtotal.toLocaleString()}
                  </span>
                </div>
              )}
              {order.taxAmount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax</span>
                  <span className="font-medium">
                    ₹{order.taxAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {order.shippingCharges !== undefined && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">
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
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start gap-4 p-6 hover:bg-neutral-50 transition-colors"
                >
                  {item.imageUrl && (
                    <Link href={`/product/${item.productId}`}>
                      <div className="w-20 h-28 bg-neutral-100 rounded overflow-hidden shrink-0 hover:opacity-80 transition-opacity">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
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
                  {/* Return Button */}
                  {(order.status === "PAID" ||
                    order.status === "DELIVERED") && (
                    <button
                      onClick={() =>
                        setSelectedItemForReturn({
                          ...item,
                          orderItemId: item.productId,
                        })
                      }
                      className="whitespace-nowrap px-4 py-2.5 border border-blue-200 text-blue-600 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-blue-50 transition-all"
                    >
                      <UndoIcon size={14} className="inline mr-1.5" />
                      Return Item
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {order.status !== "CANCELLED" && (
            <>
              <button
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </>
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
          orderItem={selectedItemForReturn}
          onClose={() => setSelectedItemForReturn(null)}
          onSuccess={() => {
            refetch();
            setSuccess("Return requested successfully!");
            setTimeout(() => setSuccess(null), 3000);
          }}
        />
      )}
    </div>
  );
}
