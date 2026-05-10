import { Metadata } from "next";
import Script from "next/script";
import ProductPageClient from "@/components/product/ProductPageClient";

const BASE_URL = "https://www.richnretired.com";
const API_URL = "https://project-fnwy.onrender.com/api";

type Params = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const title = `${product.name} | Rich and Retired`;
  const description =
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    `Buy ${product.name} from Rich and Retired. Best price guaranteed.`;
  const image = product.mainImage || product.thumbnailImage || "/RichLogo.png";
  const url = `${BASE_URL}/product/${slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand,
      product.category?.name,
      "buy online India",
      "Rich and Retired",
    ].filter(Boolean),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image, alt: product.name }],
      siteName: "Rich and Retired",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;

  if (!slug || slug.trim() === "") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Invalid product</div>
      </div>
    );
  }

  let productId: number | string = slug;

  if (slug.includes("-")) {
    const parts = slug.split("-");
    const potentialId = parts[0];
    if (!isNaN(Number(potentialId))) {
      productId = Number(potentialId);
    }
  } else if (!isNaN(Number(slug))) {
    productId = Number(slug);
  }

  // Product JSON-LD for rich snippets
  const product = await getProduct(slug);
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description || "",
    image: product.mainImage || product.thumbnailImage || `${BASE_URL}/RichLogo.png`,
    url: `${BASE_URL}/product/${slug}`,
    brand: { "@type": "Brand", name: product.brand || "Rich and Retired" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.sellingPrice || product.price || 0,
      availability: product.in_stock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${BASE_URL}/product/${slug}`,
      seller: { "@type": "Organization", name: "Rich and Retired" },
    },
  } : null;

  return (
    <>
      {productSchema && (
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductPageClient productId={productId} slug={slug} />
    </>
  );
}
