"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useCheckReturnEligibilityMutation,
  useRequestReturnMutation,
} from "@/features/order/orderApi";
import { OrderItem, ReturnReason, ReturnResponse } from "@/features/order/orderTypes";
import { X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ReturnFormProps {
  orderId: number;
  orderItem: OrderItem & {
    orderItemId?: number;
    availableReasons?: ReturnReason[];
    returnDeadline?: string;
    eligibilityMessage?: string;
    isEligible?: boolean;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const RETURN_REASONS = [
  { value: "SIZE_ISSUE", label: "Size Issue" },
  { value: "DEFECTIVE", label: "Defective/Damaged" },
  { value: "DAMAGED", label: "Damaged in Transit" },
  { value: "NOT_AS_DESCRIBED", label: "Not as Described" },
  { value: "CHANGED_MIND", label: "Changed Mind" },
  { value: "OTHER", label: "Other" },
];

export const ReturnForm: React.FC<ReturnFormProps> = ({
  orderId,
  orderItem,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState<ReturnReason>("SIZE_ISSUE");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<ReturnResponse | null>(null);

  const [requestReturn, { isLoading }] = useRequestReturnMutation();
  const [checkReturnEligibility, { data: eligibility, isLoading: checkingEligibility }] =
    useCheckReturnEligibilityMutation();

  const availableReasons = useMemo(() => {
    if (orderItem.availableReasons?.length) {
      return RETURN_REASONS.filter(({ value }) =>
        orderItem.availableReasons?.includes(value as ReturnReason),
      );
    }

    return RETURN_REASONS;
  }, [orderItem.availableReasons]);

  const eligibilityMessage = eligibility?.message || orderItem.eligibilityMessage;
  const isEligible =
    orderItem.isEligible !== false &&
    eligibility?.isEligible !== false &&
    Boolean(orderItem.orderItemId);

  useEffect(() => {
    const fallbackReason = (availableReasons[0]?.value || "SIZE_ISSUE") as ReturnReason;
    setReason(fallbackReason);
  }, [availableReasons]);

  useEffect(() => {
    if (!orderItem.orderItemId || !orderItem.productId) {
      return;
    }

    checkReturnEligibility({
      orderItemId: orderItem.orderItemId,
      productId: orderItem.productId,
    });
  }, [checkReturnEligibility, orderItem.orderItemId, orderItem.productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!orderItem.orderItemId) {
      setError("This item is missing a return identifier. Please refresh and try again.");
      return;
    }

    if (!isEligible) {
      setError(eligibilityMessage || "This item is not eligible for return.");
      return;
    }

    if (quantity > orderItem.quantity) {
      setError(`Cannot return more than ${orderItem.quantity} items`);
      return;
    }

    if (quantity < 1) {
      setError("Please select at least 1 item to return");
      return;
    }

    try {
      const response = await requestReturn({
        orderId,
        orderItemId: orderItem.orderItemId,
        quantity,
        reason,
        reasonDescription: details || undefined,
        comments: details || undefined,
      }).unwrap();

      setSuccessData(response);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to request return";
      setError(errorMsg);
      console.error("Return error:", err);
    }
  };

  if (successData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-10">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-light uppercase tracking-tight mb-2">
            Return Requested
          </h2>
          <p className="text-neutral-600 mb-6">
            Return {successData.returnNumber} has been created. We'll keep you
            updated as pickup, quality check, and refund steps progress.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-neutral-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-light uppercase tracking-tight">
            Request Return
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
              Returning Item
            </p>
            <p className="font-medium text-neutral-900">
              {orderItem.productName}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Price: ₹{orderItem.price.toLocaleString()}
            </p>
            <p className="text-sm text-neutral-600">
              Available Qty: {orderItem.quantity}
            </p>
            {orderItem.returnDeadline && (
              <p className="text-sm text-neutral-600">
                Return by: {new Date(orderItem.returnDeadline).toLocaleDateString()}
              </p>
            )}
          </div>

          {checkingEligibility && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-sm text-neutral-600 flex items-center gap-3">
              <Loader2 size={16} className="animate-spin" />
              Checking return eligibility...
            </div>
          )}

          {!checkingEligibility && eligibilityMessage && (
            <div
              className={`rounded-lg p-4 text-sm ${
                isEligible
                  ? "bg-blue-50 border border-blue-200 text-blue-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {eligibilityMessage}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label
              htmlFor="return-quantity"
              className="block text-xs uppercase tracking-widest font-bold text-neutral-700 mb-3"
            >
              Return Quantity *
            </label>
            <div
              id="return-quantity"
              className="flex items-center border border-neutral-200 rounded-lg"
            >
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center text-neutral-600  font-bold py-2">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(Math.min(orderItem.quantity, quantity + 1))
                }
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="return-reason"
              className="block text-xs uppercase tracking-widest font-bold text-neutral-700 mb-3"
            >
              Return Reason *
            </label>
            <select
              id="return-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnReason)}
              className="w-full px-4 text-neutral-600  py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
            >
              {availableReasons.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="return-details"
              className="block text-xs uppercase tracking-widest font-bold text-neutral-700 mb-3"
            >
              Additional Details (Optional)
            </label>
            <textarea
              id="return-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide any additional details about the return..."
              className="w-full text-neutral-600 s px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm resize-none"
              rows={4}
            />
          </div>

          {/* Estimated Refund */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs uppercase tracking-widest text-green-700 font-bold mb-2">
              Estimated Refund
            </p>
            <p className="text-2xl font-light text-green-700">
              ₹{(orderItem.price * quantity).toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2">
              Refund will be processed within 5-7 business days after we receive
              the item
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-900 font-bold uppercase tracking-widest text-sm hover:bg-neutral-50 transition-all rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || checkingEligibility || !isEligible}
              className="flex-1 px-4 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-neutral-800 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Submitting..." : "Request Return"}
            </button>
          </div>
        </form>

        {/* Info Footer */}
        <div className="bg-neutral-50 border-t border-neutral-200 p-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            <span className="font-bold">Return Policy:</span> Products can be
            returned within 30 days of delivery in original condition. We'll
            provide a prepaid shipping label.
          </p>
        </div>
      </div>
    </div>
  );
};
