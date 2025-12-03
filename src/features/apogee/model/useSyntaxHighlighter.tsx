"use client";

import { useMemo, type ReactNode } from "react";

import type { InputType } from "../model/types";

import { useCsvSyntaxHighlighter } from "@/entities/csv";
import { useJsonSyntaxHighlighter } from "@/entities/json";
import { useTomlSyntaxHighlighter } from "@/entities/toml";
import { useXmlSyntaxHighlighter } from "@/entities/xml";
import { useYamlSyntaxHighlighter } from "@/entities/yaml";

interface SyntaxHighlighterResult {
  renderContent?: (content: string) => ReactNode;
  renderLineContent?: (line: string, lineIndex: number) => ReactNode;
}

/**
 * Hook to select the appropriate syntax highlighter based on input type
 *
 * Returns the correct highlighter (renderContent or renderLineContent) for the given type.
 * Used by DataBlock to automatically apply syntax highlighting.
 *
 * @param inputType - The current input type (csv, json, yaml, xml, toml, jwt, etc.)
 * @param enabled - Whether syntax highlighting should be enabled
 * @returns Object with renderContent or renderLineContent function, or undefined if no highlighting
 */
export function useSyntaxHighlighter(
  inputType: InputType | undefined,
  enabled: boolean = true,
): SyntaxHighlighterResult {
  const jsonHighlighter = useJsonSyntaxHighlighter({
    enabled: enabled && inputType === "json",
  });
  const csvHighlighter = useCsvSyntaxHighlighter({
    enabled: enabled && inputType === "csv",
  });
  const yamlHighlighter = useYamlSyntaxHighlighter({
    enabled: enabled && inputType === "yaml",
  });
  const xmlHighlighter = useXmlSyntaxHighlighter({
    enabled: enabled && inputType === "xml",
  });
  const tomlHighlighter = useTomlSyntaxHighlighter({
    enabled: enabled && inputType === "toml",
  });

  // JWT is a special case - it's not in InputType but could be a transform output
  // For now we'll handle it separately if needed

  return useMemo(() => {
    if (!enabled || !inputType) {
      return {};
    }

    switch (inputType) {
      case "json":
        return jsonHighlighter
          ? { renderContent: jsonHighlighter.renderContent }
          : {};
      case "csv":
        return csvHighlighter
          ? { renderLineContent: csvHighlighter.renderLineContent }
          : {};
      case "yaml":
        return yamlHighlighter
          ? { renderContent: yamlHighlighter.renderContent }
          : {};
      case "xml":
        return xmlHighlighter
          ? { renderContent: xmlHighlighter.renderContent }
          : {};
      case "toml":
        return tomlHighlighter
          ? { renderContent: tomlHighlighter.renderContent }
          : {};
      case "auto":
      case "text":
      case "file":
      default:
        return {};
    }
  }, [
    enabled,
    inputType,
    jsonHighlighter,
    csvHighlighter,
    yamlHighlighter,
    xmlHighlighter,
    tomlHighlighter,
  ]);
}
