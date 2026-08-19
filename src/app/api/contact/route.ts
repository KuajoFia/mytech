import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const ContactSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(80),
  phone: z.string().min(8, "Téléphone invalide").max(20),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  delay: z.string().max(100).optional(),
});

// POST /api/contact — handle contact form & service quote requests
export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = ContactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const sr = await db.serviceRequest.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email && body.email.length > 0 ? body.email : null,
        service: body.service || "Non spécifié",
        location: body.location || null,
        description: body.description || "",
        delay: body.delay || null,
        status: "NEW",
      },
    });

    return NextResponse.json({ id: sr.id, success: true });
  } catch (e: any) {
    console.error("contact error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
