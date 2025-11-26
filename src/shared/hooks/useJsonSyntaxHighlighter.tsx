"use client";

import { Fragment, useMemo, type ReactNode } from "react";

export type JsonSyntaxTokenType =
  | "key"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "punctuation"
  | "plain";

export interface JsonSyntaxToken {
  type: JsonSyntaxTokenType;
  text: string;
  start: number;
  end: number;
}

export type JsonSyntaxTheme = Record<
  Exclude<JsonSyntaxTokenType, "plain">,
  string
>;

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

const JSON_TOKEN_REGEX =
  /("(?:\\.|[^"\\])*"(?=\s*:))|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}\[\],:])/g;

export function tokenizeJson(content: string): JsonSyntaxToken[] {
  JSON_TOKEN_REGEX.lastIndex = 0;
  const tokens: JsonSyntaxToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = JSON_TOKEN_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "plain",
        text: content.slice(lastIndex, match.index),
        start: lastIndex,
        end: match.index,
      });
    }

    const [text, keyGroup, stringGroup, numberGroup, booleanGroup, nullGroup] =
      match;
    const type: JsonSyntaxTokenType = keyGroup
      ? "key"
      : stringGroup
        ? "string"
        : numberGroup
          ? "number"
          : booleanGroup
            ? "boolean"
            : nullGroup
              ? "null"
              : "punctuation";

    tokens.push({
      type,
      text,
      start: match.index,
      end: match.index + text.length,
    });
    lastIndex = match.index + text.length;
  }

  if (lastIndex < content.length) {
    tokens.push({
      type: "plain",
      text: content.slice(lastIndex),
      start: lastIndex,
      end: content.length,
    });
  }

  return tokens;
}

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

    const highlightJson = (currentContent: string) => {
      if (!currentContent.trim()) {
        return currentContent;
      }

      const tokens = tokenizeJson(currentContent);
      if (tokens.length === 0) {
        return currentContent;
      }

      return (
        <>
          {tokens.map((token, index) => {
            if (token.type === "plain") {
              return <Fragment key={index}>{token.text}</Fragment>;
            }
            return (
              <span key={index} className={mergedTheme[token.type]}>
                {token.text}
              </span>
            );
          })}
        </>
      );
    };

    return {
      renderContent: highlightJson,
      theme: mergedTheme,
    };
  }, [enabled, mergedTheme]);
}
