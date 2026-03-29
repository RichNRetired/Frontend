"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useGetReturnDetailsQuery,
  useGetReturnTrackingQuery,
  useGetReturnTimelineQuery,
  useCancelReturnMutation,
} from "@/features/order/orderApi";
import { ReturnStatus } from "@/features/order/orderTypes";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  X,
  Clock,
  Package,
  Loader2,
} from "lucide-react";
import { sendEvent } from "@/services/analytics.service";

const CANCELLABLE_STATUSES = new Set<ReturnStatus>(["REQUESTED", "PENDING_APPROVAL"]);

const getStatusBadgeClass = (status: ReturnStatus): string => {
  switch (status) {
    case "COMPLETED":
    case "REFUND_COMPLETED":
    case "REPLACEMENT_DELIVERED":
    case "QC_PASSED":
      return "bg-green-50 text-green-700";
    case "REJECTED":
    case "QC_FAILED":
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    case "APPROVED":
    case "PICKUP_SCHEDULED":
    case "PICKUP_COMPLETED":
    case "QC_PENDING":
    case "QC_IN_PROGRESS":
    case "REFUND_PENDING":
    case "REPLACEMENT_PENDING":
    case "REPLACEMENT_SHIPPED":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-orange-50 text-orange-700";
  }
};

const getStatusLabel = (status: ReturnStatus): string => {
  const labels: Record<ReturnStatus, string> = {
    REQUESTED: "Requested",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PICKED_UP: "Picked Up",
    PENDING_APPROVAL: "Pending Approval",
    PENDING_PICKUP: "Pending Pickup",
    PICKUP_SCHEDULED: "Pickup Scheduled",
    PICKUP_COMPLETED: "Pickup Completed",
    QC_PENDING: "QC Pending",
    QC_IN_PROGRESS: "QC In Progress",
    REFUND_PENDING: "Refund Pending",
    REFUND_COMPLETED: "Refund Completed",
    REPLACEMENT_PENDING: "Replacement Pending",
    REPLACEMENT_SHIPPED: "Replacement Shipped",
    REPLACEMENT_DELIVERED: "Replacement Delivered",
    QC_PASSED: "QC Passed",
    QC_FAILED: "QC Failed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  };
  return labels[status] ?? status;
};

export default function ReturnDetailsPage() {
  const params = useParams();
  const returnId = Number(params.id);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    data: details,
    isLoading,
    error: detailsError,
    refetch,
  } = useGetReturnDetailsQuery(returnId, {
    skip: !Number.isFinite(returnId) || returnId <= 0,
  });

  const { data: tracking, isLoading: trackingLoading } = useGetReturnTrackingQuery(
    returnId,
    { skip: !Number.isFinite(returnId) || returnId <= 0 },
  );

  const { data: timeline = [], isLoading: timelineLoading } = useGetReturnTimelineQuery(
    returnId,
    { skip: !Number.isFinite(returnId) || returnId <= 0 },
  );

  const [cancelReturn, { isLoading: cancelling }] = useCancelReturnMutation();

  const confirmCancelReturn = async () => {
    try {
      setError(null);
      await cancelReturn(returnId).unwrap();
      setSuccess("Return cancelled successfully");
      sendEvent("return_cancelled", { returnId });
      setIsCancelDialogOpen(false);
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to cancel return");
      setIsCancelDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-neutral-400" />
          <span className="text-sm uppercase tracking-widest text-neutral-400">
            Loading return details...
          </span>
        </div>
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Link
            href="/account/returns"
            className="flex items-center gap-2 text-neutral-500 mb-8 hover:text-black transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Returns</span>
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-light uppercase tracking-tighter mb-2">
              Return Not Found
            </h1>
            <p className="text-neutral-600 mb-6">
              We couldn't find the return you're looking for.
            </p>
            <Link href="/account/returns">
              <button className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all">
                View All Returns
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { returnInfo, orderItem, refund } = details;
  const isCancellable = CANCELLABLE_STATUSES.has(returnInfo.status);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Notifications */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 z-50 max-w-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
          <p className="text-sm text-green-700">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-700">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 z-50 max-w-md animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          href="/account/returns"
          className="flex items-center gap-2 text-neutral-500 mb-8 hover:text-black transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Returns</span>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl text-black font-light uppercase tracking-tighter mb-1">
                Return {returnInfo.returnNumber}
              </h1>
              <p className="text-neutral-500 text-sm">
                {returnInfo.createdAt
                  ? new Date(returnInfo.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date unavailable"}
              </p>
            </div>
            <span
              className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded ${getStatusBadgeClass(
                returnInfo.status,
              )}`}
            >
              {getStatusLabel(returnInfo.status)}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Return Summary */}
          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-4">
              Return Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Product</span>
                <span className="font-medium text-neutral-900 text-right max-w-[55%] truncate">
                  {returnInfo.productName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Quantity</span>
                <span className="font-medium text-neutral-900">{returnInfo.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Reason</span>
                <span className="font-medium text-neutral-900">
                  {returnInfo.reason.replaceAll("_", " ")}
                </span>
              </div>
              {returnInfo.reasonDescription && (
                <div className="pt-2 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500">{returnInfo.reasonDescription}</p>
                </div>
              )}
              <div className="border-t border-neutral-100 pt-3 flex justify-between font-bold text-base text-black">
                <span>Refund Amount</span>
                <span>₹{returnInfo.totalRefundAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Refund Info */}
          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-4">
              Refund Details
            </h2>
            {refund ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status</span>
                  <span className={`font-medium ${refund.status === "COMPLETED" ? "text-green-600" : ""} ${refund.status === "FAILED" ? "text-red-600" : ""} ${refund.status !== "COMPLETED" && refund.status !== "FAILED" ? "text-neutral-900" : ""}`}>
                    {refund.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Amount</span>
                  <span className="font-medium text-neutral-900">₹{refund.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Method</span>
                  <span className="font-medium text-neutral-900">
                    {refund.refundMethod.replaceAll("_", " ")}
                  </span>
                </div>
                {refund.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Transaction ID</span>
                    <span className="font-medium text-neutral-900 text-right text-xs">
                      {refund.transactionId}
                    </span>
                  </div>
                )}
                {refund.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Processed At</span>
                    <span className="font-medium text-neutral-900">
                      {new Date(refund.processedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {refund.failureReason && (
                  <div className="pt-2 border-t border-neutral-100 text-red-600 text-xs">
                    {refund.failureReason}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                Refund will be initiated once the return is approved and quality-checked.
              </p>
            )}
          </div>
        </div>

        {/* Order Item */}
        {orderItem && (
          <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-4">
              Returned Item
            </h2>
            <div className="border border-neutral-200 rounded-lg p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0">
                <Package size={16} className="text-neutral-500" />
              </div>
              <div className="flex-1 text-sm space-y-1">
                <p className="font-medium text-neutral-900">{orderItem.productName}</p>
                {orderItem.size && <p className="text-neutral-500">Size: {orderItem.size}</p>}
                {orderItem.color && <p className="text-neutral-500">Colour: {orderItem.color}</p>}
                <p className="text-neutral-500">
                  ₹{orderItem.price.toLocaleString()} &times; {orderItem.quantity} ={" "}
                  <span className="font-medium text-neutral-900">
                    ₹{orderItem.total.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Steps */}
        {(trackingLoading || tracking) && (
          <div className="mb-10 border border-neutral-200 rounded-lg p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-5">
              Return Progress
            </h2>
            {trackingLoading && (
              <div className="flex items-center gap-3 text-sm text-neutral-400">
                <Loader2 size={16} className="animate-spin" />
                Loading tracking...
              </div>
            )}
            {!trackingLoading && tracking && (
              <>
                {tracking.estimatedCompletionDate && (
                  <div className="flex items-center gap-2 mb-5 text-sm text-neutral-500">
                    <Clock size={14} />
                    <span>
                      Estimated completion:{" "}
                      {new Date(tracking.estimatedCompletionDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  {tracking.steps.map((step, index) => (
                    <div key={`${step.title}-${index}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                            step.completed ? "bg-black" : "bg-neutral-200"
                          }`}
                        />
                        {index < tracking.steps.length - 1 && (
                          <div className={`w-px flex-1 mt-1 ${step.completed ? "bg-neutral-300" : "bg-neutral-100"}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-medium ${step.completed ? "text-neutral-900" : "text-neutral-400"}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
                        {step.date && step.completed && (
                          <p className="text-[11px] text-neutral-400 mt-1">
                            {new Date(step.date).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Timeline */}
        {(timelineLoading || timeline.length > 0) && (
          <div className="mb-10 border border-neutral-200 rounded-lg p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-black mb-5">
              Activity Timeline
            </h2>
            {timelineLoading && (
              <div className="flex items-center gap-3 text-sm text-neutral-400">
                <Loader2 size={16} className="animate-spin" />
                Loading timeline...
              </div>
            )}
            {!timelineLoading && (
              <div className="space-y-4">
                {timeline.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex gap-4 border-l border-neutral-200 pl-4"
                  >
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-black" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{entry.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{entry.description}</p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        {new Date(entry.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {entry.createdBy ? ` · ${entry.createdBy}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {isCancellable && (
            <button
              disabled={cancelling}
              onClick={() => setIsCancelDialogOpen(true)}
              className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
              {cancelling ? "Cancelling..." : "Cancel Return"}
            </button>
          )}
          <Link href="/account/returns">
            <button className="flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-neutral-200 transition-all">
              Back to Returns
            </button>
          </Link>
          <Link href={`/account/orders/${returnInfo.orderId}`}>
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-neutral-800 transition-all">
              View Order
            </button>
          </Link>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel return"
        description="Are you sure you want to cancel this return request? This action cannot be undone."
        confirmLabel="Cancel Return"
        tone="danger"
        isConfirming={cancelling}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancelReturn}
      />
    </div>
  );
}
