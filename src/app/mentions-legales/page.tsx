import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mentions légales — AGBE-TECH",
  description: "Mentions légales d'AGBE-TECH, entreprise togolaise de solutions technologiques et énergétiques.",
  alternates: { canonical: "/mentions-legales" },
};

export default async function LegalPage() {
  const settings = await db.settings.findFirst();
  const year = new Date().getFullYear();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-6">Mentions légales</h1>

      <div className="prose prose-slate max-w-none space-y-4 text-foreground/90">
        <section>
          <h2 className="font-display text-xl font-bold mb-2">Éditeur du site</h2>
          <p>
            Le site <strong>www.agbe-tech.com</strong> est édité par{" "}
            <strong>{settings?.legalName ?? "AGBE-TECH"}</strong>, entreprise togolaise spécialisée
            dans les solutions technologiques et énergétiques.
          </p>
          <p className="mt-2">
            Adresse : {settings?.address ?? "Kégué, Rue Kpacha — Lomé, Togo"}<br />
            Téléphone : {settings?.phone1 ?? "+228 98 89 79 14"} / {settings?.phone2 ?? "+228 93 90 77 06"}<br />
            Email : {settings?.email ?? "contact@agbe-tech.com"}<br />
            {settings?.rccm && <>RCCM : {settings.rccm}<br /></>}
            {settings?.nif && <>NIF : {settings.nif}<br /></>}
            TVA : {Math.round((settings?.vatRate ?? 0.18) * 100)} %
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Directeur de publication</h2>
          <p>Le directeur de la publication est le représentant légal d&apos;AGBE-TECH.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Hébergement</h2>
          <p>
            Le site est hébergé par un prestataire d&apos;hébergement web professionnel respectant
            les normes en vigueur. Les coordonnées de l&apos;hébergeur peuvent être obtenues sur
            simple demande à <a href={`mailto:${settings?.email ?? "contact@agbe-tech.com"}`} className="text-brand hover:underline">{settings?.email ?? "contact@agbe-tech.com"}</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, logos, images, vidéos,
            charte graphique) est la propriété exclusive d&apos;AGBE-TECH, sauf mention contraire.
            Toute reproduction, représentation, modification ou exploitation, totale ou partielle,
            sans autorisation préalable écrite, est interdite et pourra faire l&apos;objet de poursuites.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Facturation</h2>
          <p>
            Conformément à la réglementation togolaise, toutes les factures émises par AGBE-TECH
            comportent une numérotation séquentielle inaltérable, la TVA de {Math.round((settings?.vatRate ?? 0.18) * 100)} %,
            ainsi que les mentions RCCM et NIF de l&apos;entreprise.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Données personnelles</h2>
          <p>
            Le traitement des données personnelles est conforme à la{" "}
            <strong>loi togolaise n° 2011-010</strong> du 9 mai 2011 relative à la protection
            des données à caractère personnel. Pour plus d&apos;informations, consultez notre{" "}
            <a href="/confidentialite" className="text-brand hover:underline">politique de confidentialité</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Médiation</h2>
          <p>
            En cas de litige non résolu, le client peut recourir à une procédure de médiation
            conventionnelle. Pour toute réclamation, contactez-nous à{" "}
            <a href={`mailto:${settings?.email ?? "contact@agbe-tech.com"}`} className="text-brand hover:underline">{settings?.email ?? "contact@agbe-tech.com"}</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-2">Crédits</h2>
          <p>Conception, développement et intégration : équipe AGBE-TECH.</p>
        </section>
      </div>
    </div>
  );
}
