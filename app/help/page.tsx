"use client";

import Link from "next/link";
import {
  HelpCircle,
  Package,
  RefreshCw,
  CreditCard,
  Truck,
  Mail,
  ChevronRight,
} from "lucide-react";

const helpTopics = [
  {
    icon: Package,
    title: "Orders & Tracking",
    description: "Track your order, manage deliveries, and view order history.",
    href: "/account/orders",
  },
  {
    icon: RefreshCw,
    title: "Returns & Refunds",
    description: "Start a return, check refund status, and return policies.",
    href: "/returns",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Payment methods, failed transactions, and billing issues.",
    href: "/account/payments",
  },
  {
    icon: Truck,
    title: "Shipping",
    description: "Delivery timelines, shipping charges, and serviceability.",
    href: "/shipping",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <HelpCircle className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-semibold text-gray-900">Help Center</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        How can we help you today?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {helpTopics.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={title}
            href={href}
            className="flex items-start gap-4 p-5 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all group"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 text-sm">{title}</p>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
              </div>
              <p className="text-gray-500 text-xs mt-1">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-center">
        <Mail className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium text-sm mb-1">Still need help?</p>
        <p className="text-gray-500 text-xs mb-4">
          Our support team is available to assist you.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
