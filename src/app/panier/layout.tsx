import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon panier",
  description: "Votre panier AGBE-TECH — produits sélectionnés, total et paiement sécurisé.",
  alternates: { canonical: "/panier" },
};

export default function PanierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
