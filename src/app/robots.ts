import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/compte", "/api", "/checkout", "/panier"],
      },
    ],
    sitemap: "https://agbe-tech.com/sitemap.xml",
    host: "https://agbe-tech.com",
  };
}
