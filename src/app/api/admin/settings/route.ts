import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { invalidateSettingsCache } from "@/lib/settings-cache";

const SettingsPatchSchema = z.object({
  companyName: z.string().max(100).optional(),
  legalName: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  phone1: z.string().max(30).optional(),
  phone2: z.string().max(30).optional(),
  email: z.string().email().max(100).optional(),
  rccm: z.string().max(50).optional(),
  nif: z.string().max(50).optional(),
  vatRate: z.number().min(0).max(1).optional(),
  proformaValidity: z.number().int().min(1).max(90).optional(),
  lomeDeliveryFee: z.number().min(0).optional(),
  otherRegionsFee: z.number().min(0).optional(),
  whatsapp: z.string().max(30).optional(),
  instagram: z.string().max(100).optional(),
  facebook: z.string().max(100).optional(),
  // Note: API keys are intentionally excluded — they live in env vars only.
});

// GET /api/admin/settings
// Returns redacted settings (no API keys) — admin only.
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const settings = await db.settings.findFirst();
  if (!settings) {
    return NextResponse.json({ error: "Settings non initialisés" }, { status: 404 });
  }
  // Strip sensitive fields before returning
  // (Even though we no longer store real keys in DB, defensive measure)
  const { kkiapayKey, cinetpayKey, paydunaKey, ...safe } = settings;
  return NextResponse.json({
    ...safe,
    hasKkiapayKey: Boolean(process.env.KKIAPAY_API_KEY),
    hasCinetpayKey: Boolean(process.env.CINETPAY_API_KEY),
    hasPaydunaKey: Boolean(process.env.PAYDUNA_API_KEY),
  });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const json = await req.json().catch(() => null);
    const parsed = SettingsPatchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    const existing = await db.settings.findFirst();
    let settings;
    if (existing) {
      settings = await db.settings.update({ where: { id: existing.id }, data: parsed.data });
    } else {
      settings = await db.settings.create({ data: { id: "singleton", ...parsed.data } });
    }
    // Invalidate cached settings so the next read picks up the new values
    await invalidateSettingsCache();
    // Strip sensitive fields
    const { kkiapayKey, cinetpayKey, paydunaKey, ...safe } = settings;
    return NextResponse.json(safe);
  } catch (e: any) {
    console.error("settings PATCH error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
