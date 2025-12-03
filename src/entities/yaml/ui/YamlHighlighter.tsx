/**
 * YAML syntax highlighting component
 */

import type { ReactNode } from "react";

export interface YamlSyntaxTheme {
  key: string;
  string: string;
  number: string;
  boolean: string;
  null: string;
  comment: string;
  anchor: string;
  tag: string;
  punctuation: string;
}

export const DEFAULT_YAML_THEME: YamlSyntaxTheme = {
  key: "text-sky-700 dark:text-sky-300",
  string: "text-emerald-700 dark:text-emerald-300",
  number: "text-amber-700 dark:text-amber-300",
  boolean: "text-purple-700 dark:text-purple-300",
  null: "text-rose-700 dark:text-rose-300",
  comment: "text-zinc-400 dark:text-zinc-500 italic",
  anchor: "text-pink-700 dark:text-pink-300",
  tag: "text-indigo-700 dark:text-indigo-300",
  punctuation: "text-zinc-500 dark:text-zinc-400",
};

/**
 * Highlights YAML syntax with color coding
 */
export function highlightYaml(
  content: string,
  theme: YamlSyntaxTheme = DEFAULT_YAML_THEME,
): ReactNode {
  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {highlightYamlLine(line, theme)}
          {"\n"}
        </div>
      ))}
    </>
  );
}

function highlightYamlLine(line: string, theme: YamlSyntaxTheme): ReactNode {
  // Comments
  if (line.trim().startsWith("#")) {
    return <span className={theme.comment}>{line}</span>;
  }

  const parts: ReactNode[] = [];
  let remaining = line;
  let keyIndex = 0;

  // Handle indentation
  const indentMatch = remaining.match(/^(\s+)/);
  if (indentMatch) {
    parts.push(<span key={`indent-${keyIndex++}`}>{indentMatch[1]}</span>);
    remaining = remaining.slice(indentMatch[1].length);
  }

  // Handle list items
  if (remaining.startsWith("- ")) {
    parts.push(
      <span key={`list-${keyIndex++}`} className={theme.punctuation}>
        {"- "}
      </span>,
    );
    remaining = remaining.slice(2);
  }

  // Handle key: value pairs
  const keyValueMatch = remaining.match(/^([^:]+)(:)(\s*)/);
  if (keyValueMatch) {
    const [, key, colon, space] = keyValueMatch;
    parts.push(
      <span key={`key-${keyIndex++}`} className={theme.key}>
        {key}
      </span>,
    );
    parts.push(
      <span key={`colon-${keyIndex++}`} className={theme.punctuation}>
        {colon}
      </span>,
    );
    if (space) {
      parts.push(<span key={`space-${keyIndex++}`}>{space}</span>);
    }
    remaining = remaining.slice(keyValueMatch[0].length);
  }

  // Handle the value part
  if (remaining) {
    parts.push(...highlightYamlValue(remaining, theme, keyIndex));
  }

  return <>{parts}</>;
}

function highlightYamlValue(
  value: string,
  theme: YamlSyntaxTheme,
  startIndex: number,
): ReactNode[] {
  const parts: ReactNode[] = [];
  let keyIndex = startIndex;

  // Comments at end of line
  const commentMatch = value.match(/^([^#]*)(#.*)$/);
  if (commentMatch) {
    const [, beforeComment, comment] = commentMatch;
    parts.push(...highlightYamlValue(beforeComment, theme, keyIndex));
    parts.push(
      <span key={`comment-${keyIndex++}`} className={theme.comment}>
        {comment}
      </span>,
    );
    return parts;
  }

  const trimmed = value.trim();

  // null values
  if (trimmed === "null" || trimmed === "~" || trimmed === "") {
    parts.push(
      <span key={`null-${keyIndex++}`} className={theme.null}>
        {value}
      </span>,
    );
    return parts;
  }

  // Boolean values
  if (
    trimmed === "true" ||
    trimmed === "false" ||
    trimmed === "yes" ||
    trimmed === "no" ||
    trimmed === "on" ||
    trimmed === "off"
  ) {
    parts.push(
      <span key={`bool-${keyIndex++}`} className={theme.boolean}>
        {value}
      </span>,
    );
    return parts;
  }

  // Numbers
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    parts.push(
      <span key={`num-${keyIndex++}`} className={theme.number}>
        {value}
      </span>,
    );
    return parts;
  }

  // Anchors and aliases
  if (trimmed.startsWith("&") || trimmed.startsWith("*")) {
    parts.push(
      <span key={`anchor-${keyIndex++}`} className={theme.anchor}>
        {value}
      </span>,
    );
    return parts;
  }

  // Tags
  if (trimmed.startsWith("!")) {
    parts.push(
      <span key={`tag-${keyIndex++}`} className={theme.tag}>
        {value}
      </span>,
    );
    return parts;
  }

  // Strings (quoted or unquoted)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    trimmed.startsWith("|") ||
    trimmed.startsWith(">")
  ) {
    parts.push(
      <span key={`str-${keyIndex++}`} className={theme.string}>
        {value}
      </span>,
    );
    return parts;
  }

  // Default: treat as string
  parts.push(
    <span key={`default-${keyIndex++}`} className={theme.string}>
      {value}
    </span>,
  );

  return parts;
}
