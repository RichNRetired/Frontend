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
import { Input } from "../../../components/ui/Input";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Camera,
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

  if (!isAuthenticated)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen mt-10 bg-[#F9F9F9] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 space-y-2">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-pink-600 border-2 border-white shadow-sm">
                {formData.fullName?.charAt(0) || "U"}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 hover:text-pink-600 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <p className="text-center font-bold text-gray-800 tracking-tight">
              {formData.fullName}
            </p>
          </div>

          <nav className="space-y-1">
            {[
              { label: "Orders", href: "/account/orders" },
              { label: "Wishlist", href: "/account/wishlist" },
              { label: "Coupons", href: "/account/coupons" },
              { label: "Addresses", href: "/account/addresses" },
              { label: "Profile", href: "/account/profile" },
            ].map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/account/profile" &&
                  pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-all ${active ? "bg-pink-50 text-pink-600" : "text-gray-500 hover:bg-white hover:shadow-sm"}`}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={14} />
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your personal information and preferences.
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "secondary" : "primary"}
                className="rounded-full px-6 text-sm font-bold uppercase tracking-wider"
              >
                {isEditing ? "Discard" : "Edit Details"}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your name"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all outline-none text-gray-800 font-medium ${isEditing ? "border-pink-100 focus:border-pink-500 bg-white" : "border-transparent bg-gray-50"}`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled={true} // Usually email is not editable directly
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+91 XXXXX XXXXX"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all outline-none text-gray-800 font-medium ${isEditing ? "border-pink-100 focus:border-pink-500 bg-white" : "border-transparent bg-gray-50"}`}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={(e: any) => handleInputChange(e)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-gray-800 font-medium appearance-none ${isEditing ? "border-pink-100 focus:border-pink-500 bg-white" : "border-transparent bg-gray-50"}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all outline-none text-gray-800 font-medium ${isEditing ? "border-pink-100 focus:border-pink-500 bg-white" : "border-transparent bg-gray-50"}`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 py-4 rounded-xl shadow-lg shadow-pink-100 font-bold uppercase tracking-wider"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
