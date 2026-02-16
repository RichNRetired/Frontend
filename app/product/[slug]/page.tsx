import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import { Product } from "@/features/product/productTypes";
import { fetchBackendApi } from "@/lib/backend-api";

type Params = { params: { slug: string } };

// Fetch product directly from backend API
async function fetchProduct(
  idOrSlug: string | number,
): Promise<Product | null> {
  try {
    const product = await fetchBackendApi<Product>(`/products/${idOrSlug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return product;
  } catch (error) {
    console.error("[ProductPage] Fetch error:", error);
    return null;
  }
}

export default async function ProductPage({ params }: Params) {
  const slug = params.slug;

  // Validate slug
  if (!slug || slug.trim() === "") {
    console.error("[ProductPage] Invalid slug");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Invalid product</div>
      </div>
    );
  }

  // Extract product ID from slug (format: "id-slug-name")
  // If URL is like /product/101-nike-running-shoes, extract 101
  let productId: number | string = slug;

  // Try to extract numeric ID if slug contains dash (format: "id-slug")
  if (slug.includes("-")) {
    const parts = slug.split("-");
    const potentialId = parts[0];

    if (!isNaN(Number(potentialId))) {
      productId = Number(potentialId);
    }
  } else if (!isNaN(Number(slug))) {
    // If slug is just a number, use it as ID
    productId = Number(slug);
  }

  const product = await fetchProduct(productId);

  // product not found
  if (!product) {
    console.error("[ProductPage] Product not found for ID:", productId);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-neutral-500">Product not found</div>
          <div className="text-xs text-neutral-400">ID: {productId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto py-12 px-6 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-neutral-100 p-8 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={
                  product.images?.[0] ||
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                }
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-100 p-2 rounded-lg overflow-hidden aspect-square flex items-center justify-center group cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <ProductDetailsClient product={product} />
        </div>
      </div>

      {/* Trust & Benefits Section */}
      <div className="bg-neutral-50 border-y border-neutral-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light tracking-tight mb-12 text-center">
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

      {/* Related Information */}
      <div className="max-w-7xl mx-auto py-12 lg:py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-light tracking-tight mb-6">
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

          {/* Specifications */}
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

      {/* CTA Section */}
      <div className="bg-black text-white py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            Ready to get this?
          </h2>
          <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've made their choice.
            Limited stock available.
          </p>
          <button
            onClick={() => (window.location.hash = "#add-to-cart")}
            className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
