"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/boutique", label: "Boutique" },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  // Hide global header on admin pages (admin has its own layout)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top utility bar */}
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

      {/* Main nav */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="AGBE-TECH accueil">
          <AgbeLogo className="h-9 w-9" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight text-brand">
              AGBE<span className="text-accent-yellow">-</span>TECH
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Solutions tech & énergie
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active ? "text-brand bg-secondary" : "text-foreground hover:text-brand hover:bg-secondary/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/panier"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary transition"
            aria-label="Voir le panier"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-yellow text-[10px] font-bold text-black">
                {cartCount}
              </span>
            )}
          </Link>
          <Button asChild className="hidden md:inline-flex bg-brand hover:bg-brand-light">
            <Link href="/contact?devis=1">Demander un devis</Link>
          </Button>
          {/* Mobile toggle */}
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t bg-background">
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
