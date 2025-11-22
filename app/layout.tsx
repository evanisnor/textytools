import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "textytools.dev - Free Developer Utilities",
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
    title: "textytools.dev - Free Developer Utilities",
    description:
      "Fast, browser-based productivity tools for developers. Text manipulation, JSON formatting, case conversion, encoding, and more.",
    type: "website",
  },
};

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} Texty Software.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Privacy Policy
            </Link>
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
