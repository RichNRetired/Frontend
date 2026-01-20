import React from "react";
import Link from "next/link";

export const Navbar: React.FC = () => {
  const categories = [
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Kids", href: "/kids" },
    { name: "Sale", href: "/sale", highlight: true },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Brands", href: "/brands" },
  ];

  return (
    <nav className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center space-x-8 py-3 overflow-x-auto">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={category.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-pink-600 ${
                  category.highlight
                    ? "text-red-600 font-semibold"
                    : "text-gray-700"
                }`}
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
