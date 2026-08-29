import type { Metadata } from "next";

import { getTool, SITE_URL, type ToolSlug } from "./toolCatalog";

export function createToolMetadata(slug: ToolSlug): Metadata {
  const tool = getTool(slug);
  const pathname = `/${tool.slug}`;

  return {
    title: tool.metadataTitle,
    description: tool.metadataDescription,
    keywords: [...tool.keywords, "textytools"],
    alternates: { canonical: pathname },
    openGraph: {
      type: "website",
      url: pathname,
      title: tool.metadataTitle,
      description: tool.metadataDescription,
      siteName: "textytools.dev",
    },
    twitter: {
      card: "summary",
      title: tool.metadataTitle,
      description: tool.metadataDescription,
    },
    other: {
      "application-url": `${SITE_URL}${pathname}`,
    },
  };
}
