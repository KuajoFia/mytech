import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Réalisations AGBE-TECH — Installations solaires, vidéosurveillance, réseau à Lomé",
  description:
    "Découvrez nos chantiers livrés au Togo : installations solaires, systèmes de vidéosurveillance, câblage réseau, mise aux normes électriques, liaisons faisceau hertzien.",
  alternates: { canonical: "/realisations" },
};

const CATEGORIES = [
  { slug: "all", label: "Toutes" },
  { slug: "solar", label: "Solaire" },
  { slug: "camera", label: "Caméras" },
  { slug: "network", label: "Réseau" },
  { slug: "electricity", label: "Électricité" },
  { slug: "telecom", label: "Télécom" },
];

export default async function RealisationsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const where = cat && cat !== "all" ? { category: cat } : {};
  let realisations: any[] = [];
  let dbError = false;
  try {
    realisations = await db.realization.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("RealisationsPage DB error:", e);
    dbError = true;
  }

  return (
    <>
      <section className="bg-brand-gradient text-white py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge className="mb-3 bg-accent-yellow text-black hover:bg-accent-yellow">
            Nos réalisations
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold">
            Des projets concrets, livrés et opérationnels
          </h1>
          <p className="mt-4 text-white/85 text-lg">
            Plus de 500 chantiers livrés au Togo depuis 2014. Découvrez quelques unes de nos
            installations : solaire, vidéosurveillance, réseau, électricité, télécom.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((c) => {
              const active = (!cat && c.slug === "all") || cat === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/realisations${c.slug === "all" ? "" : `?cat=${c.slug}`}`}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand text-white border-brand"
                      : "bg-background hover:bg-secondary border-border"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>

          {/* Grid */}
          {dbError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Base de données en cours d&apos;initialisation.</strong> Les réalisations seront affichées prochainement.
            </div>
          )}
          {realisations.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Aucune réalisation dans cette catégorie pour l&apos;instant.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {realisations.map((r) => (
                <Card key={r.id} className="overflow-hidden hover:shadow-brand transition-all">
                  <Link href={`/realisations#${r.slug}`} className="block aspect-video bg-brand-gradient relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white/80">
                      <span className="text-xs uppercase tracking-widest">{r.category}</span>
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-2 text-[10px] uppercase">{r.category}</Badge>
                    <h3 className="font-display font-bold leading-snug mb-2">{r.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{r.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {r.location}
                      </span>
                      {r.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(r.date)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
