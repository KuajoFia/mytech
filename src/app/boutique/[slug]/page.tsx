import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ArrowLeft, ShoppingCart } from "lucide-react";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { ProductCard } from "@/components/shop/product-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await db.product.findUnique({ where: { slug }, include: { brand: true, category: true } });
  if (!p) return { title: "Produit introuvable" };
  return {
    title: `${p.name} — ${p.brand?.name ?? ""} | AGBE-TECH`,
    description: p.shortDesc,
    alternates: { canonical: `/boutique/${p.slug}` },
    openGraph: {
      title: p.name,
      description: p.shortDesc,
      type: "article",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true, category: true },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: "ACTIVE",
      slug: { not: product.slug },
    },
    take: 4,
    include: { brand: true, category: true },
  });

  return (
    <>
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-4 text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand">Accueil</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/boutique" className="hover:text-brand">Boutique</Link>
        <ChevronRight className="h-3 w-3" />
        {product.category && (
          <>
            <Link href={`/boutique?cat=${product.category.slug}`} className="hover:text-brand">
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      {/* Product */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <ProductDetailClient
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              shortDesc: product.shortDesc,
              description: product.description,
              regularPrice: product.regularPrice,
              promoPrice: product.promoPrice,
              stock: product.stock,
              stockThreshold: product.stockThreshold,
              warranty: product.warranty,
              sku: product.sku,
              images: product.images,
              pdfSpec: product.pdfSpec,
              pricingMode: product.pricingMode,
              attributes: product.attributes,
              brand: product.brand?.name ?? null,
              category: product.category?.name ?? null,
            }}
          />

          {/* Long description */}
          <div className="mt-10 max-w-3xl">
            <h2 className="font-display text-xl font-bold mb-3">Description complète</h2>
            <div className="prose prose-slate max-w-none">
              {product.description.split("\n").map((line, i) => (
                <p key={i} className="text-foreground/90 leading-relaxed mb-3">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Produits liés</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/boutique?cat=${product.category?.slug}`}>
                  Voir la catégorie <ArrowLeft className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    shortDesc: p.shortDesc,
                    regularPrice: p.regularPrice,
                    promoPrice: p.promoPrice,
                    stock: p.stock,
                    images: p.images,
                    pricingMode: p.pricingMode,
                    brand: p.brand?.name ?? null,
                    category: p.category?.name ?? null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
