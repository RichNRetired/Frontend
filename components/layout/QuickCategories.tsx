"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetSectionsQuery } from "@/features/category/categoryApi";

export default function QuickCategories() {
  const [mounted, setMounted] = useState(false);
  const { data: quickCategories = [], isLoading } = useGetSectionsQuery();

  // Hardcoded images for men's and boys categories
  const hardcodedImages: Record<string, string> = {
    men: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_a62496d4-9caa-4a63-a91c-dd836e29ab2c.jpg?v=1766424594&quality=80",
    boys: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mst2343-10-m-28.jpg?v=1735627148&quality=80",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-100 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tighter text-neutral-900 uppercase">
              Featured <span className="font-medium ">Categories</span>
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-2">
              Curated essentials for the modern wardrobe
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:block text-xs font-medium uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-300 transition-all"
          >
            View All
          </Link>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-10">
          {isLoading
            ? // Simple Skeleton Loader
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-neutral-100 animate-pulse"
                />
              ))
            : quickCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?section=${cat.name.toLowerCase()}`}
                  className="group flex flex-col"
                >
                  {/* Image Wrapper */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-4">
                    <img
                      src={
                        hardcodedImages[cat.name.toLowerCase()] || cat.imageUrl
                      }
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />

                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                    {/* "Quick View" or "Shop" Slide-up */}
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-white/90 backdrop-blur-sm text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                        Discover More
                      </p>
                    </div>
                  </div>

                  {/* Category Info Below Image (Zara Style) */}
                  <div className="flex justify-between items-start pt-2">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-800">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                        New Arrival
                      </span>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-neutral-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 9L9 1M9 1H1M9 1V9"
                          stroke="black"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
