"use client";

import { useMemo } from "react";
import ProductDetailsClient from "./ProductDetailsClient";
import PDPImageGallery from "./PDPImageGallery";
import { ProductCard } from "./ProductCard";
import {
  useGetProductQuery,
  useGetRelatedProductsQuery,
} from "@/features/product/productApi";
import { getProductImageUrls } from "@/features/product/productUtils";

interface ProductPageClientProps {
  productId: string | number;
  slug: string;
}

export default function ProductPageClient({
  productId,
  slug: _slug,
}: ProductPageClientProps) {
  const normalizedProductId = useMemo(() => {
    const value = Number(productId);
    return Number.isFinite(value) ? value : null;
  }, [productId]);

  const {
    data: product,
    isLoading,
    isFetching,
    isError,
  } = useGetProductQuery(normalizedProductId as number, {
    skip: !normalizedProductId,
  });

  const { data: relatedResp, isLoading: relatedLoading } =
    useGetRelatedProductsQuery(
      {
        productId: normalizedProductId as number,
        page: 0,
        size: 8,
      },
      { skip: !normalizedProductId },
    );

  const relatedProducts = (relatedResp?.content || []).filter(
    (item) => item.id !== normalizedProductId,
  );

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-600">Loading product...</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-neutral-500">Product not found</div>
          <div className="text-xs text-neutral-400">ID: {productId}</div>
        </div>
      </div>
    );
  }

  const imageUrls = getProductImageUrls(product);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col items-center lg:items-start w-full">
            <div className="w-full max-w-full sm:max-w-112.5 lg:max-w-100 xl:max-w-112.5 space-y-4">
              <PDPImageGallery images={imageUrls} name={product.name} />
            </div>
          </div>
          <ProductDetailsClient product={product} />
        </div>
      </div>

      <div className="bg-neutral-50 border-y border-neutral-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl text-black font-light tracking-tight mb-12 text-center">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-sm text-neutral-600">
                Quick and reliable shipping to your doorstep
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-sm text-neutral-600">
                All products verified for authenticity and quality
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-sm text-neutral-600">
                Hassle-free returns within 30 days*
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 lg:py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl text-black font-light tracking-tight mb-6">
              Product Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Brand</span>
                <span className="font-medium text-neutral-900">
                  {product.brand}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Product ID</span>
                <span className="font-medium text-neutral-900">
                  PRD-{product.id}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Availability</span>
                <span
                  className={`font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-neutral-600">Status</span>
                <span className="font-medium text-neutral-900">
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div>
              <h2 className="text-2xl font-light tracking-tight mb-6">
                Specifications
              </h2>
              <div className="space-y-4">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-neutral-100 last:border-0"
                  >
                    <span className="text-neutral-600 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-medium text-neutral-900">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pb-14 px-6 lg:pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-light tracking-tight text-black">
            You may also like
          </h2>
        </div>

        {relatedLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-neutral-100 h-80 w-full"
              />
            ))}
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8">
            {relatedProducts.slice(0, 4).map((related) => (
              <ProductCard
                key={related.id}
                id={related.id}
                slug={related.slug}
                name={related.name}
                price={related.price}
                originalPrice={related.mrp}
                images={related.images}
                isOnSale={!!related.discount_percent}
                isNew={Boolean(related.status?.toLowerCase() === "new")}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center text-neutral-600">
            No related products available right now.
          </div>
        )}
      </div>
    </div>
  );
}
