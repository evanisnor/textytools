"use client";

import { useMemo, type ReactNode } from "react";

import { highlightJson, type JsonSyntaxTheme } from "../ui/JsonHighlighter";

interface JsonSyntaxHighlighterOptions {
  enabled?: boolean;
  theme?: Partial<JsonSyntaxTheme>;
}

export interface JsonSyntaxRenderer {
  renderContent: (content: string) => ReactNode;
  theme: JsonSyntaxTheme;
}

const DEFAULT_THEME: JsonSyntaxTheme = {
  key: "text-sky-700 dark:text-sky-300",
  string: "text-emerald-700 dark:text-emerald-300",
  number: "text-amber-700 dark:text-amber-300",
  boolean: "text-purple-700 dark:text-purple-300",
  null: "text-rose-700 dark:text-rose-300",
  punctuation: "text-zinc-500 dark:text-zinc-400",
};

/**
 * React hook for JSON syntax highlighting.
 * Provides memoized rendering function for use in text editors.
 */
export function useJsonSyntaxHighlighter({
  enabled = true,
  theme,
}: JsonSyntaxHighlighterOptions = {}): JsonSyntaxRenderer | undefined {
  const mergedTheme = useMemo(
    () => ({
      ...DEFAULT_THEME,
      ...(theme ?? {}),
    }),
    [theme],
  );

  return useMemo(() => {
    if (!enabled) return undefined;

    return {
      renderContent: (content: string) => highlightJson(content, mergedTheme),
      theme: mergedTheme,
    };
  }, [enabled, mergedTheme]);
}
