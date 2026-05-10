"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ArrowLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { API_BASE } from "@/lib/api";

type Step = "identifier" | "otp" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [cooldown]);

  const sendOtp = async () => {
    if (!identifier.trim()) { setError("Enter your email or phone number"); return; }
    setIsLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Failed to send OTP");
      }
      setStep("otp");
      setCooldown(30);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) { setError("Enter the OTP"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setIsLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), otp: otp.trim(), newPassword }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Reset failed");
      }
      setStep("done");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-black" />
      <div className="w-full max-w-sm">
        <Link href="/login" className="group inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-black transition-colors mb-12">
          <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Return to Sign In
        </Link>

        {step === "identifier" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
                Reset <span className="font-serif font-light">Password</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enter your email or phone number to receive a one-time code.
              </p>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="space-y-8">
              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-focus-within:text-black transition-colors">
                  Email or Phone
                </label>
                <input
                  type="text"
                  placeholder="email@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  className="h-12 border-0 border-b border-slate-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent placeholder:text-slate-200 w-full outline-none"
                />
              </div>
              <Button
                type="button"
                disabled={isLoading}
                onClick={sendOtp}
                className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-[0.3em] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? "Sending..." : <> Send OTP <ChevronRight size={14} /> </>}
              </Button>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
                New <span className="font-serif font-light">Password</span>
              </h1>
              <p className="text-sm text-slate-500">
                OTP sent to <span className="text-black font-semibold">{identifier}</span>
              </p>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <form onSubmit={resetPassword} className="space-y-6">
              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-focus-within:text-black transition-colors">
                  OTP
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 border-0 border-b border-slate-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent placeholder:text-slate-200 tracking-widest"
                />
              </div>
              <div className="group relative">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-focus-within:text-black transition-colors">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 border-0 border-b border-slate-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent placeholder:text-slate-200 pr-8"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-[0.3em] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? "Resetting..." : <> Reset Password <ChevronRight size={14} /> </>}
              </Button>
              <div className="text-center">
                <button type="button" disabled={cooldown > 0} onClick={() => { setCooldown(30); sendOtp(); }}
                  className="text-[11px] text-slate-400 hover:text-black disabled:opacity-40 transition-colors">
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4 text-4xl">✓</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Password Reset!</h2>
              <p className="text-sm text-slate-500">You can now log in with your new password.</p>
            </div>
            <Button onClick={() => router.push("/login")}
              className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-[0.3em] font-bold">
              Go to Login
            </Button>
          </div>
        )}

        <div className="mt-24 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-300">EST. 2026</p>
        </div>
      </div>
    </div>
  );
}
