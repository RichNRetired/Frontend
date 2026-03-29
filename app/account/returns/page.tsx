"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useGetMyReturnsQuery,
  useCancelReturnMutation,
} from "@/features/order/orderApi";
import { ReturnResponse, ReturnStatus } from "@/features/order/orderTypes";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  AlertCircle,
  CheckCircle2,
  Package,
  Clock,
  ChevronRight,
  UndoIcon,
  X,
  RotateCcw,
} from "lucide-react";
import { sendEvent } from "@/services/analytics.service";

const CANCELLABLE_STATUSES = new Set<ReturnStatus>(["REQUESTED", "PENDING_APPROVAL"]);

const getStatusDotClass = (status: ReturnStatus): string => {
  switch (status) {
    case "COMPLETED":
    case "REFUND_COMPLETED":
    case "REPLACEMENT_DELIVERED":
    case "QC_PASSED":
      return "bg-green-500";
    case "REJECTED":
    case "QC_FAILED":
    case "CANCELLED":
      return "bg-red-500";
    case "APPROVED":
    case "PICKUP_SCHEDULED":
    case "PICKUP_COMPLETED":
    case "QC_PENDING":
    case "QC_IN_PROGRESS":
    case "REFUND_PENDING":
    case "REPLACEMENT_PENDING":
    case "REPLACEMENT_SHIPPED":
      return "bg-blue-500";
    default:
      return "bg-orange-400";
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

export default function ReturnsPage() {
  const [pendingCancelReturnId, setPendingCancelReturnId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetMyReturnsQuery({ page: 0, size: 20 });
  const [cancelReturn, { isLoading: cancelling }] = useCancelReturnMutation();

  const confirmCancelReturn = async () => {
    if (pendingCancelReturnId === null) return;
    try {
      setError(null);
      await cancelReturn(pendingCancelReturnId).unwrap();
      setSuccess("Return cancelled successfully");
      sendEvent("return_cancelled", { returnId: pendingCancelReturnId });
      refetch();
      setPendingCancelReturnId(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to cancel return");
      setPendingCancelReturnId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 bg-white rounded-2xl animate-pulse border border-neutral-100"
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
        <h1 className="text-xl font-semibold mb-2">Could not load returns</h1>
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

  const returns: ReturnResponse[] = data?.content ?? [];

  if (returns.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
          <RotateCcw className="text-neutral-300" size={40} />
        </div>
        <h1 className="text-2xl text-black font-bold tracking-tight mb-2">
          No returns yet
        </h1>
        <p className="text-neutral-500 mb-8 max-w-xs">
          When you request a return, it will appear here for you to track.
        </p>
        <Link
          href="/account/orders"
          className="w-full max-w-xs py-4 bg-black text-white rounded-full font-medium text-center block"
        >
          View Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-10">
      {/* Toasts */}
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

      {/* Header */}
      <header className="bg-white mt-12 pt-16 pb-8 px-6 border-b border-neutral-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            My Returns
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Track and manage your return requests
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        {returns.map((ret) => {
          const isCancellable = CANCELLABLE_STATUSES.has(ret.status);

          return (
            <div
              key={ret.id}
              className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-5 flex items-center justify-between border-b border-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <UndoIcon size={18} className="text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                      Return #
                    </p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {ret.returnNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Refund
                  </p>
                  <p className="text-sm font-bold text-black">
                    ₹{ret.totalRefundAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Product & Reason */}
              <div className="px-5 py-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={16} className="text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {ret.productName}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Qty: {ret.quantity} &middot; Reason:{" "}
                    {ret.reason.replaceAll("_", " ")}
                  </p>
                  {ret.reasonDescription && (
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">
                      {ret.reasonDescription}
                    </p>
                  )}
                </div>
              </div>

              {/* Status & Date */}
              <div className="px-5 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusDotClass(ret.status)}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    {getStatusLabel(ret.status)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-neutral-400">
                  <Clock size={12} />
                  <span className="text-[11px] font-medium">
                    {new Date(ret.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-neutral-50/50 grid grid-cols-2 gap-2">
                <Link
                  href={`/account/returns/${ret.id}`}
                  className="col-span-2"
                >
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-neutral-200 text-black rounded-xl text-xs font-bold uppercase tracking-tight hover:bg-neutral-100 transition-colors">
                    <ChevronRight size={14} />
                    View Details &amp; Tracking
                  </button>
                </Link>

                {isCancellable && (
                  <button
                    disabled={cancelling && pendingCancelReturnId === ret.id}
                    onClick={() => setPendingCancelReturnId(ret.id)}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-tight border border-red-100 disabled:opacity-50 hover:bg-red-100 transition-colors"
                  >
                    <X size={14} />
                    {cancelling && pendingCancelReturnId === ret.id
                      ? "Cancelling..."
                      : "Cancel Return"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </main>

      <ConfirmDialog
        isOpen={pendingCancelReturnId !== null}
        title="Cancel return"
        description="Are you sure you want to cancel this return request? This action cannot be undone."
        confirmLabel="Cancel Return"
        tone="danger"
        isConfirming={cancelling}
        onClose={() => setPendingCancelReturnId(null)}
        onConfirm={confirmCancelReturn}
      />
    </div>
  );
}
