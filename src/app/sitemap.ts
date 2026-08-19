import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://agbe-tech.com";
  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/realisations", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/boutique", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/a-propos", priority: 0.6, changeFrequency: "yearly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
    { url: "/cgv", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/confidentialite", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const services = await db.service.findMany({ select: { slug: true, updatedAt: true } });
  const products = await db.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } });
  const blogPosts = await db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });

  return [
    ...staticPages.map((p) => ({
      url: `${baseUrl}${p.url}`,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
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
}
