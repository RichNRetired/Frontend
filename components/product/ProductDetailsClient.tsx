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
  ArrowRight,
  ShieldCheck,
  Globe,
  RefreshCcw,
} from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { sendEvent } from "@/services/analytics.service";
import { getPrimaryProductImage } from "@/features/product/productUtils";

interface Props {
  product: Product;
}

export default function ProductDetailsClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();
  const { addToWishlist, removeFromWishlist, wishlist, isAdding, isRemoving } =
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
  const isOutOfStock = (effectiveStock ?? 0) <= 0;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      if (!selectedVariant) throw new Error("Please select a variant");
      await addToCart({
        productId: Number(product.id),
        variantId: selectedVariant.id ?? 0,
        qty: quantity,
      }).unwrap();
      dispatch(
        addItem({
          id: String(selectedVariant.id),
          productId: product.id,
          variantId: selectedVariant.id ?? 0,
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

  return (
    <div className="min-w-0 w-full mt-10 flex flex-col max-w-none md:max-w-xl mx-auto lg:mx-0 font-sans text-[#111111]">
      {/* Brand & Title */}
      <header className="space-y-2 mb-8">
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

      {activeVariants.length > 0 && (
        <div className="mb-8 space-y-6">
          {sizeOptions.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-widest mb-3 font-bold">
                Size
              </p>
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
          onClick={() =>
            isInWishlist
              ? removeFromWishlist(product.id)
              : addToWishlist(product.id)
          }
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
          {isInWishlist ? "Saved in Wishlist" : "Add to Wishlist"}
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
    </div>
  );
}
