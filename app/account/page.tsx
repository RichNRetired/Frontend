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
        <div className="w-10 h-10 border border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    {
      title: "Orders",
      desc: "Track, return or buy again",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Collections",
      desc: "Your saved favourites",
      icon: Heart,
      href: "/wishlist",
    },
    {
      title: "Profile",
      desc: "Personal information",
      icon: User,
      href: "/account/profile",
    },
    {
      title: "Addresses",
      desc: "Shipping locations",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: "Payments",
      desc: "Saved cards & methods",
      icon: CreditCard,
      href: "/account/payments",
    },
    {
      title: "Help",
      desc: "Support & FAQs",
      icon: HeadphonesIcon,
      href: "/help",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mt-12 mb-20">
          <h1 className="text-[38px] sm:text-[42px] md:text-[46px] font-extralight tracking-tight text-slate-900">
            My <span className="font-medium">Account</span>
          </h1>

          <p className="mt-4 text-[12px] tracking-[0.35em] uppercase text-slate-400">
            Personal dashboard
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <button
            onClick={handleLogout}
            className="
            px-6 py-2.5
            text-xs
            tracking-[0.35em]
            uppercase
            font-medium
            text-slate-500
            border border-slate-300
            rounded-full
            transition-all duration-300
            hover:text-red-600
            hover:border-red-500
            hover:bg-red-50
            active:scale-95
            mt-8"
          >
            Sign out
          </button>
        </div>

        {/* ================= LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* ========== PROFILE CARD ========== */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.2)]">
                <div className="relative w-28 h-28 mb-10">
                  <div className="w-full h-full rounded-full bg-neutral-100 flex items-center justify-center text-[42px] font-extralight text-slate-700 uppercase">
                    {user?.name?.charAt(0)}
                  </div>

                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] uppercase text-slate-400">
                    Member
                  </div>
                </div>

                <h2 className="text-2xl font-light tracking-tight text-slate-900">
                  {user?.name}
                </h2>

                <p className="mt-2 text-[13px] tracking-wide text-slate-400 break-all">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* ========== NAVIGATION CARDS ========== */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group relative bg-white p-8 rounded-2xl border border-slate-100
                  hover:border-slate-200 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]
                  transition-all duration-500 h-[180px] flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-slate-500 group-hover:text-slate-900 transition-colors">
                    <item.icon size={22} strokeWidth={1.25} />
                  </div>

                  <div>
                    <h3 className="text-[16px] font-medium tracking-tight text-slate-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-[13px] text-slate-400 leading-relaxed max-w-[90%]">
                      {item.desc}
                    </p>
                  </div>

                  <ChevronRight
                    size={14}
                    className="absolute bottom-8 right-8 text-slate-300 opacity-0
                    group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                  />
                </Link>
              ))}
            </div>

            {/* ========== FOOTER CTA ========== */}
            <div className="mt-20">
              <Link
                href="/"
                className="block text-center text-[11px] tracking-[0.35em] uppercase text-slate-900
                border-t border-slate-200 pt-10 hover:text-slate-500 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
