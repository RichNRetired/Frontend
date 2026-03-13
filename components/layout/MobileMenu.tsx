import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, Search } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sections: { name: string; categories: string[] }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  sections,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (name: string) => {
    setExpandedSection(expandedSection === name ? null : name);
  };

  return (
    <>
      {/* Background Overlay - Soft Blur for Premium Feel */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Top Bar: Clean & Minimal */}
          <div className="flex items-center justify-between p-6 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">
              Rich N Retired
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:rotate-90 transition-transform duration-300"
            >
              <X size={22} strokeWidth={1} className="text-black" />
            </button>
          </div>

          {/* Search Bar - Integrated & Subtle
          <div className="px-6 py-4">
            <div className="relative border-b border-gray-200 focus-within:border-black transition-colors duration-300 pb-2">
              <Search
                size={16}
                strokeWidth={1}
                className="absolute left-0 top-1 text-black"
              />
              <input
                type="text"
                placeholder="SEARCH"
                className="w-full bg-transparent pl-8 text-[10px] tracking-widest uppercase outline-none placeholder:text-gray-900"
              />
            </div>
          </div> */}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto mt-4 px-6 custom-scrollbar">
            {sections.map((section) => (
              <div key={section.name} className="mb-2">
                <button
                  onClick={() => toggleSection(section.name)}
                  className="w-full flex items-center justify-between py-4 text-[13px] font-medium tracking-[0.1em] text-black group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300 uppercase">
                    {section.name}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1}
                    className={`transition-transform duration-500 ${expandedSection === section.name ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Categories Accordion */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedSection === section.name
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="pb-4 space-y-3">
                    {section.categories.map((cat) => (
                      <li key={cat}>
                        <Link
                          href={`/category/${cat.toLowerCase()}`}
                          onClick={onClose}
                          className="text-xs text-gray-900 hover:text-black hover:pl-2 transition-all duration-300 block font-light tracking-wide"
                        >
                          {cat}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={`/category/${section.name.toLowerCase()}`}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black inline-block mt-2"
                      >
                        View All
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ))}

            {/* Static Secondary Links */}
            <div className="mt-8 pt-8 border-t border-gray-900 space-y-5">
              <Link
                href="/collections"
                className="block text-[11px] uppercase tracking-widest text-black font-semibold"
              >
                Campaigns
              </Link>
              <Link
                href="/journal"
                className="block text-[11px] uppercase tracking-widest text-black font-semibold"
              >
                The Journal
              </Link>
              <Link
                href="/sustainability"
                className="block text-[11px] uppercase tracking-widest text-gray-900"
              >
                Sustainability
              </Link>
            </div>
          </div>

          {/* Footer Actions - High Contrast */}
          <div className="p-8 bg-[#f9f9f9]">
            <div className="flex flex-col space-y-6">
              <Link
                href="/account"
                onClick={onClose}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center justify-between"
              >
                Log In / Create Account
                <span className="text-lg">→</span>
              </Link>
              <div className="flex justify-between items-center text-[9px] text-gray-900 uppercase tracking-widest">
                <span>Support</span>
                <span>Shipping Info</span>
                <span>Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
