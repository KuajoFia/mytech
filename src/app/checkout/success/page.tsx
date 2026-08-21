import Link from "next/link";
import { CheckCircle2, Package, Phone, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Paiement confirmé — Merci ! | AGBE-TECH",
};

type SearchParams = Promise<{ orderId?: string; paid?: string }>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const orderId = sp.orderId;
  const paid = sp.paid === "1";

  let order: any = null;
  let dbError = false;
  if (orderId) {
    try {
      order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
    } catch (e) {
      console.error("CheckoutSuccess DB error:", e);
      dbError = true;
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {paid || order ? (
          <Card className="border-0 shadow-card-hover">
            <CardContent className="p-8 md:p-10 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 animate-fade-in-scale">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
                Paiement confirmé !
              </h1>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Merci pour votre confiance. Votre commande a bien été enregistrée et notre équipe
                la prépare dans les plus brefs délais.
              </p>

              {order && (
                <div className="bg-secondary rounded-xl p-5 mb-6 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-brand" />
                    <span className="font-semibold">Récapitulatif</span>
                  </div>
                  <dl className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Numéro :</dt>
                      <dd className="font-semibold">{order.number}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Articles :</dt>
                      <dd className="font-semibold">{order.items.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Total :</dt>
                      <dd className="font-semibold text-brand">{order.total.toLocaleString("fr-FR")} FCFA</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Statut :</dt>
                      <dd className="font-semibold text-emerald-600">Payée</dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
                <strong>📩 Email de confirmation envoyé</strong> — vérifiez votre boîte mail
                (et les spams). Vous recevrez un SMS quand votre commande sera prête.
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild className="bg-brand hover:bg-brand-light">
                  <Link href="/compte">
                    Suivre ma commande <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/boutique">
                    Continuer mes achats
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-card-hover">
            <CardContent className="p-8 md:p-10 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 mb-6">
                <Package className="h-12 w-12 text-amber-600" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">
                En attente de confirmation
              </h1>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Votre paiement est en cours de vérification. Si le problème persiste,
                contactez-nous avec votre numéro de commande.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild className="bg-brand hover:bg-brand-light">
                  <Link href="/contact">Contacter le support</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Retour à l&apos;accueil</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
