"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../../store";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen w-full flex bg-[#fafafa]">
      {/* ================= LEFT / VISUAL ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

        <div className="relative z-10 m-14 self-end">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white text-4xl font-light leading-tight tracking-tight"
          >
            Elevate your <br />
            <span className="font-serif italic text-5xl">Presence.</span>
          </motion.h2>
        </div>
      </div>

      {/* ================= RIGHT / FORM ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm space-y-10"
        >
          {/* HEADER */}
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              New here?{" "}
              <Link
                href="/register"
                className="font-semibold text-black underline underline-offset-4 hover:text-emerald-600 transition"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  h-12
                  text-black
                  border-0
                  border-b
                  border-gray-200
                  rounded-none
                  px-0
                  bg-transparent
                  focus-visible:ring-0
                  focus-visible:border-black
                  transition
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-400 hover:text-black transition"
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
                  className="
                    h-12
                    text-black
                    border-0
                    border-b
                    border-gray-200
                    rounded-none
                    px-0
                    bg-transparent
                    pr-10
                    focus-visible:ring-0
                    focus-visible:border-black
                    transition
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CTA */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                h-12
                mt-6
                bg-black
                text-white
                rounded-full
                font-medium
                tracking-wide
                flex
                items-center
                justify-center
                gap-2
                transition
                active:scale-[0.98]
                disabled:opacity-50
              "
            >
              {isLoading ? (
                "Verifying..."
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-xs tracking-[0.3em] uppercase text-gray-400">
            Secure • Private • Encrypted
          </p>
        </motion.div>
      </div>
    </div>
  );
}
