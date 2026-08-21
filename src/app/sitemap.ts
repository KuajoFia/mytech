import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://mytech-my-des.vercel.app";
  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/realisations", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/boutique", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/a-propos", priority: 0.6, changeFrequency: "yearly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
    { url: "/cgv", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/confidentialite", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const [services, products, blogPosts] = await Promise.all([
      db.service.findMany({ select: { slug: true, updatedAt: true } }),
      db.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
      db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    dynamicEntries = [
      ...services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...products.map((p) => ({
        url: `${baseUrl}/boutique/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...blogPosts.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch (e) {
    console.error("Sitemap DB error:", e);
    // Return only static pages if DB is unavailable
  }

  return [
    ...staticPages.map((p) => ({
      url: `${baseUrl}${p.url}`,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...dynamicEntries,
  ];
}
