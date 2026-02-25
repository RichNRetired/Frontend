import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import { getProduct } from "@/services/product.service";
import { Product } from "@/types/product";

/**
 * Server component page
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ Next.js 15 async params
  const { slug } = await params;
  const id = Number(slug);

  // ❌ invalid id
  if (isNaN(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Invalid product ID</div>
      </div>
    );
  }

  // ✅ fetch from server service
  const product: Product | null = await getProduct(id);

  // ❌ not found or inactive
  if (!product || !product.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image */}
      <div className="bg-neutral-100 p-6 rounded-2xl">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : null}
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <p className="text-sm text-neutral-500">{product.brand}</p>

        <h1 className="text-3xl font-semibold">{product.name}</h1>

        <p className="text-neutral-600">{product.short_description}</p>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">₹{product.price}</span>
          <span className="line-through text-neutral-400">₹{product.mrp}</span>
          <span className="text-green-600 font-medium">
            {product.discount_percent}% OFF
          </span>
        </div>

        {/* Rating */}
        <div className="text-sm text-neutral-600">
          ⭐ {product.average_rating} ({product.total_reviews} reviews)
        </div>

        {/* Delivery */}
        <div className="text-sm text-neutral-600">
          🚚 Delivery in {product.delivery_days} days{" "}
          {product.cod_available && "• Cash on Delivery available"}
        </div>

        {/* Stock */}
        <div
          className={`text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>

        {/* Client Component (cart, qty, etc.) */}
        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}
