"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { RootState } from "../../store";
import { removeItem, updateQuantity } from "../../features/cart/cartSlice";
import { Button } from "../../components/ui/Button";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) dispatch(updateQuantity({ id, quantity }));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <ShoppingBag size={80} strokeWidth={0.5} className="text-slate-200" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-xs font-bold tracking-tighter uppercase">
              Empty
            </span>
          </div>
        </div>
        <h1 className="text-4xl font-serif italic mb-4">Your Bag is Empty</h1>
        <p className="text-slate-500 max-w-xs leading-relaxed mb-10">
          Curate your style. Explore our latest arrivals and find pieces that
          speak to you.
        </p>
        <Link href="/">
          <Button className="px-12 h-14 bg-black text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-[0.3em] font-bold">
            Explore Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="border-b border-slate-100 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">
              Shopping Bag
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              {items.length} {items.length === 1 ? "ITEM" : "ITEMS"} SELECTED
            </p>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest font-bold underline underline-offset-8 hover:text-pink-600 transition-colors"
          >
            Continue Browsing
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col sm:flex-row gap-6 pb-10 border-b border-slate-50 transition-all hover:border-slate-200"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-48 aspect-[3/4] bg-slate-50 overflow-hidden">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-tight leading-tight mb-1">
                        {item.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 italic font-serif">
                        Premium Collection
                      </p>
                    </div>
                    <p className="text-xl font-medium tracking-tighter">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Modern Quantity Selector */}
                    <div className="flex items-center border border-slate-200 px-2 py-1">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 text-slate-400 hover:text-black transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 text-slate-400 hover:text-black transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-black transition-colors">
                        <Heart size={14} /> Move to Wishlist
                      </button>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Summary Section */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50/50 p-8 sticky top-12 border border-slate-100">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 text-slate-400">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="font-semibold tracking-tighter">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 uppercase tracking-wider">
                    Shipping
                  </span>
                  <span className="text-green-600 font-bold tracking-widest text-[10px]">
                    COMPLIMENTARY
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 uppercase tracking-wider">
                    Tax (10%)
                  </span>
                  <span className="font-semibold tracking-tighter">
                    ₹{tax.toLocaleString()}
                  </span>
                </div>
                <div className="pt-6 border-t border-slate-200 mt-6 flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    Total
                  </span>
                  <span className="text-3xl font-bold tracking-tighter">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button className="w-full h-16 bg-black text-white hover:bg-zinc-800 rounded-none text-xs uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3 group">
                  Proceed to Checkout
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </Link>

              <div className="mt-8 space-y-4">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Secure checkout powered by Stripe. All transactions are
                  encrypted.
                </p>
                <div className="flex justify-center gap-4 opacity-30 grayscale">
                  <img
                    src="https://www.svgrepo.com/show/303251/visa-logo.svg"
                    className="h-4"
                    alt="Visa"
                  />
                  <img
                    src="https://www.svgrepo.com/show/361993/mastercard.svg"
                    className="h-4"
                    alt="Mastercard"
                  />
                  <img
                    src="https://www.svgrepo.com/show/303253/apple-pay-logo.svg"
                    className="h-4"
                    alt="Apple Pay"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
