import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const ReviewCreateSchema = z.object({
  authorName: z.string().min(2, "Nom requis").max(80),
  rating: z.number().int().min(1, "Note min 1").max(5, "Note max 5"),
  comment: z.string().max(2000).optional(),
});

// GET /api/products/[slug]/reviews — list published reviews for a product
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }
  const reviews = await db.productReview.findMany({
    where: { productId: product.id, published: true },
    orderBy: { createdAt: "desc" },
  });
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
  return NextResponse.json({ reviews, avgRating, count: reviews.length });
}

// POST /api/products/[slug]/reviews — submit a review (requires auth)
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Connexion requise pour laisser un avis" },
      { status: 401 }
    );
  }
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }
  const json = await req.json().catch(() => null);
  const parsed = ReviewCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }
  // One review per user per product
  const existing = await db.productReview.findFirst({
    where: { productId: product.id, userId: session.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Vous avez déjà laissé un avis sur ce produit" },
      { status: 409 }
    );
  }
  const review = await db.productReview.create({
    data: {
      productId: product.id,
      userId: session.id,
      authorName: parsed.data.authorName,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
      published: false, // requires admin moderation
    },
  });
  return NextResponse.json({ ok: true, id: review.id }, { status: 201 });
}
