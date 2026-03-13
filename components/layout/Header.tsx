"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
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
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { GlobalSearchBar } from "./GlobalSearchBar";

const getSectionDisplayName = (name: string) => {
  const normalized = name.trim().toLowerCase();
  if (normalized === "mens" || normalized === "men") return "Mens";
  if (normalized === "womens" || normalized === "women") return "Womens";
  if (normalized === "girls" || normalized === "girl") return "Girls";
  if (normalized === "boys" || normalized === "boy") return "Boys";
  if (normalized === "kids" || normalized === "kid") return "Kids";
  return name;
};

const normalizeSectionName = (name: string) => {
  const rawName = name.trim().toLowerCase();
  if (rawName === "men") return "mens";
  if (rawName === "women") return "womens";
  if (rawName === "girl") return "girls";
  if (rawName === "boy") return "boys";
  if (rawName === "kid") return "kids";
  return rawName;
};

const sortSectionsByQuickCategoryOrder = (sections: SectionType[]) => {
  const sectionPriority: Record<string, number> = {
    mens: 1,
    womens: 2,
    girls: 3,
    boys: 4,
    kids: 5,
  };

  return [...sections].sort((a, b) => {
    const aPriority =
      sectionPriority[normalizeSectionName(a.name)] ?? Number.MAX_SAFE_INTEGER;
    const bPriority =
      sectionPriority[normalizeSectionName(b.name)] ?? Number.MAX_SAFE_INTEGER;
    return aPriority - bPriority;
  });
};

const getSectionShopHref = (sectionName: string) =>
  `/shop?section=${encodeURIComponent(sectionName.trim().toLowerCase())}`;

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

  const orderedSections = useMemo(() => {
    return sortSectionsByQuickCategoryOrder(sections);
  }, [sections]);

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

          {/* Mobile Search Bar
          <div className="px-6 py-4 border-b border-gray-100">
            <GlobalSearchBar
              placeholder="Search products"
              inputClassName="text-[10px] uppercase tracking-widest w-full"
              wrapperClassName="w-full"
              onSearch={onClose}
            />
          </div> */}

          <nav className="flex-1 overflow-y-auto">
            {isLoadingSections && (
              <div className="p-6 text-sm text-gray-400">Loading...</div>
            )}

            {orderedSections.map((section: SectionType) => (
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
                    sectionName={section.name}
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
              Rich N Retired — Leisure Curated.
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
  sectionName,
  onClose,
}: {
  sectionId: number;
  sectionName: string;
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
            href={getSectionShopHref(sectionName)}
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
                    href={getSectionShopHref(sectionName)}
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

  const { data: sections = [], isLoading: isLoadingSections } =
    useGetSectionsQuery();

  const orderedSections = useMemo(() => {
    return sortSectionsByQuickCategoryOrder(sections);
  }, [sections]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-white"
        }`}
      >
     <div className="bg-black text-white py-1.5 md:py-2 overflow-hidden border-b border-white/10 flex">
  <div className="animate-marquee whitespace-nowrap flex">
    {/* First set of text */}
    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium px-4">
      Free Shipping on orders over ₹5,000 • Priority Delivery • Luxury Curated •
    </span>
    {/* Duplicate set of text */}
    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium px-4">
      Free Shipping on orders over ₹5,000 • Priority Delivery • Luxury Curated •
    </span>
    {/* Add a third if your screen is very wide (Ultra-wide monitors) */}
    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium px-4 lg:inline hidden">
      Free Shipping on orders over ₹5,000 • Priority Delivery • Luxury Curated •
    </span>
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

              {orderedSections.map((section: SectionType) => (
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
                      <DesktopSectionCategories
                        sectionId={section.id}
                        sectionName={section.name}
                      />
                    </div>
                    <div className="relative overflow-hidden aspect-square bg-gray-50">
                      <img
                        src={section.imageUrl}
                        alt={section.name}
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
              <Image
                src="/RichLogo.png"
                alt="Rich N Retired"
                width={480}
                height={100}
                priority
                className="h-16 w-auto lg:h-14"
              />
            </Link>

            {/* Right Actions - Tightened icons */}
            <div className="flex items-center space-x-2 lg:space-x-5">
              <GlobalSearchBar
                placeholder="Search"
                inputClassName="text-[10px] uppercase tracking-widest w-20 focus:w-32 transition-all"
                wrapperClassName="hidden xl:block"
              />

              <button
                className="xl:hidden p-1.5 text-black hover:opacity-60 transition-opacity"
                onClick={() => setIsMobileSearchOpen((prev) => !prev)}
                aria-label="Toggle search"
              >
                {isMobileSearchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
              </button>

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

          {/* Mobile inline search bar */}
          <div
            className={`xl:hidden transition-all duration-300 ${
              isMobileSearchOpen ? "max-h-16 opacity-100 pb-3" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <GlobalSearchBar
              placeholder="Search products…"
              inputClassName="text-[11px] uppercase tracking-widest w-full"
              wrapperClassName="w-full"
              autoFocus={isMobileSearchOpen}
              onSearch={() => setIsMobileSearchOpen(false)}
            />
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
function DesktopSectionCategories({
  sectionId,
  sectionName,
}: {
  sectionId: number;
  sectionName: string;
}) {
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
            href={getSectionShopHref(sectionName)}
            className="text-xs text-gray-700 hover:text-black transition-colors block font-semibold"
          >
            {cat.name}
          </Link>

          {!!cat.subCategories?.length && (
            <ul className="pl-3 border-l border-gray-200 space-y-1">
              {cat.subCategories.map((subCategory) => (
                <li key={`${cat.id}-${subCategory}`}>
                  <Link
                    href={getSectionShopHref(sectionName)}
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
