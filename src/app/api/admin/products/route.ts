import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const ProductCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().max(200).optional(),
  sku: z.string().min(1).max(50),
  barcode: z.string().max(50).optional(),
  shortDesc: z.string().max(500).default(""),
  description: z.string().max(10000).default(""),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  regularPrice: z.number().min(0),
  promoPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).default(0),
  stockThreshold: z.number().int().min(0).default(3),
  weight: z.number().optional(),
  dimensions: z.string().max(100).optional(),
  warranty: z.string().max(100).optional(),
  images: z.string().default("[]"),
  pdfSpec: z.string().optional(),
  tags: z.string().default("[]"),
  attributes: z.string().default("[]"),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
  pricingMode: z.enum(["PRICE", "ON_REQUEST"]).default("PRICE"),
  featured: z.boolean().default(false),
});

// POST /api/admin/products
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const json = await req.json().catch(() => null);
    const parsed = ProductCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const body = parsed.data;
    const slug = body.slug?.trim() || slugify(body.name);
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug déjà utilisé" }, { status: 409 });
    }
    const product = await db.product.create({
      data: {
        name: body.name,
        slug,
        sku: body.sku,
        barcode: body.barcode ?? null,
        shortDesc: body.shortDesc,
        description: body.description,
        categoryId: body.categoryId,
        brandId: body.brandId || null,
        regularPrice: body.regularPrice,
        promoPrice: body.promoPrice ?? null,
        stock: body.stock,
        stockThreshold: body.stockThreshold,
        weight: body.weight ?? null,
        dimensions: body.dimensions ?? null,
        warranty: body.warranty ?? null,
        images: body.images,
        pdfSpec: body.pdfSpec ?? null,
        tags: body.tags,
        attributes: body.attributes,
        status: body.status,
        pricingMode: body.pricingMode,
        featured: body.featured,
      },
    });
    return NextResponse.json(product);
  } catch (e: any) {
    console.error("admin product POST", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET /api/admin/products
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const products = await db.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { brand: true, category: true },
  });
  return NextResponse.json(products);
}
