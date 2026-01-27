"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  ChevronRight,
  Heart,
  Package,
  CreditCard,
  Settings,
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
        <div className="w-10 h-10 border-2 border-slate-100 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    {
      title: "Orders",
      desc: "Check your order status",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Collections",
      desc: "Your curated wishlists",
      icon: Heart,
      href: "/wishlist",
    },
    {
      title: "Profile Details",
      desc: "Edit name, email, & phone",
      icon: User,
      href: "/account/profile",
    },
    {
      title: "Addresses",
      desc: "Saved shipping locations",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: "Saved Cards",
      desc: "Manage payment methods",
      icon: CreditCard,
      href: "/account/payments",
    },
    {
      title: "Help Center",
      desc: "FAQs & customer support",
      icon: HeadphonesIcon,
      href: "/help",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* HEADER SECTION - Clean & Minimal like H&M */}
        <div className="mb-10 pb-8 border-b mt-10 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">
              My <span className="font-bold">Account</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Manage your profile, orders and preferences
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 transition-all hover:text-red-600 hover:border-red-100"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT SIDEBAR: PROFILE SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100/50">
                <div className="relative w-24 h-24 mb-6">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl font-light text-slate-400 border border-slate-200 shadow-sm uppercase">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-pink-600 border-4 border-slate-50 rounded-full"></div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {user?.name}
                </h2>
                <p className="text-slate-500 text-sm mb-6">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: NAVIGATION TILES */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group relative bg-white p-6 rounded-xl border border-slate-100 hover:border-pink-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between h-40"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                    <item.icon size={20} strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 mb-1 group-hover:text-pink-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="absolute top-6 right-6 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all"
                  />
                </Link>
              ))}
            </div>

            {/* Bottom Section: Continue Shopping */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <Link
                href="/"
                className="flex items-center justify-center w-full py-4 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all rounded-md"
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
