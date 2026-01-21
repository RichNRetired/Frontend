"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/slide-1-home4-1 - Copy.jpg",
    subtitle: "Spring / Summer 2026",
    title: "The Art of \nMinimalism",
    description:
      "Discover the latest collection curated for the modern aesthetic. Timeless pieces, ethically sourced.",
    button1: "Shop Men",
    button2: "Shop Women",
  },
  {
    image: "/slide-2-home4-1 - Copy.jpg",
    subtitle: "Limited Edition",
    title: "Luxe Essential \nTextures",
    description:
      "Premium fabrics meet unparalleled craftsmanship. Elevate your everyday wardrobe.",
    button1: "Explore More",
    button2: "New Arrivals",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center bg-[#F9F9F9] overflow-hidden">
      {/* Background Decorative Text (Optional for Premium Feel) */}
      <div className="absolute top-10 left-10 opacity-[0.03] pointer-events-none select-none">
        <h2 className="text-[15rem] font-bold leading-none">VOGUE</h2>
      </div>

      <div className="container mx-auto px-6 lg:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT CONTENT: Text & CTA */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-4"
                >
                  {slides[current].subtitle}
                </motion.span>

                <h1 className="text-5xl md:text-7xl font-serif text-neutral-900 leading-[1.1] mb-6 whitespace-pre-line">
                  {slides[current].title}
                </h1>

                <p className="text-neutral-600 text-lg md:text-xl max-w-sm mb-10 leading-relaxed font-light">
                  {slides[current].description}
                </p>

                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    href="/shop"
                    className="group relative px-10 py-4 bg-neutral-900 text-white overflow-hidden text-sm uppercase tracking-widest transition-all"
                  >
                    <span className="relative z-10">
                      {slides[current].button1}
                    </span>
                    <div className="absolute inset-0 bg-neutral-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>

                  <Link
                    href="/collection"
                    className="group px-10 py-4 border border-neutral-300 text-neutral-900 text-sm uppercase tracking-widest hover:border-neutral-900 transition-colors"
                  >
                    {slides[current].button2}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT CONTENT: Image with sophisticated frame */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] w-full max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ clipPath: "inset(0 0 0 100%)", scale: 1.1 }}
                  animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
                  exit={{ clipPath: "inset(0 100% 0 0%)", opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={slides[current].image}
                    alt="Collection Image"
                    fill
                    priority
                    className="object-cover"
                  />
                  {/* Overlay for depth */}
                  <div className="absolute inset-0 bg-black/5" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Decorative Box */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l border-b border-neutral-300 hidden lg:block" />
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION: Pagination & Indicators */}
        <div className="mt-16 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className="group relative py-4 focus:outline-none"
              >
                <div
                  className={`h-[2px] transition-all duration-500 ${index === current ? "w-12 bg-neutral-900" : "w-8 bg-neutral-300 group-hover:bg-neutral-400"}`}
                />
              </button>
            ))}
          </div>

          <div className="hidden md:block text-neutral-400 text-xs tracking-tighter">
            <span className="text-neutral-900">0{current + 1}</span> / 0
            {slides.length}
          </div>
        </div>
      </div>
    </section>
  );
}
