import { NextResponse, NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/payments/initiate?orderId=...
 *
 * Initiates a payment for an order. In production this would redirect to
 * Kkiapay/CinetPay/Paydunya checkout with a signed callback URL.
 *
 * For now we create a PaymentTransaction row, sign the order id, and redirect
 * to /checkout/success?ref=... when the webhook returns.
 *
 * Security: order must belong to the authenticated user (or guest phone).
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "orderId requis" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const isStaff = session.role === "ADMIN" || session.role === "STAFF";
  if (!isStaff && order.userId !== session.id && order.guestPhone !== session.phone) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ error: "Commande déjà payée" }, { status: 400 });
  }

  // Generate idempotency reference
  const reference = `PAY-${order.number}-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;

  await db.paymentTransaction.create({
    data: {
      orderId: order.id,
      reference,
      provider: order.paymentMethod === "FLOOZ" ? "cinetpay" : "kkiapay",
      amount: order.total,
      currency: "XOF",
      status: "PENDING",
    },
  });

  // In production: redirect to kkiapay.com/checkout?apikey=...&reference=...
  // For dev: render an HTML page that simulates the payment gateway
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Paiement — AGBE-TECH</title>
<style>
  body { font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 80px auto; padding: 20px; background: #F5F7FA; }
  .card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  h1 { color: #0A3D91; font-size: 20px; margin: 0 0 8px; }
  .amount { font-size: 28px; font-weight: 800; color: #0A3D91; margin: 16px 0; }
  .ref { font-family: monospace; color: #5C6678; font-size: 11px; word-break: break-all; }
  button { background: #16a34a; color: white; border: 0; padding: 14px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; width: 100%; font-size: 14px; }
  button:hover { background: #15803d; }
  .decline { background: #dc2626; margin-top: 8px; }
  .decline:hover { background: #b91c1c; }
  .info { font-size: 12px; color: #5C6678; margin-top: 20px; padding: 10px; background: #FEF3C7; border-radius: 6px; }
</style></head>
<body>
  <div class="card">
    <h1>Paiement Mobile Money</h1>
    <div style="color: #5C6678; font-size: 14px;">Commande ${order.number}</div>
    <div class="amount">${order.total.toLocaleString("fr-FR")} FCFA</div>
    <div class="ref">Référence: ${reference}</div>
    <div style="margin-top: 24px;">
      <form method="POST" action="/api/webhooks/kkiapay">
        <input type="hidden" name="reference" value="${reference}" />
        <input type="hidden" name="orderId" value="${order.id}" />
        <input type="hidden" name="status" value="SUCCESS" />
        <button type="submit">Confirmer le paiement</button>
      </form>
      <form method="POST" action="/api/webhooks/kkiapay">
        <input type="hidden" name="reference" value="${reference}" />
        <input type="hidden" name="orderId" value="${order.id}" />
        <input type="hidden" name="status" value="FAILED" />
        <button type="submit" class="decline">Annuler</button>
      </form>
    </div>
    <div class="info">
      ⚙️ Mode simulation (développement). En production, vous serez redirigé vers Kkiapay/CinetPay avec vérification de signature HMAC.
    </div>
  </div>
</body></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
