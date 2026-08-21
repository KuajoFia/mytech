import Link from "next/link";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Wrench,
  Zap,
  Sun,
  Network,
  Cctv,
  Radio,
  Star,
  Quote,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFCFA, safeParse } from "@/lib/utils";
import { ProductCard } from "@/components/shop/product-card";

export const dynamic = "force-dynamic";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  network: Network,
  antenna: Radio,
  cctv: Cctv,
  bolt: Zap,
  sun: Sun,
};

const PROCESS_STEPS = [
  { n: "01", title: "Contact", desc: "Vous nous appelez ou demandez un devis en ligne. Réponse sous 24h ouvrées." },
  { n: "02", title: "Diagnostic", desc: "Visite technique gratuite, étude de vos besoins et contraintes." },
  { n: "03", title: "Devis", desc: "Devis détaillé et transparent, sans engagement." },
  { n: "04", title: "Intervention", desc: "Pose, configuration et mise en service par nos techniciens certifiés." },
  { n: "05", title: "Suivi", desc: "Garantie, maintenance, SAV — nous restons à vos côtés." },
];

const POINTS_FORTS = [
  { icon: Wrench, title: "Professionnel expert", desc: "Techniciens certifiés, plus de 10 ans d'expérience au Togo." },
  { icon: CheckCircle2, title: "Travail de qualité", desc: "Composants certifiés CE/NFC, installations garanties 5 ans." },
  { icon: Clock, title: "Service rapide et fiable", desc: "Astreinte 7j/7, intervention sous 48h pour les urgences." },
];

export default async function HomePage() {
  let services: any[] = [];
  let featuredProducts: any[] = [];
  let testimonials: any[] = [];

  try {
    [services, featuredProducts, testimonials] = await Promise.all([
      db.service.findMany({ orderBy: { order: "asc" }, take: 5 }),
      db.product.findMany({
        where: { featured: true, status: "ACTIVE" },
        take: 4,
        include: { brand: true, category: true },
      }),
      db.testimonial.findMany({ where: { published: true }, take: 3 }),
    ]);
  } catch (e) {
    console.error("HomePage DB error:", e);
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent-yellow blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-accent-yellow text-black hover:bg-accent-yellow">
              Lomé · Togo — Depuis 2014
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Votre partenaire de confiance en{" "}
              <span className="text-accent-yellow">solutions technologiques</span> et{" "}
              <span className="text-accent-yellow">énergétiques</span>
            </h1>
            <p className="mt-5 text-lg text-white/90 max-w-2xl">
              Réseau informatique, vidéosurveillance, électricité bâtiment, panneaux solaires et
              liaison longue distance. AGBE-TECH conçoit, installe et maintient vos infrastructures
              critiques avec professionnalisme.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent-yellow text-black hover:bg-accent-yellow/90">
                <Link href="/contact?devis=1">
                  Demander un devis gratuit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Link href="/boutique">
                  Découvrir la boutique
                </Link>
              </Button>
              <a
                href="tel:+22898897914"
                className="inline-flex items-center gap-2 text-white text-sm font-medium ml-2 hover:text-accent-yellow transition"
              >
                <Phone className="h-4 w-4" /> +228 98 89 79 14
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <div className="text-3xl font-extrabold text-accent-yellow">10+</div>
                <div className="text-xs text-white/80">ans d'expérience</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-accent-yellow">500+</div>
                <div className="text-xs text-white/80">chantiers livrés</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-accent-yellow">24/7</div>
                <div className="text-xs text-white/80">astreinte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POINTS FORTS */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-3">
          {POINTS_FORTS.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <div className="rounded-lg bg-brand/10 p-3">
                <p.icon className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-3 text-brand border-brand">Nos 5 expertises</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Une expertise complète, sous un même toit
            </h2>
            <p className="mt-3 text-muted-foreground">
              Du câblage réseau au panneau solaire, en passant par la vidéosurveillance et l'électricité,
              AGBE-TECH couvre toute la chaîne de vos besoins technologiques et énergétiques.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = SERVICE_ICONS[s.icon] ?? Wrench;
              const benefits = safeParse<string[]>(s.benefits, []);
              return (
                <Card
                  key={s.id}
                  className="group overflow-hidden hover:shadow-brand transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-brand-gradient p-3 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                    </div>
                    <Link href={`/services/${s.slug}`} className="block mt-2">
                      <h3 className="font-display text-lg font-bold group-hover:text-brand transition">
                        {s.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.shortDesc}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent-yellow mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="ghost" size="sm" className="mt-3 -ml-2 text-brand hover:text-brand">
                      <Link href={`/services/${s.slug}`}>
                        En savoir plus <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3 text-brand border-brand">Notre méthode</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              De votre demande à la mise en service
            </h2>
            <p className="mt-3 text-muted-foreground">
              Un processus éprouvé en 5 étapes, du premier contact au suivi post-livraison.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} className="relative">
                <div className="bg-background rounded-lg border p-5 h-full">
                  <div className="font-display text-3xl font-extrabold text-brand/30">{step.n}</div>
                  <h3 className="font-display font-bold text-base mt-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
              <div>
                <Badge variant="outline" className="mb-3 text-brand border-brand">Boutique</Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  Produits phares
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Une sélection de matériel certifié, livré à Lomé et dans tout le Togo.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/boutique">
                  Voir tout le catalogue <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((p) => (
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

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="outline" className="mb-3 text-brand border-brand">Témoignages</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Ils nous font confiance
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.id} className="bg-background">
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 text-accent-yellow mb-3" />
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < t.rating ? "text-accent-yellow fill-accent-yellow" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-4">{t.content}</p>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-brand-gradient h-9 w-9 flex items-center justify-center text-white font-semibold text-xs">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.role}{t.company ? ` · ${t.company}` : ""}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUST / Why choose us */}
      <section className="py-16 md:py-20 bg-brand-gradient text-white">
        <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <Badge className="mb-3 bg-accent-yellow text-black hover:bg-accent-yellow">Pourquoi AGBE-TECH ?</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              La sérénité d'un partenaire unique pour vos infrastructures
            </h2>
            <p className="text-white/85 mb-6">
              Électricité, réseau, vidéosurveillance, énergie solaire : plutôt que de multiplier les
              prestataires, faites appel à une équipe intégrée. Vous gagnez en cohérence, en sécurité et
              en coût total de possession. Chaque chantier est encadré par un chef de projet dédié.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "Installations garanties 5 ans" },
                { icon: Wrench, label: "Techniciens certifiés" },
                { icon: Clock, label: "Astreinte 24/7" },
                { icon: Users, label: "+500 clients satisfaits" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <item.icon className="h-5 w-5 text-accent-yellow shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-6 bg-accent-yellow text-black hover:bg-accent-yellow/90">
              <Link href="/contact?devis=1">
                Démarrer mon projet <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="font-display text-4xl font-extrabold text-accent-yellow">5</div>
                <div className="text-xs mt-1">expertises complètes</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur mt-6">
              <CardContent className="p-6 text-center">
                <div className="font-display text-4xl font-extrabold text-accent-yellow">25 ans</div>
                <div className="text-xs mt-1">garantie panneaux solaires</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur -mt-6">
              <CardContent className="p-6 text-center">
                <div className="font-display text-4xl font-extrabold text-accent-yellow">24h</div>
                <div className="text-xs mt-1">délai de réponse devis</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="font-display text-4xl font-extrabold text-accent-yellow">100%</div>
                <div className="text-xs mt-1">conformité NFC 15-100</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
