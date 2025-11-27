"use client";

import Link from "next/link";

import { useCsvJsonConverter } from "../model/useCsvJsonConverter";

import { useCsvSyntaxHighlighter } from "@/shared/hooks/useCsvSyntaxHighlighter";
import { useJsonSyntaxHighlighter } from "@/shared/hooks/useJsonSyntaxHighlighter";
import {
  trackCopyEvent,
  trackToolConversion,
  trackClearEvent,
} from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { TextEditorContainer } from "@/shared/ui/text-editor/TextEditorContainer";
import { useToast } from "@/shared/ui/toast/Toast";


export function CsvJsonConverterShell() {
  const {
    input,
    setInput,
    delimiter,
    setDelimiter,
    includeHeaders,
    setIncludeHeaders,
    result,
  } = useCsvJsonConverter();
  const { showToast, ToastComponent } = useToast();

  const inputJsonSyntax = useJsonSyntaxHighlighter({
    enabled: result.detectedFormat === "json" && Boolean(input.trim()),
  });

  const outputJsonSyntax = useJsonSyntaxHighlighter({
    enabled:
      result.detectedFormat === "csv" &&
      result.success &&
      Boolean(result.output),
  });

  const inputCsvSyntax = useCsvSyntaxHighlighter({
    enabled: result.detectedFormat === "csv" && Boolean(input.trim()),
    delimiter,
  });

  const outputCsvSyntax = useCsvSyntaxHighlighter({
    enabled:
      result.detectedFormat === "json" &&
      result.success &&
      Boolean(result.output),
    delimiter,
  });

  return (
    <>
      {/* Main Grid: 3 columns for input/output, 1 column for options */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          {/* Input */}
          <div>
            <div className="mb-2 grid grid-cols-[auto_1fr_auto] items-center min-h-9 gap-3">
              <label
                htmlFor="csv-json-input"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Input
              </label>
              {input.trim() && (
                <div className="justify-self-center inline-flex items-center px-3 py-1.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                    {result.detectedFormat === "json"
                      ? "JSON → CSV"
                      : "CSV → JSON"}
                  </span>
                </div>
              )}
              {input.trim() && (
                <button
                  onClick={() => {
                    trackClearEvent({
                      tool: TOOL_NAMES.CSV_JSON_CONVERTER,
                      direction:
                        result.detectedFormat === "json"
                          ? "json-to-csv"
                          : "csv-to-json",
                      delimiter,
                      includeHeaders,
                    });
                    setInput("");
                  }}
                  className="justify-self-end inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors cursor-pointer"
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
              )}
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
              <TextEditorContainer
                id="csv-json-input"
                value={input}
                onChange={setInput}
                placeholder='Paste JSON or CSV here...\n\nJSON example:\n[\n  {"name": "Alice", "age": 30},\n  {"name": "Bob", "age": 25}\n]\n\nCSV example:\nname,age\nAlice,30\nBob,25'
                height="h-70"
                containerClassName="p-0 border-0"
                renderContent={
                  result.detectedFormat === "json"
                    ? inputJsonSyntax?.renderContent
                    : undefined
                }
                renderLineContent={
                  result.detectedFormat === "csv" && input.trim()
                    ? inputCsvSyntax?.renderLineContent
                    : undefined
                }
              />
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="mb-2 flex items-center justify-between min-h-9">
              <label
                htmlFor="csv-json-output"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
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
                        // Track cross-tool conversion
                        trackToolConversion({
                          sourceTool: "csv-json-converter",
                          destinationTool: "json-wizard",
                          direction:
                            result.detectedFormat === "json"
                              ? "json-to-csv"
                              : "csv-to-json",
                          delimiter,
                          includeHeaders,
                        });
                        // Save current CSV input for restoration on back navigation
                        sessionStorage.setItem(
                          "csv-json-converter-input",
                          input,
                        );
                        // Save converted JSON for JSON Wizard
                        sessionStorage.setItem(
                          "json-wizard-input",
                          result.output,
                        );
                        window.location.href = "/json-wizard";
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 transition-colors cursor-pointer"
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
                      trackCopyEvent({
                        tool: TOOL_NAMES.CSV_JSON_CONVERTER,
                        direction:
                          result.detectedFormat === "json"
                            ? "json-to-csv"
                            : "csv-to-json",
                        delimiter,
                        includeHeaders,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-colors cursor-pointer"
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
              <TextEditorContainer
                id="csv-json-output"
                value={result.success ? result.output : ""}
                readOnly
                placeholder={
                  result.error ? "" : "Converted output will appear here..."
                }
                height="h-70"
                containerClassName="p-0 border-0"
                renderContent={
                  result.detectedFormat === "csv" &&
                  result.success &&
                  result.output
                    ? outputJsonSyntax?.renderContent
                    : undefined
                }
                renderLineContent={
                  result.detectedFormat === "json" &&
                  result.success &&
                  result.output
                    ? outputCsvSyntax?.renderLineContent
                    : undefined
                }
              />
            </div>
            {result.error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                Error: {result.error}
              </div>
            )}
          </div>
        </div>

        {/* Options Panel */}
        <div className="flex flex-col h-full">
          <div className="mb-2 min-h-9">
            <div className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Options
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <label
                htmlFor="delimiter-select"
                className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2"
              >
                Delimiter
              </label>
              <select
                id="delimiter-select"
                value={delimiter === "\t" ? "tab" : delimiter}
                onChange={(e) => {
                  const value = e.target.value;
                  setDelimiter(value === "tab" ? "\t" : value);
                }}
                className="w-full px-3 py-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="tab">Tab (\t)</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
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
      {ToastComponent}
    </>
  );
}
