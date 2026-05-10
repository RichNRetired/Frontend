"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setSuccess(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 animate-in fade-in zoom-in-95 duration-500">
        <CheckCircle2 className="text-green-400 w-10 h-10" strokeWidth={1.5} />
        <p className="text-sm font-light tracking-widest text-green-300 uppercase">
          {success}
        </p>
        <button
          onClick={() => setSuccess("")}
          className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white mt-2 transition-colors"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-0 border-b border-neutral-700 pb-2 focus-within:border-white transition-colors group"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="EMAIL ADDRESS"
          required
          disabled={loading}
          className="flex-1 px-2 py-4 bg-transparent outline-none text-[10px] tracking-[0.3em] placeholder:text-neutral-500 uppercase text-white disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-neutral-400 transition-colors disabled:opacity-60 flex items-center gap-2 justify-center"
        >
          {loading ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Subscribing...</>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {error && (
        <p className="text-[11px] text-red-400 tracking-wide text-center animate-in fade-in duration-300">
          {error}
        </p>
      )}
    </div>
  );
}
