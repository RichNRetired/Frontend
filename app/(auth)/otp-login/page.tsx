"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestOtpThunk,
  verifyOtpThunk,
} from "../../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../../store";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Loader2, Mail, Phone, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type LoginMode = "email" | "phone";
type Step = "input" | "otp";

export default function OtpLoginPage() {
  const [mode, setMode] = useState<LoginMode>("phone");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error } = useSelector((state: RootState) => state.auth);

  // When mode changes, reset everything
  const handleModeChange = (newMode: LoginMode) => {
    setMode(newMode);
    setIdentifier("");
    setOtp("");
    setStep("input");
  };

  const getIdentifier = () => {
    if (mode === "phone") {
      // strip non-digits, keep as pure 10-digit number
      const digits = identifier.replace(/\D/g, "");
      return digits;
    }
    return identifier.trim();
  };

  const startCooldown = () => {
    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await dispatch(requestOtpThunk({ identifier: getIdentifier() }));
    setIsLoading(false);
    if (requestOtpThunk.fulfilled.match(result)) {
      setStep("otp");
      startCooldown();
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    const result = await dispatch(requestOtpThunk({ identifier: getIdentifier() }));
    setResendLoading(false);
    if (requestOtpThunk.fulfilled.match(result)) {
      setOtp("");
      startCooldown();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await dispatch(
      verifyOtpThunk({ identifier: getIdentifier(), otp })
    );

    setIsLoading(false);

    if (verifyOtpThunk.fulfilled.match(result)) {
      router.push("/");
    }
  };

  const handleBack = () => {
    setStep("input");
    setOtp("");
  };

  const maskedIdentifier =
    mode === "phone"
      ? `+91 ******${identifier.replace(/\D/g, "").slice(-4)}`
      : identifier.replace(/(.{2}).*(@.*)/, "$1****$2");

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FBFBFB] text-[#1a1a1a] selection:bg-black selection:text-white">
      {/* LEFT VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-200">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
          alt="Luxury storefront"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 transition-opacity hover:opacity-0 duration-700" />
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.6em] text-white font-bold">
              Collection 2026
            </span>
            <div className="h-[1px] flex-1 bg-white/30" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <h2 className="text-white text-7xl font-light leading-[0.85] tracking-tighter mb-6">
              The <br />
              <span className="font-serif">Identity</span>
            </h2>
            <p className="text-white/80 text-[10px] uppercase tracking-[0.4em] max-w-[300px] leading-loose border-l border-white/40 pl-4">
              Quick &amp; secure access with a one-time password.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 flex items-start lg:items-center justify-center px-6 sm:px-12 lg:px-24 pt-24 pb-12 lg:py-0"
      >
        <div className="w-full max-w-[400px] space-y-10">
          {/* HEADER */}
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-4xl mt-8 sm:text-5xl font-medium tracking-tighter leading-none">
              Sign In
            </h1>
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">
              One-time password
            </p>
          </div>

          {/* MODE TOGGLE — only shown on first step */}
          {step === "input" && (
            <div className="flex border border-neutral-200">
              <button
                type="button"
                onClick={() => handleModeChange("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-200 ${
                  mode === "phone"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-400 hover:text-black"
                }`}
              >
                <Phone size={13} />
                Mobile
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-200 ${
                  mode === "email"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-400 hover:text-black"
                }`}
              >
                <Mail size={13} />
                Email
              </button>
            </div>
          )}

          {/* ---- STEP 1: INPUT ---- */}
          {step === "input" && (
            <form onSubmit={handleRequestOtp} className="space-y-10">
              <div className="space-y-8">
                <AnimatePresence mode="wait">
                  {mode === "phone" ? (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="group relative"
                    >
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 group-focus-within:text-black transition-colors mb-2">
                        Mobile Number
                      </label>
                      <div className="flex items-end gap-3">
                        <span className="text-sm text-neutral-400 pb-[13px] border-b border-neutral-200 shrink-0">
                          +91
                        </span>
                        <Input
                          type="tel"
                          value={identifier}
                          onChange={(e) =>
                            setIdentifier(
                              e.target.value.replace(/\D/g, "").slice(0, 10)
                            )
                          }
                          placeholder="98765 43210"
                          required
                          className="h-12 border-0 border-b border-neutral-200 rounded-none px-0 bg-transparent text-sm placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:border-black transition-all duration-300 tracking-widest"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-400 mt-2 uppercase tracking-widest">
                        OTP will be sent via SMS
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="group relative"
                    >
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 group-focus-within:text-black transition-colors mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="h-12 border-0 border-b border-neutral-200 rounded-none px-0 bg-transparent text-sm placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:border-black transition-all duration-300"
                      />
                      <p className="text-[9px] text-neutral-400 mt-2 uppercase tracking-widest">
                        OTP will be sent via Email
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 border border-red-100"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-red-600 font-bold">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (mode === "phone" && identifier.replace(/\D/g, "").length < 10)
                }
                className="w-full h-14 bg-black hover:bg-[#1a1a1a] text-white rounded-none text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden group"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    Send OTP
                    {mode === "phone" ? (
                      <Phone size={14} className="group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <Mail size={14} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ---- STEP 2: VERIFY OTP ---- */}
          {step === "otp" && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleVerifyOtp}
              className="space-y-10"
            >
              {/* Sent-to indicator */}
              <div className="p-4 bg-neutral-50 border border-neutral-100">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">
                  OTP sent to
                </p>
                <p className="text-sm font-bold mt-1 tracking-wide">
                  {maskedIdentifier}
                </p>
              </div>

              <div className="group relative">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 group-focus-within:text-black transition-colors mb-2">
                  Enter OTP
                </label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="h-12 border-0 border-b border-neutral-200 rounded-none px-0 bg-transparent text-sm placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:border-black transition-all duration-300 text-center text-2xl tracking-[0.5em]"
                />
                <p className="text-[9px] text-neutral-400 mt-2 uppercase tracking-widest text-center">
                  Valid for 5 minutes
                </p>
                <div className="mt-3 text-center">
                  {resendCooldown > 0 ? (
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                      Resend OTP in {resendCooldown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                      className="text-[10px] uppercase tracking-widest font-bold text-black underline underline-offset-4 hover:text-neutral-500 transition disabled:opacity-50"
                    >
                      {resendLoading ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 border border-red-100"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-red-600 font-bold">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-14 bg-black hover:bg-[#1a1a1a] text-white rounded-none text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Key size={14} />
                      Verify OTP
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleBack}
                  className="w-full h-12 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black rounded-none text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-300 bg-transparent"
                >
                  ← Change {mode === "phone" ? "Number" : "Email"}
                </Button>
              </div>
            </motion.form>
          )}

          {/* FOOTER */}
          <div className="pt-8 border-t border-neutral-100 flex flex-col items-center gap-6">
            <p className="text-[11px] text-neutral-500 tracking-tight">
              Prefer password login?{" "}
              <Link
                href="/login"
                className="text-black font-black uppercase tracking-[0.1em] hover:text-neutral-500 transition decoration-black underline underline-offset-[12px]"
              >
                Sign In
              </Link>
            </p>
            <p className="text-[11px] text-neutral-500 tracking-tight">
              New to the brand?{" "}
              <Link
                href="/register"
                className="text-black font-black uppercase tracking-[0.1em] hover:text-neutral-500 transition decoration-black underline underline-offset-[12px]"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
