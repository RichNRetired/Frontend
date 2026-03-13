"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, MapPin } from "lucide-react";
import { useGetLocationsQuery } from "@/features/location/locationApi";
import { useAddAddressMutation } from "@/features/user/userApi";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
}

interface FormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: "Home" | "Work";
  default: boolean;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onAddressAdded,
}) => {
  const { data: serviceableLocations = [], isLoading: isLocationsLoading } =
    useGetLocationsQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
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

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const locationId = e.target.value;
    setSelectedLocationId(locationId);
    if (!locationId) return;

    const selectedLocation = serviceableLocations.find(
      (location) => String(location.id) === locationId,
    );
    if (!selectedLocation) return;

    setForm((prev) => ({
      ...prev,
      city: selectedLocation.city || prev.city,
      state: selectedLocation.state || prev.state,
      postalCode: selectedLocation.pincode || prev.postalCode,
      country: "India",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.addressLine1.trim()) {
      setError("Address line 1 is required");
      return;
    }
    if (!form.city.trim()) {
      setError("City is required");
      return;
    }
    if (!form.postalCode.trim()) {
      setError("Postal code is required");
      return;
    }

    try {
      await addAddress(form).unwrap();
      onAddressAdded();
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to add address. Please try again.");
    }
  };

  const resetForm = () => {
    setForm({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      addressType: "Home",
      default: false,
    });
    setSelectedLocationId("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <MapPin size={18} className="text-black" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black">
              Add Address
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 rounded-lg text-red-600 text-xs font-semibold uppercase tracking-tight">
              {error}
            </div>
          )}

          {/* Serviceable Location */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
              Serviceable Location
            </label>
            <select
              value={selectedLocationId}
              onChange={handleLocationChange}
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-black bg-white focus:outline-none focus:border-black transition-colors"
              disabled={isLocationsLoading}
            >
              <option value="">
                {isLocationsLoading ? "Loading..." : "Select a location"}
              </option>
              {serviceableLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.city}, {location.state} ({location.pincode})
                </option>
              ))}
            </select>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              placeholder="Street address"
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Postal code"
              className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm text-black placeholder-neutral-300 focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
              Address Type
            </label>
            <div className="flex gap-4">
              {["Home", "Work"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="addressType"
                    value={type}
                    checked={form.addressType === type}
                    onChange={handleChange}
                    className="w-4 h-4 border border-neutral-300 rounded-full"
                  />
                  <span className="text-sm text-neutral-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Default Address */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="default"
              checked={form.default}
              onChange={handleChange}
              className="w-4 h-4 border border-neutral-300 rounded"
            />
            <span className="text-xs text-neutral-700 font-semibold">
              Set as default address
            </span>
          </label>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isAdding}
              className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-neutral-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Address"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
