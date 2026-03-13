"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Edit3,
  MapPin,
} from "lucide-react";
import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
} from "../../../features/user/userApi";
import { AddressFormModal } from "@/components/account/AddressFormModal";

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
  const [deleteAddress] = useDeleteAddressMutation();
  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (Array.isArray(addresses)) setLocalAddresses(addresses as Address[]);
  }, [addresses]);

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setModalMode("add");
    setIsModalOpen(true);
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* HEADER */}
        <div className="mb-16 border-b border-black pb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-medium tracking-tighter uppercase">
                Your Addresses
              </h1>
              <p className="text-sm text-gray-500 mt-2 tracking-tight">
                Manage your delivery details for a seamless shopping experience.
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              Add Address
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : localAddresses.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-light tracking-tight mb-2">
              No addresses yet
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              Add your first delivery address to get started.
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} />
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localAddresses.map((address) => (
              <div
                key={address.id}
                className="group relative border-2 border-gray-100 rounded-2xl p-6 hover:border-black transition-all duration-300 hover:shadow-lg"
              >
                {/* Address Type & Default Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded">
                      {address.addressType}
                    </span>
                    {address.default && (
                      <span className="text-[10px] font-bold uppercase tracking-widest border border-black px-2.5 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-2 mb-6">
                  <p className="font-bold text-sm uppercase tracking-tight leading-snug">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-sm text-gray-600">{address.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-700">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                    {address.country}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest border border-gray-200 rounded hover:border-black hover:bg-black hover:text-white transition-all"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100 rounded hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deletingId === address.id ? "Removing..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingAddress={selectedAddress}
        mode={modalMode}
      />
    </div>
  );
}