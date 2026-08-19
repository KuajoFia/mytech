"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, FileText, Minus, Plus, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-provider";
import { formatFCFA, safeParse } from "@/lib/utils";

type Attribute = { name: string; value: string };

export function ProductDetailClient({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    shortDesc: string;
    description: string;
    regularPrice: number;
    promoPrice?: number | null;
    stock: number;
    stockThreshold: number;
    warranty?: string | null;
    sku: string;
    images: string;
    pdfSpec?: string | null;
    pricingMode: string;
    attributes: string;
    brand?: string | null;
    category?: string | null;
  };
}) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const images = safeParse<string[]>(product.images, []);
  const attributes = safeParse<Attribute[]>(product.attributes, []);
  const cover = images[0] && images[0].length > 0 ? images[0] : "/placeholder.png";

  const isOnRequest = product.pricingMode === "ON_REQUEST";
  const isPromo = product.promoPrice && product.promoPrice < product.regularPrice;
  const finalPrice = product.promoPrice ?? product.regularPrice;

  const stockLabel = product.stock > 5
    ? { text: "En stock", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" }
    : product.stock > 0
      ? { text: `Plus que ${product.stock} en stock`, cls: "bg-amber-100 text-amber-800 border-amber-200" }
      : { text: "Rupture de stock", cls: "bg-red-100 text-red-800 border-red-200" };

  function handleAddToCart() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      unitPrice: finalPrice,
      quantity: qty,
      image: cover,
      pricingMode: product.pricingMode as "PRICE" | "ON_REQUEST",
      max: product.stock,
    });
    toast.success(`${qty} × ${product.name} ajouté(s) au panier`);
    router.push("/panier");
  }

  function handleBuyNow() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      unitPrice: finalPrice,
      quantity: qty,
      image: cover,
      pricingMode: product.pricingMode as "PRICE" | "ON_REQUEST",
      max: product.stock,
    });
    router.push("/checkout");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Images */}
      <div>
        <div className="aspect-square rounded-lg overflow-hidden border bg-secondary relative">
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div key={i} className="aspect-square rounded border overflow-hidden bg-secondary relative">
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 25vw, 12vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.brand && (
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{product.brand}</div>
        )}
        <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2">{product.name}</h1>
        <p className="text-sm text-muted-foreground mb-4">{product.shortDesc}</p>

        <div className="flex items-center gap-2 mb-5">
          <Badge variant="outline" className={stockLabel.cls}>{stockLabel.text}</Badge>
          <Badge variant="outline">SKU : {product.sku}</Badge>
          {product.warranty && (
            <Badge variant="outline" className="text-brand border-brand">
              <ShieldCheck className="h-3 w-3 mr-1" /> {product.warranty}
            </Badge>
          )}
        </div>

        {/* Price */}
        {isOnRequest ? (
          <div className="bg-brand/5 border border-brand/20 rounded-lg p-4 mb-5">
            <div className="text-sm font-semibold text-brand mb-1">Prix sur demande</div>
            <p className="text-xs text-muted-foreground">
              Ce produit est vendu avec installation et configuration personnalisée. Contactez-nous pour un devis détaillé.
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-3 mb-5">
            {isPromo && (
              <div className="text-lg text-muted-foreground line-through">{formatFCFA(product.regularPrice)}</div>
            )}
            <div className="font-display text-3xl font-extrabold text-brand">{formatFCFA(finalPrice)}</div>
            {isPromo && (
              <Badge className="bg-red-500 text-white">-{Math.round((1 - (finalPrice / product.regularPrice)) * 100)}%</Badge>
            )}
          </div>
        )}

        {/* Quantity + actions */}
        {!isOnRequest && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 inline-flex items-center justify-center hover:bg-secondary"
                aria-label="Diminuer la quantité"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                className="h-10 w-14 text-center border-0 focus:ring-0"
                min={1}
                max={product.stock}
              />
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="h-10 w-10 inline-flex items-center justify-center hover:bg-secondary"
                aria-label="Augmenter la quantité"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={handleAddToCart} disabled={product.stock === 0} className="bg-brand hover:bg-brand-light">
              <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter au panier
            </Button>
            <Button onClick={handleBuyNow} disabled={product.stock === 0} variant="outline">
              Acheter maintenant
            </Button>
          </div>
        )}

        {isOnRequest && (
          <div className="flex gap-3 mb-4">
            <Button asChild className="bg-brand hover:bg-brand-light">
              <a href={`/contact?devis=1&produit=${product.slug}`}>
                <FileText className="h-4 w-4 mr-2" /> Demander un devis
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://wa.me/22898897914" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        )}

        {/* Reassurance */}
        <div className="grid grid-cols-3 gap-2 text-xs mb-6">
          <div className="bg-secondary rounded-md p-2 text-center">
            <Truck className="h-4 w-4 mx-auto mb-1 text-brand" />
            <div className="font-semibold">Livraison Lomé</div>
            <div className="text-muted-foreground">24–48h</div>
          </div>
          <div className="bg-secondary rounded-md p-2 text-center">
            <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-brand" />
            <div className="font-semibold">Garantie</div>
            <div className="text-muted-foreground">{product.warranty ?? "Voir produit"}</div>
          </div>
          <div className="bg-secondary rounded-md p-2 text-center">
            <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-brand" />
            <div className="font-semibold">Paiement</div>
            <div className="text-muted-foreground">T-Money · Flooz</div>
          </div>
        </div>

        {/* Attributes */}
        {attributes.length > 0 && (
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted-foreground mb-2">
              Caractéristiques techniques
            </h3>
            <table className="w-full text-sm border rounded-md overflow-hidden">
              <tbody>
                {attributes.map((a, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-secondary/50" : "bg-background"}>
                    <td className="py-2 px-3 font-medium text-muted-foreground w-1/2">{a.name}</td>
                    <td className="py-2 px-3">{a.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {product.pdfSpec && (
          <a
            href={product.pdfSpec}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-brand hover:underline"
          >
            <FileText className="h-4 w-4" /> Télécharger la fiche technique (PDF)
          </a>
        )}
      </div>
    </div>
  );
}
