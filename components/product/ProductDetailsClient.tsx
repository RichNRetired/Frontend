"use client";

import React, { useState } from "react";
import { Product } from "@/features/product/productTypes";
import { useDispatch } from "react-redux";
import { addItem } from "@/features/cart/cartSlice";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import { sendEvent } from "@/services/analytics.service";

export default function ProductDetailsClient({
  product,
}: {
  product: Product;
}) {
  const dispatch = useDispatch();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizes = product.attributes && Object.values(product.attributes);

  const changeQty = (delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleAdd = async () => {
    // Validation
    if (sizes && sizes.length > 0 && !selectedSize) {
      setError("Please select a size before adding to cart.");
      return;
    }
    if (product.stock !== undefined && quantity > product.stock) {
      setError(`Only ${product.stock} item(s) available in stock.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addToCart({
        productId: product.id,
        qty: quantity,
      }).unwrap();
      dispatch(
        addItem({
          id: String(product.id),
          name: product.name,
          price: product.price,
          quantity,
          image: product.images?.[0],
        }),
      );
      // Reset form
      setQuantity(1);
      setSelectedSize(null);
      // analytics
      sendEvent("add_to_cart", {
        productId: product.id,
        quantity,
        size: selectedSize || null,
      });
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Failed to add to cart. Please try again.";
      setError(message);
      sendEvent("add_to_cart_failed", {
        productId: product.id,
        error: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm text-neutral-500">{product.brand}</div>
        <h1 className="text-3xl font-light">{product.name}</h1>
      </div>

      <div className="mb-6 text-neutral-700">{product.short_description}</div>

      <div className="mb-6">
        <div className="text-2xl font-semibold">
          ₹{product.price.toLocaleString()}
        </div>
        {product.mrp > product.price && (
          <div className="text-sm text-neutral-400 line-through">
            ₹{product.mrp.toLocaleString()}
          </div>
        )}
      </div>

      {sizes && sizes.length > 0 && (
        <div className="mb-4">
          <label className="text-xs uppercase text-neutral-500">Size</label>
          <div className="flex gap-2 mt-2">
            {sizes.map((s: any) => (
              <button
                key={s}
                onClick={() => setSelectedSize(String(s))}
                className={`px-3 py-2 border ${selectedSize === s ? "border-black" : "border-neutral-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => changeQty(-1)} className="px-3 py-2 border">
          -
        </button>
        <div className="px-4">{quantity}</div>
        <button onClick={() => changeQty(1)} className="px-3 py-2 border">
          +
        </button>
      </div>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <div className="flex items-center gap-4">
        <button
          onClick={handleAdd}
          disabled={loading || isAdding}
          className="px-6 py-3 bg-black text-white"
        >
          {loading || isAdding ? "Adding..." : "Add to Cart"}
        </button>
        <button
          className="px-6 py-3 border"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
