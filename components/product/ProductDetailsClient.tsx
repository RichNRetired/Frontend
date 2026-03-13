"use client";

import { Product } from "@/features/product/productTypes";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/features/cart/cartSlice";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import {
  Heart,
  Plus,
  Minus,
  ShieldCheck,
  Globe,
  RefreshCcw,
  MapPin,
} from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { sendEvent } from "@/services/analytics.service";
import { getPrimaryProductImage } from "@/features/product/productUtils";
import { useLazyCheckLocationServiceabilityQuery } from "@/features/location/locationApi";

interface Props {
  product: Product;
}

type SizeGuideUnit = "CM" | "INCHES";

const sizeGuideMeasurements = {
  CM: [
    { size: "XXS", bust: 78, waist: 62, hip: 86 },
    { size: "XS", bust: 83, waist: 67, hip: 91 },
    { size: "S", bust: 88, waist: 72, hip: 96 },
    { size: "M", bust: 93, waist: 77, hip: 101 },
    { size: "L", bust: 98, waist: 82, hip: 106 },
    { size: "XL", bust: 103, waist: 87, hip: 111 },
    { size: "2XL", bust: 108, waist: 92, hip: 116 },
  ],
  INCHES: [
    { size: "XXS", bust: 31, waist: 24, hip: 34 },
    { size: "XS", bust: 33, waist: 26, hip: 36 },
    { size: "S", bust: 35, waist: 28, hip: 38 },
    { size: "M", bust: 37, waist: 30, hip: 40 },
    { size: "L", bust: 39, waist: 32, hip: 42 },
    { size: "XL", bust: 41, waist: 34, hip: 44 },
    { size: "2XL", bust: 43, waist: 36, hip: 46 },
  ],
} as const;

export default function ProductDetailsClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState<SizeGuideUnit>("CM");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();
  const [checkLocationServiceability, serviceabilityState] =
    useLazyCheckLocationServiceabilityQuery();
  const {
    addToWishlist,
    removeFromWishlistByProductId,
    wishlist,
    isAdding: isWishlistAdding,
    isRemoving: isWishlistRemoving,
  } =
    useWishlist();

  const activeVariants = useMemo(
    () => (product.variants ?? []).filter((variant) => variant.isActive),
    [product.variants],
  );

  const sizeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          activeVariants
            .map((variant) => variant.size?.trim())
            .filter((size): size is string => Boolean(size)),
        ),
      ),
    [activeVariants],
  );

  const colorOptions = useMemo(() => {
    const variantsBySize = selectedSize
      ? activeVariants.filter((variant) => variant.size === selectedSize)
      : activeVariants;

    return Array.from(
      new Set(
        variantsBySize
          .map((variant) => variant.color?.trim())
          .filter((color): color is string => Boolean(color)),
      ),
    );
  }, [activeVariants, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!activeVariants.length) return null;

    const exactMatch = activeVariants.find(
      (variant) =>
        variant.size === selectedSize && variant.color === selectedColor,
    );
    if (exactMatch) return exactMatch;

    if (selectedSize) {
      const sizeMatch = activeVariants.find(
        (variant) => variant.size === selectedSize,
      );
      if (sizeMatch) return sizeMatch;
    }

    if (selectedColor) {
      const colorMatch = activeVariants.find(
        (variant) => variant.color === selectedColor,
      );
      if (colorMatch) return colorMatch;
    }

    return activeVariants[0];
  }, [activeVariants, selectedColor, selectedSize]);

  const effectivePrice = selectedVariant?.sellingPrice ?? product.price;
  const effectiveMrp = selectedVariant?.mrp ?? product.mrp;
  const effectiveStock = selectedVariant?.availableStock ?? product.stock;

  useEffect(() => {
    if (!activeVariants.length) {
      setSelectedSize("");
      setSelectedColor("");
      return;
    }

    const fallbackVariant = activeVariants[0];

    const nextSize =
      selectedSize &&
      activeVariants.some((variant) => variant.size === selectedSize)
        ? selectedSize
        : fallbackVariant.size;

    const colorsForSize = activeVariants
      .filter((variant) => variant.size === nextSize)
      .map((variant) => variant.color)
      .filter((color): color is string => Boolean(color));

    const nextColor =
      selectedColor && colorsForSize.includes(selectedColor)
        ? selectedColor
        : colorsForSize[0] || fallbackVariant.color || "";

    if (nextSize && nextSize !== selectedSize) {
      setSelectedSize(nextSize);
    }
    if (nextColor !== selectedColor) {
      setSelectedColor(nextColor);
    }
  }, [activeVariants, selectedColor, selectedSize]);

  useEffect(() => {
    setQuantity((prev) => {
      if (effectiveStock <= 0) return 1;
      return Math.min(prev, effectiveStock);
    });
  }, [effectiveStock]);

  const isInWishlist = wishlist.some((item) => item.productId === product.id);
  const isWishlistActionLoading = isWishlistAdding || isWishlistRemoving;
  const isOutOfStock = (effectiveStock ?? 0) <= 0;

  const handleCheckServiceability = async () => {
    const normalizedPincode = pincode.trim();
    if (!/^\d{6}$/.test(normalizedPincode)) {
      setPincodeError("Enter a valid 6-digit pincode");
      return;
    }

    setPincodeError(null);
    try {
      await checkLocationServiceability(normalizedPincode).unwrap();
    } catch {
      // handled via query state
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      if (!selectedVariant) throw new Error("Please select a variant");
      await addToCart({
        productId: Number(product.id),
        variantId: selectedVariant.id,
        qty: quantity,
      }).unwrap();
      dispatch(
        addItem({
          id: String(selectedVariant.id),
          productId: product.id,
          variantId: selectedVariant.id,
          name: product.name,
          price: effectivePrice,
          quantity,
          image: getPrimaryProductImage(product),
        }),
      );
      sendEvent("product_add_to_cart", { productId: product.id, quantity });
    } catch (err: any) {
      alert(err?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlistByProductId(product.id);
        return;
      }

      const fallbackVariantId =
        selectedVariant?.id ??
        activeVariants.find((variant) => variant.id > 0)?.id ??
        0;

      await addToWishlist(product.id, fallbackVariantId, 1);
      sendEvent("product_add_to_wishlist", {
        productId: product.id,
        variantId: fallbackVariantId,
      });
    } catch (err: any) {
      alert(err?.data?.message || err?.message || "Failed to update wishlist");
    }
  };

  return (
    <div className="min-w-0 w-full flex flex-col max-w-none md:max-w-xl mx-auto lg:mx-0 md:mt-4 font-sans text-[#111111]">
      {/* Brand & Title */}
      <header className="space-y-2 lg:mt-2 mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
          {product.brand}
        </p>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight uppercase leading-none">
          {product.name}
        </h1>
        <p className="text-sm text-neutral-500 font-light max-w-md">
          {product.short_description}
        </p>
      </header>

      {/* Pricing - Zara Style */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-light">
            ₹{effectivePrice?.toLocaleString()}
          </span>
          {effectiveMrp && effectiveMrp > effectivePrice && (
            <span className="text-neutral-400 line-through text-lg font-light">
              ₹{effectiveMrp.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">
          Tax included. Shipping calculated at checkout.
        </p>
      </div>

      <div className="mb-8 border border-neutral-200 p-4">
        <p className="text-[11px] uppercase tracking-widest mb-3 font-bold">
          Check Delivery Availability
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter pincode"
            className="flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={handleCheckServiceability}
            disabled={serviceabilityState.isFetching}
            className="border border-black px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-bold disabled:opacity-60"
          >
            {serviceabilityState.isFetching ? "Checking" : "Check"}
          </button>
        </div>

        {pincodeError && (
          <p className="mt-2 text-xs text-red-600">{pincodeError}</p>
        )}

        {serviceabilityState.data && (
          <div className="mt-3 text-xs text-neutral-700 space-y-1">
            <p className="flex items-center gap-1">
              <MapPin size={12} />
              Delivery available in {serviceabilityState.data.deliveryDays} days to {serviceabilityState.data.city}, {serviceabilityState.data.state}
            </p>
            <p>
              COD: {serviceabilityState.data.codAvailable ? "Available" : "Not available"}
            </p>
          </div>
        )}

        {serviceabilityState.isError && !pincodeError && (
          <p className="mt-2 text-xs text-red-600">
            Delivery is not serviceable for this pincode.
          </p>
        )}
      </div>

      {activeVariants.length > 0 && (
        <div className="mb-8 space-y-6">
          {sizeOptions.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-widest font-bold">
                  Size
                </p>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[11px] uppercase tracking-widest font-semibold underline underline-offset-2 hover:text-black"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 px-4 py-2 border text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 text-neutral-700 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {colorOptions.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-widest mb-3 font-bold">
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 text-neutral-700 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector - Minimalist */}
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-widest mb-3 font-bold">
          Quantity
        </p>
        <div className="flex items-center border border-neutral-200 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-neutral-50 transition-colors"
            type="button"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
            className="p-3 hover:bg-neutral-50 transition-colors"
            type="button"
            disabled={effectiveStock <= 0}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col gap-3 mb-10">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
          className="w-full bg-[#111111] text-white py-5 text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-all disabled:bg-neutral-200"
        >
          {isOutOfStock ? "Sold Out" : adding ? "Adding..." : "Add to Bag"}
        </button>

        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistActionLoading}
          className="group flex items-center justify-center gap-2 py-4 text-[11px] uppercase tracking-widest font-semibold border border-neutral-200 hover:border-black transition-all"
        >
          <Heart
            size={14}
            className={
              isInWishlist
                ? "fill-black"
                : "group-hover:scale-110 transition-transform"
            }
          />
          {isWishlistActionLoading
            ? "Updating Wishlist..."
            : isInWishlist
              ? "Saved in Wishlist"
              : "Add to Wishlist"}
        </button>
      </div>

      {/* Collapsible Info Sections - H&M/Zara Style */}
      <div className="border-t border-neutral-200">
        {[
          { id: "details", label: "Description", content: product.description },
          {
            id: "shipping",
            label: "Shipping & Returns",
            content: `Free standard delivery on orders over ₹2,999. Return within ${product.returnable ? "30 days" : "0 days"}.`,
          },
          {
            id: "composition",
            label: "Composition & Care",
            content:
              "100% Organic Cotton. Machine wash at 30°C. Do not bleach.",
          },
        ].map((section) => (
          <div key={section.id} className="border-b border-neutral-200">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id,
                )
              }
              className="w-full flex items-center justify-between py-5 text-[11px] uppercase tracking-[0.2em] font-bold"
            >
              {section.label}
              {expandedSection === section.id ? (
                <Minus size={14} />
              ) : (
                <Plus size={14} />
              )}
            </button>
            {expandedSection === section.id && (
              <div className="w-full min-w-0 wrap-break-word pb-8 text-sm leading-relaxed text-neutral-600 animate-in fade-in slide-in-from-top-1">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Small Value Props */}
      <div className="mt-10 grid grid-cols-1 gap-4">
        <div className="flex items-center gap-4 text-neutral-500">
          <Globe size={18} strokeWidth={1} />
          <span className="text-[12px]">
            Sustainable materials and ethical sourcing.
          </span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <RefreshCcw size={18} strokeWidth={1} />
          <span className="text-[12px]">
            Easy exchanges in-store and online.
          </span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <ShieldCheck size={18} strokeWidth={1} />
          <span className="text-[12px]">
            Secure checkout with 128-bit encryption.
          </span>
        </div>
      </div>

      {isSizeGuideOpen && (
        <>
          <button
            type="button"
            aria-label="Close size guide"
            onClick={() => setIsSizeGuideOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <dialog
            open
            aria-label="Size guide"
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                  Size Guide
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="text-xs uppercase tracking-widest text-neutral-700 hover:text-black"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-widest text-neutral-500">
                    Measurements in:
                  </p>
                  <div className="inline-flex border border-neutral-300">
                    {(["CM", "INCHES"] as const).map((unit) => {
                      const isActive = sizeGuideUnit === unit;
                      return (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => setSizeGuideUnit(unit)}
                          className={`px-3 py-1 text-[11px] uppercase tracking-widest font-semibold transition-colors ${
                            isActive
                              ? "bg-black text-white"
                              : "bg-white text-neutral-700 hover:text-black"
                          }`}
                        >
                          {unit}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 text-left text-[11px] uppercase tracking-widest text-neutral-600">
                        <th className="py-2 pr-4">Size</th>
                        <th className="py-2 pr-4">Bust</th>
                        <th className="py-2 pr-4">Waist</th>
                        <th className="py-2">Hip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideMeasurements[sizeGuideUnit].map((row) => (
                        <tr
                          key={row.size}
                          className="border-b border-neutral-100 text-neutral-800"
                        >
                          <td className="py-2 pr-4 font-medium">{row.size}</td>
                          <td className="py-2 pr-4">{row.bust}</td>
                          <td className="py-2 pr-4">{row.waist}</td>
                          <td className="py-2">{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}
