"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/slide-1-home4-1 - Copy.jpg",
    subtitle: "New Collection",
    title: "New Collection\nEdit",
    description: "Relaxed layering for the golden hour.",
    button: "Shop Now",
    link: "/shop?collection=sundowner",
    align: "center",
  },
  {
    image: "/slide-2-home4-1 - Copy.jpg",
    subtitle: "Spring / Summer 2026",
    title: "The Art of\nMinimalism",
    description: "Timeless forms, conscious materials.",
    button: "Explore",
    link: "/shop?collection=minimalism",
    align: "left",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] md:h-[90vh] w-full bg-neutral-100 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt="Hero Banner"
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pointer-events-auto">
          <div
            className={`flex flex-col max-w-xl text-white ${
              slide.align === "center"
                ? "mx-auto text-center items-center"
                : "text-left items-start"
            }`}
          >
            <motion.span
              key={`sub-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[11px] md:text-[13px] tracking-[0.3em] uppercase font-bold text-white/90 mb-4 bg-black/20 backdrop-blur-sm px-3 py-1 inline-block w-fit rounded-sm"
            >
              {slide.subtitle}
            </motion.span>

            <motion.h1
              key={`title-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[42px] md:text-[72px] lg:text-[80px] font-serif leading-[0.95] mb-6 drop-shadow-sm whitespace-pre-line"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              key={`desc-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg font-light text-white/90 mb-10 tracking-wide drop-shadow-sm max-w-sm"
            >
              {slide.description}
            </motion.p>

            <motion.div
              key={`btn-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href={slide.link}
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
              >
                {slide.button}
                <ChevronRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
