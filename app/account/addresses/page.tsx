"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MapPin,
  CheckCircle2,
  Loader2,
  Edit3,
  Home,
  Briefcase,
  Navigation,
} from "lucide-react";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
} from "../../../features/user/userApi";

/* ---------------- TYPES ---------------- */
interface Address {
  id: number | string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  addressType: "Home" | "Work";
  default: boolean;
}

export default function AddressesPage() {
  const { data: addresses = [], isLoading, refetch } = useGetAddressesQuery();
  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const [form, setForm] = useState<Omit<Address, "id">>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addressType: "Home",
    default: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addAddress(form).unwrap();
      setLocalAddresses((prev) => (res ? [...prev, res] : prev));
      setForm({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        addressType: "Home",
        default: false,
      });
    } catch (err) {
      console.error("Add address failed", err);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Remove this address?")) return;
    const previous = localAddresses;
    setLocalAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(id);
    try {
      await deleteAddress(id).unwrap();
      refetch();
    } catch (err) {
      setLocalAddresses(previous);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (Array.isArray(addresses)) setLocalAddresses(addresses as Address[]);
  }, [addresses]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24 mt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">
              Saved <span className="font-bold">Addresses</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Manage your delivery locations for a faster checkout experience.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Navigation size={12} /> {localAddresses.length} Saved Locations
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: ADDRESS CARDS */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Your Saved Addresses
            </h2>

            {isLoading ? (
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="h-44 bg-slate-200 animate-pulse rounded-2xl"
                />
              ))
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {localAddresses.map((a) => (
                  <div
                    key={a.id}
                    className={`group bg-white rounded-2xl border-2 transition-all duration-300 ${
                      a.default
                        ? "border-pink-500 shadow-md"
                        : "border-transparent shadow-sm hover:border-slate-200"
                    } relative overflow-hidden`}
                  >
                    {a.default && (
                      <div className="absolute top-4 right-4 text-pink-500 flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
                        <CheckCircle2 size={12} /> Default
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.addressType === "Home" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
                        >
                          {a.addressType === "Home" ? (
                            <Home size={18} />
                          ) : (
                            <Briefcase size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            {a.addressType}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Verified Location
                          </p>
                        </div>
                      </div>

                      <div className="text-[15px] text-slate-600 leading-relaxed font-medium">
                        <p className="text-slate-900 font-bold mb-1">
                          {a.addressLine1}
                        </p>
                        <p>{a.addressLine2}</p>
                        <p>
                          {a.city}, {a.state} - {a.postalCode}
                        </p>
                      </div>

                      {/* MODERN ACTIONS */}
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-4">
                        <button className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 hover:text-pink-600 transition-colors">
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deletingId === a.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PREMIUM FORM CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-28">
              <div className="mb-8">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-4">
                  <Plus size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  New Address
                </h2>
                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">
                  Global Shipping Standards
                </p>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="group relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black ml-1 mb-1 block group-focus-within:text-pink-600 transition-colors">
                    Address Line 1
                  </label>
                  <input
                    name="addressLine1"
                    placeholder="E.g. 123, Fashion Street"
                    value={form.addressLine1}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 ring-pink-500/20 outline-none transition-all text-black placeholder:text-slate-800"
                    required
                  />
                </div>

                <div className="group relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1 mb-1 block group-focus-within:text-pink-600 transition-colors">
                    Area / Locality
                  </label>
                  <input
                    name="addressLine2"
                    placeholder="Apartment, Area"
                    value={form.addressLine2}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 ring-pink-500/20 outline-none transition-all text-black placeholder:text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1 mb-1 block">
                      Country
                    </label>
                    <input
                      name="country"
                      placeholder="Country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5  text-black placeholder:text-slate-800 bg-slate-50 border-none rounded-2xl text-sm outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1 mb-1 block">
                      State
                    </label>
                    <input
                      name="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-5  text-black placeholder:text-slate-800 py-3.5 bg-slate-50 border-none rounded-2xl text-sm outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1 mb-1 block">
                      City
                    </label>
                    <input
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5  text-black placeholder:text-slate-800 bg-slate-50 border-none rounded-2xl text-sm outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1 mb-1 block">
                      Pincode
                    </label>
                    <input
                      name="postalCode"
                      placeholder="XXXXXX"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="w-full px-5  text-black placeholder:text-slate-800 py-3.5 bg-slate-50 border-none rounded-2xl text-sm outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 ml-1 mb-2 block">
                    Address Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Home", "Work"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, addressType: type as any }))
                        }
                        className={`py-3 rounded-2xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                          form.addressType === type
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-100 text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 px-1">
                  <input
                    type="checkbox"
                    id="default"
                    name="default"
                    checked={form.default}
                    onChange={handleChange}
                    className="w-5 h-5 accent-gray-600 rounded-lg cursor-pointer"
                  />
                  <label
                    htmlFor="default"
                    className="text-xs text-slate-500 font-bold uppercase tracking-wide cursor-pointer"
                  >
                    Set as default address
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full py-4 bg-gray-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-gray-200 hover:bg-gray-700 transition-all hover:-translate-y-1 active:translate-y-0 disabled:bg-slate-200 mt-6 flex items-center justify-center gap-3"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus size={16} /> Save Address
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
