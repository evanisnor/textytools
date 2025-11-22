import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diff Viewer - textytools.dev",
  description:
    "Compare two text blocks with side-by-side diff highlighting, search, and navigation. Helpful for code, documents, and prose diffing.",
  keywords: [
    "diff viewer",
    "compare text",
    "text diff",
    "side-by-side diff",
    "diff tool",
    "compare files",
    "code diff",
    "text comparison",
    "diff highlight",
    "online diff tool",
    "textytools",
  ],
  openGraph: {
    title: "Diff Viewer - textytools.dev",
    description:
      "Compare two text blocks with side-by-side diff highlighting, search, and navigation.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
