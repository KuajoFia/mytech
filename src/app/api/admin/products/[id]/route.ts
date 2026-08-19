import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

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
    const body = await req.json();
    const data: any = { ...body };
    if (data.slug) {
      // ensure unique
      const other = await db.product.findFirst({ where: { slug: data.slug, NOT: { id } } });
      if (other) {
        return NextResponse.json({ error: "Slug déjà utilisé" }, { status: 409 });
      }
    }
    if (typeof data.regularPrice === "string") data.regularPrice = Number(data.regularPrice);
    if (typeof data.stock === "string") data.stock = Number(data.stock);
    if (typeof data.promoPrice === "string") data.promoPrice = Number(data.promoPrice) || null;
    const updated = await db.product.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const { id } = await params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}
