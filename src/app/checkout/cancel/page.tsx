import Link from "next/link";
import { XCircle, RefreshCw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Paiement annulé | AGBE-TECH",
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full">
        <Card className="border-0 shadow-card-hover">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6 animate-fade-in-scale">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              Paiement annulé
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Votre paiement n&apos;a pas été finalisé. Aucun montant n&apos;a été débité de votre compte.
              Vous pouvez réessayer à tout moment.
            </p>
            <div className="bg-secondary rounded-lg p-4 mb-6 text-sm text-left">
              <h3 className="font-semibold mb-2">Causes possibles :</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Solde T-Money / Flooz insuffisant</li>
                <li>• Annulation manuelle de votre part</li>
                <li>• Délai d&apos;inactivité dépassé</li>
                <li>• Problème temporaire de connexion</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild className="bg-brand hover:bg-brand-light">
                <Link href="/panier">
                  <RefreshCw className="h-4 w-4 mr-2" /> Réessayer le paiement
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contacter le support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            Besoin d&apos;aide ? <a href="tel:+22898897914" className="text-brand font-semibold hover:underline">+228 98 89 79 14</a>
          </p>
        </div>
      </div>
    </div>
  );
}
