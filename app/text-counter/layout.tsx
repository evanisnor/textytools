import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Counter - textytools.dev",
  description:
    "Count characters, words, lines, paragraphs, and AI tokens (GPT-4) in real-time. Free browser-based text analysis tool for content creation and API cost estimation.",
  openGraph: {
    title: "Text Counter - textytools.dev",
    description:
      "Count characters, words, lines, paragraphs, and AI tokens in real-time.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
