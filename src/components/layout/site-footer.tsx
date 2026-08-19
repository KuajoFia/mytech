"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { AgbeLogo } from "@/components/layout/site-header";

const SERVICES = [
  { href: "/services/reseau-informatique", label: "Réseau informatique" },
  { href: "/services/liaison-longue-distance", label: "Liaison longue distance" },
  { href: "/services/cameras-surveillance", label: "Caméras IP & analogiques" },
  { href: "/services/electricite-batiment", label: "Électricité bâtiment" },
  { href: "/services/panneaux-solaires", label: "Panneaux solaires" },
];

const BOUTIQUE = [
  { href: "/boutique?cat=cameras", label: "Caméras de surveillance" },
  { href: "/boutique?cat=solaire", label: "Solaire & énergie" },
  { href: "/boutique?cat=reseau", label: "Réseau informatique" },
  { href: "/boutique?cat=electricite", label: "Électricité bâtiment" },
  { href: "/boutique?cat=telecom", label: "Liaison longue distance" },
];

const ENTREPRISE = [
  { href: "/a-propos", label: "À propos" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/blog", label: "Blog & conseils" },
  { href: "/contact", label: "Contact & devis" },
  { href: "/compte", label: "Espace client" },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto bg-brand-dark text-white">
      {/* CTA strip */}
      <div className="bg-brand text-white">
        <div className="container mx-auto px-4 py-8 grid gap-4 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-white/85">
              Devis gratuit sous 24h ouvrées. Intervention à Lomé et dans tout le Togo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="tel:+22898897914"
              className="inline-flex items-center gap-2 rounded-md bg-accent-yellow px-5 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
            >
              <Phone className="h-4 w-4" /> Appeler le +228 98 89 79 14
            </a>
            <a
              href="https://wa.me/22898897914"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              WhatsApp Business
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AgbeLogo className="h-10 w-10" />
            <div className="leading-none">
              <div className="font-display text-xl font-extrabold">
                AGBE<span className="text-accent-yellow">-</span>TECH
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/70">
                Connecter · Sécuriser · Alimenter · Performer
              </div>
            </div>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            Entreprise togolaise spécialisée en solutions technologiques et énergétiques :
            réseau, vidéosurveillance, électricité, solaire et liaison longue distance.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white mb-3">
            Services
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {SERVICES.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-accent-yellow transition">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white mb-3">
            Boutique & entreprise
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {BOUTIQUE.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-accent-yellow transition">
                  {s.label}
                </Link>
              </li>
            ))}
            {ENTREPRISE.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-accent-yellow transition">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white mb-3">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Kégué, Rue Kpacha — Lomé, Togo</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <a href="tel:+22898897914" className="hover:text-accent-yellow">+228 98 89 79 14</a>
                <br />
                <a href="tel:+22893907706" className="hover:text-accent-yellow">+228 93 90 77 06</a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" />
              <a href="mailto:contact@agbe-tech.com" className="hover:text-accent-yellow">
                contact@agbe-tech.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Lun – Ven : 08h00 – 18h00<br />
                Sam : 09h00 – 13h00<br />
                Astreinte 24/7 pour clients sous contrat
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/70">
          <p>© {new Date().getFullYear()} AGBE-TECH. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
            <Link href="/cgv" className="hover:text-white">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
