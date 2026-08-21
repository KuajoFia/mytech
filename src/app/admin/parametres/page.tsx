import { db } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";


export default async function AdminSettingsPage() {
  const settings = await db.settings.findFirst();
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Configuration de la plateforme AGBE-TECH</p>
      </div>
      <SettingsForm initial={settings ?? undefined} />
    </div>
  );
}
