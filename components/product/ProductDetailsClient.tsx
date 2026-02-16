"use client";

import { Product } from "@/features/product/productTypes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/features/cart/cartSlice";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import type { RootState } from "@/store";
import {
  ShoppingBag,
  Heart,
  Check,
  Truck,
  RotateCcw,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { sendEvent } from "@/services/analytics.service";

interface Props {
  product: Product;
}

export default function ProductDetailsClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistError, setWishlistError] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string>("details");
  const [adding, setAdding] = useState(false);
  const dispatch = useDispatch();
  const [addToCart] = useAddToCartMutation();
  const { addToWishlist, removeFromWishlist, wishlist, isAdding, isRemoving } =
    useWishlist();
  const isOutOfStock = product.stock <= 0;
  const isInWishlist = wishlist.some((item) => item.productId === product.id);

  const discount =
    product.discount_percent ||
    Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const savings = product.mrp - product.price;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart({
        productId: Number(product.id),
        qty: quantity,
      }).unwrap();
      dispatch(
        addItem({
          id: String(product.id),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images?.[0],
        }),
      );
      setAddedToCart(true);
      sendEvent("product_add_to_cart", {
        productId: product.id,
        quantity,
        source: "product_details",
      });
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to add to cart";
      console.error("Add to cart failed:", errorMsg);
      alert(errorMsg);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      setWishlistError("");
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        sendEvent("product_removed_wishlist", {
          productId: product.id,
          source: "product_details",
        });
      } else {
        await addToWishlist(product.id);
        sendEvent("product_added_wishlist", {
          productId: product.id,
          source: "product_details",
        });
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to update wishlist";
      setWishlistError(errorMsg);
      console.error("Wishlist error:", errorMsg);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  return (
    <div className="flex flex-col gap-y-8 py-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
            {product.brand}
          </p>
          <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-2">
            {product.name}
          </h1>
          <p className="text-neutral-600 text-sm font-light">
            {product.short_description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.floor(product.average_rating)
                    ? "text-yellow-400"
                    : "text-neutral-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-neutral-600">
            {product.average_rating.toFixed(1)} ({product.total_reviews}{" "}
            {product.total_reviews === 1 ? "review" : "reviews"})
          </span>
        </div>

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-medium text-neutral-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-xl text-neutral-400 line-through">
                  ₹{product.mrp.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-white bg-red-600 px-3 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-green-600 font-medium">
              You save ₹{savings.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-500">
              Inclusive of {product.tax_percent}% tax
            </p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Truck className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-900 uppercase">
              Delivery
            </p>
            <p className="text-sm font-medium text-blue-900">
              {product.delivery_days} days
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
          <RotateCcw className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-green-900 uppercase">
              Returns
            </p>
            <p className="text-sm font-medium text-green-900">
              {product.returnable ? "30 days" : "Non-returnable"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <ShoppingBag className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-purple-900 uppercase">Stock</p>
            <p
              className={`text-sm font-medium ${
                isOutOfStock
                  ? "text-red-600"
                  : product.stock < 5
                    ? "text-orange-600"
                    : "text-green-600"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <Shield className="w-5 h-5 text-yellow-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-yellow-900 uppercase">
              Payment
            </p>
            <p className="text-sm font-medium text-yellow-900">
              {product.cod_available ? "COD Available" : "Online Only"}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="space-y-3">
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            <Info className="w-4 h-4" />
            About this product
          </h3>
          <p className="text-neutral-600 leading-relaxed text-sm">
            {product.description}
          </p>
        </div>
      )}

      {/* Specifications */}
      {product.attributes && Object.keys(product.attributes).length > 0 && (
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection("specs")}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <h3 className="font-semibold text-neutral-900">Specifications</h3>
            {expandedSection === "specs" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSection === "specs" && (
            <div className="space-y-3 animate-in">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-neutral-100 last:border-0"
                >
                  <span className="text-neutral-600 text-sm capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium text-neutral-900 text-sm">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delivery & Returns Details */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection("delivery")}
          className="w-full flex items-center justify-between py-3 text-left"
        >
          <h3 className="font-semibold text-neutral-900">Delivery & Returns</h3>
          {expandedSection === "delivery" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSection === "delivery" && (
          <div className="space-y-4 pt-2 animate-in">
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">
                Delivery Details
              </h4>
              <p className="text-sm text-neutral-600">
                This item will be delivered within {product.delivery_days} - 1
                business days to your selected address.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Returns</h4>
              <p className="text-sm text-neutral-600">
                {product.returnable
                  ? "This item is eligible for returns within 30 days of purchase in original condition with all packaging and accessories."
                  : "This item is not eligible for returns."}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">
                Payment Options
              </h4>
              <p className="text-sm text-neutral-600">
                {product.cod_available
                  ? "Cash on Delivery (COD) and online payment options available."
                  : "Online payment options available."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-4">
        <div className="flex gap-4">
          <div className="flex items-center border border-neutral-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock || adding}
              className="px-4 py-3 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="flex-1 text-center font-bold min-w-12">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={isOutOfStock || adding}
              className="px-4 py-3 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all text-white uppercase tracking-wider text-sm ${
              addedToCart
                ? "bg-green-600"
                : "bg-black hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed"
            }`}
          >
            {adding ? (
              "Adding..."
            ) : addedToCart ? (
              <>
                <Check size={18} />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleWishlistToggle}
          disabled={isAdding || isRemoving}
          className={`w-full flex items-center justify-center gap-2 border-2 py-3 rounded-lg font-bold transition uppercase tracking-wider text-sm ${
            isInWishlist
              ? "border-red-600 bg-red-50 text-red-600 hover:bg-red-100"
              : "border-neutral-200 text-neutral-900 hover:bg-neutral-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
          {isAdding || isRemoving
            ? "Updating..."
            : isInWishlist
              ? "Remove from Wishlist"
              : "Add to Wishlist"}
        </button>
        {wishlistError && (
          <p className="text-sm text-red-600 text-center">{wishlistError}</p>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-4 border-t space-y-4 text-sm">
        <div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
            Product ID
          </p>
          <p className="font-mono text-neutral-700">PRD-{product.id}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
            Brand
          </p>
          <p className="text-neutral-700">{product.brand}</p>
        </div>
        {product.slug && (
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
              Slug
            </p>
            <p className="text-neutral-700 break-all">{product.slug}</p>
          </div>
        )}
      </div>
    </div>
  );
}
