import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    return null;
  }
  return session;
}

export async function GET() {
  const settings = await db.settings.findFirst();
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const existing = await db.settings.findFirst();
    let settings;
    if (existing) {
      settings = await db.settings.update({ where: { id: existing.id }, data: body });
    } else {
      settings = await db.settings.create({ data: body });
    }
    return NextResponse.json(settings);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}
