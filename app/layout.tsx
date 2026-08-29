import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { SITE_URL, TOOL_CATALOG } from "@/shared/lib/toolCatalog";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "textytools.dev - Free browser tools for developers",
    template: "%s | textytools.dev",
  },
  description:
    "Fast, browser-based productivity tools for developers. Text manipulation, JSON formatting, case conversion, encoding, JWT decoding, and more.",
  keywords: [
    "developer tools",
    "text tools",
    "text converter",
    "text utilities",
    "JSON formatter",
    "json validator",
    "pretty print json",
    "case converter",
    "camelCase",
    "snake_case",
    "title case",
    "sentence case",
    "base64 encoder",
    "text encoder",
    "url encode",
    "hex encoder",
    "JWT decoder",
    "decode jwt",
    "jwt inspector",
    "CSV converter",
    "csv to json",
    "json to csv",
    "csv parser",
    "text sanitizer",
    "clean text",
    "remove emojis",
    "normalize whitespace",
    "token counter",
    "word counter",
    "character counter",
    "diff viewer",
    "compare text",
    "side-by-side diff",
    "developer utilities",
    "textytools",
  ],
  authors: [{ name: "Texty Software" }],
  creator: "Texty Software",
  openGraph: {
    title: "textytools.dev - Free browser tools for developers",
    description:
      "Fast, browser-based productivity tools for developers. Text manipulation, JSON formatting, case conversion, encoding, and more.",
    type: "website",
    url: "/",
    siteName: "textytools.dev",
  },
  twitter: {
    card: "summary",
    title: "textytools.dev - Free browser tools for developers",
    description:
      "Fast, browser-based productivity tools for developers. Text manipulation, JSON formatting, case conversion, encoding, JWT decoding, and more.",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
};

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
          <div className="flex-1 md:max-w-md">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              texty tools
            </h3>
            <div
              aria-label="Tool catalog"
              className="grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400"
            >
              {TOOL_CATALOG.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end md:justify-end gap-3">
            <Link
              href="/privacy"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Texty Software
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleTagId =
    process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || process.env.NEXT_PUBLIC_GOOGLE_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <div className="flex-1">{children}</div>
        <Footer />
        {googleTagId && <GoogleAnalytics gaId={googleTagId} />}
      </body>
    </html>
  );
}
