"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
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
import { useGetProfileQuery } from "../../features/user/userApi";

export default function AccountPage() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

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

  const displayName =
    profile?.fullName?.trim() ||
    profile?.user?.name?.trim() ||
    user?.name?.trim() ||
    "User";

  const preferredEmail = useMemo(
    () => profile?.user?.email?.trim() || user?.email?.trim() || "",
    [profile?.user?.email, user?.email],
  );

  const avatarLabel = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!preferredEmail) {
      return;
    }

    setSubscriptionEmail((current) => current || preferredEmail);
  }, [preferredEmail]);

  useEffect(() => {
    if (globalThis.window === undefined) {
      return;
    }

    const storedSubscription = globalThis.localStorage.getItem("inner-circle-subscription");

    if (!storedSubscription) {
      return;
    }

    try {
      const parsed = JSON.parse(storedSubscription) as {
        email?: string;
        subscribed?: boolean;
      };

      setIsSubscribed(Boolean(parsed.subscribed));

      if (parsed.email) {
        setSubscriptionEmail(parsed.email);
      }
    } catch {
      globalThis.localStorage.removeItem("inner-circle-subscription");
    }
  }, []);

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = subscriptionEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setIsSubscribed(false);
      setSubscriptionMessage("Enter your email address to join the Inner Circle.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      setIsSubscribed(false);
      setSubscriptionMessage("Enter a valid email address.");
      return;
    }

    globalThis.localStorage.setItem(
      "inner-circle-subscription",
      JSON.stringify({
        email: normalizedEmail,
        subscribed: true,
      }),
    );

    setSubscriptionEmail(normalizedEmail);
    setIsSubscribed(true);
    setSubscriptionMessage(
      "You are in. We will use this email for Inner Circle updates and early drops.",
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

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
            className="flex  items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-900 hover:text-red-500 transition-colors group"
          >
            <LogOut
              size={14}
              className="group-hover:-translate-x-1 text-black transition-transform"
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
                {avatarLabel}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                  {displayName}
                </h2>
                <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
                        The Inner Circle
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Get first access to new clothes, private drops, and early restock updates.
                      </p>
                    </div>
                    {isSubscribed && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
                        <CheckCircle2 size={12} /> Joined
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSubscribe} className="mt-5 space-y-3">
                    <input
                      type="email"
                      value={subscriptionEmail}
                      onChange={(event) => setSubscriptionEmail(event.target.value)}
                      placeholder="Email address"
                      className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-black px-4 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-colors hover:bg-neutral-800"
                    >
                      {isSubscribed ? "Update Subscription" : "Join Inner Circle"}
                    </button>
                  </form>

                  {subscriptionMessage && (
                    <p className={`mt-3 text-xs leading-5 ${isSubscribed ? "text-green-700" : "text-red-600"}`}>
                      {subscriptionMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* GRID NAVIGATION */}
          <main className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-neutral-200 border border-neutral-200">
              {navItems.map((item) => (
                <Link
                  key={item.href}
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
