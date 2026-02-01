"use client";

import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice";
import { useAddToCartMutation } from "../../features/cart/cartApi";
import { Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { sendEvent } from "@/services/analytics.service";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string; // single image URL
  images?: string[]; // API uses images array
  isNew?: boolean;
  isOnSale?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  images,
  isNew = false,
  isOnSale = false,
}) => {
  const dispatch = useDispatch();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addToCart({ productId: Number(id), qty: 1 }).unwrap();
      dispatch(
        addItem({
          id: String(id),
          name,
          price,
          quantity: 1,
        }),
      );
      sendEvent("quick_add", {
        productId: Number(id),
        source: "product_card",
      });
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to add to cart";
      console.error("Add to cart failed", errorMsg);
      sendEvent("quick_add_failed", {
        productId: Number(id),
        error: errorMsg,
      });
      // Optionally show error notification here
      alert(errorMsg);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white">
      {/* Image Wrapper */}
      <Link
        href={`/product/${id}`}
        className="relative aspect-3/4 overflow-hidden bg-neutral-100 mb-4"
      >
        <img
          src={image || (images && images[0]) || "/images/placeholder.png"}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Minimalist Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-white text-black text-[10px] tracking-widest font-bold px-2.5 py-1 uppercase shadow-sm">
              New
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-600 text-white text-[10px] tracking-widest font-bold px-2.5 py-1 uppercase shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Premium Quick Add - Slides up from bottom */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-white/90 backdrop-blur-md border-t border-neutral-100">
          <button
            onClick={handleAddToCart}
            disabled={adding || isAdding}
            className={`flex w-full items-center justify-center gap-2 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors ${adding || isAdding ? "opacity-60 pointer-events-none" : ""}`}
          >
            <Plus className="w-3.5 h-3.5" />
            {adding || isAdding ? "Adding..." : "Quick Add"}
          </button>
        </div>
      </Link>

      {/* Product Details - Clean & Linear */}
      <div className="flex flex-col space-y-1 px-1">
        <div className="flex justify-between items-start gap-4">
          <Link href={`/product/${id}`} className="flex-1">
            <h3 className="text-sm font-normal text-neutral-800 tracking-tight leading-snug group-hover:underline decoration-neutral-300 underline-offset-4">
              {name}
            </h3>
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={adding || isAdding}
            className="md:hidden p-1 text-neutral-500 hover:text-black"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-0.5">
          <span
            className={`text-sm ${isOnSale ? "text-red-600 font-semibold" : "text-neutral-900 font-medium"}`}
          >
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-neutral-400 line-through decoration-neutral-300">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
