"use client";

import { useMemo, type ReactNode } from "react";

import {
  highlightXml,
  type XmlSyntaxTheme,
  DEFAULT_XML_THEME,
} from "../ui/XmlHighlighter";

interface XmlSyntaxHighlighterOptions {
  enabled?: boolean;
  theme?: Partial<XmlSyntaxTheme>;
}

export interface XmlSyntaxRenderer {
  renderContent: (content: string) => ReactNode;
  theme: XmlSyntaxTheme;
}

/**
 * React hook for XML syntax highlighting.
 * Provides memoized rendering function for use in text editors.
 */
export function useXmlSyntaxHighlighter({
  enabled = true,
  theme,
}: XmlSyntaxHighlighterOptions = {}): XmlSyntaxRenderer | undefined {
  const mergedTheme = useMemo(
    () => ({
      ...DEFAULT_XML_THEME,
      ...(theme ?? {}),
    }),
    [theme],
  );

  return useMemo(() => {
    if (!enabled) return undefined;

    return {
      renderContent: (content: string) => highlightXml(content, mergedTheme),
      theme: mergedTheme,
    };
  }, [enabled, mergedTheme]);
}
