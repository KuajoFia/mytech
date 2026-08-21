"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ArrowRight, Send } from "lucide-react";
import { AgbeLogo } from "@/components/layout/site-header";
import { useState } from "react";
import { toast } from "sonner";

const SERVICES = [
  { href: "/services/reseau-informatique", label: "Réseau informatique" },
  { href: "/services/videosurveillance", label: "Vidéosurveillance" },
  { href: "/services/solaire-energie", label: "Solaire & énergie" },
  { href: "/services/electricite-batiment", label: "Électricité bâtiment" },
  { href: "/services/liaison-longue-distance", label: "Liaison longue distance" },
  { href: "/services/maintenance-support", label: "Maintenance & support" },
];

const BOUTIQUE = [
  { href: "/boutique?cat=cameras", label: "Caméras de surveillance" },
  { href: "/boutique?cat=solaire", label: "Solaire & énergie" },
  { href: "/boutique?cat=reseau", label: "Réseau informatique" },
  { href: "/boutique?cat=electricite", label: "Électricité bâtiment" },
];

const ENTREPRISE = [
  { href: "/a-propos", label: "À propos" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/blog", label: "Blog & conseils" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact & devis" },
  { href: "/compte", label: "Espace client" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  async function subscribeNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Inscription enregistrée !", {
          description: "Vérifiez votre email pour confirmer.",
        });
        setEmail("");
      } else {
        toast.error(data.error || "Erreur");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="mt-auto bg-brand-dark text-white relative overflow-hidden">
      {/* Decorative mesh background */}
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />

      {/* CTA strip */}
      <div className="relative bg-gradient-to-r from-brand to-brand-light text-white">
        <div className="container mx-auto px-4 py-8 grid gap-4 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-1.5 tracking-tight">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-white/85 text-sm md:text-base">
              Devis gratuit sous 24h ouvrées. Intervention à Lomé et dans tout le Togo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="tel:+22898897914"
              className="inline-flex items-center gap-2 rounded-md bg-accent-yellow px-5 py-3 text-sm font-semibold text-black hover:bg-accent-yellow/90 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <Phone className="h-4 w-4" /> Appeler le +228 98 89 79 14
            </a>
            <a
              href="https://wa.me/22898897914"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition-all"
            >
              WhatsApp Business
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative container mx-auto px-4 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand + description + newsletter */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <AgbeLogo className="h-11 w-11" />
            <div className="leading-none">
              <div className="font-display text-2xl font-extrabold tracking-tight">
                AGBE<span className="text-accent-yellow">-</span>TECH
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/60 mt-1">
                Connecter · Sécuriser · Alimenter · Performer
              </div>
            </div>
          </div>
          <p className="text-sm text-white/75 leading-relaxed max-w-md">
            Entreprise togolaise spécialisée en solutions technologiques et énergétiques :
            réseau, vidéosurveillance, électricité, solaire et liaison longue distance.
            Depuis 2014, nous équipons les particuliers, entreprises et institutions du Togo.
          </p>

          {/* Newsletter */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white/90 mb-2">
              Newsletter
            </h4>
            <form onSubmit={subscribeNewsletter} className="flex gap-2 max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-accent-yellow text-black hover:bg-accent-yellow/90 disabled:opacity-50 transition"
                aria-label="S'abonner"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="text-[11px] text-white/50 mt-1.5">
              Conseils, nouveautés et offres. Désinscription en 1 clic.
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-3 mt-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-white mb-4">
            Services
          </h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            {SERVICES.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-accent-yellow transition inline-flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-0 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Boutique + entreprise */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-white mb-4">
            Boutique
          </h3>
          <ul className="space-y-2.5 text-sm text-white/75 mb-6">
            {BOUTIQUE.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-accent-yellow transition inline-flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-0 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-white mb-4">
            Entreprise
          </h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            {ENTREPRISE.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-accent-yellow transition inline-flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-0 opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all" />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-white mb-4">
            Contact
          </h3>
          <ul className="space-y-3.5 text-sm text-white/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent-yellow" />
              <span>Kégué, Rue Kpacha — Lomé, Togo</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent-yellow" />
              <span>
                <a href="tel:+22898897914" className="hover:text-accent-yellow transition block">+228 98 89 79 14</a>
                <a href="tel:+22893907706" className="hover:text-accent-yellow transition block">+228 93 90 77 06</a>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent-yellow" />
              <a href="mailto:contact@agbe-tech.com" className="hover:text-accent-yellow transition break-all">
                contact@agbe-tech.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-accent-yellow" />
              <span className="text-xs leading-relaxed">
                Lun – Ven : 08h00 – 18h00<br />
                Sam : 09h00 – 13h00<br />
                Astreinte 24/7 pour clients sous contrat
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment badges */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60 uppercase tracking-wide">Paiement sécurisé</span>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold border border-white/15">T-Money</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold border border-white/15">Flooz</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold border border-white/15">Virement</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-[11px] font-bold border border-white/15">Espèces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} AGBE-TECH. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white transition">Confidentialité</Link>
            <Link href="/cgv" className="hover:text-white transition">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
