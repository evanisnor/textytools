import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Wizard - Validate, format, and edit JSON easily",
  description:
    "Validate, format, search, and manipulate JSON data with advanced tooling. Features real-time validation, pretty print, minify, escape/unescape, search with match navigation, and sort keys. Free browser-based JSON formatter.",
  keywords: [
    "json formatter",
    "json validator",
    "pretty print json",
    "json beautifier",
    "json minify",
    "json editor",
    "json search",
    "validate json",
    "json parse",
    "json tools",
    "textytools",
  ],
  openGraph: {
    title: "JSON Wizard - Validate, format, and edit JSON easily",
    description:
      "Validate, format, search, and manipulate JSON data with advanced tooling.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
