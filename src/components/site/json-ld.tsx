/**
 * JSON-LD structured data components for SEO.
 * Renders schema.org markup for Google rich results.
 */

type ProductJsonLdProps = {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand?: string;
  price: number;
  promoPrice?: number | null;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
};

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  brand,
  price,
  promoPrice,
  availability,
  url,
}: ProductJsonLdProps) {
  const finalPrice = promoPrice ?? price;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [image],
    sku,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "XOF",
      price: finalPrice,
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "AGBE-TECH" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ArticleJsonLdProps = {
  title: string;
  description: string;
  image?: string;
  url: string;
  datePublished: string | Date;
  author?: string;
};

export function ArticleJsonLd({
  title,
  description,
  image,
  url,
  datePublished,
  author = "AGBE-TECH",
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished: typeof datePublished === "string" ? datePublished : datePublished.toISOString(),
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: "AGBE-TECH",
      logo: {
        "@type": "ImageObject",
        url: "https://mytech-my-des.vercel.app/logo.svg",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type BreadcrumbJsonLdProps = {
  items: Array<{ name: string; url: string }>;
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
