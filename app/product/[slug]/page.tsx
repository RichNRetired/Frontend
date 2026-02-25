import ProductPageClient from "@/components/product/ProductPageClient";

type Params = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;

  // Validate slug
  if (!slug || slug.trim() === "") {
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

  return <ProductPageClient productId={productId} slug={slug} />;
}
