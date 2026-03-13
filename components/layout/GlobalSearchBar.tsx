"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useFilterProductsQuery } from "@/features/product/productApi";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product } from "@/features/product/productTypes";

interface GlobalSearchBarProps {
  placeholder?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  /** Called after navigation so the parent can close a menu/overlay */
  onSearch?: () => void;
  autoFocus?: boolean;
}

function getProductImage(product: Product): string | null {
  if (product.thumbnail_image) return product.thumbnail_image;
  if (product.main_image) return product.main_image;
  const primary = product.images?.find((img) => img.isPrimary);
  return primary?.imageUrl ?? product.images?.[0]?.imageUrl ?? null;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  placeholder = "Search",
  inputClassName = "",
  wrapperClassName = "",
  onSearch,
  autoFocus = false,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useFilterProductsQuery(
    { search: debouncedQuery.trim(), limit: 8, page: 0 },
    { skip: !debouncedQuery.trim() },
  );

  const results = data?.content ?? [];

  useEffect(() => {
    setIsOpen(!!debouncedQuery.trim());
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = () => {
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setIsOpen(false);
    onSearch?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate();
  };

  const clearQuery = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${wrapperClassName}`}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center border-b border-transparent focus-within:border-black transition-all pb-0.5"
      >
        <Search
          size={16}
          strokeWidth={1.5}
          className="text-black flex-shrink-0"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          className={`bg-transparent text-black outline-none pl-2 ${inputClassName}`}
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="text-neutral-400 hover:text-black ml-1"
          >
            <X size={12} />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 min-w-[280px] bg-white border border-neutral-100 shadow-xl z-[100]">
          {isFetching ? (
            <div className="px-4 py-3 text-[10px] text-neutral-400 uppercase tracking-[0.2em]">
              Searching…
            </div>
          ) : null}
          {!isFetching && results.length === 0 ? (
            <div className="px-4 py-3 text-[10px] text-neutral-400 uppercase tracking-[0.2em]">
              No results found
            </div>
          ) : null}
          {!isFetching && results.length > 0 && (
            <>
              {results.map((product) => {
                const img = getProductImage(product);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      router.push(`/product/${product.id}-${product.slug}`);
                      setQuery("");
                      setIsOpen(false);
                      onSearch?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0"
                  >
                    <div className="w-9 h-9 bg-neutral-100 flex-shrink-0 overflow-hidden">
                      {img ? (
                        <Image
                          src={img}
                          alt={product.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[11px] font-medium text-black uppercase tracking-wide truncate">
                        {product.name}
                      </p>
                      {product.brand && (
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest truncate">
                          {product.brand}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={navigate}
                className="w-full px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors text-left border-t border-neutral-100"
              >
                See all results for &quot;{query}&quot;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
