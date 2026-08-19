import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/contact — handle contact form & service quote requests
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, service, location, description, delay } = body ?? {};

    if (!name || !phone) {
      return NextResponse.json({ error: "Nom et téléphone requis" }, { status: 400 });
    }

    const sr = await db.serviceRequest.create({
      data: {
        name,
        phone,
        email: email || null,
        service: service || "Non spécifié",
        location: location || null,
        description: description || "",
        delay: delay || null,
        status: "NEW",
      },
    });

    return NextResponse.json({ id: sr.id, success: true });
  } catch (e: any) {
    console.error("contact error", e);
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}
