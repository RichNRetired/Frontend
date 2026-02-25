"use client";

import { MoveRight, Globe, Zap, Heart, Star, Users } from "lucide-react";
import Link from "next/link";

const departments = [
  { name: "Atelier & Design", roles: 2, location: "Paris / Remote" },
  { name: "Digital Experience", roles: 4, location: "London" },
  { name: "Brand Editorial", roles: 1, location: "New York" },
  { name: "Retail Operations", roles: 6, location: "Global" },
];

const values = [
  {
    title: "Sartorial Excellence",
    description:
      "We don't just create garments; we engineer silhouettes that stand the test of time.",
    icon: <Star className="w-5 h-5 stroke-[1px]" />,
  },
  {
    title: "Radical Transparency",
    description:
      "From our supply chain to our studio culture, honesty is our primary thread.",
    icon: <Globe className="w-5 h-5 stroke-[1px]" />,
  },
  {
    title: "The Human Element",
    description:
      "Technology powers us, but human intuition and craftsmanship define us.",
    icon: <Heart className="w-5 h-5 stroke-[1px]" />,
  },
];

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-neutral-100">
      {/* Hero Section - The Manifesto */}
      <section className="pt-48 pb-32 px-6 bg-[#0a0a0a] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000"
            alt="Atelier workspace"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 font-bold mb-8 block">
            Join the Atelier
          </span>
          <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter leading-[0.9] mb-12 max-w-4xl">
            Building the future of <br />
            <span className="italic serif text-neutral-400">
              conscious luxury.
            </span>
          </h1>
          <p className="max-w-xl text-neutral-400 font-light text-lg leading-relaxed mb-12">
            We are looking for rebels, artisans, and thinkers who believe that
            fashion should be as enduring as the memories made in it.
          </p>
          <button className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold border border-white/20 px-10 py-5 hover:bg-white hover:text-black transition-all duration-500">
            View Openings{" "}
            <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            {values.map((value, idx) => (
              <div key={idx} className="flex flex-col space-y-8">
                <div className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-light tracking-tight italic serif">
                  {value.title}
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed tracking-wide">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles - The "Gallery" Layout */}
      <section className="py-32 bg-neutral-50 border-y border-neutral-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-6">
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tighter italic serif">
              Opportunities
            </h2>
            <div className="flex gap-8">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 underline decoration-black underline-offset-8">
                All Roles
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-300 hover:text-neutral-500 cursor-pointer transition-colors">
                Design
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-300 hover:text-neutral-500 cursor-pointer transition-colors">
                Tech
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {departments.map((dept, idx) => (
              <Link
                href={`/careers/${dept.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={idx}
                className="group block bg-white border border-neutral-100 p-10 md:p-16 hover:border-black transition-all duration-700 ease-out relative overflow-hidden"
              >
                {/* Background Text Effect on Hover */}
                <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 text-[12vw] font-bold text-neutral-50 opacity-0 group-hover:opacity-100 group-hover:right-[2%] transition-all duration-1000 pointer-events-none uppercase">
                  {dept.name.split(" ")[0]}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-400 mb-2 block">
                      {dept.location}
                    </span>
                    <h4 className="text-3xl md:text-4xl font-light tracking-tight group-hover:italic transition-all duration-500">
                      {dept.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-light tracking-widest text-neutral-500 uppercase">
                      {dept.roles} Open Positions
                    </span>
                    <div className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                      <MoveRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Teaser */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
              alt="Team collaboration"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out scale-110"
            />
          </div>
          <div className="space-y-10">
            <h2 className="text-xs uppercase tracking-[0.6em] text-neutral-400 font-bold">
              Life at the Atelier
            </h2>
            <h3 className="text-5xl font-extralight tracking-tighter leading-tight italic serif">
              A collective of <br /> creative minds.
            </h3>
            <p className="text-lg text-neutral-500 font-light leading-relaxed">
              We operate at the intersection of heritage and innovation. Our
              offices are designed as open sanctuaries—spaces that foster deep
              work, spontaneous dialogue, and the pursuit of perfection.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-10">
              <div>
                <p className="text-3xl font-light mb-2">32</p>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Nationalities
                </p>
              </div>
              <div>
                <p className="text-3xl font-light mb-2">4</p>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Global Hubs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#111] text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-light italic serif mb-10">
            Start your journey.
          </h2>
          <p className="text-neutral-500 font-light mb-12">
            Don't see a role that fits? We are always seeking exceptional talent
            for our talent pool.
          </p>
          <a
            href="mailto:careers@brand.com"
            className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-neutral-700 pb-2 hover:border-white transition-colors"
          >
            Spontaneous Application
          </a>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
