import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Clothing | Kurtas, Dresses & More",
  description:
    "Shop women's fashion at Rich and Retired. Explore kurtas, dresses, ethnic wear and more. Free shipping above ₹999. Easy returns.",
  keywords: ["womens clothing", "womens kurta", "womens fashion India", "Rich and Retired women"],
  openGraph: {
    title: "Women's Clothing | Rich and Retired",
    description: "Shop trendy women's fashion — kurtas, dresses, ethnic wear and more.",
    url: "https://www.richnretired.com/women",
    siteName: "Rich and Retired",
    images: [{ url: "/RichLogo.png", alt: "Rich and Retired Women" }],
  },
  alternates: { canonical: "https://www.richnretired.com/women" },
};

export default function WomenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
