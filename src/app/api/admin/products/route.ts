import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    return null;
  }
  return session;
}

// POST /api/admin/products
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const slug = body.slug?.trim() || slugify(body.name);
    // Ensure slug uniqueness
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
        shortDesc: body.shortDesc ?? "",
        description: body.description ?? "",
        categoryId: body.categoryId,
        brandId: body.brandId || null,
        regularPrice: body.regularPrice,
        promoPrice: body.promoPrice ?? null,
        stock: body.stock ?? 0,
        stockThreshold: body.stockThreshold ?? 3,
        weight: body.weight ?? null,
        dimensions: body.dimensions ?? null,
        warranty: body.warranty ?? null,
        images: body.images ?? "[]",
        pdfSpec: body.pdfSpec ?? null,
        tags: body.tags ?? "[]",
        attributes: body.attributes ?? "[]",
        status: body.status ?? "ACTIVE",
        pricingMode: body.pricingMode ?? "PRICE",
        featured: body.featured ?? false,
      },
    });
    return NextResponse.json(product);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}

// GET /api/admin/products
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: true, category: true },
  });
  return NextResponse.json(products);
}
