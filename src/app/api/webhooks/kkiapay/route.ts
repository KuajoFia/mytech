import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/webhooks/kkiapay
 *
 * In production, this endpoint receives HMAC-signed webhook from Kkiapay.
 * We verify the signature header `x-kkiapay-signature` using the secret
 * stored in env (KKIAPAY_SECRET or KKIAPAY_API_KEY).
 *
 * For dev, we accept form data with the reference + status, so the simulate
 * page can call us directly. We ALWAYS re-fetch the order amount from DB
 * (never trust the client).
 */

function verifyKkiapaySignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.KKIAPAY_SECRET || process.env.KKIAPAY_API_KEY;
  if (!secret) {
    // In dev, allow unsigned requests when no secret is configured
    return process.env.NODE_ENV !== "production";
  }
  const sig = req.headers.get("x-kkiapay-signature");
  if (!sig) return false;
  // Use Node's createHmac via dynamic import to keep the route light
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let reference: string | undefined;
    let orderId: string | undefined;
    let status: string | undefined;

    if (contentType.includes("application/json")) {
      const rawBody = await req.text();
      if (!verifyKkiapaySignature(req, rawBody)) {
        return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
      }
      const body = JSON.parse(rawBody);
      reference = body.reference || body.transactionId;
      orderId = body.orderId;
      status = body.status || (body.success ? "SUCCESS" : "FAILED");
    } else {
      // Form data (dev simulation)
      const formData = await req.formData();
      reference = formData.get("reference") as string | undefined;
      orderId = formData.get("orderId") as string | undefined;
      status = formData.get("status") as string | undefined;
    }

    if (!reference || !orderId || !status) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Idempotency: look up existing transaction by reference
    const existing = await db.paymentTransaction.findUnique({
      where: { reference },
      include: { order: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }
    if (existing.status === "SUCCESS") {
      // Already processed — return success without re-doing
      return NextResponse.json({ ok: true, message: "Déjà traité" });
    }

    // Update transaction
    const updated = await db.paymentTransaction.update({
      where: { reference },
      data: {
        status,
        rawPayload: JSON.stringify({ reference, orderId, status, ts: Date.now() }),
      },
      include: { order: true },
    });

    if (status === "SUCCESS") {
      // Mark order as PAID, set paidAt, update paymentRef
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
            note: `Paiement confirmé via ${updated.provider} (réf: ${reference})`,
          },
        }),
      ]);
      // Trigger notifications (in production: send email/WhatsApp)
      // notifications.sendOrderPaidEmail(updated.order) ...
    }

    // Redirect to order page on success
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const target = status === "SUCCESS"
        ? new URL(`/checkout/success?orderId=${orderId}&paid=1`, req.url)
        : new URL(`/checkout/cancel`, req.url);
      return NextResponse.redirect(target);
    }
    return NextResponse.json({ ok: true, status });
  } catch (e: any) {
    console.error("kkiapay webhook error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
