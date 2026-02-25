import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    name: "Acme",
    logo: "/brands/acme.svg",
    url: "/shop?brand=acme",
  },
  {
    name: "Minimal",
    logo: "/brands/minimal.svg",
    url: "/shop?brand=minimal",
  },
  {
    name: "Urban",
    logo: "/brands/urban.svg",
    url: "/shop?brand=urban",
  },
  {
    name: "Form",
    logo: "/brands/form.svg",
    url: "/shop?brand=form",
  },
  {
    name: "Studio",
    logo: "/brands/studio.svg",
    url: "/shop?brand=studio",
  },
];

export default function FeaturedBrands() {
  return (
    <section className="py-20 bg-white border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-10 uppercase text-neutral-700">
          Featured Brands
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.url}
              className="group flex flex-col items-center gap-2 hover:opacity-80 transition"
            >
              <div className="w-32 h-16 flex items-center justify-center relative">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
              <span className="text-xs text-neutral-500 group-hover:text-black tracking-widest uppercase">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
