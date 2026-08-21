import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finaliser ma commande",
  description: "Finalisez votre commande AGBE-TECH en toute sécurité — paiement T-Money, Flooz ou virement.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
