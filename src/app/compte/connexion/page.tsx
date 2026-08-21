"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Phone } from "lucide-react";

export const dynamic = "force-dynamic";


export default function LoginPage() {
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
      if (!res.ok) throw new Error(data.error ?? "Échec de connexion");
      toast.success(`Bienvenue ${data.user.name}`);
      router.push(data.user.role === "ADMIN" || data.user.role === "STAFF" ? "/admin/dashboard" : "/compte");
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
          <h1 className="font-display text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-muted-foreground">Accédez à votre espace client AGBE-TECH</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="id">Téléphone ou email</Label>
              <Input
                id="id"
                required
                placeholder="+228 90 00 00 00 ou email"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pw">Mot de passe</Label>
              <Input
                id="pw"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full bg-brand hover:bg-brand-light" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
          <div className="text-right">
            <Link href="/compte/mot-de-passe-oublie" className="text-xs text-brand hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Pas encore de compte ?{" "}
            <Link href="/compte/inscription" className="text-brand hover:underline">Créer un compte</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
