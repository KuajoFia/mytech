import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { ProductCard } from "@/components/shop/product-card";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/site/json-ld";
import { safeParse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let title = "Produit introuvable";
  let description = "";
  try {
    const p = await db.product.findUnique({ where: { slug }, include: { brand: true, category: true } });
    if (p) {
      title = `${p.name} — ${p.brand?.name ?? ""} | AGBE-TECH`;
      description = p.shortDesc;
      return {
        title,
        description,
        alternates: { canonical: `/boutique/${p.slug}` },
        openGraph: { title: p.name, description: p.shortDesc, type: "article" },
      };
    }
  } catch {}
  return { title, description };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product: any = null;
  let related: any[] = [];
  let suggestions: any[] = [];
  let dbError = false;

  try {
    product = await db.product.findUnique({
      where: { slug },
      include: { brand: true, category: true },
    });

    if (product && product.status === "ACTIVE") {
      [related, suggestions] = await Promise.all([
        db.product.findMany({
          where: { categoryId: product.categoryId, status: "ACTIVE", slug: { not: product.slug } },
          take: 4,
          include: { brand: true, category: true },
        }),
        db.product.findMany({
          where: { status: "ACTIVE", slug: { not: slug }, featured: true },
          take: 4,
          include: { brand: true, category: true },
        }),
      ]);
    } else if (!product) {
      // If product not found, get suggestions
      suggestions = await db.product.findMany({
        where: { status: "ACTIVE" },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { brand: true, category: true },
      });
    }
  } catch (e) {
    console.error("ProductDetailPage DB error:", e);
    dbError = true;
  }

  if (dbError) {
    return <DBError />;
  }

  if (!product || product.status !== "ACTIVE") {
    return <ProductNotFound suggestions={suggestions} />;
  }

  const relatedToShow = related.length > 0 ? related : suggestions;

  return (
    <>
      {/* JSON-LD for SEO */}
      <ProductJsonLd
        name={product.name}
        description={product.shortDesc}
        image={safeParse<string[]>(product.images, [])[0] || "/placeholder.png"}
        sku={product.sku}
        brand={product.brand?.name}
        price={product.regularPrice}
        promoPrice={product.promoPrice}
        availability={product.stock > 0 ? "InStock" : "OutOfStock"}
        url={`/boutique/${product.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "/" },
          { name: "Boutique", url: "/boutique" },
          ...(product.category ? [{ name: product.category.name, url: `/boutique?cat=${product.category.slug}` }] : []),
          { name: product.name, url: `/boutique/${product.slug}` },
        ]}
      />
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
              {product.description.split("\n").map((line: string, i: number) => (
                <p key={i} className="text-foreground/90 leading-relaxed mb-3">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedToShow.length > 0 && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-xl font-bold">
                {related.length > 0 ? "Produits liés" : "Vous aimerez aussi"}
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/boutique${product.category ? `?cat=${product.category.slug}` : ""}`}>
                  Voir la catégorie <ArrowLeft className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedToShow.map((p) => (
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

function ProductNotFound({ suggestions }: { suggestions: any[] }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
          <Search className="h-10 w-10 text-muted-foreground/60" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          Produit introuvable
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Ce produit n&apos;est plus disponible ou a été déplacé. Découvrez notre sélection ci-dessous ou
          consultez l&apos;ensemble du catalogue.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-brand hover:bg-brand-light">
            <Link href="/boutique">
              <ShoppingCart className="h-4 w-4 mr-2" /> Voir la boutique
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-6 text-center">Suggestions</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
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
      )}
    </div>
  );
}

function DBError() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-3xl font-bold mb-3">Catalogue temporairement indisponible</h1>
        <p className="text-muted-foreground mb-6">
          Notre catalogue est en cours de mise à jour. Revenez dans quelques instants ou contactez-nous directement.
        </p>
        <Button asChild className="bg-brand hover:bg-brand-light">
          <Link href="/contact">Nous contacter</Link>
        </Button>
      </div>
    </div>
  );
}
