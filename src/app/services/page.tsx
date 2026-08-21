import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Network, Radio, Cctv, Zap, Sun, Wrench, CheckCircle2 } from "lucide-react";
import { safeParse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services tech & énergie à Lomé",
  description:
    "Nos services au Togo : installation caméras IP, panneaux solaires, câblage réseau, électricité bâtiment, liaisons longue distance. Devis gratuit, intervention à Lomé et toutes régions.",
  alternates: { canonical: "/services" },
};

const ICONS: Record<string, React.ElementType> = {
  network: Network,
  antenna: Radio,
  cctv: Cctv,
  bolt: Zap,
  sun: Sun,
  wrench: Wrench,
};

const FALLBACK_SERVICES = [
  {
    slug: "videosurveillance",
    title: "Vidéosurveillance",
    shortDesc: "Caméras IP, analogiques, PTZ — Hikvision, Dahua et plus.",
    icon: "cctv",
    benefits: ["Caméras IP 4MP/8MP haute définition", "Vision nocturne 30m+", "Détection AcuSense IA", "Accès mobile temps réel"],
  },
  {
    slug: "solaire-energie",
    title: "Solaire & énergie",
    shortDesc: "Panneaux solaires, batteries, onduleurs, kits complets.",
    icon: "sun",
    benefits: ["Dimensionnement sur mesure", "Marques tierces Growatt, Victron", "Batteries LiFePO4 longue durée", "Garantie 5 à 10 ans"],
  },
  {
    slug: "reseau-informatique",
    title: "Réseau informatique",
    shortDesc: "Câblage Cat6, switchs, routeurs, Wi-Fi entreprise.",
    icon: "network",
    benefits: ["Câblage certifié Cat6/Cat6a", "Switchs administrables VLAN", "Wi-Fi haute densité", "Audit sécurité"],
  },
  {
    slug: "electricite-batiment",
    title: "Électricité bâtiment",
    shortDesc: "Mise aux normes, tableaux, disjoncteurs, éclairage.",
    icon: "bolt",
    benefits: ["Mise aux normes NFC 15-100", "Tableaux électriques complets", "Certificat de conformité", "Dépannage 7j/7"],
  },
  {
    slug: "liaison-longue-distance",
    title: "Liaison longue distance",
    shortDesc: "Faisceaux hertziens, fibre, liaison radio longue portée.",
    icon: "antenna",
    benefits: ["Portée jusqu'à 100+ km", "Débit jusqu'à 10 Gbps", "Latence < 2 ms", "Étude LOS gratuite"],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & support",
    shortDesc: "Contrats annuels, astreinte, intervention prioritaire.",
    icon: "wrench",
    benefits: ["Visites préventives", "Support à distance", "Astreinte 7j/7", "Tarifs préférentiels"],
  },
];

export default async function ServicesPage() {
  let services: any[] = [];
  let dbError = false;

  try {
    services = await db.service.findMany({
      orderBy: { order: "asc" },
    });
    if (services.length === 0) {
      services = FALLBACK_SERVICES as any[];
    }
  } catch (e) {
    console.error("ServicesPage DB error:", e);
    services = FALLBACK_SERVICES as any[];
    dbError = true;
  }

  return (
    <>
      <section className="bg-brand-gradient text-white py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge className="mb-3 bg-accent-yellow text-black hover:bg-accent-yellow">Nos expertises</Badge>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">Nos services</h1>
          <p className="mt-3 text-white/85">
            AGBE-TECH couvre 5 domaines d'expertise pour les particuliers, entreprises et institutions au Togo :
            réseau, vidéosurveillance, solaire, électricité bâtiment et liaisons longue distance.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          {dbError && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Mode démo :</strong> certaines données sont affichées à titre indicatif en attendant l'initialisation
              de la base de données. <Link href="/contact" className="underline">Contactez-nous</Link> pour plus d'informations.
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = ICONS[s.icon] || Network;
              const benefits = safeParse<string[]>(s.benefits || "[]", []);
              return (
                <Card key={s.slug} className="overflow-hidden hover:shadow-brand transition-all duration-300 flex flex-col">
                  <div className="bg-brand/5 p-6">
                    <div className="w-12 h-12 rounded-lg bg-brand text-white flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-brand">{s.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{s.shortDesc}</p>
                  </div>
                  <CardContent className="flex-1 flex flex-col">
                    {benefits.length > 0 && (
                      <ul className="space-y-1.5 mb-4 mt-2">
                        {benefits.slice(0, 4).map((b, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href={`/services/${s.slug}`}
                      className="mt-auto inline-flex items-center text-sm font-semibold text-brand hover:text-brand-light"
                    >
                      En savoir plus <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-secondary rounded-lg text-center">
            <h3 className="font-display text-lg font-bold">Besoin d&apos;un devis personnalisé ?</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Décrivez votre projet, nous vous répondons sous 24h avec une proposition chiffrée.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-white font-semibold px-5 py-2.5 rounded-lg transition"
            >
              Demander un devis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
