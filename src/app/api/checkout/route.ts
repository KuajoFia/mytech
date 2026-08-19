import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/checkout — guest or authenticated order creation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, phone, email, companyName, rccm, nif,
      billingAddress, deliveryMode, shippingAddress, shippingCity,
      paymentMethod, notes, items, subtotal, vat, shippingFee, total,
    } = body ?? {};

    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Look up or create a guest user keyed by phone
    let user = await db.user.findUnique({ where: { phone } });
    if (!user) {
      user = await db.user.create({
        data: {
          phone,
          email: email || undefined,
          name,
          role: "CLIENT",
          companyName,
          rccm,
          nif,
        },
      });
    }

    // Generate order number BC-YYYY-XXX
    const year = new Date().getFullYear();
    const countThisYear = await db.order.count({
      where: { number: { startsWith: `BC-${year}-` } },
    });
    const number = `BC-${year}-${String(countThisYear + 1).padStart(3, "0")}`;

    const order = await db.order.create({
      data: {
        number,
        userId: user.id,
        guestName: name,
        guestPhone: phone,
        guestEmail: email,
        companyName,
        rccm,
        nif,
        billingAddress: billingAddress || null,
        deliveryMode,
        shippingAddress: shippingAddress ? `${shippingAddress}, ${shippingCity || "Lomé"}` : null,
        shippingFee: shippingFee || 0,
        shippingZone: shippingCity || "Lomé",
        subtotal,
        vat,
        total,
        paymentMethod,
        status: "AWAITING_PAYMENT",
        items: {
          create: items.map((it: any) => ({
            productId: it.productId,
            name: it.name,
            sku: it.sku,
            unitPrice: it.unitPrice,
            quantity: it.quantity,
            total: it.total,
          })),
        },
        timeline: {
          create: { status: "AWAITING_PAYMENT", note: "Commande créée — en attente de paiement" },
        },
      },
      include: { items: true },
    });

    // For payment-method TRANSFER or CASH, the order stays AWAITING_PAYMENT until manually confirmed.
    // For mobile money (TMoney/Flooz), production would redirect to Kkiapay/CinetPay here.
    // For the demo, we simulate immediate payment confirmation for cash/transfer at pickup.

    return NextResponse.json({ orderId: order.id, number: order.number, status: order.status });
  } catch (e: any) {
    console.error("checkout error", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
