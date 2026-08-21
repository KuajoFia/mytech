import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shop/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Boutique — Caméras, solaire, réseau, électricité à Lomé",
  description:
    "Achetez en ligne caméras IP, panneaux solaires, batteries, onduleurs, switchs, câbles Cat6, disjoncteurs. Paiement T-Money & Flooz. Livraison Lomé & tout le Togo.",
  alternates: { canonical: "/boutique" },
};

type SearchParams = Promise<{
  cat?: string;
  brand?: string;
  q?: string;
  sort?: string;
  max?: string;
  inStock?: string;
}>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const cat = sp.cat;
  const brand = sp.brand;
  const q = sp.q?.trim();
  const sort = sp.sort ?? "newest";
  const max = sp.max ? Number(sp.max) : undefined;
  const inStockOnly = sp.inStock === "1";

  const where: any = { status: "ACTIVE" };
  if (cat && cat !== "all") where.category = { slug: cat };
  if (brand && brand !== "all") where.brand = { slug: brand };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { shortDesc: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }
  if (typeof max === "number" && !Number.isNaN(max)) {
    where.regularPrice = { lte: max };
  }
  if (inStockOnly) {
    where.stock = { gt: 0 };
  }

  const orderBy: any =
    sort === "price-asc" ? { regularPrice: "asc" } :
    sort === "price-desc" ? { regularPrice: "desc" } :
    sort === "name" ? { name: "asc" } :
    { createdAt: "desc" };

  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];
  let dbError = false;

  try {
    [products, categories, brands] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        include: { brand: true, category: true },
      }),
      db.category.findMany({ orderBy: { name: "asc" } }),
      db.brand.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch (e) {
    console.error("ShopPage DB error:", e);
    dbError = true;
  }

  const currentCat = categories.find((c) => c.slug === cat);

  return (
    <>
      <section className="relative overflow-hidden bg-mesh text-white py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-brand-light/30 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-yellow" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Boutique en ligne</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            {currentCat ? currentCat.name : "Catalogue complet"}
          </h1>
          <p className="mt-3 text-white/80 text-base max-w-2xl">
            {dbError ? (
              <>Catalogue en cours d&apos;ajout — <Link href="/contact" className="underline">contactez-nous</Link> pour nos références disponibles.</>
            ) : (
              <>
                {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""} ·
                Paiement T-Money & Flooz · Livraison Lomé & tout le Togo
              </>
            )}
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar filters */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <ShopFilters
              categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
              brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
              current={{ cat, brand, q, sort, max, inStockOnly }}
            />
          </aside>

          {/* Product grid */}
          <div>
            {dbError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>Base de données en cours d&apos;initialisation.</strong> Le catalogue produits sera disponible prochainement.
                En attendant, <Link href="/contact" className="underline">contactez-nous</Link> pour toute demande.
              </div>
            )}
            {products.length === 0 ? (
              <div className="text-center py-24 border border-dashed rounded-2xl">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <h3 className="font-display font-semibold text-lg">Aucun produit ne correspond à vos critères</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  Essayez d&apos;élargir votre recherche ou consultez tout le catalogue.
                </p>
                <Link href="/boutique" className="mt-4 inline-block text-sm text-brand font-medium hover:underline">
                  Réinitialiser les filtres
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
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
            )}
          </div>
        </div>
      </section>
    </>
  );
}
