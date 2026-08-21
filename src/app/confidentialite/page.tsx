import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité AGBE-TECH, conforme à la loi togolaise n° 2011-010.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-6">Politique de confidentialité</h1>

      <div className="space-y-4 text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-bold mb-2">Préambule</h2>
          <p>
            La présente politique de confidentialité décrit la manière dont AGBE-TECH collecte,
            utilise, partage et protège les données personnelles de ses utilisateurs et clients.
            Elle est conforme à la <strong>loi togolaise n° 2011-010</strong> du 9 mai 2011
            relative à la protection des données à caractère personnel.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Identité : nom, prénom, raison sociale (clients professionnels)</li>
            <li>Coordonnées : téléphone, email, adresse de livraison/facturation</li>
            <li>Informations professionnelles : NIF, RCCM (comptes pro)</li>
            <li>Données de commande : produits, montants, modes de paiement (référence de transaction uniquement, jamais les données bancaires)</li>
            <li>Communications : échanges WhatsApp / email avec notre équipe</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Finalités</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Traiter vos commandes, devis et demandes de service</li>
            <li>Émettre les documents légaux (factures, bons de livraison, reçus)</li>
            <li>Vous notifier l&apos;évolution de vos commandes (SMS, WhatsApp, email)</li>
            <li>Assurer le support client et le SAV</li>
            <li>Respecter les obligations comptables et fiscales</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Base légale</h2>
          <p>
            Le traitement de vos données repose sur votre consentement (lors de la création de
            compte ou demande de devis), sur l&apos;exécution du contrat (traitement des commandes),
            et sur nos obligations légales (facturation, comptabilité).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Durée de conservation</h2>
          <p>
            Vos données sont conservées pour la durée nécessaire à la fourniture de nos services,
            puis archivées conformément aux obligations comptables (10 ans). Les demandes de devis
            non abouties sont supprimées au bout de 2 ans.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Partage avec des tiers</h2>
          <p>
            Vos données peuvent être partagées avec :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Les agrégateurs de paiement (KKiaPay, CinetPay, PayDunya) — uniquement la référence de transaction</li>
            <li>Les transporteurs pour la livraison</li>
            <li>L&apos;administration fiscale togolaise sur demande</li>
          </ul>
          <p className="mt-2">
            Nous ne vendons jamais vos données à des tiers à des fins marketing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Vos droits</h2>
          <p>Conformément à la loi n° 2011-010, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, contactez-nous à{" "}
            <a href="mailto:contact@agbe-tech.com" className="text-brand hover:underline">contact@agbe-tech.com</a>{" "}
            ou par courrier à l&apos;adresse Kégué, Rue Kpacha — Lomé, Togo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
            protéger vos données : chiffrement HTTPS, sauvegardes quotidiennes, accès restreint,
            journalisation des actions sensibles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Cookies</h2>
          <p>
            Notre site utilise des cookies strictement nécessaires au fonctionnement (panier,
            session utilisateur). Aucun cookie publicitaire ou de tracking tiers n&apos;est
            utilisé sans consentement explicite.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Contact</h2>
          <p>
            Pour toute question relative à vos données :{" "}
            <a href="mailto:contact@agbe-tech.com" className="text-brand hover:underline">contact@agbe-tech.com</a>{" "}
            · +228 98 89 79 14.
          </p>
        </section>
      </div>
    </div>
  );
}
