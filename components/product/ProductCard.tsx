"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice";
import { useAddToCartMutation } from "../../features/cart/cartApi";
import { Plus, Heart, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { sendEvent } from "@/services/analytics.service";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  id: number | string;
  slug: string;
  name: string;
  price: number | null | undefined;
  originalPrice?: number | null;
  image?: string;
  images?: Array<
    | string
    | {
        imageUrl?: string | null;
        image_url?: string | null;
        url?: string | null;
        src?: string | null;
      }
  >;
  variantId?: number | null;
  variants?: Array<{ id: number; isActive?: boolean }>;
  isNew?: boolean;
  isOnSale?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  images,
  variantId,
  variants,
  isNew = false,
  isOnSale = false,
}) => {
  const normalizeAmount = (amount: number | null | undefined) => {
    const value = typeof amount === "number" ? amount : Number(amount ?? 0);
    return Number.isFinite(value) ? value : 0;
  };
  const displayPrice = normalizeAmount(price);
  const displayOriginalPrice = normalizeAmount(originalPrice);
  const resolvedVariantId = useMemo(() => {
    if (typeof variantId === "number" && Number.isFinite(variantId) && variantId > 0) {
      return variantId;
    }

    if (variants && variants.length > 0) {
      const activeVariant = variants.find(
        (variant) =>
          variant?.isActive !== false &&
          typeof variant.id === "number" &&
          Number.isFinite(variant.id) &&
          variant.id > 0,
      );
      if (activeVariant) return activeVariant.id;

      const firstValidVariant = variants.find(
        (variant) =>
          typeof variant?.id === "number" &&
          Number.isFinite(variant.id) &&
          variant.id > 0,
      );
      if (firstValidVariant) return firstValidVariant.id;
    }

    return 0;
  }, [variantId, variants]);

  const dispatch = useDispatch();
  const [addToCart, { isLoading: isAddingMutation }] = useAddToCartMutation();
  const [localAdding, setLocalAdding] = useState(false);
  const isAdding = localAdding || isAddingMutation;
  const imageList = useMemo(() => {
    if (images && images.length > 0) {
      return images
        .map((entry) =>
          typeof entry === "string"
            ? entry
            : (entry?.imageUrl ??
              entry?.image_url ??
              entry?.url ??
              entry?.src ??
              ""),
        )
        .filter(Boolean);
    }
    if (image) return [image];
    return [];
  }, [images, image]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) showNextImage();
      else showPreviousImage();
    }
    touchStartX.current = null;
  };

  const {
    addToWishlist,
    removeFromWishlistByProductId,
    wishlist,
    isAdding: isWishLoading,
    isRemoving,
  } = useWishlist();

  const isInWishlist = wishlist.some((item) => item.productId === Number(id));
  const isWishActionLoading = isWishLoading || isRemoving;

  const showPreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1,
    );
  };

  const showNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  const resolveVariantIdForAction = async () => {
    if (resolvedVariantId > 0) return resolvedVariantId;

    try {
      const detailsResponse = await fetch(`/api/products/${Number(id)}`, {
        method: "GET",
        credentials: "include",
      });

      if (!detailsResponse.ok) return 0;

      const productDetails = await detailsResponse.json();
      const detailVariants = Array.isArray(productDetails?.variants)
        ? productDetails.variants
        : [];

      const activeVariant = detailVariants.find(
        (variant: any) =>
          variant?.isActive !== false &&
          typeof variant?.id === "number" &&
          Number.isFinite(variant.id) &&
          variant.id > 0,
      );

      const firstValidVariant = detailVariants.find(
        (variant: any) =>
          typeof variant?.id === "number" &&
          Number.isFinite(variant.id) &&
          variant.id > 0,
      );

      return activeVariant?.id ?? firstValidVariant?.id ?? 0;
    } catch (variantFetchError) {
      console.error("Failed to resolve variant from product details", variantFetchError);
      return 0;
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalAdding(true);
    try {
      const variantIdForCart = await resolveVariantIdForAction();

      await addToCart({
        productId: Number(id),
        variantId: variantIdForCart,
        qty: 1,
      }).unwrap();
      dispatch(
        addItem({
          id: String(id),
          productId: Number(id),
          variantId: variantIdForCart,
          name,
          price: displayPrice,
          quantity: 1,
        }),
      );
      sendEvent("quick_add", { productId: Number(id), source: "product_card" });
    } catch (err: any) {
      console.error(err);
    } finally {
      setLocalAdding(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isInWishlist) {
        await removeFromWishlistByProductId(Number(id));
      } else {
        const variantIdForWishlist = await resolveVariantIdForAction();
        await addToWishlist(Number(id), variantIdForWishlist, 1);
      }
    } catch (err) {
      console.error("Wishlist update failed", err);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-500">
      {/* IMAGE SECTION */}
      <div
        className="relative aspect-3/4 overflow-hidden bg-[#F9F9F9]"
        onTouchStart={imageList.length > 1 ? handleTouchStart : undefined}
        onTouchEnd={imageList.length > 1 ? handleTouchEnd : undefined}
      >
        <Link href={`/product/${id}-${slug}`} className="block h-full w-full">
          {imageList.length > 0 ? (
            <img
              src={imageList[selectedImageIndex]}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            />
          ) : null}
        </Link>

        {imageList.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showPreviousImage();
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-black backdrop-blur-sm transition hover:bg-white opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showNextImage();
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-black backdrop-blur-sm transition hover:bg-white opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        {imageList.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1.5 backdrop-blur-sm">
            {imageList.map((_, index) => {
              const isActive = index === selectedImageIndex;
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`View image ${index + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImageIndex(index);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                    isActive ? "bg-black" : "bg-black/30 hover:bg-black/50"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* ELEGANT BADGES */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2">
          {isNew && (
            <span className="bg-black text-white text-[8px] md:text-[9px] tracking-[0.2em] font-medium px-2 py-0.5 md:px-2.5 md:py-1 uppercase">
              New
            </span>
          )}
          {isOnSale && (
            <span className="bg-white text-red-600 text-[8px] md:text-[9px] tracking-[0.2em] font-bold px-2 py-0.5 md:px-2.5 md:py-1 uppercase border border-red-50">
              Sale
            </span>
          )}
        </div>

        {/* WISHLIST - Visible on mobile, hover-animated on desktop */}
        <button
          onClick={handleWishlistToggle}
          disabled={isWishActionLoading}
          className={`absolute top-3 right-3 md:top-4 md:right-4 p-2.5 rounded-full bg-white/70 backdrop-blur-sm transition-all duration-300 shadow-sm
            ${isWishActionLoading ? "opacity-50" : "opacity-100 md:opacity-0 md:-translate-y-2.5 md:group-hover:opacity-100 md:group-hover:translate-y-0"}`}
        >
          {isWishActionLoading ? (
            <Loader2 size={16} className="animate-spin text-neutral-400" />
          ) : (
            <Heart
              size={16}
              className={`transition-colors duration-300 ${
                isInWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-neutral-600 hover:text-black"
              }`}
            />
          )}
        </button>

        {/* QUICK ADD - DESKTOP HOVER */}
        <div className="hidden md:flex absolute inset-x-0 bottom-6 justify-center px-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex w-full items-center justify-center gap-2 py-3 bg-white/90 backdrop-blur-md border border-neutral-200 text-[10px] font-bold uppercase tracking-[0.25em] text-black hover:bg-black hover:text-white transition-all duration-300 shadow-xl"
          >
            {isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add to cart
              </>
            )}
          </button>
        </div>

        {/* QUICK ADD - MOBILE PERSISTENT BAR */}
        <div className="md:hidden absolute inset-x-0 bottom-0">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex w-full items-center justify-center gap-2 py-3 bg-white/80 backdrop-blur-md border-t border-neutral-100 text-[9px] font-bold uppercase tracking-[0.2em] text-black"
          >
            {isAdding ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Plus className="w-3 h-3" /> Add to bag
              </>
            )}
          </button>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="flex flex-col items-center pt-4 md:pt-6 pb-2 text-center">
        <Link href={`/product/${id}-${slug}`} className="mb-1">
          <h3 className="text-[12px] md:text-[13px] font-normal text-neutral-500 uppercase tracking-widest leading-relaxed transition-colors hover:text-black line-clamp-1 px-4">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <span
            className={`text-[14px] md:text-[15px] font-light tracking-tight ${isOnSale ? "text-red-600" : "text-black"}`}
          >
            ₹{displayPrice.toLocaleString()}
          </span>
          {displayOriginalPrice > displayPrice && (
            <span className="text-[11px] md:text-[13px] text-neutral-300 line-through decoration-[0.5px]">
              ₹{displayOriginalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
