"use client";

import Image from "next/image";
import Link from "next/link";

const campaigns = [
  {
    title: "The Linen Edit",
    description: "Breathable luxury for the season transition.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    link: "/shop?collection=linen",
    btn: "Shop Collection",
  },
  {
    title: "Latest Collection",
    description: "Sophisticated silhouettes for after hours.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
    link: "/shop?collection=evening",
    btn: "Explore Editorial",
  },
];

export default function CampaignBanners() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {campaigns.map((camp, idx) => (
            <div
              key={idx}
              className="group relative h-[500px] md:h-[600px] w-full overflow-hidden"
            >
              <Image
                src={camp.image}
                alt={camp.title}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start text-white">
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold mb-3 opacity-90">
                  New Campaign
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-light mb-3">
                  {camp.title}
                </h3>
                <p className="text-sm md:text-base font-light text-white/90 mb-8 max-w-sm leading-relaxed">
                  {camp.description}
                </p>
                <Link
                  href={camp.link}
                  className="bg-white text-black px-8 py-3.5 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors"
                >
                  {camp.btn}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
