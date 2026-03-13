"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Home, ShoppingBag, LayoutGrid, Heart, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  // Pulling items from Redux to show the actual count
  const { items } = useSelector((state: RootState) => state.cart);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const linkClass = (href: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `flex flex-col items-center justify-center w-full transition-transform active:scale-90 ${
      isActive ? "text-black" : "text-neutral-400"
    }`;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-neutral-100 pb-safe">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {/* HOME */}
          <Link href="/" className={linkClass("/")}>
            <Home size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Home
            </span>
          </Link>

          {/* SHOP */}
          <Link href="/shop" className={linkClass("/shop")}>
            <LayoutGrid size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Shop
            </span>
          </Link>

          {/* CART */}
          <Link href="/cart" className={`relative ${linkClass("/cart")}`}>
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
          <Link href="/wishlist" className={linkClass("/wishlist")}>
            <Heart size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.1em] mt-1 font-medium">
              Saved
            </span>
          </Link>

          {/* ACCOUNT */}
          <Link href="/account" className={linkClass("/account")}>
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
