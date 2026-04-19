import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "../components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.richnretired.com"),
  title: {
    default: "Rich and Retired | Premium Fashion for Men, Women & Kids",
    template: "%s | Rich and Retired",
  },
  description:
    "Shop premium fashion at Rich and Retired. Explore trendy T-shirts, ethnic wear, accessories and more for men, women, boys and girls. Free shipping above ₹999.",
  keywords: [
    "Rich and Retired",
    "fashion",
    "men clothing",
    "women clothing",
    "kids clothing",
    "t-shirts",
    "ethnic wear",
    "online shopping India",
    "richnretired",
  ],
  authors: [{ name: "Rich and Retired", url: "https://www.richnretired.com" }],
  creator: "Rich and Retired",
  publisher: "Rich and Retired",
  icons: {
    icon: "/RichLogo.png",
    apple: "/RichLogo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.richnretired.com",
    siteName: "Rich and Retired",
    title: "Rich and Retired | Premium Fashion for Men, Women & Kids",
    description:
      "Shop premium fashion at Rich and Retired. Explore trendy T-shirts, ethnic wear, accessories and more. Free shipping above ₹999.",
    images: [
      {
        url: "/RichLogo.png",
        width: 1200,
        height: 630,
        alt: "Rich and Retired",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rich and Retired | Premium Fashion",
    description:
      "Shop premium fashion at Rich and Retired. Free shipping above ₹999.",
    images: ["/RichLogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.richnretired.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
