"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec");
      setSent(true);
      toast.success("Demande envoyée", { description: data.message });
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-gradient-soft px-4 py-12">
      <Card className="w-full max-w-md shadow-card-hover">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-3 h-12 w-12 rounded-md bg-brand text-white flex items-center justify-center font-extrabold text-xl">A</div>
          <h1 className="font-display text-2xl font-bold">Mot de passe oublié</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Saisissez votre email ou téléphone. Vous recevrez un lien de réinitialisation.
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                <strong>Demande envoyée.</strong> Si un compte existe pour{" "}
                <code className="font-mono bg-white/50 px-1 rounded">{identifier}</code>,
                un email contenant un lien de réinitialisation vient d&apos;être envoyé.
                Ce lien est valable 1 heure.
              </div>
              <Button asChild className="w-full bg-brand hover:bg-brand-light">
                <Link href="/compte/connexion">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la connexion
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="identifier">Email ou téléphone</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="identifier"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="exemple@email.com ou +228 90 00 00 00"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Le lien de réinitialisation sera envoyé par email si votre compte en a un.
                </p>
              </div>
              <Button type="submit" className="w-full bg-brand hover:bg-brand-light" disabled={loading}>
                {loading ? "Envoi en cours…" : "Envoyer le lien"}
              </Button>
            </form>
          )}
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
