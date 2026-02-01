import ProductDetailsClient from "@/components/product/ProductDetailsClient";

type Params = { params: { slug: string } };

async function fetchProduct(id: number) {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  const res = await fetch(`${base}/api/products/${id}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({ params }: Params) {
  const id = Number(params.slug);
  const product = await fetchProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-neutral-100 p-4">
        <img
          src={product.images?.[0] || "/images/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        {/* Client component handles quantity/size/add-to-cart */}
        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}
