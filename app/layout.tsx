import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { isRegexTesterEnabled } from "./lib/featureFlags";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "textytools.dev - Free browser tools for developers",
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
  },
  alternates: {
    canonical: "https://textytools.dev",
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
              <div className="flex flex-col gap-2">
                <Link
                  href="/text-counter"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  Text Counter
                </Link>
                <Link
                  href="/diff-viewer"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  Diff Viewer
                </Link>
                <Link
                  href="/case-converter"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  Case Converter
                </Link>
                <Link
                  href="/text-sanitizer"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  Text Sanitizer
                </Link>
                {isRegexTesterEnabled() && (
                  <Link
                    href="/regex-tester"
                    className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                  >
                    Regex Tester
                  </Link>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/json-wizard"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  JSON Wizard
                </Link>
                <Link
                  href="/csv-json-converter"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  CSV / JSON Converter
                </Link>
                <Link
                  href="/text-encoder"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  Text Encoder
                </Link>
                <Link
                  href="/jwt-decoder"
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                >
                  JWT Decoder
                </Link>
              </div>
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID || ""} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_ID || ""} />
    </html>
  );
}
