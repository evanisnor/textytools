import Link from "next/link";

export default function Home() {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/text-counter"
              className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Text Counter
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Count characters, words, lines, paragraphs and AI tokens in
                real-time
              </p>
            </Link>

            <Link
              href="/case-converter"
              className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Case Converter
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Transform text between different case formats instantly
              </p>
            </Link>

            <Link
              href="/text-sanitizer"
              className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Text Sanitizer
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Clean and transform text with customizable sanitization options
              </p>
            </Link>

            <Link
              href="/json-wizard"
              className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                JSON Wizard
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Format, validate, and search JSON with real-time feedback
              </p>
            </Link>

            <Link
              href="/csv-json-converter"
              className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                CSV / JSON Converter
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Convert between JSON and CSV formats with proper parsing
              </p>
            </Link>

            <Link
              href="/text-encoder"
              className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Text Encoder
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Encode and decode text using Base64, URL, Hex, and more
              </p>
            </Link>

            <Link
              href="/jwt-decoder"
              className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors min-h-[140px]"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                JWT Decoder
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Decode and inspect JSON Web Tokens with validation
              </p>
            </Link>

            {/* Placeholder for future tools */}
            <div className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors opacity-50 min-h-[140px]">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Coming Soon
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                More productivity tools will be added here
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
