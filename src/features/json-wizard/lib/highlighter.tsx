import { Fragment, type ReactNode } from "react";

import type { ValidationResult } from "../model/types";

import {
  tokenizeJson,
  type JsonSyntaxTheme,
} from "@/shared/hooks/useJsonSyntaxHighlighter";

interface RenderHighlightedTextParams {
  text: string;
  lineIndex?: number;
  useOutputMatches?: boolean;
  currentLocalMatchIndex?: number;
  syntaxTheme?: JsonSyntaxTheme;
  validation: ValidationResult;
  searchTerm: string;
  currentMatchIndex: number;
  matchPositions: Map<number, Map<number, number>>;
  outputMatchPositions: Map<number, Map<number, number>>;
}

export function renderHighlightedText({
  text,
  lineIndex,
  useOutputMatches = false,
  currentLocalMatchIndex,
  syntaxTheme,
  validation,
  searchTerm,
  currentMatchIndex,
  matchPositions,
  outputMatchPositions,
}: RenderHighlightedTextParams): ReactNode {
  // 1. Identify Error on this line
  const errorColIndex =
    !useOutputMatches &&
    !validation.isValid &&
    validation.lineNumber === (lineIndex ?? -1) + 1 &&
    validation.columnNumber
      ? validation.columnNumber - 1
      : -1;

  // 2. Identify Search Matches on this line
  const positions = useOutputMatches ? outputMatchPositions : matchPositions;
  const lineMatches =
    lineIndex !== undefined ? positions.get(lineIndex) : undefined;

  // 3. If no error and no matches, return syntax highlighted text (fast path)
  if (errorColIndex === -1 && (!lineMatches || lineMatches.size === 0)) {
    if (syntaxTheme && text.trim()) {
      const tokens = tokenizeJson(text);
      return tokens.map((token, tokenIndex) => {
        if (token.type === "plain") {
          return <Fragment key={tokenIndex}>{token.text}</Fragment>;
        }
        return (
          <span key={tokenIndex} className={syntaxTheme[token.type]}>
            {token.text}
          </span>
        );
      });
    }
    return text;
  }

  // 4. Build mask for the line
  // We use a mask array to handle overlapping highlights (error takes precedence)
  const mask = new Array(text.length)
    .fill(null)
    .map(() => ({ type: "plain", matchIndex: -1 }));

  // Apply matches
  if (lineMatches && searchTerm) {
    const len = searchTerm.length;
    for (const [start, matchIndex] of lineMatches.entries()) {
      for (let i = start; i < start + len && i < text.length; i++) {
        mask[i] = { type: "match", matchIndex };
      }
    }
  }

  // Apply error (overrides matches)
  let errorAtEnd = false;
  if (errorColIndex !== -1) {
    if (errorColIndex >= text.length) {
      errorAtEnd = true;
    } else {
      for (let i = errorColIndex; i < text.length; i++) {
        mask[i] = { type: "error", matchIndex: -1 };
      }
    }
  }

  // 5. Group consecutive identical mask items into parts
  const parts: Array<{
    text: string;
    type: string;
    matchIndex: number;
    start: number;
  }> = [];

  if (text.length > 0) {
    let currentType = mask[0].type;
    let currentMatchIndex = mask[0].matchIndex;
    let currentStart = 0;

    for (let i = 1; i < text.length; i++) {
      if (
        mask[i].type !== currentType ||
        mask[i].matchIndex !== currentMatchIndex
      ) {
        parts.push({
          text: text.substring(currentStart, i),
          type: currentType,
          matchIndex: currentMatchIndex,
          start: currentStart,
        });
        currentType = mask[i].type;
        currentMatchIndex = mask[i].matchIndex;
        currentStart = i;
      }
    }
    parts.push({
      text: text.substring(currentStart),
      type: currentType,
      matchIndex: currentMatchIndex,
      start: currentStart,
    });
  }

  // 6. Helper for syntax highlighting inside a part
  const syntaxTokens = syntaxTheme ? tokenizeJson(text) : null;

  const renderPartContent = (segment: string, startIndex: number) => {
    if (!segment) return segment;
    if (!syntaxTokens || !syntaxTheme) return segment;

    const segmentEnd = startIndex + segment.length;
    const pieces: ReactNode[] = [];

    syntaxTokens.forEach((token, tokenIndex) => {
      const overlapStart = Math.max(startIndex, token.start);
      const overlapEnd = Math.min(segmentEnd, token.end);
      if (overlapStart >= overlapEnd) return;

      const sliceStart = overlapStart - startIndex;
      const sliceEnd = overlapEnd - startIndex;
      const slice = segment.slice(sliceStart, sliceEnd);
      if (!slice) return;

      const className =
        token.type === "plain" ? undefined : syntaxTheme[token.type];
      const key = `${startIndex}-${tokenIndex}-${overlapStart}`;

      pieces.push(
        className ? (
          <span key={key} className={className}>
            {slice}
          </span>
        ) : (
          <Fragment key={key}>{slice}</Fragment>
        ),
      );
    });

    return pieces.length > 0 ? pieces : segment;
  };

  // 7. Render parts
  const result = parts.map((part, index) => {
    if (part.type === "error") {
      return (
        <span
          key={index}
          className="bg-red-500/30 decoration-red-500 underline decoration-wavy text-red-900 dark:text-red-100"
        >
          {renderPartContent(part.text, part.start)}
        </span>
      );
    }
    if (part.type === "match") {
      const matchIndexToHighlight =
        currentLocalMatchIndex !== undefined && currentLocalMatchIndex >= 0
          ? currentLocalMatchIndex
          : currentLocalMatchIndex === undefined
            ? currentMatchIndex
            : -999;
      const isCurrentMatch = part.matchIndex === matchIndexToHighlight;

      return (
        <span
          key={index}
          id={
            useOutputMatches
              ? `output-match-${part.matchIndex}`
              : `input-match-${part.matchIndex}`
          }
          className={
            isCurrentMatch
              ? "bg-green-300 dark:bg-green-600 text-black"
              : "bg-yellow-300 dark:bg-yellow-600 text-black"
          }
        >
          {renderPartContent(part.text, part.start)}
        </span>
      );
    }
    return (
      <Fragment key={index}>{renderPartContent(part.text, part.start)}</Fragment>
    );
  });

  if (errorAtEnd) {
    result.push(
      <span
        key="error-end"
        className="bg-red-500/30 decoration-red-500 underline decoration-wavy text-red-900 dark:text-red-100"
      >
        &nbsp;
      </span>,
    );
  }

  return result;
}
