import Link from "next/link";
import type { Metadata } from "next";
import { Target, Heart, Users, Award, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "À propos — AGBE-TECH, entreprise togolaise tech & énergie",
  description:
    "AGBE-TECH est une entreprise togolaise basée à Lomé, spécialisée en réseau, vidéosurveillance, électricité bâtiment, solaire et télécom. Découvrez notre histoire, nos valeurs et notre équipe.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = [
  { icon: Award, title: "Excellence technique", desc: "Techniciens certifiés, composants de marques reconnues (Hikvision, Growatt, Schneider, Cisco), respect strict des normes NFC 15-100 et ANSI/TIA." },
  { icon: Heart, title: "Proximité client", desc: "Une entreprise locale à taille humaine. Vous parlez directement au chef de projet, sans intermédiaire." },
  { icon: Target, title: "Engagement résultat", desc: "Devis respecté, délais tenus, garantie 5 ans sur les installations. Notre réputation se construit chantier après chantier." },
  { icon: Users, title: "Impact local", desc: "Près de 15 emplois directs, formation continue de jeunes togolais, partenariats avec quincailleries et écoles techniques de Lomé." },
];

const TIMELINE = [
  { year: "2014", title: "Création d'AGBE-TECH", desc: "Ouverture du premier atelier à Kégué, Lomé. Activité initiale : installation électrique et dépannage." },
  { year: "2016", title: "Extension réseau & caméras", desc: "Déploiement de l'expertise réseau informatique et vidéosurveillance IP. Premiers contrats hôtels et commerces." },
  { year: "2019", title: "Pôle énergie solaire", desc: "Lancement du pôle solaire : kits résidentiels, hybrides, pompes solaires. Partenariat Growatt et Victron." },
  { year: "2022", title: "Liaisons longue distance", desc: "Déploiement de faisceaux hertziens pour opérateurs et entreprises multi-sites au Togo." },
  { year: "2026", title: "Plateforme e-commerce", desc: "Mise en ligne de la boutique en ligne et de l'espace client AGBE-TECH." },
];

const ENGAGEMENTS = [
  "Devis gratuit sous 24h ouvrées",
  "Déplacement gratuit dans Lomé pour diagnostic",
  "Garantie 5 ans sur les installations",
  "Astreinte 24/7 pour clients sous contrat",
  "Composants certifiés CE, NFC, ANSI",
  "Facturation conforme (TVA 18 %, RCCM, NIF)",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-brand-gradient text-white py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge className="mb-3 bg-accent-yellow text-black hover:bg-accent-yellow">
            Depuis 2014 · Lomé, Togo
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
            Une entreprise togolaise au service de votre autonomie
          </h1>
          <p className="mt-4 text-white/90 text-lg">
            AGBE-TECH conçoit, installe et maintient des infrastructures technologiques et énergétiques
            fiables pour les particuliers, entreprises et institutions du Togo. Notre mission : rendre
            accessibles les meilleures solutions tech et énergie, avec un service local de qualité.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Notre mission</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              Au Togo, l&apos;accès à un internet fiable, à une électricité sans coupure et à une
              sécurité physique efficace reste un défi quotidien pour les particuliers comme pour
              les entreprises. AGBE-TECH existe pour relever ce défi.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-3">
              Nous croyons qu&apos;une infrastructure bien conçue et bien installée est un investissement,
              pas une dépense. C&apos;est pourquoi nous travaillons avec des composants certifiés, des
              techniciens formés et une méthodologie rigoureuse — du premier diagnostic au suivi
              post-livraison.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Notre baseline résume notre promesse : <strong className="text-brand">Connecter, Sécuriser,
              Alimenter, Performer.</strong>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Année de création", value: "2014" },
              { label: "Chantiers livrés", value: "500+" },
              { label: "Clients actifs", value: "350+" },
              { label: "Techniciens certifiés", value: "12" },
              { label: "Zones d'intervention", value: "Tout le Togo" },
              { label: "Note moyenne clients", value: "4.8 / 5" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-secondary border-0">
                <CardContent className="p-5 text-center">
                  <div className="font-display text-2xl font-extrabold text-brand">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-3 text-brand border-brand">Nos valeurs</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Ce qui nous fait avancer</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <Card key={v.title}>
                <CardContent className="p-6">
                  <div className="rounded-lg bg-brand/10 p-3 w-fit">
                    <v.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-display font-bold mt-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 text-brand border-brand">Notre histoire</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold">12 ans de croissance maîtrisée</h2>
          </div>
          <ol className="relative border-s border-border space-y-8 ps-6">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -start-[1.4rem] flex h-3 w-3 items-center justify-center rounded-full bg-accent-yellow ring-2 ring-accent-yellow/30" />
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-xl font-bold text-brand">{t.year}</span>
                  <span className="font-semibold">{t.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-16 bg-brand-gradient text-white">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <Badge className="mb-3 bg-accent-yellow text-black hover:bg-accent-yellow">Nos engagements</Badge>
            <h2 className="font-display text-3xl font-bold mb-4">Une promesse claire, tenue à chaque chantier</h2>
            <p className="text-white/85 mb-6">
              Nous nous engageons par écrit sur chaque devis. La confiance se construit sur la
              transparence, le respect des délais et la qualité d&apos;exécution.
            </p>
            <Button asChild size="lg" className="bg-accent-yellow text-black hover:bg-accent-yellow/90">
              <Link href="/contact?devis=1">
                Démarrer un projet <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-2">
            {ENGAGEMENTS.map((e) => (
              <div key={e} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-md p-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-yellow text-black font-bold text-sm shrink-0">✓</span>
                <span className="text-sm">{e}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="outline" className="mb-3 text-brand border-brand">Nous trouver</Badge>
            <h2 className="font-display text-3xl font-bold mb-4">Notre siège à Kégué, Lomé</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand mt-0.5" />
                <div>
                  <div className="font-semibold">AGBE-TECH</div>
                  <div className="text-muted-foreground">Kégué, Rue Kpacha — Lomé, Togo</div>
                </div>
              </div>
              <div className="text-muted-foreground">
                Horaires :<br />
                Lun – Ven : 08h00 – 18h00<br />
                Sam : 09h00 – 13h00<br />
                Astreinte 24/7 (clients sous contrat)
              </div>
              <Button asChild variant="outline">
                <Link href="/contact">Voir sur la carte & contacter</Link>
              </Button>
            </div>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-secondary border">
            <iframe
              title="Localisation AGBE-TECH"
              src="https://www.openstreetmap.org/export/embed.html?bbox=1.27%2C6.13%2C1.31%2C6.16&layer=mapnik&marker=6.145%2C1.295"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
