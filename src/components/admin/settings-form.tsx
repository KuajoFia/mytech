"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";

type Settings = {
  id?: string;
  companyName?: string;
  legalName?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  rccm?: string;
  nif?: string;
  vatRate?: number;
  proformaValidity?: number;
  lomeDeliveryFee?: number;
  otherRegionsFee?: number;
  whatsapp?: string;
  instagram?: string | null;
  facebook?: string | null;
  kkiapayKey?: string | null;
  cinetpayKey?: string | null;
  paydunaKey?: string | null;
};

export function SettingsForm({ initial }: { initial?: Settings }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Settings>(initial ?? {
    companyName: "AGBE-TECH",
    legalName: "AGBE-TECH",
    address: "Kégué, Rue Kpacha — Lomé, Togo",
    phone1: "+228 98 89 79 14",
    phone2: "+228 93 90 77 06",
    email: "contact@agbe-tech.com",
    rccm: "",
    nif: "",
    vatRate: 0.18,
    proformaValidity: 15,
    lomeDeliveryFee: 2000,
    otherRegionsFee: 0,
    whatsapp: "22898897914",
    instagram: "",
    facebook: "",
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          vatRate: Number(form.vatRate),
          proformaValidity: Number(form.proformaValidity),
          lomeDeliveryFee: Number(form.lomeDeliveryFee),
          otherRegionsFee: Number(form.otherRegionsFee),
        }),
      });
      if (!res.ok) throw new Error("Échec");
      toast.success("Paramètres enregistrés");
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <Card>
        <CardHeader className="pb-3"><h2 className="font-display font-bold">Entreprise</h2></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="cn">Nom commercial</Label>
            <Input id="cn" value={form.companyName ?? ""} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="ln">Raison sociale légale</Label>
            <Input id="ln" value={form.legalName ?? ""} onChange={(e) => setForm({ ...form, legalName: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="ad">Adresse</Label>
            <Input id="ad" value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="p1">Téléphone 1</Label>
            <Input id="p1" value={form.phone1 ?? ""} onChange={(e) => setForm({ ...form, phone1: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="p2">Téléphone 2</Label>
            <Input id="p2" value={form.phone2 ?? ""} onChange={(e) => setForm({ ...form, phone2: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="em">Email</Label>
            <Input id="em" type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="wa">WhatsApp (chiffres uniquement)</Label>
            <Input id="wa" value={form.whatsapp ?? ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="rccm">RCCM</Label>
            <Input id="rccm" value={form.rccm ?? ""} onChange={(e) => setForm({ ...form, rccm: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="nif">NIF</Label>
            <Input id="nif" value={form.nif ?? ""} onChange={(e) => setForm({ ...form, nif: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><h2 className="font-display font-bold">Commerce</h2></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="vat">Taux TVA (0–1)</Label>
            <Input id="vat" type="number" step="0.01" min="0" max="1" value={form.vatRate ?? 0.18} onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) })} />
            <p className="text-xs text-muted-foreground mt-1">18 % = 0.18</p>
          </div>
          <div>
            <Label htmlFor="pv">Validité proforma (jours)</Label>
            <Input id="pv" type="number" min="1" value={form.proformaValidity ?? 15} onChange={(e) => setForm({ ...form, proformaValidity: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="lf">Frais livraison Lomé (FCFA)</Label>
            <Input id="lf" type="number" value={form.lomeDeliveryFee ?? 2000} onChange={(e) => setForm({ ...form, lomeDeliveryFee: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="of">Frais autres régions (FCFA, 0 = sur devis)</Label>
            <Input id="of" type="number" value={form.otherRegionsFee ?? 0} onChange={(e) => setForm({ ...form, otherRegionsFee: Number(e.target.value) })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><h2 className="font-display font-bold">Paiements (clés agrégateurs)</h2></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="kk">KKiaPay Key</Label>
            <Input id="kk" type="password" value={form.kkiapayKey ?? ""} onChange={(e) => setForm({ ...form, kkiapayKey: e.target.value })} placeholder="Optionnel — démo" />
          </div>
          <div>
            <Label htmlFor="cp">CinetPay Key</Label>
            <Input id="cp" type="password" value={form.cinetpayKey ?? ""} onChange={(e) => setForm({ ...form, cinetpayKey: e.target.value })} placeholder="Optionnel — démo" />
          </div>
          <div>
            <Label htmlFor="pd">PayDunya Key</Label>
            <Input id="pd" type="password" value={form.paydunaKey ?? ""} onChange={(e) => setForm({ ...form, paydunaKey: e.target.value })} placeholder="Optionnel — démo" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-light">
          <Save className="h-4 w-4 mr-1" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
