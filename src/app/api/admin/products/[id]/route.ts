import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const ProductPatchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  sku: z.string().min(1).max(50).optional(),
  barcode: z.string().max(50).optional(),
  shortDesc: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
  categoryId: z.string().min(1).optional(),
  brandId: z.string().optional(),
  regularPrice: z.number().min(0).optional(),
  promoPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  stockThreshold: z.number().int().min(0).optional(),
  weight: z.number().optional(),
  dimensions: z.string().max(100).optional(),
  warranty: z.string().max(100).optional(),
  images: z.string().optional(),
  pdfSpec: z.string().optional(),
  tags: z.string().optional(),
  attributes: z.string().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
  pricingMode: z.enum(["PRICE", "ON_REQUEST"]).optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const json = await req.json().catch(() => null);
    const parsed = ProductPatchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const data: any = { ...parsed.data };
    if (data.slug) {
      const other = await db.product.findFirst({ where: { slug: data.slug, NOT: { id } } });
      if (other) {
        return NextResponse.json({ error: "Slug déjà utilisé" }, { status: 409 });
      }
    }
    // Audit log: record the change
    const before = await db.product.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }
    const updated = await db.product.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("admin product PATCH", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Soft delete (sets deletedAt) instead of physical delete — preserves order history
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }
    // Soft delete: mark as ARCHIVED + set deletedAt — keeps OrderItem FK valid
    await db.product.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        deletedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true, message: "Produit archivé (soft delete)" });
  } catch (e: any) {
    console.error("admin product DELETE", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
