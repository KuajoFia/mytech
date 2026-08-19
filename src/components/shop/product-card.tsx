"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, FileText, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-provider";
import { toast } from "sonner";
import { formatFCFA, safeParse } from "@/lib/utils";

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
  const cover = images[0] && images[0].length > 0 ? images[0] : "/api/placeholder";

  const isOnRequest = product.pricingMode === "ON_REQUEST";
  const isPromo = product.promoPrice && product.promoPrice < product.regularPrice;
  const finalPrice = product.promoPrice ?? product.regularPrice;
  const stockLabel = product.stock > 5
    ? { text: "En stock", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" }
    : product.stock > 0
      ? { text: `Plus que ${product.stock}`, cls: "bg-amber-100 text-amber-800 border-amber-200" }
      : { text: "Rupture", cls: "bg-red-100 text-red-800 border-red-200" };

  const handleAdd = () => {
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
    <Card className="group overflow-hidden hover:shadow-brand transition-all duration-300 flex flex-col">
      <Link href={`/boutique/${product.slug}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={cover}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isPromo && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white hover:bg-red-500">
            Promo
          </Badge>
        )}
        {isOnRequest && (
          <Badge className="absolute top-2 left-2 bg-brand text-white hover:bg-brand">
            Sur devis
          </Badge>
        )}
      </Link>
      <CardContent className="p-4 flex flex-col flex-1">
        {product.brand && (
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </div>
        )}
        <Link href={`/boutique/${product.slug}`} className="block">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-brand transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{product.shortDesc}</p>

        <Badge variant="outline" className={`mt-3 w-fit text-[10px] ${stockLabel.cls}`}>
          {stockLabel.text}
        </Badge>

        <div className="mt-3 flex items-end justify-between gap-2">
          {isOnRequest ? (
            <div>
              <div className="text-xs text-muted-foreground">Prix sur demande</div>
              <div className="text-sm font-semibold text-brand">Demander un devis</div>
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

        <div className="mt-3 flex gap-2">
          {isOnRequest ? (
            <Button asChild size="sm" className="flex-1 bg-brand hover:bg-brand-light">
              <Link href={`/contact?devis=1&produit=${product.slug}`}>
                <FileText className="h-3.5 w-3.5 mr-1" /> Devis
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex-1 bg-brand hover:bg-brand-light"
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Ajouter
            </Button>
          )}
          <Button asChild size="sm" variant="outline">
            <Link href={`/boutique/${product.slug}`}>Détails</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
