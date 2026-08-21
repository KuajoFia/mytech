"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, FileText, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-provider";
import { toast } from "sonner";
import { formatFCFA, safeParse, cn } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    shortDesc: string;
    regularPrice: number;
    promoPrice?: number | null;
    stock: number;
    images: string;
    pricingMode: string;
    brand?: string | null;
    category?: string | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const images = safeParse<string[]>(product.images, []);
  const cover = images[0] && images[0].length > 0 ? images[0] : "/placeholder.png";

  const isOnRequest = product.pricingMode === "ON_REQUEST";
  const isPromo = product.promoPrice && product.promoPrice < product.regularPrice;
  const finalPrice = product.promoPrice ?? product.regularPrice;
  const discountPercent = isPromo
    ? Math.round(((product.regularPrice - (product.promoPrice as number)) / product.regularPrice) * 100)
    : 0;

  const stockLabel = product.stock > 5
    ? { text: "En stock", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" }
    : product.stock > 0
      ? { text: `Plus que ${product.stock}`, cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" }
      : { text: "Rupture", cls: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.slug.toUpperCase().slice(0, 12),
      unitPrice: finalPrice,
      quantity: 1,
      image: cover,
      pricingMode: product.pricingMode as "PRICE" | "ON_REQUEST",
      max: product.stock,
    });
    toast.success("Produit ajouté au panier", {
      description: product.name,
    });
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden flex flex-col p-0",
        "border-border/60",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-card-hover hover:border-brand/30"
      )}
    >
      <Link href={`/boutique/${product.slug}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={cover}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {isPromo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {isOnRequest && (
            <span className="inline-flex items-center rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Sur devis
            </span>
          )}
        </div>

        {/* Quick add button (appears on hover) */}
        {!isOnRequest && product.stock > 0 && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:bg-brand hover:text-white"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-1.5">
            {product.brand}
          </div>
        )}
        <Link href={`/boutique/${product.slug}`} className="block">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-brand transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 flex-1 leading-relaxed">
          {product.shortDesc}
        </p>

        {/* Stock badge with status dot */}
        <div className="mt-3 flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium", stockLabel.cls)}>
            <span className={cn("inline-block h-1.5 w-1.5 rounded-full", stockLabel.dot)} />
            {stockLabel.text}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between gap-2 pt-3 border-t border-border/60">
          {isOnRequest ? (
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Prix sur demande</div>
              <div className="text-sm font-semibold text-brand mt-0.5">Demander un devis</div>
            </div>
          ) : (
            <div>
              {isPromo && (
                <div className="text-xs text-muted-foreground line-through">
                  {formatFCFA(product.regularPrice)}
                </div>
              )}
              <div className="font-display font-bold text-brand text-lg leading-tight">
                {formatFCFA(finalPrice)}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-3">
          {isOnRequest ? (
            <Button asChild size="sm" className="w-full bg-brand hover:bg-brand-light group/btn">
              <Link href={`/contact?devis=1&produit=${product.slug}`}>
                <FileText className="h-3.5 w-3.5 mr-1.5" /> Demander un devis
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          ) : (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="bg-brand hover:bg-brand-light"
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Ajouter
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/boutique/${product.slug}`}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
