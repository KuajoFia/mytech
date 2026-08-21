import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const Schema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z.string().min(8, "Mot de passe trop court (8 caractères min)").max(100),
});

// POST /api/auth/reset-password
export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = Schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const { token, password } = parsed.data;

    // Find the OTP code by token
    const otp = await db.otpCode.findFirst({
      where: { code: token, channel: "EMAIL", consumed: false },
      orderBy: { createdAt: "desc" },
    });

    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Hash new password
    const hash = await hashPassword(password);

    // Update user + mark OTP as consumed in a transaction
    await db.$transaction([
      db.user.update({
        where: { id: otp.userId },
        data: { passwordHash: hash },
      }),
      db.otpCode.update({
        where: { id: otp.id },
        data: { consumed: true },
      }),
    ]);

    return NextResponse.json({ ok: true, message: "Mot de passe réinitialisé avec succès" });
  } catch (e: any) {
    console.error("reset-password error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
