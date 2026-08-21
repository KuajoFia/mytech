import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "CGV AGBE-TECH : commandes, paiements, livraisons, garanties et réclamations.",
  alternates: { canonical: "/cgv" },
};

export default function CGVPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-6">Conditions Générales de Vente</h1>

      <div className="space-y-4 text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent l&apos;ensemble des ventes
            de produits et services réalisées par AGBE-TECH, que ce soit sur la boutique en ligne,
            par téléphone, ou en magasin. Toute commande implique l&apos;acceptation pleine et
            entière des présentes CGV.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 2 — Commandes</h2>
          <p>
            Les commandes peuvent être passées en ligne (boutique), par téléphone, WhatsApp ou
            en magasin. Toute commande vaut acceptation du prix et des caractéristiques du produit.
            AGBE-TECH se réserve le droit d&apos;annuler ou refuser une commande en cas de litige
            paiement, de rupture de stock ou de suspicion de fraude.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 3 — Prix</h2>
          <p>
            Les prix sont indiqués en FCFA TTC, TVA 18 % incluse. Une remise commerciale peut être
            accordée par AGBE-TECH (visible sur la facture proforma). Les frais de livraison sont
            indiqués lors du paiement et varient selon la zone (Lomé, environs, autres régions).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 4 — Paiement</h2>
          <p>Les modes de paiement acceptés sont :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>T-Money (Moov)</li>
            <li>Flooz (Togocom)</li>
            <li>Virement bancaire (avec justificatif)</li>
            <li>Espèces au retrait ou à la livraison</li>
          </ul>
          <p className="mt-2">
            Les paiements mobiles sont traités par des agrégateurs certifiés (KKiaPay, CinetPay ou
            PayDunya). AGBE-TECH ne stocke jamais les données de paiement. La confirmation du
            paiement entraîne la génération automatique d&apos;un reçu / facture acquittée.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 5 — Livraison</h2>
          <p>
            Trois modes de livraison sont proposés : retrait magasin (Kégué, gratuit, sous 24h),
            livraison Lomé & environs (forfait 2 000 FCFA, 24–48h ouvrées), autres régions (sur
            devis). Les délais sont indicatifs et peuvent varier en cas de force majeure.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 6 — Proforma</h2>
          <p>
            La facture proforma est valable 15 jours à compter de son émission.
            Elle ne tient pas lieu de facture définitive. Le stock n&apos;est réservé qu&apos;après
            paiement et confirmation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 7 — Garantie</h2>
          <p>
            Les produits vendus bénéficient de la garantie fabricant (variable selon le produit,
            indiquée sur la fiche). Les installations réalisées par AGBE-TECH sont garanties 5 ans
            (pièces et main-d&apos;œuvre). La garantie ne couvre pas les dommages liés à une
            utilisation non conforme, à une mauvaise manipulation ou à un cas fortuit.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 8 — Rétractation et retours</h2>
          <p>
            Pour les produits achetés en boutique en ligne, vous disposez d&apos;un délai de 14 jours
            à compter de la livraison pour exercer votre droit de rétractation. Les produits doivent
            être retournés neufs, dans leur emballage d&apos;origine. Les frais de retour sont à la
            charge du client, sauf défaut produit.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 9 — Réclamations</h2>
          <p>
            Toute réclamation doit être adressée par écrit (email ou WhatsApp) dans les 48h suivant
            la livraison pour les défauts apparents. AGBE-TECH s&apos;engage à répondre sous 24h ouvrées.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 10 — Données personnelles</h2>
          <p>
            Le traitement des données est conforme à la{" "}
            <a href="/confidentialite" className="text-brand hover:underline">politique de confidentialité</a>{" "}
            et à la loi togolaise n° 2011-010.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Article 11 — Droit applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit togolais. Tout litige relèvera de la
            compétence des tribunaux de Lomé.
          </p>
        </section>
      </div>
    </div>
  );
}
