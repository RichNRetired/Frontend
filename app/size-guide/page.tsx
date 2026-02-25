"use client";

import { useState } from "react";
import { Ruler, Info, ChevronRight, Maximize2 } from "lucide-react";

const sizeData = {
  tops: {
    title: "Tops & Outerwear",
    headers: ["Size", "Chest (in)", "Waist (in)", "Sleeve (in)"],
    rows: [
      ["XS", "34 - 36", "28 - 30", "32"],
      ["S", "36 - 38", "30 - 32", "33"],
      ["M", "38 - 40", "32 - 34", "34"],
      ["L", "40 - 42", "34 - 36", "35"],
      ["XL", "42 - 44", "36 - 38", "36"],
    ],
  },
  bottoms: {
    title: "Trousers & Denim",
    headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
    rows: [
      ["28", "28", "34", "32"],
      ["30", "30", "36", "32"],
      ["32", "32", "38", "33"],
      ["34", "34", "40", "33"],
      ["36", "36", "42", "34"],
    ],
  },
};

const SizeGuidePage = () => {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [activeTab, setActiveTab] = useState<keyof typeof sizeData>("tops");

  // Simple conversion logic for display
  const convert = (val: string) => {
    if (unit === "in") return val;
    return val.replace(/\d+/g, (m) =>
      Math.round(parseInt(m) * 2.54).toString(),
    );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="max-w-3xl mb-20">
          <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-bold mb-4 block">
            Fit & Measurement
          </span>
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter italic serif mb-8">
            The Size Guide
          </h1>
          <p className="text-neutral-500 font-light leading-relaxed tracking-wide text-lg">
            Our silhouettes are engineered for a deliberate drape. Use this
            guide to ensure your selection aligns perfectly with your
            proportions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Left: How to Measure (Visual) */}
          <div className="lg:col-span-4 space-y-12">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-neutral-100 pb-4">
              How to Measure
            </h2>

            <div className="space-y-8">
              <div className="group">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  01. Chest <Info className="w-3 h-3 text-neutral-300" />
                </h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Measure around the fullest part of your chest, keeping the
                  tape horizontal under the arms.
                </p>
              </div>
              <div className="group">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                  02. Waist
                </h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Measure around your natural waistline, where your trousers
                  usually sit.
                </p>
              </div>
              <div className="group">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-2">
                  03. Sleeve
                </h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Measure from the center back of your neck, across the
                  shoulder, and down to the wrist.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interaction & Tables */}
          <div className="lg:col-span-8">
            <div className="bg-neutral-50 p-1 border border-neutral-100 mb-12 flex justify-between items-center">
              <div className="flex">
                {Object.keys(sizeData).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${
                      activeTab === key
                        ? "bg-white shadow-sm text-black"
                        : "text-neutral-400"
                    }`}
                  >
                    {sizeData[key as keyof typeof sizeData].title}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-4 px-4">
                <button
                  onClick={() => setUnit("in")}
                  className={`text-[10px] font-bold ${unit === "in" ? "text-black underline underline-offset-4" : "text-neutral-300"}`}
                >
                  IN
                </button>
                <div className="w-[1px] h-3 bg-neutral-200" />
                <button
                  onClick={() => setUnit("cm")}
                  className={`text-[10px] font-bold ${unit === "cm" ? "text-black underline underline-offset-4" : "text-neutral-300"}`}
                >
                  CM
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200">
                    {sizeData[activeTab].headers.map((header, i) => (
                      <th
                        key={header}
                        className={`py-6 text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 ${i === 0 ? "" : "text-right"}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {sizeData[activeTab].rows.map((row, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-neutral-50/50 transition-colors"
                    >
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`py-8 text-sm font-light tracking-wide ${j === 0 ? "font-bold text-black" : "text-neutral-600 text-right"}`}
                        >
                          {j === 0 ? cell : convert(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Global Conversions Footnote */}
            <div className="mt-16 p-8 border border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 stroke-[1px] text-neutral-400" />
                <p className="text-xs text-neutral-500 font-light italic">
                  Looking for International conversions (EU, UK, JP)?
                </p>
              </div>
              <button className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-all">
                View Global Chart
              </button>
            </div>
          </div>
        </div>

        {/* The Fit Philosophy Section */}
        <section className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-100 border border-neutral-100">
          <div className="bg-white p-12 md:p-20 space-y-6">
            <Maximize2 className="w-6 h-6 stroke-[1px] mb-4" />
            <h3 className="text-3xl font-light italic serif">
              The Relaxed Silhouette
            </h3>
            <p className="text-neutral-500 font-light leading-relaxed">
              Our signature cut features a dropped shoulder and an elongated
              body. This is intended to create a fluid movement. If you prefer a
              tailored, close-to-body feel, we recommend selecting one size
              smaller than your standard measurement.
            </p>
          </div>
          <div className="bg-white p-12 md:p-20 space-y-6">
            <Ruler className="w-6 h-6 stroke-[1px] mb-4" />
            <h3 className="text-3xl font-light italic serif">
              Bespoke Guidance
            </h3>
            <p className="text-neutral-500 font-light leading-relaxed">
              Unsure of your proportions? Our sartorial consultants are
              available for virtual fittings and detailed garment measurements
              via our private client portal.
            </p>
            <button className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold pt-4">
              Consult Concierge <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const Globe = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default SizeGuidePage;
