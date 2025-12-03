/**
 * TOML syntax highlighting component
 */

import type { ReactNode } from "react";

export interface TomlSyntaxTheme {
  section: string;
  key: string;
  string: string;
  number: string;
  boolean: string;
  date: string;
  comment: string;
  punctuation: string;
}

export const DEFAULT_TOML_THEME: TomlSyntaxTheme = {
  section: "text-purple-700 dark:text-purple-300 font-semibold",
  key: "text-sky-700 dark:text-sky-300",
  string: "text-emerald-700 dark:text-emerald-300",
  number: "text-amber-700 dark:text-amber-300",
  boolean: "text-purple-700 dark:text-purple-300",
  date: "text-pink-700 dark:text-pink-300",
  comment: "text-zinc-400 dark:text-zinc-500 italic",
  punctuation: "text-zinc-500 dark:text-zinc-400",
};

/**
 * Highlights TOML syntax with color coding
 */
export function highlightToml(
  content: string,
  theme: TomlSyntaxTheme = DEFAULT_TOML_THEME,
): ReactNode {
  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {highlightTomlLine(line, theme)}
          {"\n"}
        </div>
      ))}
    </>
  );
}

function highlightTomlLine(line: string, theme: TomlSyntaxTheme): ReactNode {
  const trimmed = line.trim();

  // Empty line
  if (!trimmed) {
    return <span>{line}</span>;
  }

  // Comments
  if (trimmed.startsWith("#")) {
    return <span className={theme.comment}>{line}</span>;
  }

  // Section headers [section] or [[array]]
  if (trimmed.startsWith("[")) {
    const parts: ReactNode[] = [];
    let keyIndex = 0;

    // Leading whitespace
    const leadingSpace = line.match(/^(\s*)/)?.[1] || "";
    if (leadingSpace) {
      parts.push(<span key={`space-${keyIndex++}`}>{leadingSpace}</span>);
    }

    // Opening brackets
    const openBrackets = trimmed.match(/^\[+/)?.[0] || "[";
    parts.push(
      <span key={`open-${keyIndex++}`} className={theme.punctuation}>
        {openBrackets}
      </span>,
    );

    // Section name
    const closeBracketIndex = trimmed.lastIndexOf("]");
    if (closeBracketIndex > openBrackets.length) {
      const sectionName = trimmed.slice(openBrackets.length, closeBracketIndex);
      parts.push(
        <span key={`section-${keyIndex++}`} className={theme.section}>
          {sectionName}
        </span>,
      );

      // Closing brackets
      const closeBrackets = trimmed.slice(closeBracketIndex);
      parts.push(
        <span key={`close-${keyIndex++}`} className={theme.punctuation}>
          {closeBrackets}
        </span>,
      );
    }

    return <>{parts}</>;
  }

  // Key = Value pairs
  const parts: ReactNode[] = [];
  let keyIndex = 0;

  // Leading whitespace
  const leadingSpace = line.match(/^(\s*)/)?.[1] || "";
  if (leadingSpace) {
    parts.push(<span key={`space-${keyIndex++}`}>{leadingSpace}</span>);
  }

  // Find the equals sign
  const equalsIndex = line.indexOf("=");
  if (equalsIndex === -1) {
    // No equals sign, just return as-is
    return <span>{line}</span>;
  }

  // Key part
  const keyPart = line.slice(leadingSpace.length, equalsIndex).trim();
  parts.push(
    <span key={`key-${keyIndex++}`} className={theme.key}>
      {keyPart}
    </span>,
  );

  // Whitespace before equals
  const beforeEquals = line.slice(
    leadingSpace.length + keyPart.length,
    equalsIndex,
  );
  if (beforeEquals) {
    parts.push(<span key={`space-${keyIndex++}`}>{beforeEquals}</span>);
  }

  // Equals sign
  parts.push(
    <span key={`eq-${keyIndex++}`} className={theme.punctuation}>
      {"="}
    </span>,
  );

  // Value part
  const valuePart = line.slice(equalsIndex + 1);
  parts.push(...highlightTomlValue(valuePart, theme, keyIndex));

  return <>{parts}</>;
}

function highlightTomlValue(
  value: string,
  theme: TomlSyntaxTheme,
  startIndex: number,
): ReactNode[] {
  const parts: ReactNode[] = [];
  let keyIndex = startIndex;

  // Leading whitespace
  const leadingSpace = value.match(/^(\s*)/)?.[1] || "";
  if (leadingSpace) {
    parts.push(<span key={`space-${keyIndex++}`}>{leadingSpace}</span>);
  }

  const trimmed = value.trim();

  // Check for inline comment
  let actualValue = trimmed;
  let comment = "";

  // For strings, don't split on # inside quotes
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    const quote = trimmed[0];
    const endQuoteIndex = trimmed.indexOf(quote, 1);
    if (endQuoteIndex !== -1) {
      const afterQuote = trimmed.slice(endQuoteIndex + 1);
      const commentIndex = afterQuote.indexOf("#");
      if (commentIndex !== -1) {
        actualValue = trimmed.slice(0, endQuoteIndex + 1 + commentIndex).trim();
        comment = afterQuote.slice(commentIndex);
      }
    }
  } else {
    const commentIndex = trimmed.indexOf("#");
    if (commentIndex !== -1) {
      actualValue = trimmed.slice(0, commentIndex).trim();
      comment = trimmed.slice(commentIndex);
    }
  }

  // Boolean values
  if (actualValue === "true" || actualValue === "false") {
    parts.push(
      <span key={`bool-${keyIndex++}`} className={theme.boolean}>
        {actualValue}
      </span>,
    );
  }
  // Numbers (including hex, octal, binary, infinity, nan)
  else if (
    /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(actualValue) ||
    /^0x[0-9a-fA-F]+$/.test(actualValue) ||
    /^0o[0-7]+$/.test(actualValue) ||
    /^0b[01]+$/.test(actualValue) ||
    actualValue === "inf" ||
    actualValue === "+inf" ||
    actualValue === "-inf" ||
    actualValue === "nan" ||
    actualValue === "+nan" ||
    actualValue === "-nan"
  ) {
    parts.push(
      <span key={`num-${keyIndex++}`} className={theme.number}>
        {actualValue}
      </span>,
    );
  }
  // Dates (ISO 8601)
  else if (
    /^\d{4}-\d{2}-\d{2}/.test(actualValue) ||
    /^\d{2}:\d{2}:\d{2}/.test(actualValue)
  ) {
    parts.push(
      <span key={`date-${keyIndex++}`} className={theme.date}>
        {actualValue}
      </span>,
    );
  }
  // Strings
  else if (
    actualValue.startsWith('"') ||
    actualValue.startsWith("'") ||
    actualValue.startsWith('"""') ||
    actualValue.startsWith("'''")
  ) {
    parts.push(
      <span key={`str-${keyIndex++}`} className={theme.string}>
        {actualValue}
      </span>,
    );
  }
  // Arrays or inline tables
  else if (actualValue.startsWith("[") || actualValue.startsWith("{")) {
    parts.push(
      <span key={`punct-${keyIndex++}`} className={theme.punctuation}>
        {actualValue}
      </span>,
    );
  }
  // Default
  else {
    parts.push(<span key={`default-${keyIndex++}`}>{actualValue}</span>);
  }

  // Trailing whitespace before comment
  if (comment) {
    const spaceBefore = value.slice(
      leadingSpace.length + actualValue.length,
      value.indexOf(comment),
    );
    if (spaceBefore) {
      parts.push(<span key={`space2-${keyIndex++}`}>{spaceBefore}</span>);
    }
    parts.push(
      <span key={`comment-${keyIndex++}`} className={theme.comment}>
        {comment}
      </span>,
    );
  } else {
    // Trailing whitespace
    const trailingSpace = value.slice(leadingSpace.length + actualValue.length);
    if (trailingSpace) {
      parts.push(<span key={`trail-${keyIndex++}`}>{trailingSpace}</span>);
    }
  }

  return parts;
}
