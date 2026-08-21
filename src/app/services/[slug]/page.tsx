import Link from "next/link";
import { Network, Radio, Cctv, Zap, Sun, Wrench, CheckCircle2, ArrowRight, Phone, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { safeParse } from "@/lib/utils";
import { getFallbackService } from "@/lib/fallback-services";

export const dynamic = "force-dynamic";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  network: Network,
  antenna: Radio,
  cctv: Cctv,
  bolt: Zap,
  sun: Sun,
  wrench: Wrench,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let title = "Service introuvable";
  let description = "";

  // Try DB first
  try {
    const service = await db.service.findUnique({ where: { slug } });
    if (service) {
      title = `${service.title} à Lomé — Devis gratuit`;
      description = service.shortDesc;
      return {
        title,
        description,
        alternates: { canonical: `/services/${service.slug}` },
      };
    }
  } catch {}

  // Fallback
  const fallback = getFallbackService(slug);
  if (fallback) {
    return {
      title: `${fallback.title} à Lomé — Devis gratuit`,
      description: fallback.shortDesc,
      alternates: { canonical: `/services/${fallback.slug}` },
    };
  }

  return { title, description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let service: any = null;
  let dbError = false;

  try {
    service = await db.service.findUnique({ where: { slug } });
  } catch (e) {
    console.error("ServiceDetailPage DB error:", e);
    dbError = true;
  }

  // Fallback to static data if DB is empty or service not found
  if (!service) {
    const fallback = getFallbackService(slug);
    if (fallback) {
      service = fallback;
    } else {
      return <ServiceNotFound />;
    }
  }

  const Icon = SERVICE_ICONS[service.icon] ?? Network;
  const benefits = typeof service.benefits === "string" ? safeParse<string[]>(service.benefits, []) : (service.benefits || []);
  const interventions = typeof service.interventions === "string" ? safeParse<string[]>(service.interventions, []) : (service.interventions || []);
  const faqs = typeof service.faqs === "string" ? safeParse<{ q: string; a: string }[]>(service.faqs, []) : (service.faqs || []);

  // Related products (only if DB is accessible)
  let relatedProducts: any[] = [];
  if (!dbError) {
    const categorySlug =
      service.slug === "videosurveillance" || service.slug === "cameras-surveillance" ? "cameras" :
      service.slug === "solaire-energie" || service.slug === "panneaux-solaires" ? "solaire" :
      service.slug === "reseau-informatique" || service.slug === "cablage-reseau" ? "reseau" :
      service.slug === "electricite-batiment" ? "electricite" :
      service.slug === "liaison-longue-distance" ? "telecom" : null;

    if (categorySlug) {
      try {
        relatedProducts = await db.product.findMany({
          where: { category: { slug: categorySlug }, status: "ACTIVE" },
          take: 4,
          include: { brand: true },
        });
      } catch {}
    }
  }

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
      <section className="relative overflow-hidden bg-mesh text-white py-12 md:py-16 mt-2">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-brand-light/30 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="flex items-start gap-5 max-w-3xl">
            <div className="rounded-xl bg-white/10 p-4 shrink-0 backdrop-blur-sm border border-white/20">
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">{service.title}</h1>
              <p className="mt-3 text-white/85 text-base md:text-lg max-w-2xl">{service.shortDesc}</p>
              <div className="flex gap-3 mt-5">
                <Button asChild size="sm" className="bg-accent-yellow text-black hover:bg-accent-yellow/90">
                  <Link href={`/contact?devis=1&service=${service.slug}`}>
                    Demander un devis gratuit
                  </Link>
                </Button>
                <a href="tel:+22898897914" className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent-yellow transition">
                  <Phone className="h-4 w-4" /> +228 98 89 79 14
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 tracking-tight">Présentation</h2>
              <p className="text-foreground/90 leading-relaxed text-base">{service.description}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 tracking-tight">Bénéfices</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {benefits.map((b: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 bg-secondary rounded-lg p-4 hover:bg-secondary/70 transition">
                    <CheckCircle2 className="h-5 w-5 text-accent-yellow mt-0.5 shrink-0" />
                    <span className="text-sm font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 tracking-tight">Types d&apos;interventions</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {interventions.map((b: string, i: number) => (
                  <div key={i} className="border border-border/60 rounded-lg p-4 text-sm flex items-start gap-3 hover:border-brand/30 hover:shadow-card transition">
                    <ArrowRight className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <Card className="shadow-card-hover border-brand/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-display font-bold text-lg">Demander un devis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Réponse sous 24h ouvrées. Déplacement gratuit à Lomé pour diagnostic.
                </p>
                <Button asChild className="w-full bg-brand hover:bg-brand-light">
                  <Link href={`/contact?devis=1&service=${service.slug}`}>
                    Demander un devis <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <a
                  href="https://wa.me/22898897914"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-border rounded-md py-2.5 text-sm font-medium hover:bg-secondary transition"
                >
                  WhatsApp Business
                </a>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-0">
              <CardContent className="p-5">
                <h3 className="font-display font-bold text-sm mb-3 text-brand uppercase tracking-wide">Zones d&apos;intervention</h3>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-accent-yellow">▸</span> Lomé (tous quartiers)</li>
                  <li className="flex items-start gap-2"><span className="text-accent-yellow">▸</span> Kégué, Agoè, Bè, Tokoin, Adidogomé, Baguida</li>
                  <li className="flex items-start gap-2"><span className="text-accent-yellow">▸</span> Tsévié, Aného, Kpalimé</li>
                  <li className="flex items-start gap-2"><span className="text-accent-yellow">▸</span> Atakpamé, Sokodé, Kara (sur devis)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-brand text-white">
              <CardContent className="p-5">
                <h3 className="font-display font-bold text-sm mb-3 uppercase tracking-wide text-accent-yellow">Astreinte 24/7</h3>
                <p className="text-xs text-white/85 leading-relaxed mb-3">
                  Pour les clients sous contrat de maintenance, intervention sous 4h sur Lomé.
                </p>
                <a href="tel:+22898897914" className="text-sm font-bold inline-flex items-center gap-2 hover:text-accent-yellow transition">
                  <Phone className="h-4 w-4" /> +228 98 89 79 14
                </a>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-14 bg-secondary">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center tracking-tight">
              Questions fréquentes
            </h2>
            <Accordion type="single" collapsible className="bg-background rounded-xl border border-border/60 px-4">
              {faqs.map((f: { q: string; a: string }, i: number) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-2xl font-bold tracking-tight">Produits associés</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/boutique">Voir tout <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <Card key={p.id} className="overflow-hidden card-hover">
                  <Link href={`/boutique/${p.slug}`} className="block bg-secondary aspect-square flex items-center justify-center">
                    <Icon className="h-12 w-12 text-muted-foreground/40" />
                  </Link>
                  <CardContent className="p-3">
                    <div className="text-[10px] uppercase text-muted-foreground">{p.brand?.name}</div>
                    <Link href={`/boutique/${p.slug}`} className="font-semibold text-sm line-clamp-2 hover:text-brand transition">
                      {p.name}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-14 bg-mesh text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Prêt à démarrer votre projet {service.title.toLowerCase()} ?
          </h2>
          <p className="text-white/85 mb-6">
            Devis gratuit sous 24h. Notre équipe vous conseille sur la meilleure solution pour votre budget et vos contraintes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-accent-yellow text-black hover:bg-accent-yellow/90">
              <Link href={`/contact?devis=1&service=${service.slug}`}>
                Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
              <a href="tel:+22898897914">
                <Phone className="h-4 w-4 mr-2" /> Appeler
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-6">
          <Wrench className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Service introuvable</h1>
        <p className="text-muted-foreground mb-6">
          Le service que vous cherchez n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Button asChild className="bg-brand hover:bg-brand-light">
          <Link href="/services">Voir tous les services</Link>
        </Button>
      </div>
    </div>
  );
}
