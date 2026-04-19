import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boys' Clothing | T-Shirts, Casual Wear & More",
  description:
    "Shop boys' fashion at Rich and Retired. Find trendy T-shirts, casual wear and more for boys. Free shipping above ₹999.",
  keywords: ["boys clothing", "boys t-shirts", "kids fashion India", "Rich and Retired boys"],
  openGraph: {
    title: "Boys' Clothing | Rich and Retired",
    description: "Shop trendy boys' fashion — T-shirts, casual wear and more.",
    url: "https://www.richnretired.com/boys",
    siteName: "Rich and Retired",
    images: [{ url: "/RichLogo.png", alt: "Rich and Retired Boys" }],
  },
  alternates: { canonical: "https://www.richnretired.com/boys" },
};

export default function BoysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
