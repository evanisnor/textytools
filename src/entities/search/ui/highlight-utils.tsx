import { Fragment, type ReactNode } from "react";

/**
 * Standard highlight colors used across the application
 */
export const HIGHLIGHT_COLORS = {
  currentMatch: "bg-green-300 dark:bg-green-600 text-black",
  otherMatch: "bg-yellow-300 dark:bg-yellow-600 text-black",
} as const;

/**
 * Represents a segment of text with optional highlighting
 */
export interface TextSegment {
  text: string;
  isMatch: boolean;
  isCurrent: boolean;
}

/**
 * Options for rendering highlighted text
 */
export interface HighlightOptions {
  searchTerm: string;
  caseSensitive: boolean;
  currentMatchPositions?: Set<number>; // Column positions of current match in this line
  allMatchPositions?: Set<number>; // All match positions in this line
}

/**
 * Splits text into segments based on match positions
 */
export function segmentText(
  text: string,
  searchTerm: string,
  caseSensitive: boolean,
  currentMatchPositions?: Set<number>,
  allMatchPositions?: Set<number>,
): TextSegment[] {
  if (!searchTerm || !allMatchPositions || allMatchPositions.size === 0) {
    return [{ text, isMatch: false, isCurrent: false }];
  }

  const regex = new RegExp(
    searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    caseSensitive ? "g" : "gi",
  );

  const segments: TextSegment[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add non-match text before this match
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        isMatch: false,
        isCurrent: false,
      });
    }

    // Add the match
    const isCurrent =
      currentMatchPositions !== undefined &&
      currentMatchPositions.has(match.index);

    segments.push({
      text: match[0],
      isMatch: true,
      isCurrent,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining non-match text
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isMatch: false,
      isCurrent: false,
    });
  }

  return segments;
}

/**
 * Renders text segments with highlighting
 */
export function renderHighlightedSegments(
  segments: TextSegment[],
  idPrefix?: string,
  matchIndex?: number,
): ReactNode {
  return segments.map((segment, index) => {
    if (segment.isMatch) {
      const id =
        idPrefix && matchIndex !== undefined
          ? `${idPrefix}-${matchIndex}`
          : undefined;

      return (
        <span
          key={index}
          id={id}
          className={
            segment.isCurrent
              ? HIGHLIGHT_COLORS.currentMatch
              : HIGHLIGHT_COLORS.otherMatch
          }
        >
          {segment.text}
        </span>
      );
    }
    return <Fragment key={index}>{segment.text}</Fragment>;
  });
}

/**
 * Convenience function to segment and render text in one call
 */
export function highlightText(
  text: string,
  options: HighlightOptions,
  idPrefix?: string,
  matchIndex?: number,
): ReactNode {
  const segments = segmentText(
    text,
    options.searchTerm,
    options.caseSensitive,
    options.currentMatchPositions,
    options.allMatchPositions,
  );

  return renderHighlightedSegments(segments, idPrefix, matchIndex);
}
