"use client";

import Link from "next/link";
import { ProductCard } from "../components/product/ProductCard";
import HeroSection from "@/components/layout/Hero";
import {
  MoveRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";

// Types for better DX
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 1299,
    originalPrice: 1799,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "men",
    isNew: true,
  },
  {
    id: "2",
    name: "Floral Summer Dress",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    category: "women",
    isOnSale: true,
  },
  {
    id: "3",
    name: "Cozy Kids Hoodie",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1503944168849-c1246463e59?w=800&q=80",
    category: "kids",
    isNew: true,
  },
  {
    id: "4",
    name: "Classic Denim Jacket",
    price: 3999,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80",
    category: "men",
    isOnSale: true,
  },
];

export default function Home() {
  const { data: categoriesData = [] } = useGetCategoriesQuery();

  // Map API categories with display properties
  const categoryImages: Record<string, { image: string; description: string }> =
    {
      men: {
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        description: "Minimalist Essentials",
      },
      women: {
        image:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
        description: "Seasonal curation",
      },
      kids: {
        image:
          "https://images.unsplash.com/photo-1503944168849-c1246463e59?w=800&q=80",
        description: "Comfort & Play",
      },
      sale: {
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
        description: "Last chance pieces",
      },
    };

  const categories = categoriesData.map((cat) => {
    const slug = cat.name.toLowerCase();
    const categoryInfo = categoryImages[slug] || {
      image:
        "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&q=80",
      description: "New Collection",
    };
    return {
      name: cat.name,
      href: `/${slug}`,
      ...categoryInfo,
    };
  });
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-neutral-900">
      <HeroSection />

      {/* Trust Bar - More Minimalist */}
      <section className="border-y border-neutral-100 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex items-center justify-center gap-4 group">
              <Truck className="w-5 h-5 stroke-[1.5px] text-neutral-500 group-hover:text-black transition-colors" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium">
                Complimentary Shipping
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 group border-neutral-200 md:border-x">
              <RotateCcw className="w-5 h-5 stroke-[1.5px] text-neutral-500 group-hover:text-black transition-colors" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium">
                30-Day Returns Policy
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 group">
              <ShieldCheck className="w-5 h-5 stroke-[1.5px] text-neutral-500 group-hover:text-black transition-colors" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium">
                Verified Security
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                The Editorial Selection
              </h2>
              <p className="text-neutral-500 font-light leading-relaxed">
                A selection of modern essentials designed for versatility and
                longevity.
              </p>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-sm font-semibold tracking-widest uppercase border-b border-black pb-1"
            >
              Explore All{" "}
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
            {
              // hook at top-level of component
            }
            {(() => {
              // move hook here to top of component body is required by rules of hooks;
              // useProducts is already imported; call it here and render based on state
              const { data: productsResp, isLoading, isError } = useProducts();
              if (isLoading) {
                return Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="flex flex-col animate-pulse"
                  >
                    <div className="bg-neutral-100 h-56 mb-4" />
                    <div className="h-4 bg-neutral-100 w-3/4 mb-2" />
                    <div className="h-4 bg-neutral-100 w-1/4" />
                  </div>
                ));
              }

              if (isError) {
                return (
                  <div className="col-span-2 lg:col-span-4 text-center text-red-500">
                    Failed to load products.
                  </div>
                );
              }

              const list = productsResp?.content?.length
                ? productsResp.content
                : featuredProducts;
              return list.map((product: any) => (
                <div key={product.id} className="flex flex-col">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.mrp}
                    images={product.images}
                    isOnSale={!!product.discount_percent}
                  />
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Categories - Zara Style Grid */}
      <section className="pb-24 sm:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-12 text-center text-neutral-400">
            Discover More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative aspect-[3/4] overflow-hidden bg-neutral-100"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] mb-1 opacity-80">
                        {category.description}
                      </p>
                      <h3 className="text-2xl font-light tracking-wide italic">
                        {category.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Sophisticated & Clean */}
      <section className="bg-[#1a1a1a] text-white py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
            Join the Inner Circle
          </h2>
          <p className="text-neutral-400 font-light mb-10 leading-relaxed tracking-wide">
            Subscribe to receive private sale invitations, early access to new
            collections, and sartorial inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-0 border-b border-neutral-700 pb-2 focus-within:border-white transition-colors">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 px-2 py-4 bg-transparent outline-none text-sm tracking-widest placeholder:text-neutral-600 uppercase"
              required
            />
            <button className="px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:text-neutral-400 transition-colors">
              Subscribe
            </button>
          </form>
          <p className="mt-6 text-[10px] text-neutral-500 uppercase tracking-widest leading-loose">
            By signing up, you agree to our Privacy Policy. <br /> You can
            unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
