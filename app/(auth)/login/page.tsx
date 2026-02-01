"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../../store";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await dispatch(loginUser({ email, password }));

    setIsLoading(false);

    if (loginUser.fulfilled.match(result)) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen mt-10 w-full flex flex-col lg:flex-row bg-white text-[#1a1a1a] selection:bg-black selection:text-white">
      {/* ================= LEFT / VISUAL (Hidden on mobile) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-100">
        <motion.img
          initial={{ scale: 1.1, filter: "grayscale(100%)" }}
          animate={{ scale: 1, filter: "grayscale(0%)" }}
          transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
          alt="Luxury storefront"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        {/* Minimalist Editorial Overlay */}
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/80">
              Est. 2026
            </span>
            <div className="h-[1px] w-12 bg-white/50" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <h2 className="text-white text-6xl font-light leading-[0.9] tracking-tighter mb-4">
              The <br />
              <span className="font-serif italic">Atelier</span>
            </h2>
            <p className="text-white/70 text-[10px] uppercase tracking-[0.3em] max-w-[280px] leading-loose">
              Access your personal collection and bespoke recommendations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT / FORM ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24"
      >
        <div className="w-full max-w-[380px] space-y-12 lg:space-y-16">
          {/* HEADER */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-light tracking-tighter leading-none">
              Sign In
            </h1>
            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">
              Welcome back to your private account.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* EMAIL */}
              <div className="group relative">
                <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 group-focus-within:text-black transition-colors">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-black transition-all duration-500"
                />
              </div>

              {/* PASSWORD */}
              <div className="group relative">
                <div className="flex justify-between items-end">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 group-focus-within:text-black transition-colors">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[9px] uppercase tracking-widest text-slate-400 hover:text-black transition underline underline-offset-4"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-black transition-all duration-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-2 text-slate-300 hover:text-black transition"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] uppercase tracking-widest text-red-500 font-semibold"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* CTA BUTTON - Sharp Rectangular Style */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-black hover:bg-[#222] text-white rounded-none text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={14} strokeWidth={1.5} />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* FOOTER */}
          <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
            <p className="text-[11px] text-slate-500 tracking-wide">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-black font-bold uppercase tracking-widest hover:opacity-60 transition underline underline-offset-8"
              >
                Register
              </Link>
            </p>

            <span className="text-[9px] uppercase tracking-[0.4em] text-slate-300">
              Secure • Private • International
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
