import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/analytics
 *
 * Returns aggregated KPIs for the admin dashboard:
 * - Total revenue (PAID orders)
 * - Orders count by status
 * - Top 5 products by sales
 * - Revenue by month (last 12 months)
 */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const paidOrders = await db.order.findMany({
    where: { status: "PAID" },
    select: { total: true, paidAt: true, id: true },
  });

  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  const ordersByStatus = await db.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  // Top 5 products by sales (sum of OrderItem.total for PAID orders)
  const topProductsRaw = await db.orderItem.findMany({
    where: { order: { status: "PAID" } },
    select: { name: true, quantity: true, total: true },
  });
  const productAgg = new Map<string, { qty: number; revenue: number }>();
  for (const it of topProductsRaw) {
    const cur = productAgg.get(it.name) ?? { qty: 0, revenue: 0 };
    cur.qty += it.quantity;
    cur.revenue += it.total;
    productAgg.set(it.name, cur);
  }
  const topProducts = Array.from(productAgg.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Revenue by month (last 12 months)
  const now = new Date();
  const monthly: { month: string; revenue: number; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = d;
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthOrders = paidOrders.filter(
      (o) => o.paidAt && o.paidAt >= monthStart && o.paidAt <= monthEnd
    );
    monthly.push({
      month: d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      revenue: monthOrders.reduce((s, o) => s + o.total, 0),
      count: monthOrders.length,
    });
  }

  return NextResponse.json({
    totalRevenue,
    avgOrderValue,
    paidOrdersCount: paidOrders.length,
    ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count._all })),
    topProducts,
    monthly,
  });
}
