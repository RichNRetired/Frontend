"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { registerUser } from "../../../features/auth/authSlice";
import type { AppDispatch } from "../../../store";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength =
    form.password.length >= 8
      ? "strong"
      : form.password.length >= 5
        ? "medium"
        : "weak";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    );
    setLoading(false);

    if (registerUser.fulfilled.match(result)) {
      router.push("/login");
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-[#1a1a1a] selection:bg-black selection:text-white">
      {/* ================= LEFT — FORM ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20 relative z-10"
      >
        <div className="w-full max-w-md space-y-10 lg:space-y-16">
          {/* BACK BUTTON - Refined */}
          <Link
            href="/"
            className="group inline-flex items-center text-[10px] uppercase tracking-[0.4em] text-slate-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-3 w-3 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Boutique
          </Link>

          {/* HEADER - Editorial Style */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter leading-none">
              Create Account
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
              Join the inner circle. Access curated collections.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Email Address", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  type: "password",
                },
              ].map((field) => (
                <div key={field.name} className="group relative">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 group-focus-within:text-black transition-all duration-300">
                    {field.label}
                  </label>
                  <Input
                    name={field.name}
                    type={field.type}
                    value={form[field.name as keyof FormState]}
                    onChange={handleChange}
                    required
                    className="h-10 border-0 border-b border-slate-200 rounded-none px-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-black transition-all duration-500 placeholder:text-slate-300"
                  />
                </div>
              ))}
            </div>

            {/* PASSWORD STRENGTH - Minimalist Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] uppercase tracking-widest text-slate-400">
                <span>Security Level</span>
                <span
                  className={
                    passwordStrength === "strong"
                      ? "text-emerald-600"
                      : passwordStrength === "medium"
                        ? "text-amber-500"
                        : "text-slate-400"
                  }
                >
                  {passwordStrength}
                </span>
              </div>
              <div className="h-px w-full bg-slate-100 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      passwordStrength === "strong"
                        ? "100%"
                        : passwordStrength === "medium"
                          ? "60%"
                          : "30%",
                  }}
                  className={`absolute h-full transition-colors duration-500 ${
                    passwordStrength === "strong" ? "bg-black" : "bg-slate-400"
                  }`}
                />
              </div>
            </div>

            {/* ERROR HANDLING */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-[11px] text-red-500 font-medium tracking-wide uppercase"
                >
                  <AlertCircle size={12} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 space-y-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-black hover:bg-[#222] text-white rounded-none text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>

              <div className="flex items-start gap-3 text-[10px] text-slate-400 leading-normal tracking-wide">
                <CheckCircle2 size={14} className="shrink-0 text-slate-300" />
                <p>
                  I accept the{" "}
                  <span className="text-black underline underline-offset-4 cursor-pointer hover:text-slate-600 transition">
                    Terms of Service
                  </span>{" "}
                  and acknowledge the{" "}
                  <span className="text-black underline underline-offset-4 cursor-pointer hover:text-slate-600 transition">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </form>

          {/* FOOTER LINKS */}
          <div className="pt-8 border-t border-slate-100 space-y-4 text-center">
            <p className="text-[11px] text-slate-500 tracking-wide">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-black font-bold uppercase tracking-widest hover:opacity-60 transition underline underline-offset-8"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ================= RIGHT — VISUAL ================= */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="h-full w-full"
        >
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80"
            alt="Haute Couture"
            className="absolute inset-0 w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-black/5" />

          {/* Floating Minimalist Label */}
          <div className="absolute bottom-12 right-12 text-white text-right space-y-1">
            <p className="text-[10px] uppercase tracking-[0.5em] font-light">
              Spring / Summer
            </p>
            <p className="text-2xl font-serif italic tracking-tighter">
              Collection MMXXVI
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
