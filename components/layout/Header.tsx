"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "../../store";
import {
  useGetSectionsQuery,
  useGetCategoriesQuery,
} from "@/features/category/categoryApi";
import {
  Section as SectionType,
  Category as CategoryType,
} from "@/types/catalog";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const getSectionDisplayName = (name: string) => {
  const normalized = name.trim().toLowerCase();
  if (normalized === "boys" || normalized === "men" || normalized === "mens") {
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

// --- Shared Types & Data ---

// When available, fetch sections from the backend via RTK Query.
// Per-section categories are fetched in a child component (hooks cannot be used inside loops).

// --- Mobile Menu Component ---
const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Fetch sections dynamically
  const { data: sections = [], isLoading: isLoadingSections } =
    useGetSectionsQuery();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <span className="text-[10px] text-black font-black uppercase tracking-[0.3em]">
              Menu
            </span>
            <button onClick={onClose} className="p-2 -mr-2 text-black">
              <X size={22} strokeWidth={1} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {isLoadingSections && (
              <div className="p-6 text-sm text-gray-400">Loading...</div>
            )}

            {sections.map((section: SectionType) => (
              <div key={section.id} className="border-b border-gray-50">
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === String(section.id)
                        ? null
                        : String(section.id),
                    )
                  }
                  className="w-full flex items-center text-black justify-between px-6 py-6 text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  {getSectionDisplayName(section.name)}
                  {expandedSection === String(section.id) ? (
                    <ChevronUp size={14} strokeWidth={1} />
                  ) : (
                    <ChevronDown size={14} strokeWidth={1} />
                  )}
                </button>

                <div
                  className={`bg-gray-50 text-black transition-all duration-500 ease-in-out overflow-hidden ${
                    expandedSection === String(section.id)
                      ? "max-h-[400px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <MobileSectionCategories
                    sectionId={section.id}
                    onClose={onClose}
                  />
                </div>
              </div>
            ))}
          </nav>

          <div className="p-8 bg-[#fcfcfc] border-t border-gray-100">
            <div className="flex flex-col gap-5">
              <Link
                href="/account"
                onClick={onClose}
                className="text-[10px] text-black uppercase tracking-widest font-black"
              >
                Account
              </Link>
              <Link
                href="/wishlist"
                onClick={onClose}
                className="text-[10px] text-black uppercase tracking-widest font-black"
              >
                Wishlist
              </Link>
            </div>
            <p className="mt-8 text-[9px] text-gray-400 leading-relaxed uppercase tracking-[0.2em]">
              Rich & Retired — Leisure Curated.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// ... (Keep SECTIONS and MobileMenu exactly as they are)

// Child: fetch categories for mobile menu
function MobileSectionCategories({
  sectionId,
  onClose,
}: {
  sectionId: number;
  onClose: () => void;
}) {
  const { data: categories = [], isLoading } = useGetCategoriesQuery(
    sectionId,
    {
      skip: !sectionId,
    },
  );

  if (isLoading)
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  return (
    <ul className="px-10 py-4 space-y-5">
      {categories.map((cat: CategoryType) => (
        <li key={cat.id} className="space-y-2">
          <Link
            href={`/catalog?sectionId=${sectionId}&categoryId=${cat.id}`}
            onClick={onClose}
            className="text-xs text-gray-700 font-semibold hover:text-black block transition-colors"
          >
            {cat.name}
          </Link>

          {!!cat.subCategories?.length && (
            <ul className="pl-3 space-y-1 border-l border-gray-200">
              {cat.subCategories.map((subCategory) => (
                <li key={`${cat.id}-${subCategory}`}>
                  <Link
                    href={`/catalog?sectionId=${sectionId}&categoryId=${cat.id}`}
                    onClick={onClose}
                    className="text-[11px] text-gray-500 italic font-serif hover:text-black block transition-colors"
                  >
                    {subCategory}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

// --- Main Header Component ---
export const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  // Fetch sections for desktop nav
  const { data: sections = [], isLoading: isLoadingSections } =
    useGetSectionsQuery();

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-white"
        }`}
      >
        {/* Top Announcement Bar - Slightly thinner for desktop */}
        <div className="bg-black text-white py-1.5 md:py-2 overflow-hidden border-b border-white/10">
          <div className="whitespace-nowrap animate-marquee text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium text-center">
            Free Shipping on orders over ₹5,000 • Priority Delivery
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8">
          {/* Height reduced from h-20 to h-14 for a sleeker desktop look */}
          <div className="flex items-center justify-between h-16 lg:h-14">
            {/* Menu Button (Mobile Only - Unchanged) */}
            <button
              className="lg:hidden p-2 -ml-2 text-black transition-transform active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Desktop Navigation - Reduced spacing and font size */}
            <nav className="hidden text-black lg:flex items-center space-x-6">
              {isLoadingSections && (
                <div className="text-sm text-gray-400">Loading...</div>
              )}

              {sections.map((section: SectionType) => (
                <div
                  key={section.id}
                  className="relative group h-14 flex items-center"
                  onMouseEnter={() => setActiveMenu(String(section.id))}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className="text-[10px] uppercase tracking-[0.15em] font-bold hover:text-gray-500 transition-colors flex items-center gap-1">
                    {getSectionDisplayName(section.name)}
                    <ChevronDown
                      size={10}
                      className={`transition-transform duration-300 ${activeMenu === String(section.id) ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`absolute top-full left-0 w-[500px] bg-white border border-gray-100 shadow-xl p-6 grid grid-cols-2 gap-6 transition-all duration-300 ${
                      activeMenu === String(section.id)
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black uppercase tracking-widest border-b pb-2">
                        Categories
                      </h4>
                      <DesktopSectionCategories sectionId={section.id} />
                    </div>
                    <div className="relative overflow-hidden aspect-square bg-gray-50">
                      <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=300"
                        alt="Featured"
                        className="w-full h-full object-cover grayscale opacity-80"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Logo - Smaller for Desktop (text-lg instead of text-2xl) */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <span className="text-sm lg:text-lg text-black font-black uppercase tracking-[0.3em] leading-none whitespace-nowrap transition-all duration-500">
                Rich <span className="text-black">&</span> Retired
              </span>
            </Link>

            {/* Right Actions - Tightened icons */}
            <div className="flex items-center space-x-2 lg:space-x-5">
              <div className="hidden xl:flex items-center border-b border-transparent focus-within:border-black transition-all pb-0.5">
                <Search size={16} strokeWidth={1.5} className="text-black" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent text-black text-[10px] uppercase tracking-widest outline-none pl-2 w-20 focus:w-32 transition-all"
                />
              </div>

              <Link
                href="/account"
                className="p-1.5 text-black hover:opacity-60 transition-opacity"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              <Link
                href="/wishlist"
                className="hidden sm:block p-1.5 text-black hover:opacity-60 transition-opacity"
              >
                <Heart size={18} strokeWidth={1.5} />
              </Link>

              <Link
                href="/cart"
                className="hidden lg:flex relative p-1.5 text-black hover:opacity-60 transition-opacity"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-black text-white text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

// Child: fetch categories for desktop dropdown
function DesktopSectionCategories({ sectionId }: { sectionId: number }) {
  const { data: categories = [], isLoading } = useGetCategoriesQuery(
    sectionId,
    {
      skip: !sectionId,
    },
  );

  if (isLoading) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <ul className="space-y-3">
      {categories.map((cat: CategoryType) => (
        <li key={cat.id} className="space-y-1">
          <Link
            href={`/catalog?sectionId=${sectionId}&categoryId=${cat.id}`}
            className="text-xs text-gray-700 hover:text-black transition-colors block font-semibold"
          >
            {cat.name}
          </Link>

          {!!cat.subCategories?.length && (
            <ul className="pl-3 border-l border-gray-200 space-y-1">
              {cat.subCategories.map((subCategory) => (
                <li key={`${cat.id}-${subCategory}`}>
                  <Link
                    href={`/catalog?sectionId=${sectionId}&categoryId=${cat.id}`}
                    className="text-[11px] text-gray-500 hover:text-black transition-colors block italic font-serif"
                  >
                    {subCategory}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
