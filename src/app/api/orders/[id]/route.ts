import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

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
  // Authz: client can only see their own; admin can see all
  if (session.role !== "ADMIN" && session.role !== "STAFF" && order.userId !== session.id) {
    // Also allow guests to see orders placed with their phone
    if (order.guestPhone !== session.phone) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
  }
  return NextResponse.json(order);
}

// PATCH /api/orders/[id] — update order status (admin only, or client for limited actions)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { id } = await params;
  const { status, note, paymentMethod, paymentRef } = await req.json();
  const order = await db.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  // Authz
  const isStaff = session.role === "ADMIN" || session.role === "STAFF";
  if (!isStaff && order.userId !== session.id && order.guestPhone !== session.phone) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
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
