"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../features/wishlist/wishlistApi";
import { useAddToCartMutation } from "../../features/cart/cartApi";

export default function WishlistPage() {
  const [page, setPage] = useState(0);
  const { data: wishlistData, isLoading: isLoadingWishlist } =
    useGetWishlistQuery({
      page,
      size: 10,
    });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const handleRemove = async (wishlistItemId: number) => {
    try {
      await removeFromWishlist(wishlistItemId).unwrap();
    } catch (err: any) {
      console.error("Failed to remove item:", err);
      const errorMsg = err?.data?.message || "Failed to remove item";
      alert(errorMsg);
    }
  };

  const handleAddToCart = async (productId: number, variantId?: number) => {
    try {
      await addToCart({
        productId,
        variantId: variantId ?? 0,
        qty: 1,
      }).unwrap();
    } catch (err: any) {
      console.error("Failed to add to cart:", err);
      const errorMsg = err?.data?.message || "Failed to add to cart";
      alert(errorMsg);
    }
  };

  if (isLoadingWishlist) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-neutral-400">Loading wishlist...</div>
      </div>
    );
  }

  const items = wishlistData?.content || [];

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="relative mb-8 mt-30">
          <Heart size={60} strokeWidth={1} className="text-neutral-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neutral-900 rounded-full animate-pulse" />
        </div>
        <h1 className="text-2xl font-light tracking-widest uppercase mb-6 ">
          Your Wishlist is Empty
        </h1>
        <Link
          href="/"
          className="px-10 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white mt-10 min-h-screen">
      <div className="max-w-350 mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 border-b border-neutral-100 pb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
            My Wishlist
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            {wishlistData?.totalElements || 0} Items in your wishlist
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative border border-neutral-100 hover:border-neutral-300 transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="w-full h-80 overflow-hidden bg-neutral-100 relative">
                <img
                  src={item.productImage}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={item.productName}
                />
                {!item.inStock && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
                    <p className="text-white font-bold uppercase tracking-wider">
                      Out of Stock
                    </p>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-sm md:text-base font-medium tracking-tight text-neutral-900 mb-2">
                  {item.productName}
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleAddToCart(item.productId, item.variantId)}
                    disabled={!item.inStock}
                    className={`w-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                      item.inStock
                        ? "bg-black text-white hover:bg-neutral-800"
                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={14} />
                    Add to Bag
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-full py-3 text-[11px] font-bold uppercase tracking-[0.2em] border border-neutral-200 text-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {wishlistData && wishlistData.totalPages > 1 && (
          <div className="mt-16 flex items-center justify-between border-t border-neutral-100 pt-8">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={wishlistData.page === 0}
              className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest border border-neutral-200 text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-600">
              Page {wishlistData.page + 1} of {wishlistData.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(wishlistData.totalPages - 1, p + 1))
              }
              disabled={wishlistData.last}
              className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest border border-neutral-200 text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-all flex items-center gap-2 group"
            >
              Next{" "}
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-16 flex justify-center">
          <Link href="/">
            <button className="px-10 py-4 border border-neutral-900 text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 hover:text-white transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
