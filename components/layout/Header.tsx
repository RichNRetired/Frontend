"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "../../store";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      name: "New Arrivals",
      categories: ["Just In", "Exclusives", "Limited Drop", "Summer Edit"],
    },
    {
      name: "Men",
      categories: [
        "Polos",
        "Linen Shirts",
        "Tailored Trousers",
        "Knitwear",
        "Accessories",
      ],
    },
    {
      name: "Women",
      categories: [
        "Silk Dress",
        "Evening Wear",
        "Cashmere",
        "Handbags",
        "Jewelry",
      ],
    },
    {
      name: "Collections",
      categories: [
        "The Resort Look",
        "Business Casual",
        "Quiet Luxury",
        "Archive",
      ],
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="bg-black text-white py-2 overflow-hidden border-b border-white/10">
        <div className="whitespace-nowrap animate-marquee text-[10px] uppercase tracking-[0.3em] font-medium text-center">
          Free Shipping on orders over ₹5,000 • Priority Delivery
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Menu Button (Mobile) */}
          <button className="lg:hidden p-2 -ml-2">
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Navigation - Left Side (Desktop) */}
          <nav className="hidden text-black lg:flex items-center space-x-8">
            {sections.map((section) => (
              <div
                key={section.name}
                className="relative group h-20 flex items-center"
                onMouseEnter={() => setActiveMenu(section.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="text-[11px] uppercase tracking-[0.2em] font-bold hover:text-gray-950 transition-colors flex items-center gap-1">
                  {section.name}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${activeMenu === section.name ? "rotate-180" : ""}`}
                  />
                </button>

                {/* MEGA MENU DROP DOWN */}
                <div
                  className={`absolute top-full left-0 w-[600px] bg-white border border-gray-100 shadow-2xl p-8 grid grid-cols-2 gap-8 transition-all duration-300 ${
                    activeMenu === section.name
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest border-b pb-2">
                      Categories
                    </h4>
                    <ul className="space-y-3">
                      {section.categories.map((cat) => (
                        <li key={cat}>
                          <Link
                            href={`/category/${cat.toLowerCase()}`}
                            className="text-sm text-gray-500 hover:text-black transition-colors block italic font-serif"
                          >
                            {cat}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative overflow-hidden group/img">
                    <img
                      src={`https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=300`}
                      alt="Featured"
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/img:grayscale-0 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-end p-4">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                        Shop {section.name} Edit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Logo - Centered */}
          <Link href="/" className="flex flex-col items-center">
            <span className="text-xl mr-20 md:text-2xl  text-gray-900  font-black uppercase tracking-[0.4em] leading-none">
              Rich <span className="text-gray-700 italic">&</span> Retired
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-5 lg:space-x-7">
            {/* Search - Subtle underline style */}
            <div className="hidden lg:flex items-center border-b border-transparent focus-within:border-black transition-all pb-1">
              <Search size={18} strokeWidth={1.5} className="text-gray-900" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent text-black text-xs uppercase tracking-widest outline-none pl-2 w-24 focus:w-48 transition-all"
              />
            </div>

            <Link
              href="/account"
              className="hover:text-gray-950 text-gray-800 transition-colors"
            >
              <User size={20} strokeWidth={1.2} />
            </Link>

            <Link
              href="/wishlist"
              className="hidden sm:block hover:text-gray-950 text-gray-800  transition-colors"
            >
              <Heart size={20} strokeWidth={1.2} />
            </Link>

            <Link
              href="/cart"
              className="relative hover:text-gray-950 text-gray-800 transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.2} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
