"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const campaigns = [
  {
    category: "Menswear",
    title: "THE PERFECT\nT-SHIRT",
    description:
      "Heavyweight 300GSM organic cotton. A structured drape for a contemporary silhouette.",
    image: "/BannerImage2.jpg",
    link: "/shop?category=t-shirts",
    btn: "Shop Collection",
  },
  {
    category: "Editorial",
    title: "THE OXFORD\nSERIES",
    description:
      "Crisp, refined, and versatile. Reimagining the classic button-down for the modern era.",
    image: "/BannerImage1.jpg",
    link: "/shop?category=shirts",
    btn: "Explore Shirts",
  },
];

export default function CampaignBanners() {
  return (
    <section className="bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Section Header: Zara Style Editorial Header */}
        <div className="mb-10 flex flex-col items-start border-l border-black pl-8">
          <h3 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-black">
            MENSWEAR <br />
          </h3>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {campaigns.map((camp, idx) => (
            <div
              key={idx}
              className="group relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-neutral-100"
            >
              {/* Image with slow Ken Burns effect */}
              <Image
                src={camp.image}
                alt={camp.title}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[4s] ease-out group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
              />

              {/* Minimal Gradient for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              {/* Text Content: Bottom Left Alignment */}
              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end items-start text-white">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 mb-4 block">
                    {camp.category}
                  </span>

                  <h3 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6 leading-[0.95] whitespace-pre-line">
                    {camp.title}
                  </h3>

                  <p className="text-sm font-light text-white/70 mb-10 max-w-xs leading-relaxed group-hover:text-white transition-colors">
                    {camp.description}
                  </p>

                  {/* High-Fashion Flat Button */}
                  <Link
                    href={camp.link}
                    className="group/btn relative inline-flex items-center justify-center px-12 py-4 border border-white text-white text-[11px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-colors duration-500 hover:text-black"
                  >
                    <span className="relative z-10">{camp.btn}</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.22, 1, 0.36, 1]" />
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