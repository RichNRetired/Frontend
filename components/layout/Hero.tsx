"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/SlideImage1.jpg",
    subtitle: "New In",
    title: "THE REFINED\nCOLLECTION",
    description: "Architectural silhouettes met with premium fabrics.",
    button: "Shop Now",
    link: "/shop?category=men",
    align: "left",
  },
  {
    image: "/SlideImage2.jpg",
    subtitle: "Spring Summer 2026",
    title: "PURE\nMINIMALISM",
    description: "A study in form and understated elegance.",
    button: "Explore",
    link: "/shop?category=men",
    align: "left",
  },
  {
    image: "/SlideImage3.jpg",
    subtitle: "Seasonal Edition",
    title: "URBAN\nSTRUCTURE",
    description: "Versatile essentials for the modern wardrobe.",
    button: "View All",
    link: "/shop?category=men",
    align: "left",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000); // Slightly longer for a more relaxed premium feel
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Ken Burns Effect (Slow Scale) */}
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 7, ease: "linear" }}
            className="relative w-full h-full"
          >
            <Image
              src={slide.image}
              alt="Hero Banner"
              fill
              priority
              className="object-cover object-top grayscale-[20%] contrast-[110%]"
            />
          </motion.div>
          
          {/* Editorial Overlays */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-8 md:px-16">
          <div
            className={`flex flex-col max-w-2xl text-white ${
              slide.align === "center" ? "mx-auto text-center items-center" : "text-left items-start"
            }`}
          >
            {/* Subtitle Stagger */}
            <motion.span
              key={`sub-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] md:text-[12px] tracking-[0.4em] uppercase font-bold text-white mb-6 border-l-2 border-white pl-4"
            >
              {slide.subtitle}
            </motion.span>

            {/* Title Stagger */}
            <motion.h1
              key={`title-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[48px] md:text-[80px] lg:text-[100px] font-medium leading-[0.9] mb-8 tracking-tighter whitespace-pre-line"
            >
              {slide.title}
            </motion.h1>

            {/* Description Stagger */}
            <motion.p
              key={`desc-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-sm md:text-base font-light text-white/80 mb-12 tracking-wide max-w-md leading-relaxed"
            >
              {slide.description}
            </motion.p>

            {/* Button Stagger */}
            <motion.div
              key={`btn-${current}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link
                href={slide.link}
                className="group relative inline-flex items-center bg-white text-black px-10 py-5 text-[11px] font-bold uppercase tracking-[0.25em] transition-all hover:bg-black hover:text-white"
              >
                <span className="relative z-10">{slide.button}</span>
                <ChevronRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern Progress Bar Indicators */}
      <div className="absolute bottom-12 left-8 md:left-16 flex items-center gap-6 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group relative py-4"
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold transition-colors ${idx === current ? "text-white" : "text-white/40"}`}>
                0{idx + 1}
              </span>
              <div className="h-[1px] w-12 bg-white/20 overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: idx === current ? "0%" : "-100%" }}
                  transition={{ duration: idx === current ? 7 : 0.3, ease: "linear" }}
                  className="h-full bg-white"
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}