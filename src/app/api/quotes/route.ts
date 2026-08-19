import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/quotes — create a draft quote from a guest cart
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, guestName, guestPhone, guestEmail, companyName, rccm, nif } = body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    // Find or create a guest user
    let user: { id: string } | null = null;
    if (guestPhone) {
      const found = await db.user.findUnique({ where: { phone: guestPhone } });
      if (found) {
        user = { id: found.id };
      } else {
        const created = await db.user.create({
          data: {
            phone: guestPhone,
            email: guestEmail || undefined,
            name: guestName || "Invité",
            role: "CLIENT",
            companyName,
            rccm,
            nif,
          },
        });
        user = { id: created.id };
      }
    }

    const subtotal = items.reduce((s: number, i: any) => s + i.total, 0);
    const settings = await db.settings.findFirst();
    const vatRate = settings?.vatRate ?? 0.18;
    const vat = Math.round(subtotal * vatRate);
    const total = subtotal + vat;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (settings?.proformaValidity ?? 15));

    const year = new Date().getFullYear();
    const count = await db.quote.count({ where: { number: { startsWith: `PF-${year}-` } } });
    const number = `PF-${year}-${String(count + 1).padStart(3, "0")}`;

    const quote = await db.quote.create({
      data: {
        number,
        userId: user?.id,
        guestName,
        guestPhone,
        guestEmail,
        companyName,
        rccm,
        nif,
        status: "ISSUED",
        validUntil,
        subtotal,
        vat,
        total,
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
      },
      include: { items: true },
    });

    // Create an order in QUOTE_REQUESTED status linked to this quote
    const orderCount = await db.order.count({ where: { number: { startsWith: `BC-${year}-` } } });
    const orderNumber = `BC-${year}-${String(orderCount + 1).padStart(3, "0")}`;

    const order = await db.order.create({
      data: {
        number: orderNumber,
        userId: user?.id,
        guestName,
        guestPhone,
        guestEmail,
        companyName,
        rccm,
        nif,
        billingAddress: null,
        deliveryMode: "PICKUP_STORE",
        shippingFee: 0,
        subtotal,
        vat,
        total,
        status: "QUOTE_REQUESTED",
        proformaId: quote.id,
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
          create: { status: "QUOTE_REQUESTED", note: `Proforma ${quote.number} émise` },
        },
      },
    });

    // Mark quote as linked (optional — order has proformaId, but quote has order via reverse relation)
    return NextResponse.json({ quoteId: quote.id, orderId: order.id, number: quote.number });
  } catch (e: any) {
    console.error("quote error", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
