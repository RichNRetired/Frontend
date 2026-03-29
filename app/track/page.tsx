"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TrackOrderPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/orders");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
      <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-4">
        Order Tracking
      </p>
      <h1 className="text-4xl font-light tracking-tighter uppercase mb-4">
        Track Your Order
      </h1>
      <p className="text-neutral-500 text-sm mb-8 max-w-xs">
        Redirecting you to your orders page where you can track all your
        shipments in real time.
      </p>
      <Link
        href="/account/orders"
        className="px-8 py-4 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 transition-all"
      >
        Go to My Orders
      </Link>
    </div>
  );
}
