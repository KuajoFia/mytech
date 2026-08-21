/**
 * Debug endpoint: shows the actual DB error from the dashboard queries.
 */
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const setupToken = process.env.SETUP_DB_TOKEN;
  if (!setupToken) return NextResponse.json({ error: "disabled" }, { status: 403 });
  if (req.nextUrl.searchParams.get("token") !== setupToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const tests: any = {};

  try {
    const orders = await db.order.aggregate({ _sum: { total: true }, _count: true });
    tests.aggregate = { ok: true, result: orders };
  } catch (e: any) {
    tests.aggregate = { ok: false, error: e.message.slice(0, 300) };
  }

  try {
    const recent = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true, user: true },
    });
    tests.recentOrders = { ok: true, count: recent.length };
  } catch (e: any) {
    tests.recentOrders = { ok: false, error: e.message.slice(0, 300) };
  }

  try {
    const products = await db.product.findMany();
    tests.products = { ok: true, count: products.length };
  } catch (e: any) {
    tests.products = { ok: false, error: e.message.slice(0, 300) };
  }

  try {
    const users = await db.user.findMany({ where: { role: "CLIENT" }, take: 5, orderBy: { createdAt: "desc" } });
    tests.users = { ok: true, count: users.length };
  } catch (e: any) {
    tests.users = { ok: false, error: e.message.slice(0, 300) };
  }

  try {
    const lowStock = await db.product.findMany({ where: { stock: { lte: 5 } }, take: 5, include: { brand: true } });
    tests.lowStock = { ok: true, count: lowStock.length };
  } catch (e: any) {
    tests.lowStock = { ok: false, error: e.message.slice(0, 300) };
  }

  try {
    const sr = await db.serviceRequest.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 5 });
    tests.serviceRequests = { ok: true, count: sr.length };
  } catch (e: any) {
    tests.serviceRequests = { ok: false, error: e.message.slice(0, 300) };
  }

  try {
    const paid = await db.order.count({ where: { status: "PAID" } });
    tests.paidCount = { ok: true, count: paid };
  } catch (e: any) {
    tests.paidCount = { ok: false, error: e.message.slice(0, 300) };
  }

  try {
    const groups = await db.order.groupBy({ by: ["status"], _count: true });
    tests.statusGroups = { ok: true, count: groups.length };
  } catch (e: any) {
    tests.statusGroups = { ok: false, error: e.message.slice(0, 300) };
  }

  return NextResponse.json({
    url: (process.env.DATABASE_URL || "").replace(/:[^:@]+@/, ":***@"),
    tests,
  });
}
