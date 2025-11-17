"use client";

import React, { useState, useMemo, JSX } from "react";
import Link from "next/link";
import { useToast } from "@/app/components/Toast";

interface JsonObject {
  [key: string]: unknown;
}

// Column colors for CSV highlighting (supporting up to 20 columns)
const COLUMN_COLORS = [
  "bg-blue-200/60 dark:bg-blue-800/40",
  "bg-green-200/60 dark:bg-green-800/40",
  "bg-yellow-200/60 dark:bg-yellow-800/40",
  "bg-purple-200/60 dark:bg-purple-800/40",
  "bg-pink-200/60 dark:bg-pink-800/40",
  "bg-indigo-200/60 dark:bg-indigo-800/40",
  "bg-red-200/60 dark:bg-red-800/40",
  "bg-orange-200/60 dark:bg-orange-800/40",
  "bg-teal-200/60 dark:bg-teal-800/40",
  "bg-cyan-200/60 dark:bg-cyan-800/40",
  "bg-lime-200/60 dark:bg-lime-800/40",
  "bg-emerald-200/60 dark:bg-emerald-800/40",
  "bg-violet-200/60 dark:bg-violet-800/40",
  "bg-fuchsia-200/60 dark:bg-fuchsia-800/40",
  "bg-rose-200/60 dark:bg-rose-800/40",
  "bg-sky-200/60 dark:bg-sky-800/40",
  "bg-amber-200/60 dark:bg-amber-800/40",
  "bg-slate-200/60 dark:bg-slate-800/40",
  "bg-gray-200/60 dark:bg-gray-800/40",
  "bg-zinc-200/60 dark:bg-zinc-700/40",
];

function highlightCSV(csvText: string, delimiter: string): JSX.Element {
  const lines = csvText.split("\n");

  return (
    <>
      {lines.map((line, lineIndex) => {
        if (!line.trim()) {
          return <React.Fragment key={lineIndex}>{"\n"}</React.Fragment>;
        }

        const values = parseCsvLine(line, delimiter);

        return (
          <React.Fragment key={lineIndex}>
            {values.map((value, colIndex) => (
              <span
                key={colIndex}
                className={`${COLUMN_COLORS[colIndex % COLUMN_COLORS.length]} px-0.5`}
              >
                {value || "\u00A0"}
                {colIndex < values.length - 1 && delimiter}
              </span>
            ))}
            {"\n"}
          </React.Fragment>
        );
      })}
    </>
  );
}

function detectInputFormat(input: string): "json" | "csv" {
  const trimmed = input.trim();
  if (!trimmed) return "csv";

  // Check if it starts with JSON markers
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return "json";
  }

  // Try to parse as JSON
  try {
    JSON.parse(trimmed);
    return "json";
  } catch {
    // Not valid JSON, assume CSV
    return "csv";
  }
}

export default function CsvJsonConverter() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const inputEditableRef = React.useRef<HTMLDivElement>(null);
  const outputEditableRef = React.useRef<HTMLDivElement>(null);
  const { showToast, ToastComponent } = useToast();

  React.useEffect(() => {
    // Load from localStorage after mount to avoid hydration mismatch
    const storedInput = localStorage.getItem("csv-json-converter-input");
    if (storedInput) {
      localStorage.removeItem("csv-json-converter-input");
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setInput(storedInput), 0);
    }
  }, []);

  const contentKey = React.useMemo(() => {
    // Use line count of non-empty lines as key to force remount when rows are added/deleted
    const lines = input.split("\n").filter((line) => line.trim());
    return lines.length;
  }, [input]);

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        success: true,
        output: "",
        error: null,
        detectedFormat: "csv" as const,
      };
    }

    const detectedFormat = detectInputFormat(input);

    try {
      if (detectedFormat === "json") {
        const conversionResult = jsonToCsv(input, delimiter, includeHeaders);
        return { ...conversionResult, detectedFormat };
      } else {
        const conversionResult = csvToJson(input, delimiter, includeHeaders);
        return { ...conversionResult, detectedFormat };
      }
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error instanceof Error ? error.message : "Conversion failed",
        detectedFormat,
      };
    }
  }, [input, delimiter, includeHeaders]);

  // Helper to get cursor position as character offset from plain text
  const getCursorPosition = (element: HTMLDivElement): number => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return 0;

      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      return preCaretRange.toString().length;
    } catch {
      // If we can't get cursor position (e.g., during DOM mutations), return 0
      return 0;
    }
  };

  // Helper to restore cursor position by character offset
  const setCursorPosition = (element: HTMLDivElement, offset: number) => {
    const selection = window.getSelection();
    if (!selection) return;

    let charCount = 0;

    const findPosition = (node: Node): boolean => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (charCount + textLength >= offset) {
          try {
            const range = document.createRange();
            range.setStart(node, Math.min(offset - charCount, textLength));
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            return true;
          } catch {
            // If range creation fails, continue searching
            return false;
          }
        }
        charCount += textLength;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (findPosition(node.childNodes[i])) {
            return true;
          }
        }
      }
      return false;
    };

    const found = findPosition(element);

    // If we couldn't find the exact position, place cursor at the end
    if (!found && element.lastChild) {
      try {
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch {
        // Silently fail if we can't set cursor position
      }
    }
  };

  const handleInputContentEditableChange = (
    e: React.FormEvent<HTMLDivElement>,
  ) => {
    const element = e.currentTarget;
    const newText = element.textContent || "";

    // Prevent React re-render if text hasn't actually changed
    if (newText === input) {
      return;
    }

    // If content is empty or only whitespace, don't try to restore cursor
    if (!newText.trim()) {
      setInput(newText);
      return;
    }

    const cursorPos = getCursorPosition(element);
    setInput(newText);

    // Restore cursor position after React re-renders
    requestAnimationFrame(() => {
      if (inputEditableRef.current) {
        setCursorPosition(inputEditableRef.current, cursorPos);
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← back to textytools.dev
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            CSV / JSON Converter
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Convert between JSON and CSV formats with automatic format detection
          </p>
        </div>

        {/* Options */}
        <div className="mb-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">
                Delimiter:
              </label>
              <select
                value={delimiter === "\t" ? "tab" : delimiter}
                onChange={(e) => {
                  const value = e.target.value;
                  setDelimiter(value === "tab" ? "\t" : value);
                }}
                className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="tab">Tab (\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeHeaders"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700"
              />
              <label
                htmlFor="includeHeaders"
                className="text-sm text-zinc-600 dark:text-zinc-400"
              >
                Include headers
              </label>
            </div>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <div className="mb-2 flex items-center justify-between min-h-9">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Input
              </label>
              <button
                onClick={() => setInput("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear
              </button>
            </div>
            <div className="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
              {input.trim() && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                      {result.detectedFormat === "json"
                        ? "JSON → CSV"
                        : "CSV → JSON"}
                    </span>
                  </div>
                </div>
              )}
              {result.detectedFormat === "csv" && input.trim() ? (
                <div
                  key={contentKey}
                  ref={inputEditableRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleInputContentEditableChange}
                  className="w-full h-[500px] p-4 bg-transparent focus:outline-none font-mono text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre overflow-auto"
                  spellCheck={false}
                >
                  {highlightCSV(input, delimiter)}
                </div>
              ) : (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Paste JSON or CSV here...\n\nJSON example:\n[\n  {"name": "Alice", "age": 30},\n  {"name": "Bob", "age": 25}\n]\n\nCSV example:\nname,age\nAlice,30\nBob,25'
                  className="w-full h-[500px] p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 whitespace-pre overflow-auto"
                  spellCheck={false}
                  wrap="off"
                />
              )}
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="mb-2 flex items-center justify-between min-h-9">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Output
              </label>
              <div className="flex items-center gap-2">
                {result.success &&
                  result.output &&
                  result.detectedFormat === "csv" && (
                    <Link
                      href="/json-wizard"
                      onClick={(e) => {
                        e.preventDefault();
                        // Save current CSV input for restoration on back navigation
                        localStorage.setItem("csv-json-converter-input", input);
                        // Save converted JSON for JSON Wizard
                        localStorage.setItem(
                          "json-wizard-input",
                          result.output,
                        );
                        window.location.href = "/json-wizard";
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      Format with JSON Wizard
                    </Link>
                  )}
                {result.success && result.output && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.output);
                      showToast("Copied to clipboard");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
              {result.detectedFormat === "json" &&
              result.success &&
              result.output ? (
                <div
                  ref={outputEditableRef}
                  className="w-full h-[500px] p-4 bg-transparent overflow-auto font-mono text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre"
                >
                  {highlightCSV(result.output, delimiter)}
                </div>
              ) : (
                <textarea
                  value={result.success ? result.output : ""}
                  readOnly
                  placeholder={
                    result.error ? "" : "Converted output will appear here..."
                  }
                  className="w-full h-[500px] p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 whitespace-pre"
                  spellCheck={false}
                  wrap="off"
                />
              )}
            </div>
            {result.error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                Error: {result.error}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              <strong className="text-zinc-900 dark:text-zinc-50">
                JSON to CSV:
              </strong>{" "}
              Supports arrays of objects. Nested objects will be flattened with
              dot notation (e.g., <code>user.name</code>).
            </p>
          </div>
        </div>
      </div>
      {ToastComponent}
    </div>
  );
}

// JSON to CSV conversion
function jsonToCsv(
  jsonString: string,
  delimiter: string,
  includeHeaders: boolean,
): { success: boolean; output: string; error: string | null } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    return {
      success: false,
      output: "",
      error:
        error instanceof Error
          ? `Invalid JSON: ${error.message}`
          : "Invalid JSON",
    };
  }

  // Ensure we have an array of objects
  if (!Array.isArray(parsed)) {
    return {
      success: false,
      output: "",
      error: "JSON must be an array of objects",
    };
  }

  if (parsed.length === 0) {
    return { success: true, output: "", error: null };
  }

  // Flatten objects and collect all keys
  const flattenedRows = parsed.map((item) => flattenObject(item));
  const allKeys = Array.from(
    new Set(flattenedRows.flatMap((row) => Object.keys(row))),
  ).sort();

  // Build CSV
  const lines: string[] = [];

  if (includeHeaders) {
    const headerLine = allKeys
      .map((key) => escapeCsvValue(key, delimiter))
      .join(delimiter);
    lines.push(headerLine);
  }

  for (const row of flattenedRows) {
    const values = allKeys.map((key) => {
      const value = row[key];
      let stringValue: string;

      if (value === null || value === undefined) {
        stringValue = "";
      } else if (typeof value === "string") {
        stringValue = value;
      } else {
        stringValue = String(value);
      }

      return escapeCsvValue(stringValue, delimiter);
    });

    // Ensure we have the correct number of fields
    if (values.length !== allKeys.length) {
      return {
        success: false,
        output: "",
        error: `Internal error: Row has ${values.length} fields but expected ${allKeys.length}`,
      };
    }

    const csvLine = values.join(delimiter);
    lines.push(csvLine);
  }

  const output = lines.join("\n");
  return { success: true, output, error: null };
}

// CSV to JSON conversion
function csvToJson(
  csvString: string,
  delimiter: string,
  hasHeaders: boolean,
): { success: boolean; output: string; error: string | null } {
  const lines = csvString.trim().split("\n");

  if (lines.length === 0) {
    return { success: true, output: "[]", error: null };
  }

  let headers: string[];
  let dataStartIndex: number;

  if (hasHeaders) {
    // First row is headers
    headers = parseCsvLine(lines[0], delimiter);
    dataStartIndex = 1;
  } else {
    // Generate sequential letter headers (a, b, c, ..., z, aa, ab, etc.)
    const firstRow = parseCsvLine(lines[0], delimiter);
    headers = firstRow.map((_, i) => generateColumnLetter(i));
    dataStartIndex = 0;
  }

  const rows: JsonObject[] = [];

  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCsvLine(line, delimiter);

    // Pad with empty strings if row has fewer columns
    while (values.length < headers.length) {
      values.push("");
    }

    // Warn if row has more columns than expected
    if (values.length > headers.length) {
      return {
        success: false,
        output: "",
        error: `Row ${i + 1} has ${values.length} columns, expected ${headers.length}. Check your delimiter setting.`,
      };
    }

    const row: JsonObject = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = values[j] || "";
      setNestedValue(row, header, parseValue(value));
    }
    rows.push(row);
  }

  return { success: true, output: JSON.stringify(rows, null, 2), error: null };
}

// Helper: Flatten nested objects with dot notation
function flattenObject(
  obj: unknown,
  prefix = "",
): Record<string, string | number | boolean | null> {
  const result: Record<string, string | number | boolean | null> = {};

  if (obj === null || obj === undefined) {
    result[prefix || "value"] = null;
    return result;
  }

  if (typeof obj !== "object") {
    result[prefix || "value"] = obj as string | number | boolean;
    return result;
  }

  if (Array.isArray(obj)) {
    // Check if array contains only primitives
    const allPrimitives = obj.every(
      (item) =>
        item === null ||
        item === undefined ||
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean",
    );

    if (allPrimitives && obj.length <= 10) {
      // Flatten small arrays of primitives with indexed keys
      obj.forEach((item, index) => {
        const key = prefix ? `${prefix}.${index}` : `${index}`;
        result[key] = item as string | number | boolean | null;
      });
    } else if (
      obj.length > 0 &&
      obj.every(
        (item) =>
          typeof item === "object" && item !== null && !Array.isArray(item),
      )
    ) {
      // Array of objects - flatten each with index
      obj.forEach((item, index) => {
        const indexedPrefix = prefix ? `${prefix}.${index}` : `${index}`;
        Object.assign(result, flattenObject(item, indexedPrefix));
      });
    } else {
      // Complex or large arrays - convert to JSON string
      result[prefix || "value"] = JSON.stringify(obj);
    }
    return result;
  }

  // Regular object - recursively flatten
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[newKey] = null;
    } else if (Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (typeof value === "object") {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value as string | number | boolean;
    }
  }

  return result;
}

// Helper: Escape CSV values according to RFC 4180
function escapeCsvValue(value: string, delimiter: string): string {
  // RFC 4180: Fields containing line breaks (CRLF), double quotes, and delimiters
  // should be enclosed in double-quotes
  const needsQuoting =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r");

  if (needsQuoting) {
    // Escape double quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

// Helper: Parse CSV line handling quoted values
function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// Helper: Parse string values to appropriate types
function parseValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  if (trimmed === "") return "";
  if (trimmed.toLowerCase() === "null") return null;
  if (trimmed.toLowerCase() === "true") return true;
  if (trimmed.toLowerCase() === "false") return false;

  // Try to parse as number
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed !== "") {
    return num;
  }

  return value;
}

// Helper: Generate column letter (a, b, c, ..., z, aa, ab, ...)
function generateColumnLetter(index: number): string {
  let result = "";
  let num = index;

  while (num >= 0) {
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26) - 1;
  }

  return result;
}

// Helper: Set nested value using dot notation with array support
function setNestedValue(obj: JsonObject, path: string, value: unknown): void {
  const keys = path.split(".");
  let current: unknown = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextKeyArrayIndex = /^\d+$/.test(nextKey);

    if (Array.isArray(current)) {
      const index = parseInt(key, 10);
      if (!current[index]) {
        current[index] = isNextKeyArrayIndex ? [] : {};
      }
      current = current[index];
    } else {
      const currentObj = current as JsonObject;
      if (!(key in currentObj)) {
        currentObj[key] = isNextKeyArrayIndex ? [] : {};
      }
      current = currentObj[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  if (Array.isArray(current)) {
    const index = parseInt(lastKey, 10);
    current[index] = value;
  } else {
    (current as JsonObject)[lastKey] = value;
  }
}
