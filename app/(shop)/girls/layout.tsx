import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Girls' Clothing | Dresses, Ethnic Wear & More",
  description:
    "Shop girls' fashion at Rich and Retired. Find cute dresses, ethnic wear and more for girls. Free shipping above ₹999.",
  keywords: ["girls clothing", "girls dresses", "kids fashion India", "Rich and Retired girls"],
  openGraph: {
    title: "Girls' Clothing | Rich and Retired",
    description: "Shop trendy girls' fashion — dresses, ethnic wear and more.",
    url: "https://www.richnretired.com/girls",
    siteName: "Rich and Retired",
    images: [{ url: "/RichLogo.png", alt: "Rich and Retired Girls" }],
  },
  alternates: { canonical: "https://www.richnretired.com/girls" },
};

export default function GirlsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
