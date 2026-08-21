import Link from "next/link";
import { Network, Radio, Cctv, Zap, Sun, CheckCircle2, ArrowRight, Phone, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { safeParse } from "@/lib/utils";

export const dynamic = "force-dynamic";


const SERVICE_ICONS: Record<string, React.ElementType> = {
  network: Network,
  antenna: Radio,
  cctv: Cctv,
  bolt: Zap,
  sun: Sun,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) return { title: "Service introuvable" };
  return {
    title: `${service.title} à Lomé — Devis gratuit | AGBE-TECH`,
    description: service.shortDesc,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) notFound();

  const Icon = SERVICE_ICONS[service.icon] ?? Network;
  const benefits = safeParse<string[]>(service.benefits, []);
  const interventions = safeParse<string[]>(service.interventions, []);
  const faqs = safeParse<{ q: string; a: string }[]>(service.faqs, []);

  // Related products (match by category approximate)
  const categorySlug =
    service.slug === "cameras-surveillance" ? "cameras" :
    service.slug === "panneaux-solaires" ? "solaire" :
    service.slug === "reseau-informatique" ? "reseau" :
    service.slug === "electricite-batiment" ? "electricite" :
    service.slug === "liaison-longue-distance" ? "telecom" : null;

  const relatedProducts = categorySlug
    ? await db.product.findMany({
        where: { category: { slug: categorySlug }, status: "ACTIVE" },
        take: 4,
        include: { brand: true },
      })
    : [];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-4 text-xs text-muted-foreground flex items-center gap-1">
        <Link href="/" className="hover:text-brand">Accueil</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/services" className="hover:text-brand">Services</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{service.title}</span>
      </nav>

      {/* Hero */}
      <section className="bg-brand-gradient text-white py-12 md:py-16 mt-2">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-5 max-w-3xl">
            <div className="rounded-xl bg-white/10 p-4 shrink-0">
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold">{service.title}</h1>
              <p className="mt-2 text-white/85">{service.shortDesc}</p>
              <div className="flex gap-3 mt-5">
                <Button asChild size="sm" className="bg-accent-yellow text-black hover:bg-accent-yellow/90">
                  <Link href={`/contact?devis=1&service=${service.slug}`}>
                    Demander un devis gratuit
                  </Link>
                </Button>
                <a href="tel:+22898897914" className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent-yellow">
                  <Phone className="h-4 w-4" /> +228 98 89 79 14
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">Présentation</h2>
              <p className="text-foreground/90 leading-relaxed">{service.description}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">Bénéfices</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 bg-secondary rounded-md p-3">
                    <CheckCircle2 className="h-4 w-4 text-accent-yellow mt-0.5 shrink-0" />
                    <span className="text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">Types d&apos;interventions</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {interventions.map((b, i) => (
                  <div key={i} className="border rounded-md p-3 text-sm flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-display font-bold text-base">Demander un devis</h3>
                <p className="text-sm text-muted-foreground">
                  Réponse sous 24h ouvrées. Déplacement gratuit à Lomé pour diagnostic.
                </p>
                <Button asChild className="w-full bg-brand hover:bg-brand-light">
                  <Link href={`/contact?devis=1&service=${service.slug}`}>
                    Demander un devis
                  </Link>
                </Button>
                <a
                  href="https://wa.me/22898897914"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border rounded-md py-2 text-sm font-medium hover:bg-secondary"
                >
                  WhatsApp Business
                </a>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-0">
              <CardContent className="p-5">
                <h3 className="font-display font-bold text-sm mb-3 text-brand">Zones d&apos;intervention</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>Lomé (tous quartiers)</li>
                  <li>Kégué, Agoè, Bè, Tokoin, Adidogomé, Baguida</li>
                  <li>Tsévié, Aného, Kpalimé</li>
                  <li>Atakpamé, Sokodé, Kara (sur devis)</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
              Questions fréquentes
            </h2>
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Produits associés</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/boutique">Voir tout <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <Link href={`/boutique/${p.slug}`} className="block bg-secondary aspect-square flex items-center justify-center">
                    <Icon className="h-12 w-12 text-muted-foreground/40" />
                  </Link>
                  <CardContent className="p-3">
                    <div className="text-[10px] uppercase text-muted-foreground">{p.brand?.name}</div>
                    <Link href={`/boutique/${p.slug}`} className="font-semibold text-sm line-clamp-2 hover:text-brand">
                      {p.name}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
