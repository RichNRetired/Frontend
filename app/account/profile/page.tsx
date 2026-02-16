"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "../../../store";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../../features/user/userApi";
import { Button } from "../../../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Camera,
  Settings,
  ShoppingBag,
  Heart,
  Ticket,
  MapPin,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const router = useRouter();
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fullName: "",
    gender: "",
    dob: "",
  });

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.user?.name || "",
        email: profile.user?.email || "",
        phone: profile.phone || "",
        fullName: profile.fullName || profile.user?.name || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  if (!isAuthenticated || profileLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black w-8 h-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-16 space-y-2">
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase">
            My Profile
          </h1>
          <div className="h-[1px] w-24 bg-black" />
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* SIDE NAVIGATION - Refined Sidebar */}
          <aside className="w-full lg:w-72 space-y-12">
            <div className="flex flex-col items-center lg:items-start space-y-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-none border border-slate-200 flex items-center justify-center text-3xl font-light tracking-tighter bg-slate-50 grayscale hover:grayscale-0 transition-all duration-500">
                  {formData.fullName?.charAt(0) || "U"}
                </div>
                <button className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-none hover:bg-slate-800 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl font-medium tracking-tight uppercase">
                  {formData.fullName}
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Exclusive Member
                </p>
              </div>
            </div>

            <nav className="flex flex-col space-y-1">
              {[
                { label: "Orders", href: "/account/orders", icon: ShoppingBag },
                { label: "Wishlist", href: "/wishlist", icon: Heart },
                { label: "Coupons", href: "/account/coupons", icon: Ticket },
                {
                  label: "Addresses",
                  href: "/account/addresses",
                  icon: MapPin,
                },
                { label: "Profile", href: "/account/profile", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`group flex items-center justify-between py-4 border-b border-slate-100 transition-all ${
                      active ? "border-black" : "hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon
                        size={16}
                        className={active ? "text-black" : "text-slate-400"}
                      />
                      <span
                        className={`text-[11px] uppercase tracking-[0.2em] ${active ? "font-bold" : "font-light"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`transition-transform duration-300 ${active ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`}
                    />
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* MAIN CONTENT - Clean & Minimal Form */}
          <main className="flex-1 max-w-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">
                Personal Information
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[10px] uppercase tracking-widest font-bold underline underline-offset-8 hover:text-slate-500 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {/* Full Name */}
                <div className="group space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 group-focus-within:text-black transition-colors">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-10 border-0 border-b border-slate-200 rounded-none bg-transparent px-0 text-sm focus:ring-0 focus:border-black transition-all disabled:text-slate-500"
                    />
                  </div>
                </div>

                {/* Email (Read Only Luxury) */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400">
                    Email Identity
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full h-10 border-0 border-b border-slate-100 rounded-none bg-transparent px-0 text-sm text-slate-400 cursor-not-allowed italic"
                  />
                </div>

                {/* Phone */}
                <div className="group space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 group-focus-within:text-black">
                    Phone Contact
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full h-10 border-0 border-b border-slate-200 rounded-none bg-transparent px-0 text-sm focus:ring-0 focus:border-black transition-all"
                  />
                </div>

                {/* Gender */}
                <div className="group space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 group-focus-within:text-black">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={(e: any) => handleInputChange(e)}
                    disabled={!isEditing}
                    className="w-full h-10 border-0 border-b border-slate-200 rounded-none bg-transparent px-0 text-sm focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="group space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 group-focus-within:text-black">
                    Date of Birth
                  </label>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full h-10 border-0 border-b border-slate-200 rounded-none bg-transparent px-0 text-sm focus:ring-0 focus:border-black transition-all"
                  />
                </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="pt-6"
                  >
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full sm:w-auto px-12 h-14 bg-black hover:bg-slate-800 text-white rounded-none text-[11px] uppercase tracking-[0.3em] font-medium transition-all"
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
