"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen flex bg-[#fafafa] text-slate-900">
      {/* ================= LEFT — FORM ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12"
      >
        <div className="w-full max-w-sm space-y-12">
          {/* BACK */}
          <Link
            href="/"
            className="group inline-flex items-center text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-black transition"
          >
            <ArrowLeft className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>

          {/* HEADER */}
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 max-w-xs">
              Private access. Curated experience. Reserved for members.
            </p>
          </div>

          {/* FORM */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-7"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
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
              <motion.div
                key={field.name}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                className="group space-y-1"
              >
                <label className="text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-400 group-focus-within:text-black transition">
                  {field.label}
                </label>
                <Input
                  name={field.name}
                  type={field.type}
                  value={form[field.name as keyof FormState]}
                  onChange={handleChange}
                  required
                  className="
                    h-12
                    border-0
                    border-b
                    border-slate-200
                    rounded-none
                    px-0
                    bg-transparent
                    focus-visible:ring-0
                    focus-visible:border-black
                    transition
                  "
                />
              </motion.div>
            ))}

            {/* PASSWORD STRENGTH */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 tracking-wide">
                Password strength
              </span>
              <span
                className={`font-semibold tracking-widest ${
                  passwordStrength === "strong"
                    ? "text-emerald-600"
                    : passwordStrength === "medium"
                      ? "text-amber-500"
                      : "text-red-500"
                }`}
              >
                {passwordStrength.toUpperCase()}
              </span>
            </div>

            {/* ERROR */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs text-red-600"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* TERMS */}
            <div className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
              <CheckCircle2 size={14} className="mt-0.5 text-emerald-600" />
              <p>
                By creating an account, you agree to our{" "}
                <span className="underline underline-offset-4 cursor-pointer">
                  Terms & Privacy Policy
                </span>
                .
              </p>
            </div>

            {/* CTA */}
            <Button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-14
                bg-black
                text-white
                rounded-full
                text-xs
                uppercase
                tracking-[0.25em]
                font-semibold
                transition
                active:scale-[0.97]
                disabled:opacity-60
              "
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </motion.form>

          <p className="text-center text-xs tracking-[0.3em] uppercase text-slate-400">
            Secure • Encrypted • Private
          </p>

          <p className="text-center text-sm text-slate-500">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-semibold text-black hover:text-emerald-600 underline underline-offset-4 transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="hidden lg:block w-1/2 relative"
      >
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80"
          alt="Luxury fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="border border-white/30 backdrop-blur-xl bg-white/10 px-10 py-12 text-center text-white max-w-sm">
            <span className="text-[10px] uppercase tracking-[0.4em] block mb-6 opacity-80">
              Limited Membership
            </span>
            <h3 className="text-4xl font-serif italic mb-4">
              The New Standard
            </h3>
            <p className="text-xs tracking-widest font-light leading-loose opacity-90">
              Join a private circle crafted for those who value refinement,
              intention, and precision.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
