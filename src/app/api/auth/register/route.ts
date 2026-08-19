import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { setSessionCookie, hashPassword } from "@/lib/auth";

const RegisterSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(80),
  phone: z
    .string()
    .min(8, "Téléphone invalide")
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Téléphone invalide"),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6, "Mot de passe trop court (6 caractères min)").max(100),
  companyName: z.string().optional(),
  rccm: z.string().optional(),
  nif: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const { name, phone, email, password, companyName, rccm, nif } = parsed.data;

    const existing = await db.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "Téléphone déjà utilisé" }, { status: 409 });
    }
    const cleanEmail = email && email.length > 0 ? email : undefined;
    if (cleanEmail) {
      const emailTaken = await db.user.findUnique({ where: { email: cleanEmail } });
      if (emailTaken) {
        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
      }
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        phone,
        email: cleanEmail,
        passwordHash,
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
    console.error("register error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
