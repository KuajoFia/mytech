/**
 * Test endpoint: probe Supabase connection.
 * Returns detailed error so we can see what's wrong.
 */
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const setupToken = process.env.SETUP_DB_TOKEN;
  if (!setupToken) {
    return NextResponse.json({ error: "Setup disabled" }, { status: 403 });
  }
  const token = req.nextUrl.searchParams.get("token");
  if (token !== setupToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const currentUrl = process.env.DATABASE_URL || "(not set)";
  const results: any = {
    currentUrl: currentUrl.replace(/:[^:@]+@/, ":***@"),
  };

  // Test 1: query SELECT 1
  try {
    const prisma = new PrismaClient({
      datasources: { db: { url: currentUrl } },
    });
    const start = Date.now();
    const res = await prisma.$queryRaw`SELECT 1 as ok`;
    results.test1 = { ok: true, ms: Date.now() - start, res };
    await prisma.$disconnect();
  } catch (e: any) {
    results.test1 = { ok: false, error: e.message };
  }

  // Test 2: list tables
  try {
    const prisma = new PrismaClient({
      datasources: { db: { url: currentUrl } },
    });
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `;
    results.test2 = { ok: true, tables: (tables as any[]).map((t) => t.tablename) };
    await prisma.$disconnect();
  } catch (e: any) {
    results.test2 = { ok: false, error: e.message };
  }

  return NextResponse.json(results);
}
