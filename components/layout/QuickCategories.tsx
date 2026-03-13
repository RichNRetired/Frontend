"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetSectionsQuery } from "@/features/category/categoryApi";

export default function QuickCategories() {
  const [mounted, setMounted] = useState(false);
  const { data: quickCategories = [] } = useGetSectionsQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-12 md:mt-4 border-b border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 uppercase">
            Shop by Category
          </h2>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 overflow-x-visible md:overflow-x-auto no-scrollbar pb-4 justify-center">
          {!mounted ? null : quickCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?section=${cat.name.toLowerCase()}`}
              className="flex flex-col items-center gap-3 min-w-20 md:min-w-25 group shrink-0"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-neutral-100 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] md:text-[11px] uppercase tracking-widest font-medium text-neutral-600 group-hover:text-black transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
