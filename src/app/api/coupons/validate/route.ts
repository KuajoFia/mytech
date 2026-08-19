import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const Schema = z.object({
  code: z.string().min(1).max(50).transform((s) => s.toUpperCase().trim()),
  cartTotal: z.number().min(0),
});

// POST /api/coupons/validate — validate a coupon against the current cart
export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = Schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const { code, cartTotal } = parsed.data;

    const coupon = await db.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: "Code invalide" }, { status: 404 });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expiré" }, { status: 400 });
    }
    if (coupon.maxUses > 0 && coupon.usesCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Code entièrement utilisé" }, { status: 400 });
    }
    if (cartTotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Montant minimum: ${coupon.minOrder.toLocaleString("fr-FR")} FCFA` },
        { status: 400 }
      );
    }

    const discount =
      coupon.type === "PERCENT"
        ? Math.round((cartTotal * coupon.value) / 100)
        : coupon.value;

    return NextResponse.json({
      ok: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      newTotal: Math.max(0, cartTotal - discount),
    });
  } catch (e: any) {
    console.error("coupon validate", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
