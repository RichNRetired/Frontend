import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All | Men, Women, Boys & Girls Fashion",
  description:
    "Browse all collections at Rich and Retired. Shop premium fashion for men, women, boys and girls. Free shipping above ₹999. Easy returns.",
  keywords: ["shop online India", "fashion store", "men women kids clothing", "Rich and Retired shop"],
  openGraph: {
    title: "Shop All | Rich and Retired",
    description: "Browse all premium fashion collections at Rich and Retired.",
    url: "https://www.richnretired.com/shop",
    siteName: "Rich and Retired",
    images: [{ url: "/RichLogo.png", alt: "Rich and Retired Shop" }],
  },
  alternates: { canonical: "https://www.richnretired.com/shop" },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
