"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ArrowLeft, Mail, ChevronRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-6">
      {/* Decorative Background Element (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black" />

      <div className="w-full max-w-sm">
        {/* Navigation Back */}
        <Link
          href="/login"
          className="group inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Return to Sign In
        </Link>

        {!isSent ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
                Reset{" "}
                <span className="font-serif italic font-light">Password</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enter the email address associated with your account and
                we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-focus-within:text-black transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="e.g. vogue@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-0 border-b border-slate-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent placeholder:text-slate-200"
                  />
                  <Mail className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-[0.3em] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  "Requesting..."
                ) : (
                  <>
                    Send Reset Link <ChevronRight size={14} />
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4">
              <Mail className="h-8 w-8 text-black" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Check your inbox
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                We’ve sent a password reset link to <br />
                <span className="text-black font-semibold">{email}</span>
              </p>
            </div>
            <div className="pt-4">
              <p className="text-xs text-slate-400">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={() => setIsSent(false)}
                  className="text-black font-bold underline underline-offset-4 hover:text-pink-600 transition-colors"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Brand Footer */}
        <div className="mt-24 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-300">
            EST. 2026
          </p>
        </div>
      </div>
    </div>
  );
}
