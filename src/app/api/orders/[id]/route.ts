import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const PatchSchema = z.object({
  status: z
    .enum([
      "QUOTE_REQUESTED",
      "PROFORMA_ISSUED",
      "ORDERED",
      "AWAITING_PAYMENT",
      "PAID",
      "PREPARING",
      "AWAITING_DELIVERY",
      "DELIVERING",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ])
    .optional(),
  note: z.string().max(500).optional(),
  paymentMethod: z.string().max(50).optional(),
  paymentRef: z.string().max(100).optional(),
});

// GET /api/orders/[id] — fetch a single order (with auth)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      documents: true,
      timeline: { orderBy: { createdAt: "asc" } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  const isStaff = session.role === "ADMIN" || session.role === "STAFF";
  if (!isStaff && order.userId !== session.id && order.guestPhone !== session.phone) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  return NextResponse.json(order);
}

// PATCH /api/orders/[id] — update order status
// Security: status transitions to PAID / DELIVERED / etc. are ADMIN/STAFF only.
// Webhooks (server-only) bypass this via a separate internal route.
const ADMIN_ONLY_STATUSES = new Set(["PAID", "PREPARING", "AWAITING_DELIVERY", "DELIVERING", "DELIVERED", "RETURNED"]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  const { status, note, paymentMethod, paymentRef } = parsed.data;

  const order = await db.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const isStaff = session.role === "ADMIN" || session.role === "STAFF";
  const isOwner = order.userId === session.id || order.guestPhone === session.phone;

  if (!isStaff && !isOwner) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // Non-admin clients can only cancel their own order, only if it's not yet paid
  if (!isStaff) {
    if (status && status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Action non autorisée — contactez l'équipe AGBE-TECH" },
        { status: 403 }
      );
    }
    if (status === "CANCELLED" && ["PAID", "DELIVERING", "DELIVERED"].includes(order.status)) {
      return NextResponse.json(
        { error: "Impossible d'annuler une commande déjà payée/livrée" },
        { status: 400 }
      );
    }
    // Clients cannot set payment fields
    if (paymentRef || (paymentMethod && paymentMethod !== order.paymentMethod)) {
      return NextResponse.json(
        { error: "Paiement non modifiable côté client" },
        { status: 403 }
      );
    }
  }

  // Admin-only statuses
  if (status && ADMIN_ONLY_STATUSES.has(status) && !isStaff) {
    return NextResponse.json({ error: "Action réservée à l'équipe" }, { status: 403 });
  }

  const data: any = {};
  if (status) data.status = status;
  if (paymentMethod) data.paymentMethod = paymentMethod;
  if (paymentRef) data.paymentRef = paymentRef;
  if (status === "PAID" && !order.paidAt) data.paidAt = new Date();

  const updated = await db.order.update({
    where: { id },
    data,
  });

  if (status && status !== order.status) {
    await db.orderTimeline.create({
      data: {
        orderId: id,
        status,
        note: note ?? null,
      },
    });
  }

  return NextResponse.json(updated);
}
