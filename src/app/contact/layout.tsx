import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & devis gratuit",
  description:
    "Contactez AGBE-TECH à Lomé (Togo) pour un devis gratuit en réseau, vidéosurveillance, électricité, solaire ou télécom. Réponse sous 24h ouvrées.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
