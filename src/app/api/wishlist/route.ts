import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

// GET /api/wishlist — current user's wishlist items
export async function GET() {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const items = await db.wishlistItem.findMany({
    where: { userId: session.id },
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          shortDesc: true,
          regularPrice: true,
          promoPrice: true,
          stock: true,
          images: true,
          pricingMode: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

// POST /api/wishlist — add a product to wishlist
export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { productId } = await req.json().catch(() => ({}));
  if (!productId) {
    return NextResponse.json({ error: "productId requis" }, { status: 400 });
  }
  // upsert (unique on userId+productId)
  const existing = await db.wishlistItem.findFirst({
    where: { userId: session.id, productId },
  });
  if (existing) {
    return NextResponse.json({ ok: true, message: "Déjà dans la wishlist" });
  }
  await db.wishlistItem.create({
    data: { userId: session.id, productId },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

// DELETE /api/wishlist?productId=...
export async function DELETE(req: Request) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId requis" }, { status: 400 });
  }
  await db.wishlistItem.deleteMany({
    where: { userId: session.id, productId },
  });
  return NextResponse.json({ ok: true });
}
