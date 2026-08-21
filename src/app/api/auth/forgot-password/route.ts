import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/notifications/email";
import { randomUUID } from "crypto";

const Schema = z.object({
  identifier: z.string().min(3, "Email ou téléphone requis"),
});

// POST /api/auth/forgot-password
// Generates a reset token, saves it on the user, and emails a reset link.
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
    const { identifier } = parsed.data;

    // Find user by email or phone
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    });

    // For security, always return success (don't leak which emails exist)
    if (!user || !user.email) {
      return NextResponse.json({
        ok: true,
        message: "Si un compte existe, un email de réinitialisation a été envoyé.",
      });
    }

    // Generate reset token (valid 1 hour)
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await db.otpCode.create({
      data: {
        userId: user.id,
        code: token,
        channel: "EMAIL",
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "https://mytech-my-des.vercel.app"}/compte/reinitialiser-mot-de-passe?token=${token}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Réinitialisation de votre mot de passe AGBE-TECH",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1F2C">
          <div style="background: #0A3D91; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">Réinitialisation de votre mot de passe</h1>
          </div>
          <div style="border: 1px solid #E2E8F0; border-top: 0; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Bonjour ${user.name},</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau :</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetUrl}" style="background: #0A3D91; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="font-size: 12px; color: #5C6678;">Ce lien est valable 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            <hr style="margin: 24px 0; border: 0; border-top: 1px solid #E2E8F0;">
            <p style="font-size: 11px; color: #94A3B8;">AGBE-TECH — Kégué, Rue Kpacha, Lomé, Togo</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "Si un compte existe, un email de réinitialisation a été envoyé.",
    });
  } catch (e: any) {
    console.error("forgot-password error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
