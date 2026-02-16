"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Home, ShoppingBag, Search, Heart, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  // Pulling items from Redux to show the actual count
  const { items } = useSelector((state: RootState) => state.cart);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-neutral-100 pb-safe">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {/* HOME */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center w-full text-black transition-active active:scale-90"
          >
            <Home size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Home
            </span>
          </Link>

          {/* SEARCH - Premium brands often put search in bottom nav for mobile */}
          <Link
            href="/search"
            className="flex flex-col items-center justify-center w-full text-black transition-active active:scale-90"
          >
            <Search size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Search
            </span>
          </Link>

          {/* CART - Only shows count if > 0 */}
          <Link
            href="/cart"
            className="flex flex-col items-center justify-center w-full text-black relative transition-active active:scale-90"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span className="absolute top-2 right-1/2 translate-x-3 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-90">
                {cartItemCount}
              </span>
            )}
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Cart
            </span>
          </Link>

          {/* WISHLIST */}
          <Link
            href="/wishlist"
            className="flex flex-col items-center justify-center w-full text-black transition-active active:scale-90"
          >
            <Heart size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Saved
            </span>
          </Link>

          {/* ACCOUNT */}
          <Link
            href="/account"
            className="flex flex-col items-center justify-center w-full text-black transition-active active:scale-90"
          >
            <User size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Profile
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
