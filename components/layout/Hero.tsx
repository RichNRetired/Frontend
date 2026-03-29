"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    image: "/hero1.jpg",
    subtitle: "New In",
    title: "THE REFINED\nCOLLECTION",
    description: "Architectural silhouettes met with premium fabrics.",
    button: "Shop Now",
    link: "/shop?category=men",
  },
  {
    image: "/hero2.jpg",
    subtitle: "Spring Summer 2026",
    title: "PURE\nMINIMALISM",
    description: "A study in form and understated elegance.",
    button: "Explore",
    link: "/shop?category=men",
  },
  {
    image: "/hero3.jpg",
    subtitle: "Seasonal Edition",
    title: "URBAN\nSTRUCTURE",
    description: "Versatile essentials for the modern wardrobe.",
    button: "View All",
    link: "/shop?category=men",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* 1. We use min-h-screen to ensure the section is never too short.
          2. On large screens, we use aspect-[16/9] or h-screen to balance the portrait images.
          3. 'object-center' often works better for desktop to keep the subject framed.
      */}
      <div className="relative h-[80vh] sm:h-[85vh] md:h-screen w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[current].image}
                alt="Hero Banner"
                fill
                priority
                // Changed to object-center so desktop doesn't cut off the head/bottom as harshly
                className="object-cover object-center md:object-[50%_20%]" 
                sizes="100vw"
                quality={100}
              />
            </div>

            {/* Gradient overlay - darkened for better text readability on large screens */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/10 md:to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="max-w-7xl mx-auto w-full px-6 py-20 md:px-16 md:py-0">
            <div className="flex flex-col max-w-2xl text-white">

              {/* Animated Subtitle */}
              <div className="overflow-hidden mb-4">
                <motion.span
                  key={`sub-${current}`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[10px] tracking-[0.3em] uppercase font-semibold text-white/90 border-l border-white/50 pl-4"
                >
                  {slides[current].subtitle}
                </motion.span>
              </div>

              {/* Title */}
              <motion.h1
                key={`title-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-[42px] md:text-[80px] lg:text-[100px] font-light leading-[1] md:leading-[0.85] mb-6 tracking-tight whitespace-pre-line"
              >
                {slides[current].title}
              </motion.h1>

              {/* Description */}
              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="hidden sm:block text-sm md:text-base font-light text-white/70 mb-10 tracking-wide max-w-xs md:max-w-md leading-relaxed"
              >
                {slides[current].description}
              </motion.p>

              {/* Button */}
              <motion.div
                key={`btn-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Link
                  href={slides[current].link}
                  className="group inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-black px-8 py-4 md:px-10 md:py-5 transition-all hover:bg-transparent hover:text-white border border-white"
                >
                  {slides[current].button}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-0 w-full flex justify-center md:justify-start md:left-16 gap-8 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group flex flex-col items-start gap-2"
          >
            <span className={`text-[9px] font-medium transition-colors ${idx === current ? "text-white" : "text-white/30"}`}>
              0{idx + 1}
            </span>
            <div className="h-[2px] w-12 md:w-16 bg-white/10 overflow-hidden rounded-full">
              {idx === current && (
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 7, ease: "linear" }}
                  className="h-full bg-white"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}