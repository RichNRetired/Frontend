"use client";

import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="w-6 h-6 text-gray-700" />
        <h1 className="text-2xl font-semibold text-gray-900">Payment Methods</h1>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">
          No saved payment methods yet.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Payment methods will be saved automatically when you complete a purchase.
        </p>
      </div>
    </div>
  );
}
