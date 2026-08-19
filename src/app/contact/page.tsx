"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, Clock, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SERVICES = [
  { value: "reseau-informatique", label: "Réseau informatique" },
  { value: "liaison-longue-distance", label: "Liaison longue distance" },
  { value: "cameras-surveillance", label: "Caméras IP & analogiques" },
  { value: "electricite-batiment", label: "Électricité bâtiment" },
  { value: "panneaux-solaires", label: "Panneaux solaires" },
  { value: "autre", label: "Autre demande" },
];

function ContactForm() {
  const sp = useSearchParams();
  const defaultService = sp.get("service") ?? "";
  const defaultProduit = sp.get("produit") ?? "";
  const isDevis = sp.get("devis") === "1";
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: defaultService,
    location: "",
    description: defaultProduit ? `Demande de devis pour le produit : ${defaultProduit}` : "",
    delay: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Échec de l'envoi");
      toast.success("Demande envoyée !", {
        description: "Nous vous contactons sous 24h ouvrées.",
      });
      setForm({ name: "", phone: "", email: "", service: "", location: "", description: "", delay: "" });
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-display text-xl font-bold mb-1">
          {isDevis ? "Demander un devis gratuit" : "Contactez-nous"}
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Réponse sous 24h ouvrées. Déplacement gratuit à Lomé pour diagnostic.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone (WhatsApp) *</Label>
            <Input id="phone" required placeholder="+228 90 00 00 00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="service">Service concerné</Label>
            <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
              <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Localisation (quartier / ville)</Label>
            <Input id="location" placeholder="ex : Kégué, Lomé" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="desc">Description du besoin</Label>
            <Textarea
              id="desc"
              rows={4}
              placeholder="Décrivez votre projet : type de bâtiment, surface, équipements souhaités, contraintes…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="delay">Délai souhaité (optionnel)</Label>
            <Input id="delay" placeholder="ex : dans les 2 semaines" value={form.delay} onChange={(e) => setForm({ ...form, delay: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button type="submit" disabled={submitting} className="bg-brand hover:bg-brand-light">
              {submitting ? "Envoi…" : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Envoyer ma demande
                </>
              )}
            </Button>
            <a
              href="https://wa.me/22898897914"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border rounded-md px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <FileText className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-brand-gradient text-white py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">Contact & demande de devis</h1>
          <p className="mt-2 text-white/85">
            Une question, un projet ? Notre équipe vous répond sous 24h ouvrées.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-[1fr_320px]">
          <Suspense fallback={<div className="text-muted-foreground">Chargement du formulaire…</div>}>
            <ContactForm />
          </Suspense>

          <aside className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-3 text-sm">
                <h3 className="font-display font-bold">Coordonnées</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">AGBE-TECH</div>
                    <div className="text-muted-foreground">Kégué, Rue Kpacha — Lomé, Togo</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <a href="tel:+22898897914" className="block hover:text-brand">+228 98 89 79 14</a>
                    <a href="tel:+22893907706" className="block hover:text-brand">+228 93 90 77 06</a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <a href="mailto:contact@agbe-tech.com" className="hover:text-brand">contact@agbe-tech.com</a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <div>Lun – Ven : 08h00 – 18h00</div>
                    <div>Sam : 09h00 – 13h00</div>
                    <div className="text-muted-foreground text-xs mt-1">Astreinte 24/7 (clients sous contrat)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-square">
                <iframe
                  title="Carte AGBE-TECH Kégué"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=1.27%2C6.13%2C1.31%2C6.16&layer=mapnik&marker=6.145%2C1.295"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
