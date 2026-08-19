import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { CartProvider } from "@/components/cart/cart-provider";
import { LocalBusinessJsonLd } from "@/components/site/local-business-jsonld";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agbe-tech.com"),
  title: {
    default: "AGBE-TECH — Connecter · Sécuriser · Alimenter · Performer",
    template: "%s | AGBE-TECH",
  },
  description:
    "AGBE-TECH, votre partenaire de confiance à Lomé (Togo) : réseau informatique, vidéosurveillance, électricité bâtiment, panneaux solaires, liaison longue distance. Devis gratuit.",
  keywords: [
    "AGBE-TECH",
    "caméra surveillance Lomé",
    "panneau solaire Lomé",
    "électricien Lomé",
    "câblage réseau Togo",
    "installation caméra IP",
    "installateur solaire Togo",
    "faisceau hertzien Togo",
  ],
  authors: [{ name: "AGBE-TECH" }],
  creator: "AGBE-TECH",
  publisher: "AGBE-TECH",
  alternates: {
    canonical: "/",
    languages: { "fr-FR": "/", en: "/en" },
  },
  openGraph: {
    title: "AGBE-TECH — Solutions technologiques et énergétiques au Togo",
    description:
      "Site vitrine + Boutique en ligne + Espace client. Réseau, caméras IP, électricité, solaire, liaison longue distance. Lomé, Kégué — Togo.",
    url: "https://agbe-tech.com",
    siteName: "AGBE-TECH",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGBE-TECH — Solutions technologiques et énergétiques au Togo",
    description:
      "Connecter · Sécuriser · Alimenter · Performer. Lomé, Kégué — Togo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <WhatsAppFab />
        </CartProvider>
        <Toaster />
        <SonnerToaster position="top-right" />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
