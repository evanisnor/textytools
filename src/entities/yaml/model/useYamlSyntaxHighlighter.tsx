"use client";

import { useMemo, type ReactNode } from "react";

import {
  highlightYaml,
  type YamlSyntaxTheme,
  DEFAULT_YAML_THEME,
} from "../ui/YamlHighlighter";

interface YamlSyntaxHighlighterOptions {
  enabled?: boolean;
  theme?: Partial<YamlSyntaxTheme>;
}

export interface YamlSyntaxRenderer {
  renderContent: (content: string) => ReactNode;
  theme: YamlSyntaxTheme;
}

/**
 * React hook for YAML syntax highlighting.
 * Provides memoized rendering function for use in text editors.
 */
export function useYamlSyntaxHighlighter({
  enabled = true,
  theme,
}: YamlSyntaxHighlighterOptions = {}): YamlSyntaxRenderer | undefined {
  const mergedTheme = useMemo(
    () => ({
      ...DEFAULT_YAML_THEME,
      ...(theme ?? {}),
    }),
    [theme],
  );

  return useMemo(() => {
    if (!enabled) return undefined;

    return {
      renderContent: (content: string) => highlightYaml(content, mergedTheme),
      theme: mergedTheme,
    };
  }, [enabled, mergedTheme]);
}
