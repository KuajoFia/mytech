import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, phone, email, password, companyName, rccm, nif } = await req.json();
    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Nom, téléphone et mot de passe requis" }, { status: 400 });
    }
    const existing = await db.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "Téléphone déjà utilisé" }, { status: 409 });
    }
    if (email) {
      const emailTaken = await db.user.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
      }
    }

    // Demo: store password as plaintext (production MUST use bcrypt)
    const user = await db.user.create({
      data: {
        name,
        phone,
        email: email || undefined,
        passwordHash: password,
        role: companyName ? "PRO" : "CLIENT",
        companyName: companyName || undefined,
        rccm: rccm || undefined,
        nif: nif || undefined,
      },
    });

    await setSessionCookie({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role as any,
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, role: user.role, phone: user.phone, email: user.email },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}
