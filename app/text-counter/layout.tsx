import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Counter - Count words, characters, lines, tokens",
  description:
    "Count characters, words, lines, paragraphs, and AI tokens (GPT-4) in real-time. Free browser-based text analysis tool for content creation and API cost estimation.",
  keywords: [
    "word counter",
    "character counter",
    "text counter",
    "token counter",
    "AI token counter",
    "gpt token counter",
    "token estimator",
    "paragraph counter",
    "line counter",
    "word count online",
    "character count",
    "textytools",
  ],
  openGraph: {
    title: "Text Counter - Count words, characters, lines, tokens",
    description:
      "Count characters, words, lines, paragraphs, and AI tokens in real-time.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
