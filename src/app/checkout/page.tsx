"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ArrowRight, ShieldCheck, Truck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/components/cart/cart-provider";
import { formatFCFA } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_LOME_FEE = 2000;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    rccm: "",
    nif: "",
    billingAddress: "",
    deliveryMode: "PICKUP_STORE",
    shippingAddress: "",
    shippingCity: "Lomé",
    paymentMethod: "TMONEY",
    notes: "",
    acceptCGV: false,
  });

  if (!hydrated) {
    return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Chargement…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Votre panier est vide</h1>
        <Button asChild className="bg-brand hover:bg-brand-light mt-3">
          <Link href="/boutique">Aller à la boutique</Link>
        </Button>
      </div>
    );
  }

  const shippingFee =
    form.deliveryMode === "PICKUP_STORE" ? 0 :
    form.deliveryMode === "LOME_DELIVERY" ? DEFAULT_LOME_FEE : 0;

  const vat = Math.round(subtotal * 0.18);
  const total = subtotal + vat + shippingFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acceptCGV) {
      toast.error("Veuillez accepter les CGV");
      return;
    }
    if (!form.name || !form.phone) {
      toast.error("Nom et téléphone obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            sku: i.sku,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            total: i.unitPrice * i.quantity,
          })),
          subtotal,
          vat,
          shippingFee,
          total,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Échec de la commande");
      }
      const data = await res.json();
      clear();
      toast.success("Commande créée !");
      router.push(`/compte/commandes/${data.orderId}?new=1`);
    } catch (e: any) {
      toast.error("Erreur", { description: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-1">Finaliser ma commande</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Compte invité — un compte sera créé automatiquement avec votre numéro WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form sections */}
        <div className="space-y-6">
          {/* Account */}
          <Card>
            <CardHeader><h2 className="font-display font-bold">1. Coordonnées</h2></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
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
            </CardContent>
          </Card>

          {/* Billing */}
          <Card>
            <CardHeader><h2 className="font-display font-bold">2. Facturation</h2></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2 flex items-center gap-2 text-sm">
                <Checkbox id="pro" onCheckedChange={(v) => setForm({ ...form, companyName: v ? form.companyName : "" })} />
                <Label htmlFor="pro" className="cursor-pointer">Facturation professionnelle (raison sociale, NIF/RCCM)</Label>
              </div>
              {form.companyName !== undefined && form.companyName !== "" || form.rccm || form.nif ? (
                <>
                  <div>
                    <Label htmlFor="company">Raison sociale</Label>
                    <Input id="company" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="rccm">RCCM</Label>
                    <Input id="rccm" value={form.rccm} onChange={(e) => setForm({ ...form, rccm: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="nif">NIF</Label>
                    <Input id="nif" value={form.nif} onChange={(e) => setForm({ ...form, nif: e.target.value })} />
                  </div>
                </>
              ) : null}
              <div className="md:col-span-2">
                <Label htmlFor="addr">Adresse de facturation</Label>
                <Input id="addr" value={form.billingAddress} onChange={(e) => setForm({ ...form, billingAddress: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader><h2 className="font-display font-bold">3. Livraison</h2></CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup
                value={form.deliveryMode}
                onValueChange={(v) => setForm({ ...form, deliveryMode: v })}
                className="space-y-2"
              >
                <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-secondary has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                  <RadioGroupItem value="PICKUP_STORE" id="pickup" className="mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4 text-brand" /> Retrait magasin
                    </div>
                    <p className="text-xs text-muted-foreground">Kégué, Rue Kpacha — Lomé · Gratuit · Sous 24h</p>
                  </div>
                  <span className="text-sm font-semibold">0 FCFA</span>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-secondary has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                  <RadioGroupItem value="LOME_DELIVERY" id="lome" className="mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4 text-brand" /> Livraison Lomé & environs
                    </div>
                    <p className="text-xs text-muted-foreground">24 à 48h ouvrées · Forfait {DEFAULT_LOME_FEE} FCFA</p>
                  </div>
                  <span className="text-sm font-semibold">{formatFCFA(DEFAULT_LOME_FEE)}</span>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-secondary has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                  <RadioGroupItem value="OTHER_REGIONS" id="other" className="mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4 text-brand" /> Autres régions (sur devis)
                    </div>
                    <p className="text-xs text-muted-foreground">Tsévié, Aného, Kpalimé, Sokodé, Kara… Nous vous contacterons.</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Sur devis</span>
                </label>
              </RadioGroup>

              {form.deliveryMode !== "PICKUP_STORE" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="saddr">Adresse de livraison</Label>
                    <Input id="saddr" value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="scity">Ville</Label>
                    <Input id="scity" value={form.shippingCity} onChange={(e) => setForm({ ...form, shippingCity: e.target.value })} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader><h2 className="font-display font-bold">4. Paiement</h2></CardHeader>
            <CardContent className="space-y-2">
              <RadioGroup
                value={form.paymentMethod}
                onValueChange={(v) => setForm({ ...form, paymentMethod: v })}
                className="space-y-2"
              >
                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-secondary has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                  <RadioGroupItem value="TMONEY" id="tmoney" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">T-Money (Moov)</div>
                    <p className="text-xs text-muted-foreground">Paiement mobile sécurisé via KKiaPay/CinetPay</p>
                  </div>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded">T-Money</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-secondary has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                  <RadioGroupItem value="FLOOZ" id="flooz" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Flooz (Togocom)</div>
                    <p className="text-xs text-muted-foreground">Paiement mobile sécurisé via KKiaPay/CinetPay</p>
                  </div>
                  <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Flooz</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-secondary has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                  <RadioGroupItem value="TRANSFER" id="transfer" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Virement bancaire</div>
                    <p className="text-xs text-muted-foreground">Avec dépôt de justificatif dans votre espace client</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-secondary has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                  <RadioGroupItem value="CASH" id="cash" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Espèces au retrait / à la livraison</div>
                    <p className="text-xs text-muted-foreground">Payez en magasin ou à votre livreur</p>
                  </div>
                </label>
              </RadioGroup>
              <p className="text-xs text-muted-foreground pt-2 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                Vos données de paiement ne transitent jamais par nos serveurs. Les paiements mobiles sont traités par des agrégateurs certifiés.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-3">
          <Card>
            <CardHeader className="pb-3"><h2 className="font-display font-bold">Votre commande</h2></CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {items.map((i) => (
                  <div key={i.productId} className="flex items-center gap-2 text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="line-clamp-1 font-medium">{i.name}</div>
                      <div className="text-xs text-muted-foreground">{i.quantity} × {formatFCFA(i.unitPrice)}</div>
                    </div>
                    <div className="font-medium">{formatFCFA(i.unitPrice * i.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total HT</span>
                  <span>{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA 18 %</span>
                  <span>{formatFCFA(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>{shippingFee === 0 ? "Offerte" : formatFCFA(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total TTC</span>
                  <span className="text-brand">{formatFCFA(total)}</span>
                </div>
              </div>

              <label className="flex items-start gap-2 pt-2 text-xs">
                <Checkbox
                  id="cgv"
                  checked={form.acceptCGV}
                  onCheckedChange={(v) => setForm({ ...form, acceptCGV: !!v })}
                />
                <label htmlFor="cgv" className="text-muted-foreground">
                  J&apos;accepte les <Link href="/cgv" className="text-brand underline" target="_blank">CGV</Link> et la <Link href="/confidentialite" className="text-brand underline" target="_blank">politique de confidentialité</Link> (loi togolaise n° 2011-010).
                </label>
              </label>

              <Button type="submit" className="w-full bg-brand hover:bg-brand-light" disabled={submitting}>
                {submitting ? "Traitement…" : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Payer {formatFCFA(total)}
                  </>
                )}
              </Button>

              <a
                href="https://wa.me/22898897914"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-muted-foreground hover:text-brand pt-2"
              >
                <Phone className="h-3 w-3 inline mr-1" />
                Besoin d&apos;aide ? WhatsApp +228 98 89 79 14
              </a>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
