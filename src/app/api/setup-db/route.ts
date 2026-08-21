/**
 * One-shot API endpoint to initialize the production PostgreSQL database.
 * Call: GET /api/setup-db?token=xxx
 *
 * This creates all tables in PostgreSQL via prisma db push.
 * Run once after deployment, then DELETE this file.
 *
 * Security: requires SETUP_DB_TOKEN env var matching the ?token= query param.
 */
import { NextResponse, NextRequest } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min for Prisma migration

export async function GET(req: NextRequest) {
  const setupToken = process.env.SETUP_DB_TOKEN;
  if (!setupToken) {
    return NextResponse.json(
      { error: "Setup endpoint disabled. Set SETUP_DB_TOKEN env var to use this." },
      { status: 403 }
    );
  }
  const token = req.nextUrl.searchParams.get("token");
  if (token !== setupToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  try {
    const output = execSync("bunx prisma db push --accept-data-loss", {
      encoding: "utf-8",
      timeout: 240000,
      env: process.env,
    });

    return NextResponse.json({
      ok: true,
      message: "Database schema pushed successfully",
      output: output.slice(-2000),
    });
  } catch (e: any) {
    console.error("setup-db error:", e.message);
    return NextResponse.json(
      {
        ok: false,
        error: e.message,
        stdout: e.stdout?.toString().slice(-2000),
        stderr: e.stderr?.toString().slice(-2000),
      },
      { status: 500 }
    );
  }
}
