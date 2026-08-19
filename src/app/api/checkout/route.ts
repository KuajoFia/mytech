import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail, orderConfirmationEmail } from "@/lib/notifications/email";
import { sendWhatsApp, orderConfirmationWhatsApp } from "@/lib/notifications/whatsapp";

const CheckoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
});

const CheckoutSchema = z.object({
  name: z.string().min(2, "Nom requis").max(120),
  phone: z.string().min(8, "Téléphone invalide").max(20),
  email: z.string().email().optional().or(z.literal("")),
  companyName: z.string().optional(),
  rccm: z.string().optional(),
  nif: z.string().optional(),
  billingAddress: z.string().optional(),
  deliveryMode: z.enum(["PICKUP_STORE", "LOME_DELIVERY", "OTHER_REGIONS"]),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(CheckoutItemSchema).min(1, "Panier vide"),
  // Client-sent totals are IGNORED — server recomputes everything
  subtotal: z.number().optional(),
  vat: z.number().optional(),
  shippingFee: z.number().optional(),
  total: z.number().optional(),
});

// POST /api/checkout — guest or authenticated order creation
// Server recalculates prices, decrements stock atomically
export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = CheckoutSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const body = parsed.data;
    const session = await getSession();

    // Lookup products and verify stock in a transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Find or create user
      let user = session
        ? await tx.user.findUnique({ where: { id: session.id } })
        : await tx.user.findUnique({ where: { phone: body.phone } });

      if (!user) {
        user = await tx.user.create({
          data: {
            phone: body.phone,
            email: body.email && body.email.length > 0 ? body.email : undefined,
            name: body.name,
            role: body.companyName ? "PRO" : "CLIENT",
            companyName: body.companyName || undefined,
            rccm: body.rccm || undefined,
            nif: body.nif || undefined,
          },
        });
      }

      // 2. Fetch all products in one query, lock via read-after-write semantics
      const productIds = body.items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      // 3. Validate products exist, are active, and have sufficient stock
      const orderItems: Array<{
        productId: string;
        name: string;
        sku: string;
        unitPrice: number;
        quantity: number;
        total: number;
      }> = [];

      for (const item of body.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Produit introuvable: ${item.productId}`);
        }
        if (product.status !== "ACTIVE") {
          throw new Error(`Produit non disponible: ${product.name}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour ${product.name} (disponible: ${product.stock})`);
        }
        // Use server-side price (promo or regular)
        const unitPrice = product.promoPrice ?? product.regularPrice;
        orderItems.push({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice,
          quantity: item.quantity,
          total: unitPrice * item.quantity,
        });

        // Decrement stock atomically
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 4. Recompute totals server-side
      const settings = await tx.settings.findFirst();
      const vatRate = settings?.vatRate ?? 0.18;
      const subtotal = orderItems.reduce((s, i) => s + i.total, 0);

      // Shipping fee
      let shippingFee = 0;
      if (body.deliveryMode === "LOME_DELIVERY") {
        shippingFee = settings?.lomeDeliveryFee ?? 2000;
      } else if (body.deliveryMode === "OTHER_REGIONS") {
        shippingFee = settings?.otherRegionsFee ?? 0;
      }

      const vat = Math.round(subtotal * vatRate);
      const total = subtotal + vat + shippingFee;

      // 5. Generate order number BC-YYYY-XXX
      const year = new Date().getFullYear();
      const countThisYear = await tx.order.count({
        where: { number: { startsWith: `BC-${year}-` } },
      });
      const number = `BC-${year}-${String(countThisYear + 1).padStart(3, "0")}`;

      // 6. Create order
      const order = await tx.order.create({
        data: {
          number,
          userId: user.id,
          guestName: body.name,
          guestPhone: body.phone,
          guestEmail: body.email && body.email.length > 0 ? body.email : undefined,
          companyName: body.companyName || undefined,
          rccm: body.rccm || undefined,
          nif: body.nif || undefined,
          billingAddress: body.billingAddress || null,
          deliveryMode: body.deliveryMode,
          shippingAddress: body.shippingAddress
            ? `${body.shippingAddress}, ${body.shippingCity || "Lomé"}`
            : null,
          shippingFee,
          shippingZone: body.shippingCity || "Lomé",
          subtotal,
          vat,
          total,
          paymentMethod: body.paymentMethod || null,
          status: "AWAITING_PAYMENT",
          items: { create: orderItems },
          timeline: {
            create: { status: "AWAITING_PAYMENT", note: "Commande créée — en attente de paiement" },
          },
        },
        include: { items: true },
      });

      return order;
    });

    // Fire-and-forget notifications (don't block the response)
    if (body.email && body.email.length > 0) {
      sendEmail(
        orderConfirmationEmail({
          number: result.number,
          total: result.total,
          guestName: body.name,
          guestEmail: body.email,
          items: result.items.map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        })
      ).catch(() => {});
    }
    if (body.phone) {
      sendWhatsApp(
        orderConfirmationWhatsApp({
          number: result.number,
          total: result.total,
          guestName: body.name,
          guestPhone: body.phone,
        })
      ).catch(() => {});
    }

    return NextResponse.json({
      orderId: result.id,
      number: result.number,
      status: result.status,
      total: result.total,
    });
  } catch (e: any) {
    console.error("checkout error", e);
    // Distinguish stock/validation errors from server errors
    if (e?.message?.startsWith("Produit") || e?.message?.startsWith("Stock")) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
