/**
 * Test a DB password via query param.
 * GET /api/test-password?token=xxx&password=YYYY
 */
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const setupToken = process.env.SETUP_DB_TOKEN;
  if (!setupToken) {
    return NextResponse.json({ error: "Setup disabled" }, { status: 403 });
  }
  const token = req.nextUrl.searchParams.get("token");
  if (token !== setupToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const password = req.nextUrl.searchParams.get("password");
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const PROJECT_REF = "fkjomoctlukymwrzkcqj";
  const url = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`;

  try {
    const prisma = new PrismaClient({
      datasources: { db: { url } },
    });
    const start = Date.now();
    const res = await prisma.$queryRaw`SELECT 1 as ok, NOW() as now, current_user as user`;
    await prisma.$disconnect();
    return NextResponse.json({
      ok: true,
      ms: Date.now() - start,
      result: res,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message.split("\n").pop()?.trim() || e.message,
      },
      { status: 500 }
    );
  }
}
