"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Sections",
      links: [
        { name: "Men", href: "/men" },
        { name: "Boys", href: "/boys" },
        { name: "Sale", href: "/sale" },
        { name: "New Arrivals", href: "/" },
      ],
    },
    {
      title: "Help & Support",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Track Order", href: "/track" },
        { name: "Return / Exchange", href: "/returns" },
      ],
    },
    {
      title: "Policies",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Refund Policy", href: "/refund" },
        { name: "Shipping Policy", href: "/shipping" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-black text-white border-t border-neutral-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          {/* Brand & Contact Section (Takes up 5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-[14px] font-bold tracking-[0.4em] uppercase mb-8 border-l-2 border-white pl-4">
                Rich N Retired
              </h2>
              <div className="space-y-6 text-[13px] font-light text-neutral-400 tracking-wide leading-relaxed">
                <p>
                  CUSTOMER SUPPORT <br />
                  <span className="text-white font-medium">
                    +91 98898 08605
                  </span>
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-6 mt-10">
              <Link
                href="#"
                className="hover:text-neutral-400 transition-colors"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="hover:text-neutral-400 transition-colors"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="hover:text-neutral-400 transition-colors"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="hover:text-neutral-400 transition-colors"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Spacer for Desktop Alignment */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Navigation Links (Each takes 2 columns) */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500 mb-8">
                {section.title}
              </h4>
              <ul className="space-y-5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-white/70 hover:text-white transition-all duration-300 font-light tracking-wider relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
            © 2026 Rich N Retired. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-[9px] text-neutral-700 tracking-widest uppercase">
              Designed in India
            </span>
            <span className="text-[9px] text-neutral-700 tracking-widest uppercase">
              Global Shipping Available
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
