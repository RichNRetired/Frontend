"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Selection",
      links: [
        { name: "Men", href: "/men" },
        { name: "Women", href: "/women" },
        { name: "Kids", href: "/kids" },
        { name: "Sale", href: "/sale" },
        { name: "New Arrivals", href: "/new-arrivals" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
      ],
    },
    {
      title: "Help",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "FAQ", href: "/faq" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-neutral-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          {/* Logo & Manifesto Section */}
          <div className="col-span-2 lg:col-span-2 pr-0 lg:pr-20">
            <h2 className="text-xl text-black font-bold tracking-[0.3em] uppercase mb-6">
              RICH & RETIRED
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed font-light max-w-sm">
              Elevated essentials for the modern wardrobe. We believe in
              timeless design, sustainable craftsmanship, and the art of living
              well.
            </p>
            <div className="flex space-x-5 mt-8">
              <Instagram className="w-5 h-5 text-neutral-400 hover:text-black cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-neutral-400 hover:text-black cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-neutral-400 hover:text-black cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-neutral-400 hover:text-black cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-neutral-500 hover:text-black transition-colors duration-200 font-light"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Legal & Payments */}
        <div className="border-t border-neutral-100 pt-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-medium">
              <span>© 2026 Rich and Retired</span>
              <Link
                href="/privacy"
                className="hover:text-black transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-black transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-black transition-colors"
              >
                Cookies
              </Link>
            </div>

            {/* Clean Payment Icons */}
            <div className="flex items-center gap-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-3"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-5"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-4"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg"
                alt="Apple Pay"
                className="h-5"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
