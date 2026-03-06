"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const campaigns = [
  {
    category: "The Essential Tee",
    title: "Heavyweight Jersey",
    description:
      "Drop-shoulder silhouettes in 300GSM organic cotton. Built for the playground, designed for the aesthetic.",
    // Using a high-quality studio shot of a premium kids t-shirt
    image:
      "https://images.unsplash.com/photo-1622273509381-0699479e0a0d?q=80&w=1200&auto=format&fit=crop",
    link: "/shop?category=t-shirts",
    btn: "Shop T-Shirts",
  },
  {
    category: "Seasonal Shirting",
    title: "The Oxford Series",
    description:
      "Classic button-downs with a modern oversized fit. Versatile layers for the young tastemaker.",
    // Using a sharp editorial shot of a youth button-up shirt
    image:
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=1200&auto=format&fit=crop",
    link: "/shop?category=shirts",
    btn: "Explore Shirting",
  },
];

export default function CampaignBanners() {
  return (
    <section className="py-20 md:py-32 bg-[#FBFBFB] border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl tracking-tighter leading-[0.85]">
              Mens' Wardrobe <br />
              <span className="text-neutral-300 not-italic font-sans font-bold uppercase text-4xl md:text-6xl">
                Essentials.
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-neutral-500 text-sm font-light leading-relaxed">
            Premium fabrics meets functional design. A new standard for the next
            generation.
          </p>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {campaigns.map((camp, idx) => (
            <div
              key={idx}
              className="group relative h-[600px] md:h-[750px] w-full overflow-hidden bg-neutral-200"
            >
              {/* Image Logic:
                  1. priority={true} ensures these "above-the-fold" images load instantly.
                  2. sizes handles responsive image delivery.
                  3. grayscale-[20%] gives that high-fashion "muted" look until hover.
              */}
              <Image
                src={camp.image}
                alt={camp.title}
                fill
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2.5s] cubic-bezier(0.19, 1, 0.22, 1) group-hover:scale-110 grayscale-[15%] group-hover:grayscale-0"
              />

              {/* Sophisticated Dark Overlay - Improved for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-100" />

              {/* Text Content */}
              <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-end items-start text-white">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  className="w-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-[1px] w-8 bg-white/40 group-hover:w-12 transition-all duration-500" />
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/80">
                      {camp.category}
                    </span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-serif italic tracking-tighter mb-4 leading-tight">
                    {camp.title}
                  </h3>

                  <p className="text-sm md:text-base font-light text-white/60 mb-10 max-w-sm leading-relaxed group-hover:text-white/90 transition-colors">
                    {camp.description}
                  </p>

                  <Link
                    href={camp.link}
                    className="relative inline-flex items-center justify-center px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:bg-black hover:text-white group/btn overflow-hidden"
                  >
                    <span className="relative z-10">{camp.btn}</span>
                    <div className="absolute inset-0 bg-black translate-y-full group-hover/btn:translate-y-0 transition-transform duration-100 ease-[0.19, 1, 0.22, 1]" />
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
