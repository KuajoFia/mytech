/**
 * LocalBusiness JSON-LD structured data for SEO.
 * Renders a script tag with LocalBusiness schema for richer Google results.
 */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://agbe-tech.com/#business",
    name: "AGBE-TECH",
    legalName: "AGBE-TECH",
    description:
      "Solutions technologiques et énergétiques au Togo : réseau informatique, vidéosurveillance, électricité bâtiment, panneaux solaires, liaison longue distance.",
    url: "https://agbe-tech.com",
    telephone: "+22898897914",
    email: "contact@agbe-tech.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kégué, Rue Kpacha",
      addressLocality: "Lomé",
      addressRegion: "Maritime",
      addressCountry: "TG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.1725,
      longitude: 1.2314,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "17:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Togo",
    },
    sameAs: [
      "https://www.facebook.com/agbe-tech",
      "https://www.instagram.com/agbe-tech",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
