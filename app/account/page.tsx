"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  ChevronRight,
  Heart,
  Package,
  CreditCard,
  HeadphonesIcon,
  LogOut,
} from "lucide-react";
import { RootState } from "../../store";
import { logout } from "../../features/auth/authSlice";

export default function AccountPage() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    {
      title: "Orders",
      desc: "Track & returns",
      icon: Package,
      href: "/account/orders",
    },
    { title: "Wishlist", desc: "Saved pieces", icon: Heart, href: "/wishlist" },
    {
      title: "Profile",
      desc: "Identity settings",
      icon: User,
      href: "/account/profile",
    },
    {
      title: "Addresses",
      desc: "Shipping info",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: "Payments",
      desc: "Cards & credit",
      icon: CreditCard,
      href: "/account/payments",
    },
    {
      title: "Support",
      desc: "Help & FAQs",
      icon: HeadphonesIcon,
      href: "/help",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A]">
      <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-20 md:pt-32">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
          <div>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tighter">
              My Account.
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 hover:text-red-500 transition-colors group"
          >
            <LogOut
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Sign Out
          </button>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* PROFILE SUMMARY */}
          <aside className="lg:col-span-4 lg:border-r border-neutral-200 lg:pr-12">
            <div className="flex items-center lg:flex-col lg:items-start gap-6">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-neutral-900 flex items-center justify-center text-white text-2xl md:text-4xl font-light">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                  {user?.name}
                </h2>
                <p className="text-sm text-neutral-400 font-light mt-1">
                  {user?.email}
                </p>
                <div className="inline-block mt-4 px-3 py-1 bg-neutral-100 rounded-full"></div>
              </div>
            </div>
          </aside>

          {/* GRID NAVIGATION */}
          <main className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-neutral-200 border border-neutral-200">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group bg-white p-8 md:p-10 flex flex-col justify-between transition-colors hover:bg-[#F9F9F9]"
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="text-neutral-900">
                      <item.icon size={24} strokeWidth={1} />
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-neutral-300 group-hover:text-black group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light tracking-wide uppercase">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* SHOPPING CTA */}
            <div className="mt-16 text-center lg:text-left">
              <Link
                href="/shop"
                className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] group"
              >
                <span className="border-b border-black pb-1">
                  Continue Shopping
                </span>
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
