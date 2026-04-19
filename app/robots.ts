import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/checkout/",
          "/cart/",
          "/api/",
          "/track/",
          "/wishlist/",
        ],
      },
    ],
    sitemap: "https://www.richnretired.com/sitemap.xml",
  };
}
