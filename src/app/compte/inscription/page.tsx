"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const dynamic = "force-dynamic";


export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    isPro: false,
    companyName: "",
    rccm: "",
    nif: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Mot de passe trop court", { description: "6 caractères minimum." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec");
      toast.success(`Bienvenue ${data.user.name} !`);
      router.push("/compte");
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <h1 className="font-display text-2xl font-bold">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">Suivez vos commandes et devis AGBE-TECH</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone (WhatsApp) *</Label>
              <Input id="phone" required placeholder="+228 90 00 00 00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="email">Email (optionnel)</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="pw">Mot de passe (min. 6 caractères) *</Label>
              <Input id="pw" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id="pro"
                checked={form.isPro}
                onCheckedChange={(v) => setForm({ ...form, isPro: !!v })}
              />
              <span className="text-sm">Compte professionnel (entreprise, NIF/RCCM)</span>
            </label>
            {form.isPro && (
              <div className="space-y-3 p-3 bg-secondary rounded">
                <div>
                  <Label htmlFor="cn">Raison sociale</Label>
                  <Input id="cn" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="rccm">RCCM</Label>
                  <Input id="rccm" value={form.rccm} onChange={(e) => setForm({ ...form, rccm: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="nif">NIF</Label>
                  <Input id="nif" value={form.nif} onChange={(e) => setForm({ ...form, nif: e.target.value })} />
                </div>
              </div>
            )}
            <Button type="submit" className="w-full bg-brand hover:bg-brand-light" disabled={loading}>
              {loading ? "Création…" : "Créer mon compte"}
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Déjà inscrit ?{" "}
            <Link href="/compte/connexion" className="text-brand hover:underline">Se connecter</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
