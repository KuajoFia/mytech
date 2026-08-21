/**
 * Probe multiple Supabase pooler regions to find the right one.
 */
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REGIONS = [
  "eu-west-1",
  "eu-central-1",
  "us-east-1",
  "us-west-1",
  "ap-southeast-1",
  "ap-northeast-1",
  "ap-south-1",
  "sa-east-1",
];

const PROJECT_REF = "fkjomoctlukymwrzkcqj";
const PASSWORD = "Viviane@1311";

async function tryConnect(url: string) {
  try {
    const prisma = new PrismaClient({
      datasources: { db: { url } },
    });
    const start = Date.now();
    const res = await prisma.$queryRaw`SELECT 1 as ok`;
    await prisma.$disconnect();
    return { ok: true, ms: Date.now() - start, res };
  } catch (e: any) {
    return { ok: false, error: e.message.split("\n").pop()?.trim() || e.message };
  }
}

export async function GET(req: NextRequest) {
  const setupToken = process.env.SETUP_DB_TOKEN;
  if (!setupToken) {
    return NextResponse.json({ error: "Setup disabled" }, { status: 403 });
  }
  const token = req.nextUrl.searchParams.get("token");
  if (token !== setupToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const results: any[] = [];

  for (const region of REGIONS) {
    const url6543 = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    const r6543 = await tryConnect(url6543);
    results.push({ region, port: 6543, mode: "transaction", ...r6543 });

    const url5432 = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
    const r5432 = await tryConnect(url5432);
    results.push({ region, port: 5432, mode: "session", ...r5432 });
  }

  const urlDirect = `postgresql://postgres:${encodeURIComponent(PASSWORD)}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
  const rDirect = await tryConnect(urlDirect);
  results.push({ region: "direct", port: 5432, mode: "direct", ...rDirect });

  return NextResponse.json({
    results,
    success: results.filter((r) => r.ok),
  });
}
