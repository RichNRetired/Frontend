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
import { ArrowRight, Loader2, Mail, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OtpLoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await dispatch(requestOtpThunk({ identifier: email }));

    setIsLoading(false);

    if (requestOtpThunk.fulfilled.match(result)) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await dispatch(verifyOtpThunk({ identifier: email, otp }));

    setIsLoading(false);

    if (verifyOtpThunk.fulfilled.match(result)) {
      router.push("/");
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FBFBFB] text-[#1a1a1a] selection:bg-black selection:text-white">
      {/* ================= LEFT / VISUAL (Hidden on mobile) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-200">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
          alt="Luxury storefront"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Minimalist Editorial Overlay */}
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
              Login with OTP for secure access to your account.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT / FORM ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 flex items-start lg:items-center justify-center px-6 sm:px-12 lg:px-24 pt-24 pb-12 lg:py-0"
      >
        <div className="w-full max-w-[400px] space-y-12">
          {/* HEADER */}
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-4xl mt-8 sm:text-5xl font-medium tracking-tighter leading-none">
              Sign In
            </h1>
          </div>

          {/* FORM */}
          {step === "email" ? (
            <form onSubmit={handleRequestOtp} className="space-y-10">
              <div className="space-y-8">
                {/* EMAIL */}
                <div className="group relative">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 group-focus-within:text-black transition-colors mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="h-12 border-0 border-b border-neutral-200 rounded-none px-0 bg-transparent text-sm placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:border-black transition-all duration-300"
                  />
                </div>
              </div>

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 border border-red-100"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-red-600 font-bold">
                      Error: {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA BUTTON */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-black hover:bg-[#1a1a1a] text-white rounded-none text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden group"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      Send OTP
                      <Mail
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-10">
              <div className="space-y-8">
                {/* OTP */}
                <div className="group relative">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 group-focus-within:text-black transition-colors mb-2">
                    OTP Code
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
                    className="h-12 border-0 border-b border-neutral-200 rounded-none px-0 bg-transparent text-sm placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:border-black transition-all duration-300 text-center text-2xl tracking-widest"
                  />
                </div>
              </div>

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 border border-red-100"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-red-600 font-bold">
                      Error: {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA BUTTON */}
              <div className="pt-2 space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-14 bg-black hover:bg-[#1a1a1a] text-white rounded-none text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden group"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>Verify OTP</>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleBackToEmail}
                  className="w-full h-12 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black rounded-none text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-300 bg-transparent"
                >
                  Back to Email
                </Button>
              </div>
            </form>
          )}

          {/* FOOTER */}
          <div className="pt-12 border-t border-neutral-100 flex flex-col items-center gap-8">
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
