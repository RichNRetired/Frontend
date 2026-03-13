"use client";

import { useRef } from "react";
import Link from "next/link";
import { ProductCard } from "../components/product/ProductCard";
import HeroSection from "@/components/layout/Hero";
import FeaturedBrands from "@/components/layout/FeaturedBrands";
import QuickCategories from "@/components/layout/QuickCategories";
import CampaignBanners from "@/components/layout/CampaignBanners";
import {
  MoveRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useBestSellers,
  useFeaturedProducts,
  useNewArrivals,
  useProducts,
} from "@/hooks/useProducts";
import { useGetSectionsQuery } from "@/features/category/categoryApi";

export default function Home() {
  const { data: sectionsData = [], isLoading: sectionsLoading } =
    useGetSectionsQuery();
  const { data: productsResp, isLoading: productsLoading } = useProducts();
  const { data: newArrivalsResp, isLoading: newArrivalsLoading } =
    useNewArrivals(0, 10);
  const { data: bestSellersResp, isLoading: bestSellersLoading } =
    useBestSellers(0, 10);
  const { data: featuredResp, isLoading: featuredLoading } =
    useFeaturedProducts(0, 10);
  const trendingRailRef = useRef<HTMLDivElement>(null);

  const scrollTrending = (direction: "left" | "right") => {
    if (!trendingRailRef.current) return;
    const amount = 340;
    trendingRailRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const sectionDescriptions: Record<string, string> = {
    men: "Minimalist Essentials",
    women: "Seasonal curation",
    kids: "Comfort & Play",
    sale: "Last chance pieces",
  };

  const categories = sectionsData.map((section) => {
    const originalSlug = section.name.toLowerCase();
    const slug =
      originalSlug === "girl" ||
        originalSlug === "girls" ||
        originalSlug === "women" ||
        originalSlug === "womens"
        ? "women"
        : originalSlug;
    const displayName =
      originalSlug === "girl" ||
        originalSlug === "girls" ||
        originalSlug === "women" ||
        originalSlug === "womens"
        ? "Women"
        : section.name;
    return {
      id: section.id,
      name: displayName,
      href: `/shop?section=${slug}`,
      image: section.imageUrl,
      description: sectionDescriptions[slug] || "New Collection",
    };
  });

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-neutral-900">
      <HeroSection />

      {/* New Quick Categories (Like Reference) */}
      <QuickCategories />

      <CampaignBanners />

      {/* Trending Now Section */}
      <section className="py-16 md:py-20 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
              Trending Now
            </h2>
            <p className="mt-3 text-xl md:text-2xl font-light text-neutral-800 tracking-wide">
              Based On Your Recent Activity
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollTrending("left")}
              className="absolute -left-3 top-1/2 z-10 hidden md:flex -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white/90 text-neutral-700 shadow-sm hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={trendingRailRef}
              className="overflow-x-auto no-scrollbar scroll-smooth py-2"
            >
              <div className="flex gap-5 min-w-max">
                {(productsResp?.content || [])
                  .slice(0, 10)
                  .map((product: any) => (
                    <div key={product.id} className="w-64 shrink-0">
                      <ProductCard
                        {...product}
                        images={[
                          ...(Array.isArray(product.images) ? product.images : []),
                          product.main_image,
                          product.thumbnail_image,
                          product.medium_image,
                        ].filter(Boolean)}
                        image={
                          product.main_image ||
                          product.thumbnail_image ||
                          product.medium_image
                        }
                        originalPrice={product.mrp}
                        isOnSale={!!product.discount_percent}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollTrending("right")}
              className="absolute -right-3 top-1/2 z-10 hidden md:flex -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white/90 text-neutral-700 shadow-sm hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-8">
        <div className="max-w-7xl mx-auto px-0 md:px-6">
          <div className="relative overflow-hidden bg-black aspect-video md:rounded-sm">
            <video
              className="h-full w-full object-cover"
              src="https://s7ap1.scene7.com/is/content/adityabirlafashion/videoSpring%20SS26?wid=1366&hei=670px"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-8 sm:py-15 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4">
                New Arrivals
              </h2>
              <p className="text-neutral-500 font-light leading-relaxed">
                Fresh drops curated from our latest collection.
              </p>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase border-b border-black pb-1"
            >
              View All
              <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16 sm:gap-x-8">
            {newArrivalsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-neutral-50 h-96 w-full"
                />
              ))
              : (newArrivalsResp?.content || [])
                .slice(0, 8)
                .map((product: any) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    images={[
                      ...(Array.isArray(product.images) ? product.images : []),
                      product.main_image,
                      product.thumbnail_image,
                      product.medium_image,
                    ].filter(Boolean)}
                    image={
                      product.main_image ||
                      product.thumbnail_image ||
                      product.medium_image
                    }
                    originalPrice={product.mrp}
                    isOnSale={!!product.discount_percent}
                    isNew
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4  serif">
                Our Featured Collection
              </h2>
              <p className="text-neutral-500 font-light leading-relaxed">
                Modern essentials designed for versatility and longevity.
              </p>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase border-b border-black pb-1"
            >
              Explore Archive{" "}
              <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          {/* Product Grid Render */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16 sm:gap-x-8">
            {featuredLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-neutral-50 h-90 w-full"
                />
              ))
              : (featuredResp?.content || []).map((product: any) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  images={[
                    ...(Array.isArray(product.images) ? product.images : []),
                    product.main_image,
                    product.thumbnail_image,
                    product.medium_image,
                  ].filter(Boolean)}
                  image={
                    product.main_image ||
                    product.thumbnail_image ||
                    product.medium_image
                  }
                  originalPrice={product.mrp}
                  isOnSale={!!product.discount_percent}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 sm:py-10 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4">
                Best Sellers
              </h2>
              <p className="text-neutral-500 font-light leading-relaxed">
                Most loved products chosen by our shoppers.
              </p>
            </div>

            <Link
              href="/shop"
              className="group flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase border-b border-black pb-1"
            >
              Shop Best Sellers
              <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16 sm:gap-x-8">
            {bestSellersLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white h-56 w-full" />
              ))
              : (bestSellersResp?.content || [])
                .slice(0, 8)
                .map((product: any) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    images={[
                      ...(Array.isArray(product.images) ? product.images : []),
                      product.main_image,
                      product.thumbnail_image,
                      product.medium_image,
                    ].filter(Boolean)}
                    image={
                      product.main_image ||
                      product.thumbnail_image ||
                      product.medium_image
                    }
                    originalPrice={product.mrp}
                    isOnSale={!!product.discount_percent}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Newsletter - visually enhanced */}
      <section className="relative bg-[#0a0a0a] text-white py-32 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6">
            The Inner Circle
          </h2>
          <p className="text-neutral-300 font-light mb-12 tracking-wide text-sm">
            Join for private invitations and early collection access.
          </p>
          <form className="flex flex-col sm:flex-row gap-0 border-b border-neutral-700 pb-2 focus-within:border-white transition-colors group bg-black/10 rounded-lg">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="flex-1 px-2 py-4 bg-transparent outline-none text-[10px] tracking-[0.3em] placeholder:text-neutral-500 uppercase"
              required
            />
            <button className="px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-neutral-400 transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        {/* Trust Bar integrated into footer area */}
        <div className="mt-20 border-t border-neutral-800 pt-10">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-neutral-500 italic">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 stroke-[1px]" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
                Free Shipping
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 stroke-[1px]" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
                Easy Returns
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 stroke-[1px]" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
                Secure Payment
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
