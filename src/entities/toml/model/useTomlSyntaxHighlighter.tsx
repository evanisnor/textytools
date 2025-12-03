"use client";

import { useMemo, type ReactNode } from "react";

import {
  highlightToml,
  type TomlSyntaxTheme,
  DEFAULT_TOML_THEME,
} from "../ui/TomlHighlighter";

interface TomlSyntaxHighlighterOptions {
  enabled?: boolean;
  theme?: Partial<TomlSyntaxTheme>;
}

export interface TomlSyntaxRenderer {
  renderContent: (content: string) => ReactNode;
  theme: TomlSyntaxTheme;
}

/**
 * React hook for TOML syntax highlighting.
 * Provides memoized rendering function for use in text editors.
 */
export function useTomlSyntaxHighlighter({
  enabled = true,
  theme,
}: TomlSyntaxHighlighterOptions = {}): TomlSyntaxRenderer | undefined {
  const mergedTheme = useMemo(
    () => ({
      ...DEFAULT_TOML_THEME,
      ...(theme ?? {}),
    }),
    [theme],
  );

  return useMemo(() => {
    if (!enabled) return undefined;

    return {
      renderContent: (content: string) => highlightToml(content, mergedTheme),
      theme: mergedTheme,
    };
  }, [enabled, mergedTheme]);
}
