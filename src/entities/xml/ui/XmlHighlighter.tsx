/**
 * XML syntax highlighting component
 */

import type { ReactNode } from "react";

export interface XmlSyntaxTheme {
  tagName: string;
  attribute: string;
  attributeValue: string;
  text: string;
  comment: string;
  declaration: string;
  cdata: string;
  punctuation: string;
}

export const DEFAULT_XML_THEME: XmlSyntaxTheme = {
  tagName: "text-sky-700 dark:text-sky-300",
  attribute: "text-amber-700 dark:text-amber-300",
  attributeValue: "text-emerald-700 dark:text-emerald-300",
  text: "text-zinc-700 dark:text-zinc-300",
  comment: "text-zinc-400 dark:text-zinc-500 italic",
  declaration: "text-purple-700 dark:text-purple-300",
  cdata: "text-rose-700 dark:text-rose-300",
  punctuation: "text-zinc-500 dark:text-zinc-400",
};

/**
 * Highlights XML syntax with color coding
 */
export function highlightXml(
  content: string,
  theme: XmlSyntaxTheme = DEFAULT_XML_THEME,
): ReactNode {
  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {highlightXmlLine(line, theme)}
          {"\n"}
        </div>
      ))}
    </>
  );
}

function highlightXmlLine(line: string, theme: XmlSyntaxTheme): ReactNode {
  const parts: ReactNode[] = [];
  let remaining = line;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Handle XML comments
    if (remaining.startsWith("<!--")) {
      const endIndex = remaining.indexOf("-->");
      if (endIndex !== -1) {
        const comment = remaining.slice(0, endIndex + 3);
        parts.push(
          <span key={`comment-${keyIndex++}`} className={theme.comment}>
            {comment}
          </span>,
        );
        remaining = remaining.slice(endIndex + 3);
        continue;
      }
    }

    // Handle XML declaration
    if (remaining.startsWith("<?")) {
      const endIndex = remaining.indexOf("?>");
      if (endIndex !== -1) {
        const declaration = remaining.slice(0, endIndex + 2);
        parts.push(
          <span key={`decl-${keyIndex++}`} className={theme.declaration}>
            {declaration}
          </span>,
        );
        remaining = remaining.slice(endIndex + 2);
        continue;
      }
    }

    // Handle CDATA
    if (remaining.startsWith("<![CDATA[")) {
      const endIndex = remaining.indexOf("]]>");
      if (endIndex !== -1) {
        const cdata = remaining.slice(0, endIndex + 3);
        parts.push(
          <span key={`cdata-${keyIndex++}`} className={theme.cdata}>
            {cdata}
          </span>,
        );
        remaining = remaining.slice(endIndex + 3);
        continue;
      }
    }

    // Handle tags
    if (remaining.startsWith("<")) {
      const endIndex = remaining.indexOf(">");
      if (endIndex !== -1) {
        const tag = remaining.slice(0, endIndex + 1);
        parts.push(...highlightXmlTag(tag, theme, keyIndex));
        keyIndex += 10; // Reserve indices for tag parts
        remaining = remaining.slice(endIndex + 1);
        continue;
      }
    }

    // Handle text content
    const nextTagIndex = remaining.indexOf("<");
    if (nextTagIndex === -1) {
      // Rest is text
      if (remaining.trim()) {
        parts.push(
          <span key={`text-${keyIndex++}`} className={theme.text}>
            {remaining}
          </span>,
        );
      } else {
        parts.push(<span key={`space-${keyIndex++}`}>{remaining}</span>);
      }
      break;
    } else if (nextTagIndex > 0) {
      const text = remaining.slice(0, nextTagIndex);
      if (text.trim()) {
        parts.push(
          <span key={`text-${keyIndex++}`} className={theme.text}>
            {text}
          </span>,
        );
      } else {
        parts.push(<span key={`space-${keyIndex++}`}>{text}</span>);
      }
      remaining = remaining.slice(nextTagIndex);
      continue;
    }

    // Fallback: consume one character
    parts.push(<span key={`char-${keyIndex++}`}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }

  return <>{parts}</>;
}

function highlightXmlTag(
  tag: string,
  theme: XmlSyntaxTheme,
  startIndex: number,
): ReactNode[] {
  const parts: ReactNode[] = [];
  let keyIndex = startIndex;

  // Opening bracket
  parts.push(
    <span key={`open-${keyIndex++}`} className={theme.punctuation}>
      {"<"}
    </span>,
  );

  let content = tag.slice(1, -1); // Remove < and >

  // Self-closing or closing tag detection
  const isSelfClosing = content.endsWith("/");
  const isClosing = content.startsWith("/");

  if (isSelfClosing) {
    content = content.slice(0, -1);
  }
  if (isClosing) {
    parts.push(
      <span key={`slash-${keyIndex++}`} className={theme.punctuation}>
        {"/"}
      </span>,
    );
    content = content.slice(1);
  }

  // Extract tag name
  const tagNameMatch = content.match(/^(\S+)/);
  if (tagNameMatch) {
    const tagName = tagNameMatch[1];
    parts.push(
      <span key={`tag-${keyIndex++}`} className={theme.tagName}>
        {tagName}
      </span>,
    );
    content = content.slice(tagName.length);
  }

  // Extract attributes
  const attrRegex = /\s+([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;
  let lastIndex = 0;
  let match;

  while ((match = attrRegex.exec(content)) !== null) {
    const [fullMatch, attrName, doubleQuotedValue, singleQuotedValue] = match;
    const attrValue = doubleQuotedValue ?? singleQuotedValue;

    // Whitespace before attribute
    if (match.index > lastIndex) {
      parts.push(
        <span key={`space-${keyIndex++}`}>
          {content.slice(lastIndex, match.index)}
        </span>,
      );
    }

    // Space before attribute
    const leadingSpace = fullMatch.match(/^\s+/)?.[0] || "";
    if (leadingSpace) {
      parts.push(<span key={`space-${keyIndex++}`}>{leadingSpace}</span>);
    }

    // Attribute name
    parts.push(
      <span key={`attr-${keyIndex++}`} className={theme.attribute}>
        {attrName}
      </span>,
    );

    // Attribute value
    if (attrValue !== undefined) {
      parts.push(
        <span key={`eq-${keyIndex++}`} className={theme.punctuation}>
          {"="}
        </span>,
      );
      const quote = doubleQuotedValue !== undefined ? '"' : "'";
      parts.push(
        <span key={`quote1-${keyIndex++}`} className={theme.punctuation}>
          {quote}
        </span>,
      );
      parts.push(
        <span key={`val-${keyIndex++}`} className={theme.attributeValue}>
          {attrValue}
        </span>,
      );
      parts.push(
        <span key={`quote2-${keyIndex++}`} className={theme.punctuation}>
          {quote}
        </span>,
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Remaining whitespace
  if (lastIndex < content.length) {
    parts.push(
      <span key={`end-space-${keyIndex++}`}>{content.slice(lastIndex)}</span>,
    );
  }

  // Self-closing slash
  if (isSelfClosing) {
    parts.push(
      <span key={`self-close-${keyIndex++}`} className={theme.punctuation}>
        {"/"}
      </span>,
    );
  }

  // Closing bracket
  parts.push(
    <span key={`close-${keyIndex++}`} className={theme.punctuation}>
      {">"}
    </span>,
  );

  return parts;
}
