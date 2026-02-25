"use client";

import { MoveRight, ArrowDown, Link } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-neutral-100">
      {/* Cinematic Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-neutral-100">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000"
          alt="Brand Aesthetic"
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] opacity-90 scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 text-center text-white px-6">
          <span className="text-[10px] uppercase tracking-[0.6em] mb-8 block opacity-80 animate-fade-in">
            Established MMXXIV
          </span>
          <h1 className="text-6xl md:text-9xl font-extralight tracking-tighter leading-none mb-12 italic serif">
            The Art of <br /> Persistence
          </h1>
          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 stroke-[1px] animate-bounce opacity-50" />
          </div>
        </div>
      </section>

      {/* The Manifesto - Centered & Powerful */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-bold mb-12">
            Our Philosophy
          </h2>
          <p className="text-3xl md:text-5xl font-light tracking-tight leading-[1.2] italic serif text-neutral-800">
            "We believe that a garment should be more than a trend. It is a
            vessel for memory, a sculpture for the body, and a commitment to the
            earth."
          </p>
        </div>
      </section>

      {/* Section 01: Craftsmanship (Image Left, Text Right) */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-[3/4] group">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200"
              alt="Tailoring detail"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-neutral-50 -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4" />
          </div>
          <div className="space-y-8 lg:pl-12">
            <span className="text-xs font-bold tracking-widest text-neutral-300">
              01 / ARCHITECTURAL INTEGRITY
            </span>
            <h3 className="text-4xl font-light tracking-tighter italic serif">
              Engineered, not just sewn.
            </h3>
            <p className="text-neutral-500 font-light leading-relaxed text-lg">
              Every seam is a calculated decision. We work with family-owned
              ateliers in Italy and Portugal, combining century-old tailoring
              techniques with modern laser-cutting precision. The result is a
              silhouette that retains its structure for a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Section 02: Sustainability (Text Left, Image Right) */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-8 lg:pr-12">
            <span className="text-xs font-bold tracking-widest text-neutral-300">
              02 / RADICAL HONESTY
            </span>
            <h3 className="text-4xl font-light tracking-tighter italic serif">
              Luxury without the footprint.
            </h3>
            <p className="text-neutral-500 font-light leading-relaxed text-lg">
              Transparency is our primary fabric. From GOTS-certified organic
              cotton to recycled cashmere, we trace 100% of our supply chain. We
              don't believe in "collections"—we believe in a continuous
              evolution of essential pieces.
            </p>
            <Link
              href="/sustainability"
              className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-black pb-2 w-fit"
            >
              Read our Impact Report{" "}
              <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[3/4]">
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200"
              alt="Sustainable fibers"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </div>
      </section>

      {/* The Founder / Creative Director Quote */}
      <section className="py-40 px-6 text-center bg-white relative">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 inline-block">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
              alt="Founder Signature"
              className="w-20 h-20 rounded-full object-cover grayscale mb-4 mx-auto"
            />
          </div>
          <p className="text-xl font-light leading-relaxed text-neutral-600 mb-8 tracking-wide">
            "Our goal was never to be the loudest in the room, but the most
            enduring. We design for the individual who finds power in subtlety."
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold">
            Julian V. — Creative Director
          </p>
        </div>
      </section>

      {/* Heritage Grid (3 Images) */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspect-[2/3] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800"
              className="w-full h-full object-cover grayscale hover:scale-110 transition-transform duration-1000"
              alt="Process 1"
            />
          </div>
          <div className="aspect-[2/3] overflow-hidden mt-0 md:mt-12">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800"
              className="w-full h-full object-cover grayscale hover:scale-110 transition-transform duration-1000"
              alt="Process 2"
            />
          </div>
          <div className="aspect-[2/3] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=800"
              className="w-full h-full object-cover grayscale hover:scale-110 transition-transform duration-1000"
              alt="Process 3"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <h2 className="text-4xl md:text-6xl font-extralight tracking-tighter italic serif">
            Experience the <br /> collection.
          </h2>
          <Link
            href="/shop"
            className="px-12 py-6 border border-white/20 hover:bg-white hover:text-black transition-all duration-500 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            Shop the Archive
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
