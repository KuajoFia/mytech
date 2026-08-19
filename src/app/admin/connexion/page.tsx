"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec");
      if (data.user.role !== "ADMIN" && data.user.role !== "STAFF") {
        throw new Error("Accès refusé — privilèges insuffisants");
      }
      toast.success(`Bienvenue ${data.user.name}`);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 h-12 w-12 rounded-md bg-brand text-white flex items-center justify-center font-extrabold text-xl">A</div>
          <h1 className="font-display text-2xl font-bold">Back-office AGBE-TECH</h1>
          <p className="text-sm text-muted-foreground">Connexion réservée à l&apos;équipe</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="id">Email ou téléphone</Label>
              <Input id="id" required value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="pw">Mot de passe</Label>
              <Input id="pw" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button type="submit" className="w-full bg-brand hover:bg-brand-light" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-secondary rounded text-xs text-muted-foreground">
            <strong className="text-foreground">Compte démo :</strong><br />
            Email : <code>admin@agbe-tech.com</code><br />
            Mot de passe : <code>agbe-admin-2026</code>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            <Link href="/" className="hover:text-brand">← Retour au site</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
