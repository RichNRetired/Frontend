"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReturnsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/returns");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
      <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-4">
        Returns
      </p>
      <h1 className="text-4xl font-light tracking-tighter uppercase mb-4">
        Return / Exchange
      </h1>
      <p className="text-neutral-500 text-sm mb-8 max-w-xs">
        Redirecting you to your returns dashboard where you can manage all your
        return requests.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/account/returns"
          className="px-8 py-4 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 transition-all"
        >
          My Returns
        </Link>
        <Link
          href="/refund"
          className="px-8 py-4 border border-black text-black text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-50 transition-all"
        >
          Refund Policy
        </Link>
      </div>
    </div>
  );
}
