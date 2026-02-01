"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/slide-1-home4-1 - Copy.jpg",
    subtitle: "Spring / Summer 2026",
    title: "The Art of\nMinimalism",
    description:
      "A refined selection designed for modern silhouettes. Timeless forms, conscious materials.",
    button1: "Shop Men",
    button2: "Shop Women",
  },
  {
    image: "/slide-2-home4-1 - Copy.jpg",
    subtitle: "Limited Edition",
    title: "Luxe Essential\nTextures",
    description:
      "Elevated fabrics and understated tailoring for a contemporary wardrobe.",
    button1: "Explore",
    button2: "New Arrivals",
  },
];

const textVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: { duration: 0.6, ease: [0.4, 0, 1, 1] },
  },
};

const imageVariants = {
  initial: { scale: 1.08, clipPath: "inset(0 0 0 100%)" },
  animate: {
    scale: 1,
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 1.4, ease: [0.77, 0, 0.175, 1] },
  },
  exit: {
    clipPath: "inset(0 100% 0 0)",
    transition: { duration: 0.8, ease: [0.4, 0, 1, 1] },
  },
};

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#FAFAFA] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* ================= TEXT ================= */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <span className="block text-[11px] tracking-[0.4em] uppercase text-neutral-400 mb-6">
                  {slides[current].subtitle}
                </span>

                <h1 className="whitespace-pre-line text-[42px] sm:text-[56px] md:text-[64px] xl:text-[72px] font-serif font-light leading-[1.05] text-neutral-900 mb-8">
                  {slides[current].title}
                </h1>

                <p className="text-neutral-500 text-[15px] sm:text-[16px] leading-relaxed max-w-md mb-14 font-light">
                  {slides[current].description}
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-12 py-4 text-[11px] tracking-[0.35em] uppercase bg-neutral-900 text-white hover:bg-neutral-800 transition"
                  >
                    {slides[current].button1}
                  </Link>

                  <Link
                    href="/collection"
                    className="inline-flex items-center justify-center px-12 py-4 text-[11px] tracking-[0.35em] uppercase text-neutral-900 border border-neutral-300 hover:border-neutral-900 transition"
                  >
                    {slides[current].button2}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ================= IMAGE ================= */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Image
                    src={slides[current].image}
                    alt="Fashion collection"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </motion.div>
              </AnimatePresence>

              {/* Editorial corner detail */}
              <div className="hidden lg:block absolute -bottom-8 -left-8 w-40 h-40 border-l border-b border-neutral-300" />
            </div>
          </div>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="mt-20 flex items-center justify-between">
          <div className="flex gap-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="relative h-6 flex items-center"
              >
                <span
                  className={`block h-[1px] transition-all duration-500 ${
                    i === current
                      ? "w-12 bg-neutral-900"
                      : "w-8 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="hidden md:block text-[11px] tracking-widest text-neutral-400">
            <span className="text-neutral-900">0{current + 1}</span> / 0
            {slides.length}
          </div>
        </div>
      </div>
    </section>
  );
}
