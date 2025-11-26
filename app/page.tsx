"use client";

import { useState } from "react";
import ToolCard from "./components/ToolCard";
import { FeedbackModal } from "./components/FeedbackModal";
import { isRegexTesterEnabled } from "@/shared/lib/featureFlags";

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
    hasPart: [
      {
        "@type": "WebPage",
        name: "Text Counter",
        url: "https://textytools.dev/text-counter",
        description:
          "Count characters, words, lines, paragraphs and AI tokens in real-time",
      },
      {
        "@type": "WebPage",
        name: "Case Converter",
        url: "https://textytools.dev/case-converter",
        description: "Transform text between different case formats instantly",
      },
      {
        "@type": "WebPage",
        name: "Text Sanitizer",
        url: "https://textytools.dev/text-sanitizer",
        description:
          "Clean and transform text with customizable sanitization options",
      },
      {
        "@type": "WebPage",
        name: "JSON Wizard",
        url: "https://textytools.dev/json-wizard",
        description:
          "Format, validate, and search JSON with real-time feedback",
      },
      {
        "@type": "WebPage",
        name: "CSV / JSON Converter",
        url: "https://textytools.dev/csv-json-converter",
        description: "Convert between JSON and CSV formats with proper parsing",
      },
      {
        "@type": "WebPage",
        name: "Text Encoder",
        url: "https://textytools.dev/text-encoder",
        description: "Encode and decode text using Base64, URL, Hex, and more",
      },
      {
        "@type": "WebPage",
        name: "JWT Decoder",
        url: "https://textytools.dev/jwt-decoder",
        description: "Decode and inspect JSON Web Tokens with validation",
      },
      {
        "@type": "WebPage",
        name: "Diff Viewer",
        url: "https://textytools.dev/diff-viewer",
        description:
          "Compare two text blocks with side-by-side diff highlighting and search",
      },
      {
        "@type": "WebPage",
        name: "Regex Tester",
        url: "https://textytools.dev/regex-tester",
        description:
          "Test regular expressions with real-time match highlighting and capture groups",
      },
    ],
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
            <ToolCard
              href="/text-counter"
              title="Text Counter"
              description="Count characters, words, lines, paragraphs and AI tokens in real-time"
            />

            <ToolCard
              href="/diff-viewer"
              title="Diff Viewer"
              description="Compare two text blocks with side-by-side diff highlighting and search"
            />

            <ToolCard
              href="/case-converter"
              title="Case Converter"
              description="Transform text between different case formats instantly"
            />

            <ToolCard
              href="/text-sanitizer"
              title="Text Sanitizer"
              description="Clean and transform text with customizable sanitization options"
            />

            <ToolCard
              href="/json-wizard"
              title="JSON Wizard"
              description="Format, validate, and search JSON with real-time feedback"
            />

            <ToolCard
              href="/csv-json-converter"
              title="CSV / JSON Converter"
              description="Convert between JSON and CSV formats with proper parsing"
            />

            <ToolCard
              href="/text-encoder"
              title="Text Encoder"
              description="Encode and decode text using Base64, URL, Hex, and more"
            />

            <ToolCard
              href="/jwt-decoder"
              title="JWT Decoder"
              description="Decode and inspect JSON Web Tokens with validation"
            />

            {isRegexTesterEnabled() && (
              <ToolCard
                href="/regex-tester"
                title="Regex Tester"
                description="Test regular expressions with real-time match highlighting"
              />
            )}

            {!isRegexTesterEnabled() && (
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
            )}
          </div>

          {isRegexTesterEnabled() && (
            <div className="mt-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-lg text-zinc-700 dark:text-zinc-300">
                  Have an idea for a tool you&apos;d like to see? Let me know!
                </p>

                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="px-4 py-2 text-sm bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-md font-medium cursor-pointer hover:opacity-80 transition"
                >
                  Suggest a Tool
                </button>
              </div>
            </div>
          )}
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
