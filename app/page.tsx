"use client";

import Link from "next/link";
import { ProductCard } from "../components/product/ProductCard";
import HeroSection from "@/components/layout/Hero";

const featuredProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 1299,
    originalPrice: 1799,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    category: "men",
    isNew: true,
  },
  {
    id: "2",
    name: "Floral Summer Dress",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    category: "women",
    isOnSale: true,
  },
  {
    id: "3",
    name: "Cozy Kids Hoodie",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1503944168849-c1246463e59?w=400&h=500&fit=crop",
    category: "kids",
    isNew: true,
  },
  {
    id: "4",
    name: "Classic Denim Jacket",
    price: 3999,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=500&fit=crop",
    category: "men",
    isOnSale: true,
  },
];

const categories = [
  {
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    href: "/men",
    description: "Contemporary styles for modern men",
  },
  {
    name: "Women",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=400&fit=crop",
    href: "/women",
    description: "Elegant fashion for every occasion",
  },
  {
    name: "Kids",
    image:
      "https://images.unsplash.com/photo-1503944168849-c1246463e59?w=600&h=400&fit=crop",
    href: "/kids",
    description: "Fun and comfortable clothing for children",
  },
  {
    name: "Sale",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop",
    href: "/sale",
    description: "Up to 70% off on selected items",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span className="font-medium">Free Shipping</span>
            </div>
            <div className="hidden md:block text-pink-200">|</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">↩️</span>
              <span className="font-medium">30-Day Returns</span>
            </div>
            <div className="hidden md:block text-pink-200">|</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="font-medium">Secure Payment</span>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that define this season's must-haves
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  isNew={product.isNew}
                  isOnSale={product.isOnSale}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/men"
              className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our curated collections
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter Signup */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stay in Style
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get exclusive access to new arrivals, sales, and style tips
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-6 py-4 rounded-full
               border border-white bg-transparent
               text-white placeholder:text-white/70
               focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-full font-semibold transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
