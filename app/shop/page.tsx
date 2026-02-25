"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import {
  useGetFilterOptionsQuery,
  useGetProductsByLocationQuery,
} from "@/features/product/productApi";

type PriceFilter = "all" | "under1000" | "1000to2000" | "above2000";
type SortFilter = "featured" | "priceLowToHigh" | "priceHighToLow" | "discount";

const sectionTitle: Record<string, string> = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  sale: "Sale",
  all: "Shop",
};

const aliases: Record<string, string> = {
  mens: "men",
  men: "men",
  womens: "women",
  women: "women",
  kid: "kids",
  kids: "kids",
  sale: "sale",
  all: "all",
};

const allowedPriceFilters: PriceFilter[] = [
  "all",
  "under1000",
  "1000to2000",
  "above2000",
];

const allowedSortFilters: SortFilter[] = [
  "featured",
  "priceLowToHigh",
  "priceHighToLow",
  "discount",
];

const DEFAULT_LOCATION_ID = Number(
  process.env.NEXT_PUBLIC_DEFAULT_LOCATION_ID || 1,
);

const mapSortBy = (sortBy: SortFilter): string | undefined => {
  if (sortBy === "priceLowToHigh") return "priceAsc";
  if (sortBy === "priceHighToLow") return "priceDesc";
  if (sortBy === "discount") return "discount";
  return undefined;
};

const getPriceRange = (
  selectedPrice: PriceFilter,
): { minPrice?: number; maxPrice?: number } => {
  if (selectedPrice === "under1000") return { maxPrice: 999 };
  if (selectedPrice === "1000to2000") return { minPrice: 1000, maxPrice: 2000 };
  if (selectedPrice === "above2000") return { minPrice: 2001 };
  return {};
};

const cleanList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const pickFilterOptions = (options: Record<string, unknown> | undefined) => {
  if (!options) return { brands: [], sizes: [], colors: [] };

  return {
    brands: cleanList(options.brands || options.brand),
    sizes: cleanList(options.sizes || options.size),
    colors: cleanList(options.colors || options.color),
  };
};

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasHydratedFromUrl = useRef(false);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const [sortBy, setSortBy] = useState<SortFilter>("featured");

  const requestedSection = (searchParams.get("section") || "all").toLowerCase();
  const section = aliases[requestedSection] || "all";

  const locationId = useMemo(() => {
    const value = Number(searchParams.get("locationId") || DEFAULT_LOCATION_ID);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_LOCATION_ID;
  }, [searchParams]);

  const { minPrice, maxPrice } = getPriceRange(selectedPrice);

  const {
    data: productsResp,
    isLoading,
    isFetching,
  } = useGetProductsByLocationQuery({
    locationId,
    page: 0,
    limit: 24,
    sortBy: mapSortBy(sortBy),
    minPrice,
    maxPrice,
    brand: selectedBrand || undefined,
    size: selectedSize || undefined,
    color: selectedColor || undefined,
  });

  const { data: filterOptionsResp } = useGetFilterOptionsQuery({});

  const products = productsResp?.content || [];

  const derivedBrands = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.brand).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const derivedSizes = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .flatMap((product) => product.variants || [])
            .map((variant) => variant.size)
            .filter(Boolean),
        ),
      ),
    [products],
  );

  const derivedColors = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .flatMap((product) => product.variants || [])
            .map((variant) => variant.color)
            .filter(Boolean),
        ),
      ),
    [products],
  );

  const filterOptions = pickFilterOptions(
    (filterOptionsResp as Record<string, unknown> | undefined) || undefined,
  );

  const availableBrands = filterOptions.brands.length
    ? filterOptions.brands
    : derivedBrands;
  const availableSizes = filterOptions.sizes.length
    ? filterOptions.sizes
    : derivedSizes;
  const availableColors = filterOptions.colors.length
    ? filterOptions.colors
    : derivedColors;

  const clearAllFilters = () => {
    setSelectedBrand(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedPrice("all");
    setSortBy("featured");
  };

  useEffect(() => {
    const brand = searchParams.get("brand");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const priceParam = searchParams.get("price") as PriceFilter | null;
    const sortParam = searchParams.get("sort") as SortFilter | null;

    setSelectedBrand(brand || null);
    setSelectedSize(size || null);
    setSelectedColor(color || null);
    setSelectedPrice(
      priceParam && allowedPriceFilters.includes(priceParam)
        ? priceParam
        : "all",
    );
    setSortBy(
      sortParam && allowedSortFilters.includes(sortParam)
        ? sortParam
        : "featured",
    );

    hasHydratedFromUrl.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!hasHydratedFromUrl.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (selectedBrand) params.set("brand", selectedBrand);
    else params.delete("brand");

    if (selectedSize) params.set("size", selectedSize);
    else params.delete("size");

    if (selectedColor) params.set("color", selectedColor);
    else params.delete("color");

    if (selectedPrice !== "all") params.set("price", selectedPrice);
    else params.delete("price");

    if (sortBy !== "featured") params.set("sort", sortBy);
    else params.delete("sort");

    if (locationId !== DEFAULT_LOCATION_ID)
      params.set("locationId", String(locationId));
    else params.delete("locationId");

    const current = searchParams.toString();
    const next = params.toString();

    if (current === next) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [
    selectedBrand,
    selectedSize,
    selectedColor,
    selectedPrice,
    sortBy,
    locationId,
    pathname,
    router,
    searchParams,
  ]);

  const isBusy = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-white text-black pt-24 md:pt-28 pb-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 border-b border-neutral-200 pb-5">
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/shop?section=all${locationId ? `&locationId=${locationId}` : ""}`}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                section === "all"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-black hover:text-black"
              }`}
            >
              All Sections
            </Link>
            <Link
              href={`/shop?section=men${locationId ? `&locationId=${locationId}` : ""}`}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                section === "men"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-black hover:text-black"
              }`}
            >
              Men
            </Link>
            <Link
              href={`/shop?section=women${locationId ? `&locationId=${locationId}` : ""}`}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                section === "women"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-black hover:text-black"
              }`}
            >
              Women
            </Link>
            <Link
              href={`/shop?section=kids${locationId ? `&locationId=${locationId}` : ""}`}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                section === "kids"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-black hover:text-black"
              }`}
            >
              Kids
            </Link>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-700"
          >
            Filters <SlidersHorizontal className="h-4 w-4" />
          </button>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            {products.length} Products
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6 rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.24em]">
                  Filters
                </h2>
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 hover:text-black"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                  Sort By
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortFilter)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="discount">Discount</option>
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                  Price
                </p>
                {[
                  { key: "all", label: "All Prices" },
                  { key: "under1000", label: "Under ₹1000" },
                  { key: "1000to2000", label: "₹1000 - ₹2000" },
                  { key: "above2000", label: "Above ₹2000" },
                ].map((priceOption) => (
                  <label
                    key={priceOption.key}
                    className="flex items-center gap-2 text-sm text-neutral-700"
                  >
                    <input
                      type="radio"
                      name="price-filter"
                      checked={selectedPrice === priceOption.key}
                      onChange={() =>
                        setSelectedPrice(priceOption.key as PriceFilter)
                      }
                    />
                    {priceOption.label}
                  </label>
                ))}
              </div>

              {!!availableBrands.length && (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Brand
                  </p>
                  <div className="max-h-40 space-y-2 overflow-auto pr-1">
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() =>
                          setSelectedBrand((current) =>
                            current === brand ? null : brand,
                          )
                        }
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          selectedBrand === brand
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-neutral-700 hover:border-black"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!!availableSizes.length && (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize((current) =>
                            current === size ? null : size,
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs uppercase ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!!availableColors.length && (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedColor((current) =>
                            current === color ? null : color,
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs uppercase ${
                          selectedColor === color
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section>
            <div className="mb-4 hidden items-center justify-between lg:flex">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                {products.length} Products
              </p>
            </div>

            {isBusy ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse bg-neutral-100 h-96 w-full"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 transition-opacity duration-300 opacity-100">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.mrp}
                    images={product.images}
                    isOnSale={!!product.discount_percent}
                    isNew={Boolean(product.status?.toLowerCase() === "new")}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-neutral-600">
                No products match the selected filters.
              </div>
            )}
          </section>
        </div>

        <div
          className={`fixed inset-0 z-100 bg-black/30 transition-opacity lg:hidden ${
            isMobileFiltersOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div
            className="absolute inset-0"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div
            className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white p-6 shadow-2xl transition-transform duration-300 ${
              isMobileFiltersOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em]">
                Filters
              </h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto pb-24">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                  Price
                </p>
                {[
                  { key: "all", label: "All Prices" },
                  { key: "under1000", label: "Under ₹1000" },
                  { key: "1000to2000", label: "₹1000 - ₹2000" },
                  { key: "above2000", label: "Above ₹2000" },
                ].map((priceOption) => (
                  <label
                    key={priceOption.key}
                    className="flex items-center gap-2 text-sm text-neutral-700"
                  >
                    <input
                      type="radio"
                      name="mobile-price-filter"
                      checked={selectedPrice === priceOption.key}
                      onChange={() =>
                        setSelectedPrice(priceOption.key as PriceFilter)
                      }
                    />
                    {priceOption.label}
                  </label>
                ))}
              </div>

              {!!availableBrands.length && (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Brand
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() =>
                          setSelectedBrand((current) =>
                            current === brand ? null : brand,
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs uppercase ${
                          selectedBrand === brand
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!!availableSizes.length && (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize((current) =>
                            current === size ? null : size,
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs uppercase ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!!availableColors.length && (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                    Color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedColor((current) =>
                            current === color ? null : color,
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs uppercase ${
                          selectedColor === color
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
              <button
                onClick={clearAllFilters}
                className="rounded-lg border border-neutral-300 px-4 py-3 text-xs uppercase tracking-[0.2em]"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="rounded-lg bg-black px-4 py-3 text-xs uppercase tracking-[0.2em] text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
