"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-neutral-900 font-sans antialiased selection:bg-neutral-200">
      {/* Ultra-Minimal Header */}
      <header className="pt-64 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[9px] uppercase tracking-[0.8em] text-neutral-400 font-medium mb-6 block animate-fade-in">
            Liaison
          </span>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase mb-8">
            Contact{" "}
            <span className="italic serif lowercase tracking-normal">the</span>{" "}
            Atelier
          </h1>
          <div className="w-px h-24 bg-neutral-200 mx-auto mt-12 animate-grow-y" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-24 lg:gap-x-12">
          {/* Left Column: Essential Contact */}
          <div className="lg:col-span-4 space-y-24">
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-10">
                Correspondence
              </h2>
              <div className="space-y-8">
                <div className="group transition-all">
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                    Global Concierge
                  </p>
                  <a
                    href="mailto:concierge@atelier.com"
                    className="text-lg font-light hover:italic transition-all duration-300 border-b border-transparent hover:border-neutral-200 pb-1"
                  >
                    concierge@atelier.com
                  </a>
                </div>
                <div className="group">
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 mb-1">
                    Private Client Suite
                  </p>
                  <p className="text-lg font-light">+1 800 555 0199</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-10">
                Residences
              </h2>
              <div className="grid grid-cols-1 gap-12">
                <div className="group">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3">
                    Manhattan
                  </h4>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed tracking-wide">
                    742 Madison Avenue
                    <br />
                    New York, NY 10065
                  </p>
                </div>
                <div className="group">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3">
                    Paris VIII
                  </h4>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed tracking-wide">
                    22 Rue du Faubourg Saint-Honoré
                    <br />
                    75008 Paris, France
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: The Inquiry Form - Elevated */}
          <div className="lg:col-span-7 lg:col-start-6">
            <section className="bg-white p-1 md:p-12 lg:p-20 border border-neutral-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="max-w-lg">
                <h3 className="text-xl font-light tracking-widest uppercase mb-12">
                  Digital Inquiry
                </h3>
                <form className="space-y-12">
                  <div className="relative group">
                    <label className="text-[8px] uppercase tracking-[0.4em] text-neutral-400 mb-2 block">
                      Identity
                    </label>
                    <input
                      type="text"
                      placeholder="YOUR FULL NAME"
                      className="w-full bg-transparent border-b border-neutral-100 py-3 outline-none focus:border-black transition-all text-[10px] tracking-[0.2em] uppercase placeholder:text-neutral-200"
                    />
                  </div>

                  <div className="relative group">
                    <label className="text-[8px] uppercase tracking-[0.4em] text-neutral-400 mb-2 block">
                      Contact
                    </label>
                    <input
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      className="w-full bg-transparent border-b border-neutral-100 py-3 outline-none focus:border-black transition-all text-[10px] tracking-[0.2em] uppercase placeholder:text-neutral-200"
                    />
                  </div>

                  <div className="relative group">
                    <label className="text-[8px] uppercase tracking-[0.4em] text-neutral-400 mb-2 block">
                      Nature of Inquiry
                    </label>
                    <select className="w-full bg-transparent border-b border-neutral-100 py-3 outline-none focus:border-black transition-all text-[10px] tracking-[0.2em] uppercase text-neutral-400 appearance-none rounded-none cursor-pointer">
                      <option>Select Intent</option>
                      <option>Sartorial Consultation</option>
                      <option>Bespoke Commissions</option>
                      <option>Order Orchestration</option>
                    </select>
                  </div>

                  <div className="relative group">
                    <label className="text-[8px] uppercase tracking-[0.4em] text-neutral-400 mb-2 block">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="HOW MAY WE ASSIST?"
                      className="w-full bg-transparent border-b border-neutral-100 py-3 outline-none focus:border-black transition-all text-[10px] tracking-[0.2em] uppercase placeholder:text-neutral-200 resize-none"
                    />
                  </div>

                  <button className="flex items-center gap-6 text-[9px] uppercase tracking-[0.5em] font-bold group">
                    <span className="border-b border-black pb-1 group-hover:pr-4 transition-all duration-500">
                      Dispatch
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[1px] group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Atmospheric Footer Image */}
      <section className="relative h-[80vh] overflow-hidden group">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-1000 z-10" />
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000"
          alt="Atelier Atmosphere"
          className="w-full h-full object-cover grayscale transition-transform duration-[3000ms] group-hover:scale-110"
        />
        <div className="absolute bottom-12 right-12 z-20">
          <p className="text-white text-[9px] uppercase tracking-[0.6em] font-bold opacity-50">
            Paris Studio, 2026
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
