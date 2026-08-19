import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

// POST /api/auth/login
export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      return NextResponse.json({ error: "Identifiant et mot de passe requis" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        OR: [{ phone: identifier }, { email: identifier }],
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }
    if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

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
