"use client";

import { useState } from "react";

import { SITE_URL, TOOL_CATALOG } from "@/shared/lib/toolCatalog";
import ToolCard from "@/shared/ui/tool-card/ToolCard";
import { FeedbackModal } from "@/shared/ui/tool-frame/FeedbackModal";

export default function Home() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "textytools.dev",
    url: "https://textytools.dev",
    description:
      "Fast, browser-based productivity tools for developers. Text manipulation, JSON formatting, case conversion, encoding, JWT decoding, and more.",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Texty Software",
    },
    hasPart: TOOL_CATALOG.map((tool) => ({
      "@type": "WebApplication",
      name: tool.name,
      url: `${SITE_URL}/${tool.slug}`,
      description: tool.metadataDescription,
      applicationCategory: "DeveloperApplication",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
        <main className="flex w-full max-w-4xl flex-col gap-12 py-16 px-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              textytools.dev
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Fast, browser-based productivity tools for developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {TOOL_CATALOG.map((tool) => (
              <ToolCard
                key={tool.slug}
                href={`/${tool.slug}`}
                title={tool.name}
                description={tool.description}
              />
            ))}

            <ToolCard
              title="&lt;Something New&gt;"
              description="Have an idea for a tool you'd like to see? Let me know!"
              onClick={() => setIsFeedbackOpen(true)}
              backgroundColor="bg-zinc-50 dark:bg-zinc-950"
            >
              <div className="mt-4 px-4 py-2 text-sm bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-md text-center font-medium">
                Suggest a Tool
              </div>
            </ToolCard>
          </div>
        </main>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        toolName="Tool Suggestion"
      />
    </>
  );
}
