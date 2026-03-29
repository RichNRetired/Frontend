import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  tone?: "danger" | "neutral";
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
  tone = "neutral",
  onConfirm,
  onClose,
}: Readonly<ConfirmDialogProps>) {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass =
    tone === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-black text-white hover:bg-neutral-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${confirmButtonClass}`}
          >
            {isConfirming ? "Canceling..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}