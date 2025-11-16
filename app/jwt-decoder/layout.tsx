import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder - textytools.dev",
  description:
    "Decode and inspect JSON Web Tokens (JWT) with syntax highlighting and automatic validation. View header, payload, signature, algorithm, expiration, and standard claims. Free browser-based JWT decoder with no server communication.",
  openGraph: {
    title: "JWT Decoder - textytools.dev",
    description: "Decode and inspect JSON Web Tokens with validation.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
