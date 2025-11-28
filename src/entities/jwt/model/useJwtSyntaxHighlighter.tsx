"use client";

import { useMemo, type ReactNode } from "react";

import { highlightJWT } from "../ui/JwtHighlighter";

interface JwtSyntaxHighlighterOptions {
  enabled?: boolean;
}

export interface JwtSyntaxRenderer {
  renderContent: (content: string) => ReactNode;
}

/**
 * React hook for JWT syntax highlighting.
 * Provides memoized rendering function for use in text editors.
 */
export function useJwtSyntaxHighlighter({
  enabled = true,
}: JwtSyntaxHighlighterOptions = {}): JwtSyntaxRenderer | undefined {
  return useMemo(() => {
    if (!enabled) return undefined;

    return {
      renderContent: (content: string) => highlightJWT(content),
    };
  }, [enabled]);
}
