import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

const Schema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().max(80).optional(),
});

// POST /api/newsletter/subscribe
export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = Schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Email invalide" },
        { status: 400 }
      );
    }
    const { email, name } = parsed.data;

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.active && existing.confirmed) {
        return NextResponse.json({ ok: true, message: "Déjà abonné" });
      }
      // Re-send confirmation if not confirmed
      const confirmToken = existing.confirmToken ?? randomUUID();
      await db.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { confirmToken, name: name ?? existing.name },
      });
      // TODO: send confirmation email with link /api/newsletter/confirm?token=...
      return NextResponse.json({
        ok: true,
        message: "Email de confirmation renvoyé",
      });
    }

    const confirmToken = randomUUID();
    await db.newsletterSubscriber.create({
      data: {
        email,
        name: name ?? null,
        confirmToken,
        confirmed: false,
        active: true,
      },
    });

    // In production: send confirmation email
    // sendEmail({ to: email, subject: "Confirmez votre inscription", html: `...` })

    return NextResponse.json({
      ok: true,
      message: "Inscription enregistrée — vérifiez votre email pour confirmer.",
    });
  } catch (e: any) {
    console.error("newsletter subscribe", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
