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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FBFBFB] text-[#1a1a1a] selection:bg-black selection:text-white">
      {/* ================= LEFT / VISUAL (Hidden on mobile) ================= */}
      {/* Uses a 3:4 aspect ratio feel common in fashion photography */}
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
              <span className="font-serif italic">Identity</span>
            </h2>
            <p className="text-white/80 text-[10px] uppercase tracking-[0.4em] max-w-[300px] leading-loose border-l border-white/40 pl-4">
              Membership grants priority access to seasonal drops and bespoke
              tailoring.
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
          {/* MOBILE LOGO/TAG (Only visible on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8"></div>

          {/* HEADER */}
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-4xl mt-8 sm:text-5xl font-medium tracking-tighter leading-none">
              Sign In
            </h1>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-10">
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

              {/* PASSWORD */}
              <div className="group relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 group-focus-within:text-black transition-colors">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[9px] uppercase tracking-widest text-neutral-400 hover:text-black transition decoration-neutral-300 underline underline-offset-4"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 border-0 border-b border-neutral-200 rounded-none px-0 bg-transparent text-sm placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:border-black transition-all duration-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-neutral-300 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.5} />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
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
                    Authentication Error: {error}
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
                    Secure Login
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                      strokeWidth={2}
                    />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* FOOTER */}
          <div className="pt-12 border-t border-neutral-100 flex flex-col items-center gap-8">
            <p className="text-[11px] text-neutral-500 tracking-tight">
              New to the brand?{" "}
              <Link
                href="/register"
                className="text-black font-black uppercase tracking-[0.1em] hover:text-neutral-500 transition decoration-black underline underline-offset-[12px]"
              >
                Create Account
              </Link>
            </p>

            <div className="flex gap-6 items-center opacity-30"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
