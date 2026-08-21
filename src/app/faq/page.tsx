import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Clock,
  ShoppingCart,
  CreditCard,
  Truck,
  ShieldCheck,
  Wrench,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes",
  description:
    "Réponses aux questions fréquentes sur nos services, la boutique en ligne, les paiements, livraisons et garanties AGBE-TECH à Lomé, Togo.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    category: "Commandes & boutique",
    icon: ShoppingCart,
    items: [
      {
        q: "Comment passer une commande sur la boutique ?",
        a: "Sélectionnez vos produits, ajoutez-les au panier, puis suivez les 4 étapes du tunnel d'achat : informations client, livraison, paiement, confirmation. Vous recevez un email de confirmation avec votre numéro de commande (format BC-AAAA-XXX).",
      },
      {
        q: "Puis-je commander sans créer de compte ?",
        a: "Oui, la commande invité est autorisée. Indiquez simplement votre nom, téléphone et email. Un compte sera automatiquement créé si vous voulez suivre vos commandes ultérieurement.",
      },
      {
        q: "Comment obtenir un devis pour un projet sur-mesure ?",
        a: "Pour les projets d'installation (caméras, solaire, réseau), utilisez le formulaire /contact?devis=1 ou appelez le +228 98 89 79 14. Réponse sous 24h ouvrées, déplacement gratuit à Lomé pour diagnostic.",
      },
      {
        q: "Les produits ont-ils une garantie ?",
        a: "Oui, tous nos produits sont garantis minimum 1 an (constructeur). Certaines catégories comme les panneaux solaires (10-25 ans) et les batteries LiFePO4 (5 ans) ont des garanties étendues. La garantie est indiquée sur chaque fiche produit.",
      },
    ],
  },
  {
    category: "Paiement",
    icon: CreditCard,
    items: [
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "T-Money (Moov), Flooz (Togocom), virement bancaire, et espèces à la livraison ou en magasin. Les paiements mobile money sont sécurisés via Kkiapay et CinetPay.",
      },
      {
        q: "Le paiement est-il sécurisé ?",
        a: "Oui, les paiements sont traités par les agrégateurs Kkiapay et CinetPay, certifiés PCI-DSS. Nous ne stockons jamais vos données bancaires. La confirmation se fait via notification sécurisée vérifiée cryptographiquement.",
      },
      {
        q: "Quand ma commande est-elle débitée ?",
        a: "Pour T-Money/Flooz : immédiatement. Pour virement : à réception du virement. Pour espèces : à la livraison ou au retrait magasin.",
      },
      {
        q: "Puis-je payer en plusieurs fois ?",
        a: "Pour les projets supérieurs à 500 000 FCFA, nous proposons un paiement en 2 ou 3 fois (50% commande, 40% livraison, 10% fin de travaux). Contactez-nous pour un échéancier personnalisé.",
      },
    ],
  },
  {
    category: "Livraison & retrait",
    icon: Truck,
    items: [
      {
        q: "Quelles sont les zones de livraison ?",
        a: "Livraison gratuite en retrait magasin (Kégué, Lomé). Livraison à domicile Lomé & environs : 2 000 FCFA, délai 24-48h. Autres régions (Sokodé, Kara, Atakpamé) : sur devis, délai 3-5 jours.",
      },
      {
        q: "Combien coûte la livraison à Lomé ?",
        a: "Lomé et environs : 2 000 FCFA pour les colis < 5 kg. Pour les colis volumineux (panneaux, batteries, onduleurs) : 5 000 à 15 000 FCFA selon le quartier.",
      },
      {
        q: "Puis-je retirer ma commande en magasin ?",
        a: "Oui, retrait gratuit à notre magasin de Kégué (Rue Kpacha, Lomé). Délai de préparation : 2-4h. Vous recevez un SMS quand votre commande est prête.",
      },
      {
        q: "Quels sont les horaires du magasin ?",
        a: "Lundi à vendredi : 08h00 - 18h00. Samedi : 09h00 - 13h00. Dimanche : fermé (astreinte téléphonique pour les clients sous contrat).",
      },
    ],
  },
  {
    category: "Services & installations",
    icon: Wrench,
    items: [
      {
        q: "Combien de temps prend une installation ?",
        a: "Cela dépend du projet : caméras (4-8) = 1 journée. Panneaux solaires domestiques (3-5 kWc) = 2-3 jours. Câblage réseau entreprise = 3-7 jours. Mise aux normes électriques = 1-3 jours. Délai précis communiqué après diagnostic.",
      },
      {
        q: "Intervenez-vous en dehors de Lomé ?",
        a: "Oui, dans toute la région maritime (Tsévié, Aného, Kpalimé) sans frais de déplacement. Pour les autres régions (Sokodé, Kara, Atakpamé), des frais de déplacement s'appliquent — sur devis.",
      },
      {
        q: "Proposez-vous des contrats de maintenance ?",
        a: "Oui, à partir de 100 000 FCFA/an pour une installation domestique. Inclut : visites préventives trimestrielles, support à distance illimité, intervention sous 24h ouvrée, et tarifs préférentiels sur pièces.",
      },
      {
        q: "Vos installations sont-elles garanties ?",
        a: "Oui, toutes nos installations sont garanties 5 ans (pièces et main-d'œuvre). Pour les panneaux solaires, garantie constructeur jusqu'à 25 ans. Pour les batteries LiFePO4, 5 ans.",
      },
    ],
  },
  {
    category: "Garanties & retours",
    icon: ShieldCheck,
    items: [
      {
        q: "Quelle est votre politique de retour ?",
        a: "Retour sous 14 jours pour les produits non installés et dans leur emballage d'origine. Remboursement sous 7 jours ouvrés après réception et inspection. Les produits installés et les consommables ne sont pas remboursables.",
      },
      {
        q: "Comment faire fonctionner la garantie ?",
        a: "Conservez votre facture (envoyée par email + disponible dans votre espace client). En cas de panne, contactez-nous au +228 98 89 79 14 ou par WhatsApp. Diagnostic gratuit, remplacement ou réparation sous 48h.",
      },
      {
        q: "Les produits sont-ils neufs ?",
        a: "Oui, tous nos produits sont neufs, importés directement des fabricants (Hikvision, Dahua, Growatt, Victron, TP-Link). Nous sommes distributeur officiel pour la plupart des marques.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh text-white py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent-yellow/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-brand-light/30 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <HelpCircle className="h-3.5 w-3.5 text-accent-yellow" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Aide & support</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            Questions fréquentes
          </h1>
          <p className="mt-3 text-white/85 text-base md:text-lg max-w-2xl">
            Tout ce que vous devez savoir sur nos services, paiements, livraisons et garanties.
            Si vous ne trouvez pas votre réponse, contactez-nous directement.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {FAQS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.category}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="rounded-xl bg-brand/10 p-2.5">
                      <Icon className="h-6 w-6 text-brand" />
                    </div>
                    <h2 className="font-display text-2xl font-bold tracking-tight">{section.category}</h2>
                  </div>
                  <Accordion type="single" collapsible className="bg-background rounded-xl border border-border/60 px-4">
                    {section.items.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-14 bg-secondary">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-0 shadow-card-hover">
            <CardContent className="p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-tight">
                    Vous n&apos;avez pas trouvé votre réponse ?
                  </h2>
                  <p className="text-muted-foreground mb-5">
                    Notre équipe répond à toutes vos questions sous 24h ouvrées. N&apos;hésitez pas à nous contacter
                    par téléphone, WhatsApp ou email.
                  </p>
                  <Button asChild size="lg" className="bg-brand hover:bg-brand-light">
                    <Link href="/contact">
                      Nous contacter <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  <a href="tel:+22898897914" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition">
                    <div className="rounded-lg bg-brand/10 p-2.5">
                      <Phone className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Téléphone</div>
                      <div className="font-semibold">+228 98 89 79 14</div>
                    </div>
                  </a>
                  <a href="mailto:contact@agbe-tech.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition">
                    <div className="rounded-lg bg-brand/10 p-2.5">
                      <Mail className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Email</div>
                      <div className="font-semibold">contact@agbe-tech.com</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3">
                    <div className="rounded-lg bg-brand/10 p-2.5">
                      <Clock className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Horaires</div>
                      <div className="font-semibold text-sm">Lun-Ven : 08h-18h · Sam : 09h-13h</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
