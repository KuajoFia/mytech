import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/webhooks/cinetpay
 *
 * Receives POST notifications from CinetPay when a payment reaches a final state.
 * In production: verify the signature in header `X-Token` against CINETPAY_API_KEY.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const reference = body.transaction_id || body.reference;
    const status = body.status === "ACCEPTED" ? "SUCCESS" : "FAILED";
    const orderId = body.orderId || body.payload?.order_id;

    if (!reference || !orderId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const existing = await db.paymentTransaction.findUnique({ where: { reference } });
    if (!existing) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }
    if (existing.status === "SUCCESS") {
      return NextResponse.json({ ok: true, message: "Déjà traité" });
    }

    await db.paymentTransaction.update({
      where: { reference },
      data: {
        status,
        rawPayload: rawBody,
      },
    });

    if (status === "SUCCESS") {
      await db.$transaction([
        db.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paidAt: new Date(),
            paymentRef: reference,
          },
        }),
        db.orderTimeline.create({
          data: {
            orderId,
            status: "PAID",
            note: `Paiement confirmé via CinetPay (réf: ${reference})`,
          },
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("cinetpay webhook error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
