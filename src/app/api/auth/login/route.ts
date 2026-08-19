import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { setSessionCookie, verifyPassword, hashPassword } from "@/lib/auth";

const LoginSchema = z.object({
  identifier: z.string().min(3, "Identifiant requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

// POST /api/auth/login
export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const { identifier, password } = parsed.data;

    const user = await db.user.findFirst({
      where: {
        OR: [{ phone: identifier }, { email: identifier }],
      },
    });
    if (!user || !user.passwordHash) {
      // Constant-ish time delay to limit timing-based user enumeration
      await verifyPassword(password, "$2a$10$xxxxxxxxxxxxxxxxxxxxxx");
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    // Rehash if password was stored as plaintext (legacy)
    if (!user.passwordHash.startsWith("$2a$") && !user.passwordHash.startsWith("$2b$") && !user.passwordHash.startsWith("$2y$")) {
      const newHash = await hashPassword(password);
      await db.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
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
    console.error("login error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
