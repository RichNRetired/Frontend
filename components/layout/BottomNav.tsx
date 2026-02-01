"use client";

import React from "react";
import Link from "next/link";
import { Home, ShoppingCart, CreditCard, Clock, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex flex-col items-center text-neutral-600 hover:text-purple-700"
          >
            <Home className="w-6 h-6" />
            <span className="text-[11px] mt-1">Home</span>
          </Link>

          <Link
            href="/cart"
            className="flex flex-col items-center text-neutral-600 hover:text-purple-700 relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[11px] mt-1">Cart</span>
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          <Link
            href="/checkout"
            className="flex flex-col items-center text-neutral-600 hover:text-purple-700"
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-[11px] mt-1">Checkout</span>
          </Link>

          <Link
            href="/viewed"
            className="flex flex-col items-center text-neutral-600 hover:text-purple-700"
          >
            <Clock className="w-6 h-6" />
            <span className="text-[11px] mt-1">Viewed</span>
          </Link>

          <Link
            href="/account"
            className="flex flex-col items-center text-neutral-600 hover:text-purple-700"
          >
            <User className="w-6 h-6" />
            <span className="text-[11px] mt-1">Account</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
