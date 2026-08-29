import { getTool, SITE_URL, type ToolSlug } from "@/shared/lib/toolCatalog";

export function ToolStructuredData({ slug }: { slug: ToolSlug }) {
  const tool = getTool(slug);
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    url: `${SITE_URL}/${tool.slug}`,
    description: tool.metadataDescription,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
