"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { formatFCFA } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const { items, updateQty, remove, clear, subtotal, count, hydrated } = useCart();
  const [processingProforma, setProcessingProforma] = useState(false);

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Chargement du panier…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <ShoppingCart className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Découvrez notre catalogue et ajoutez vos produits.</p>
        <Button asChild className="bg-brand hover:bg-brand-light">
          <Link href="/boutique">
            Parcourir la boutique <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const vat = Math.round(subtotal * 0.18);
  const total = subtotal + vat;
  const hasOnRequest = items.some((i) => i.pricingMode === "ON_REQUEST");

  async function handleProforma() {
    setProcessingProforma(true);
    // Save the cart as a draft quote via API
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            sku: i.sku,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            total: i.unitPrice * i.quantity,
          })),
          guestName: "Invité",
          guestEmail: "invité@agbe-tech.com",
          guestPhone: "+228",
        }),
      });
      if (!res.ok) throw new Error("Échec création proforma");
      const data = await res.json();
      toast.success("Demande de proforma envoyée", {
        description: "Nous vous contacterons sous 24h.",
      });
      // Optional: redirect to a thank you page or order tracking
      window.location.href = `/compte/commandes/${data.orderId}?new=1`;
    } catch (e) {
      toast.error("Erreur", { description: "Impossible de créer la proforma. Réessayez." });
    } finally {
      setProcessingProforma(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-1">Mon panier</h1>
      <p className="text-sm text-muted-foreground mb-6">{count} article{count > 1 ? "s" : ""}</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4 flex items-center gap-4">
                <Link href={`/boutique/${item.slug}`} className="shrink-0">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-secondary">
                    <Image src={item.image || "/api/placeholder"} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/boutique/${item.slug}`} className="font-semibold text-sm hover:text-brand line-clamp-2">
                    {item.name}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</div>
                  {item.pricingMode === "ON_REQUEST" && (
                    <span className="text-xs text-brand">Prix sur demande</span>
                  )}
                  <div className="font-display font-bold text-brand mt-1">
                    {formatFCFA(item.unitPrice * item.quantity)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary"
                      aria-label="Diminuer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="h-8 w-10 inline-flex items-center justify-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary"
                      aria-label="Augmenter"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      remove(item.productId);
                      toast("Produit retiré du panier");
                    }}
                    className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Retirer
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between pt-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/boutique">← Continuer mes achats</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { clear(); toast("Panier vidé"); }}>
              Vider le panier
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <h2 className="font-display font-bold">Récapitulatif</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span className="font-medium">{formatFCFA(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA (18 %)</span>
                <span className="font-medium">{formatFCFA(vat)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-muted-foreground text-xs">Calculée au checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-baseline">
                <span className="font-semibold">Total TTC estimé</span>
                <span className="font-display font-extrabold text-brand text-xl">{formatFCFA(total)}</span>
              </div>

              <div className="space-y-2 pt-2">
                <Button asChild className="w-full bg-brand hover:bg-brand-light">
                  <Link href="/checkout">
                    Payer et commander <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleProforma}
                  disabled={processingProforma}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {processingProforma ? "Création…" : "Demander une facture proforma"}
                </Button>
              </div>

              {hasOnRequest && (
                <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded p-2">
                  Votre panier contient des produits « sur devis ». Une demande de proforma vous sera envoyée pour validation.
                </p>
              )}

              <p className="text-xs text-muted-foreground text-center pt-1">
                Paiement T-Money · Flooz · Virement · Espèces au retrait
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
