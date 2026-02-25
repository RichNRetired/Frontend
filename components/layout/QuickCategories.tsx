"use client";

import Link from "next/link";
import { useGetSectionsQuery } from "@/features/category/categoryApi";

const getSectionDisplayName = (name: string) => {
  const normalized = name.trim().toLowerCase();
  if (
    normalized === "boy" ||
    normalized === "boys" ||
    normalized === "men" ||
    normalized === "mens"
  ) {
    return "Mens";
  }
  if (
    normalized === "girl" ||
    normalized === "girls" ||
    normalized === "women" ||
    normalized === "womens"
  ) {
    return "Women";
  }
  if (normalized === "kids" || normalized === "kid") {
    return "Kids";
  }
  return name;
};

export default function QuickCategories() {
  const { data: sections = [], isLoading } = useGetSectionsQuery();

  const getSectionSlug = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (normalized === "girl") {
      return "women";
    }
    if (
      normalized === "girls" ||
      normalized === "women" ||
      normalized === "womens"
    ) {
      return "women";
    }
    return normalized;
  };

  const categories = sections.map((sec) => ({
    id: sec.id,
    name: getSectionDisplayName(sec.name),
    link: `/shop?section=${getSectionSlug(sec.name)}`,
  }));

  return (
    <section className="py-12 border-b border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 uppercase">
            Shop by Category
          </h2>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 overflow-x-visible md:overflow-x-auto no-scrollbar pb-4 justify-center">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 min-w-20 md:min-w-25 shrink-0"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-neutral-100 animate-pulse" />
                  <div className="h-3 w-16 bg-neutral-100 animate-pulse" />
                </div>
              ))
            : categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.link}
                  className="flex flex-col items-center gap-3 min-w-20 md:min-w-25 group shrink-0"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-neutral-100 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                    <div className="bg-neutral-100 w-full h-full flex items-center justify-center text-neutral-300">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
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
