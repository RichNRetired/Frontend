import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-[#f1e6f2] overflow-hidden">
      <div className="container mx-auto px-6 py-10 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* LEFT CONTENT */}
          <div>
            <span className="text-sm uppercase tracking-widest text-gray-600">
              Big Sale
            </span>

            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
              Up To 50% Off <br />
              <span className="font-light">Trendy Fashion</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg max-w-md">
              Free Shipping — Don’t miss the deal. Discover premium fashion for
              every season.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/men"
                className="px-8 py-3 bg-black text-white text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition"
              >
                Shop Men
              </Link>

              <Link
                href="/women"
                className="px-8 py-3 border border-black text-black text-sm font-medium uppercase tracking-wide hover:bg-black hover:text-white transition"
              >
                Shop Women
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-[420px] md:h-[520px]">
            <Image
              src="/slide-3-home4-1 - Copy.jpg" // replace with your image
              alt="Fashion Model"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
