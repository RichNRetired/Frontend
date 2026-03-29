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

  if (!mounted) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-[0.1em] text-black uppercase">
            Featured Categories
          </h2>
        </div>

        {/* Centered Flex Container */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {quickCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?section=${cat.name.toLowerCase()}`}
              className="relative group overflow-hidden block w-[calc(50%-8px)] md:w-[220px] lg:w-[240px]"
            >
              {/* Image Container with 2:3 Aspect Ratio */}
              <div className="aspect-[2/3] w-full overflow-hidden bg-neutral-100 relative">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />

                {/* Text Label Overlaid */}
                <div className="absolute bottom-6 left-0 right-0 text-center px-2">
                  <span className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.15em] drop-shadow-md">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}