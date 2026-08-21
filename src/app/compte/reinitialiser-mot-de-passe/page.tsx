"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Lien invalide", { description: "Aucun token fourni dans l'URL." });
      router.push("/compte/mot-de-passe-oublie");
    }
  }, [token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Erreur", { description: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (password.length < 8) {
      toast.error("Erreur", { description: "Le mot de passe doit faire au moins 8 caractères." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec");
      toast.success("Mot de passe réinitialisé", {
        description: "Vous pouvez maintenant vous connecter.",
      });
      router.push("/compte/connexion");
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-gradient-soft px-4 py-12">
      <Card className="w-full max-w-md shadow-card-hover">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-3 h-12 w-12 rounded-md bg-brand text-white flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">Nouveau mot de passe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choisissez un mot de passe d&apos;au moins 8 caractères.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  aria-label="Afficher/masquer le mot de passe"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm">Confirmer</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  minLength={8}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand hover:bg-brand-light" disabled={loading}>
              {loading ? "Réinitialisation…" : "Réinitialiser mon mot de passe"}
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-4">
            <Link href="/compte/connexion" className="inline-flex items-center gap-1 text-brand hover:underline">
              <ArrowLeft className="h-3 w-3" /> Retour à la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
