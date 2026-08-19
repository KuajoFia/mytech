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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!["NEW", "IN_PROGRESS", "TREATED"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }
    const updated = await db.serviceRequest.update({ where: { id }, data: { status } });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}
