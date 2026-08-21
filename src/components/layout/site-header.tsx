"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ShoppingCart, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

type NavItem = {
  href: string;
  label: string;
  children?: Array<{ href: string; label: string; desc?: string }>;
};

const NAV: NavItem[] = [
  { href: "/", label: "Accueil" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/cablage-reseau", label: "Réseau informatique", desc: "Câblage Cat6, switchs, Wi-Fi" },
      { href: "/services/videosurveillance", label: "Vidéosurveillance", desc: "Caméras IP, PTZ, Hikvision, Dahua" },
      { href: "/services/solaire-energie", label: "Solaire & énergie", desc: "Panneaux, batteries, onduleurs" },
      { href: "/services/electricite-batiment", label: "Électricité bâtiment", desc: "Mise aux normes, tableaux" },
      { href: "/services/liaison-longue-distance", label: "Liaison longue distance", desc: "Faisceaux hertziens" },
    ],
  },
  { href: "/realisations", label: "Réalisations" },
  { href: "/boutique", label: "Boutique" },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  // Hide global header on admin pages
  const isAdmin = pathname?.startsWith("/admin");
  const isHome = pathname === "/";

  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin]);

  if (isAdmin) return null;

  // On home page, header is transparent when not scrolled, white when scrolled.
  // On other pages, always white.
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "glass-header border-b border-border/60"
      )}
    >
      {/* Top utility bar — only visible when not transparent */}
      {!isTransparent && (
        <div className="hidden md:block bg-brand text-white">
          <div className="container mx-auto flex items-center justify-between py-1.5 text-xs">
            <div className="flex items-center gap-4">
              <a href="tel:+22898897914" className="flex items-center gap-1.5 hover:text-accent-yellow transition">
                <Phone className="h-3 w-3" />
                +228 98 89 79 14
              </a>
              <span className="opacity-50">·</span>
              <a href="tel:+22893907706" className="flex items-center gap-1.5 hover:text-accent-yellow transition">
                <Phone className="h-3 w-3" />
                +228 93 90 77 06
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="opacity-80">Lomé, Kégué — Rue Kpacha, Togo</span>
              <span className="opacity-50">·</span>
              <span className="font-medium tracking-wide">Connecter · Sécuriser · Alimenter · Performer</span>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 transition-colors",
            isTransparent ? "text-white" : "text-foreground"
          )}
          aria-label="AGBE-TECH accueil"
        >
          <AgbeLogo className="h-9 w-9" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight text-brand">
              AGBE<span className="text-accent-yellow">-</span>TECH
            </span>
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-[0.15em]",
              isTransparent ? "text-white/70" : "text-muted-foreground"
            )}>
              Solutions tech & énergie
            </span>
          </div>
        </Link>

        {/* Desktop nav with mega-menu */}
        <nav
          className="hidden lg:flex items-center gap-1"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const hasMenu = Boolean(item.children);
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(hasMenu ? item.href : null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-1",
                    isTransparent
                      ? (active ? "text-accent-yellow" : "text-white hover:text-accent-yellow")
                      : (active ? "text-brand bg-secondary" : "text-foreground hover:text-brand hover:bg-secondary/60")
                  )}
                >
                  {item.label}
                  {hasMenu && (
                    <ChevronDown className={cn(
                      "h-3 w-3 transition-transform",
                      openMenu === item.href && "rotate-180"
                    )} />
                  )}
                </Link>

                {/* Mega menu */}
                {hasMenu && openMenu === item.href && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-card-hover border border-border/60 overflow-hidden animate-fade-in-scale">
                    <div className="p-2">
                      {item.children!.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block p-3 rounded-lg hover:bg-secondary transition group"
                          onClick={() => setOpenMenu(null)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-sm text-foreground group-hover:text-brand transition">
                              {c.label}
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand" />
                          </div>
                          {c.desc && (
                            <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                    <div className="bg-secondary px-4 py-2.5 border-t border-border/60">
                      <Link
                        href="/services"
                        className="text-xs font-semibold text-brand hover:text-brand-light inline-flex items-center gap-1"
                      >
                        Voir tous les services <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/panier"
            className={cn(
              "relative inline-flex h-10 w-10 items-center justify-center rounded-md transition",
              isTransparent
                ? "text-white hover:bg-white/10"
                : "hover:bg-secondary text-foreground"
            )}
            aria-label="Voir le panier"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-yellow text-[10px] font-bold text-black shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          <Button
            asChild
            className={cn(
              "hidden md:inline-flex",
              isTransparent
                ? "bg-accent-yellow text-black hover:bg-accent-yellow/90"
                : "bg-brand hover:bg-brand-light"
            )}
          >
            <Link href="/contact?devis=1">Demander un devis</Link>
          </Button>
          {/* Mobile toggle */}
          <button
            className={cn(
              "lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md",
              isTransparent ? "text-white hover:bg-white/10" : "hover:bg-secondary"
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t bg-background animate-fade-in">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2 bg-brand hover:bg-brand-light">
              <Link href="/contact?devis=1" onClick={() => setOpen(false)}>
                Demander un devis
              </Link>
            </Button>
            <div className="flex items-center justify-between pt-3 mt-2 border-t text-sm">
              <a href="tel:+22898897914" className="flex items-center gap-2 text-brand font-medium">
                <Phone className="h-4 w-4" /> +228 98 89 79 14
              </a>
              <a href="tel:+22893907706" className="flex items-center gap-2 text-brand font-medium">
                <Phone className="h-4 w-4" /> +228 93 90 77 06
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function AgbeLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="10" fill="#0A3D91" />
      <path
        d="M14 33L20.5 14H27.5L34 33H28.5L27.3 29H20.7L19.5 33H14ZM22.2 24.5H25.8L24 18.5L22.2 24.5Z"
        fill="white"
      />
      <circle cx="36" cy="14" r="3.5" fill="#FFB800" />
      <path d="M10 38H38" stroke="#FFB800" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
