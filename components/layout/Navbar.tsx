"use client";

import React from "react";
import Link from "next/link";
import { useGetSectionsQuery } from "@/features/category/categoryApi";

export const Navbar: React.FC = () => {
  const { data: sectionsData = [] } = useGetSectionsQuery();

  // Map API sections to navbar format
  const categories = sectionsData.map((section) => ({
    name: section.name,
    href: `/shop?section=${section.name.toLowerCase()}`,
  }));

  return (
    <nav className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center space-x-8 py-3 overflow-x-auto">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={category.href}
                className="whitespace-nowrap text-sm font-medium transition-colors hover:text-pink-600 text-gray-700"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
