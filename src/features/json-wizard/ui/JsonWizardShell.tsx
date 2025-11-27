"use client";

import Link from "next/link";
import { useRef } from "react";

import { renderHighlightedText } from "../lib/highlighter";
import type { ViewMode, ValidationResult } from "../model/types";

import { EditorActions } from "./EditorActions";
import { OptionsControls } from "./OptionsControls";
import { SearchControls } from "./SearchControls";
import { ViewModeControls } from "./ViewModeControls";

import {
  useJsonSyntaxHighlighter,
  type JsonSyntaxTheme,
} from "@/shared/hooks/useJsonSyntaxHighlighter";
import {
  trackCopyEvent,
  trackToolConversion,
  trackClearEvent,
} from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import {
  TextEditorContainer,
  type TextEditorContainerRef,
} from "@/shared/ui/text-editor/TextEditorContainer";
import { useToast } from "@/shared/ui/toast/Toast";

interface JsonWizardShellProps {
  input: string;
  setInput: (value: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  indentSize: number;
  setIndentSize: (size: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  caseSensitive: boolean;
  setCaseSensitive: (value: boolean) => void;
  sortKeys: boolean;
  setSortKeys: (value: boolean) => void;
  currentMatchIndex: number;
  setCurrentMatchIndex: (index: number) => void;
  validation: ValidationResult;
  processedJSON: string;
  matchPositions: Map<number, Map<number, number>>;
  inputToOutputMatchMap: Map<number, number>;
  outputMatchPositions: Map<number, Map<number, number>>;
  totalMatches: number;
  goToNextMatch: () => void;
  goToPreviousMatch: () => void;
}

export function JsonWizardShell({
  input,
  setInput,
  viewMode,
  setViewMode,
  indentSize,
  setIndentSize,
  searchTerm,
  setSearchTerm,
  caseSensitive,
  setCaseSensitive,
  sortKeys,
  setSortKeys,
  currentMatchIndex,
  setCurrentMatchIndex,
  validation,
  processedJSON,
  matchPositions,
  inputToOutputMatchMap,
  outputMatchPositions,
  totalMatches,
  goToNextMatch,
  goToPreviousMatch,
}: JsonWizardShellProps) {
  const inputEditorRef = useRef<TextEditorContainerRef>(null);
  const outputEditorRef = useRef<TextEditorContainerRef>(null);
  const { showToast, ToastComponent } = useToast();

  const inputJsonSyntax = useJsonSyntaxHighlighter({
    enabled: Boolean(input.trim()),
  });
  const inputSyntaxTheme = inputJsonSyntax?.theme;

  const outputJsonSyntax = useJsonSyntaxHighlighter({
    enabled: Boolean(processedJSON.trim()),
  });
  const outputJsonSyntaxRenderer = outputJsonSyntax?.renderContent;
  const outputSyntaxTheme = outputJsonSyntax?.theme;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processedJSON);
      showToast("Copied to clipboard");
      trackCopyEvent({
        tool: TOOL_NAMES.JSON_WIZARD,
        viewMode,
        sortKeys,
        indentSize: viewMode === "pretty" ? indentSize : undefined,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const canSearch = validation.isValid && Boolean(input.trim());

  // Helper wrapper for rendering highlighted text
  const renderLine = (
    text: string,
    lineIndex?: number,
    useOutputMatches = false,
    currentLocalMatchIndex?: number,
    syntaxTheme?: JsonSyntaxTheme,
  ) =>
    renderHighlightedText({
      text,
      lineIndex,
      useOutputMatches,
      currentLocalMatchIndex,
      syntaxTheme,
      validation,
      searchTerm,
      currentMatchIndex,
      matchPositions,
      outputMatchPositions,
    });

  return (
    <>
      <div className="space-y-6">
        {/* Search, Mode, and Options - Single-row responsive layout */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Group */}
          <SearchControls
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentMatchIndex(0);
            }}
            onEnter={goToNextMatch}
            caseSensitive={caseSensitive}
            onCaseSensitiveToggle={() => {
              setCaseSensitive(!caseSensitive);
              setCurrentMatchIndex(0);
            }}
            canSearch={canSearch}
            currentMatchIndex={currentMatchIndex}
            totalMatches={totalMatches}
            onPreviousMatch={goToPreviousMatch}
            onNextMatch={goToNextMatch}
          />

          {/* Divider */}
          <div className="hidden xl:block h-10 w-px bg-zinc-200 dark:bg-zinc-800"></div>

          {/* Mode & Options Group */}
          <div className="flex flex-none items-center gap-2 flex-wrap w-full xl:w-auto">
            <ViewModeControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              disabled={!validation.isValid}
              hasInput={Boolean(input.trim())}
            />

            <OptionsControls
              sortKeys={sortKeys}
              onSortKeysToggle={() => setSortKeys(!sortKeys)}
              indentSize={indentSize}
              onIndentSizeChange={setIndentSize}
              viewMode={viewMode}
              disabled={!validation.isValid}
            />
          </div>
        </div>

        {/* Editor controls and panes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Editor Column */}
          <div className="space-y-1.5">
            <EditorActions
              hasContent={Boolean(input.trim())}
              onClear={() => {
                trackClearEvent({
                  tool: TOOL_NAMES.JSON_WIZARD,
                  viewMode,
                  sortKeys,
                });
                setInput("");
              }}
              isValid={validation.isValid}
              showValidation={true}
            />
            <div>
              <TextEditorContainer
                id="json-wizard-input"
                ref={inputEditorRef}
                value={input}
                onChange={setInput}
                wrap={true}
                height="h-[calc(100vh-400px)] min-h-[360px]"
                placeholder='Paste your JSON here, e.g., {"key": "value"}'
                renderLineContent={(line, index) =>
                  renderLine(line, index, false, undefined, inputSyntaxTheme)
                }
              />
            </div>
          </div>

          {/* Output Editor Column */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 min-h-10">
              <div className="flex-1"></div>
              {processedJSON &&
                validation.isValid &&
                ["minified", "escaped"].includes(viewMode) && (
                  <Link
                    href="/text-encoder"
                    onClick={(e) => {
                      e.preventDefault();
                      trackToolConversion({
                        sourceTool: "json-wizard",
                        destinationTool: "text-encoder",
                        viewMode,
                        sortKeys,
                      });
                      sessionStorage.setItem(
                        "json-wizard-state",
                        JSON.stringify({
                          input,
                          viewMode,
                          indentSize,
                          sortKeys,
                          caseSensitive,
                        }),
                      );
                      sessionStorage.setItem(
                        "cross-tool-input-text-encoder",
                        processedJSON,
                      );
                      window.location.href = "/text-encoder";
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 active:bg-purple-300 dark:active:bg-purple-900/70 transition-colors cursor-pointer whitespace-nowrap"
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
                    Open in Text Encoder
                  </Link>
                )}
              {processedJSON &&
                validation.isValid &&
                viewMode !== "escaped" && (
                  <Link
                    href="/csv-json-converter"
                    onClick={(e) => {
                      e.preventDefault();
                      trackToolConversion({
                        sourceTool: "json-wizard",
                        destinationTool: "csv-json-converter",
                        viewMode,
                        sortKeys,
                      });
                      sessionStorage.setItem(
                        "json-wizard-state",
                        JSON.stringify({
                          input,
                          viewMode,
                          indentSize,
                          sortKeys,
                          caseSensitive,
                        }),
                      );
                      sessionStorage.setItem(
                        "cross-tool-input-csv-json-converter",
                        processedJSON,
                      );
                      window.location.href = "/csv-json-converter";
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 active:bg-blue-300 dark:active:bg-blue-900/70 transition-colors cursor-pointer whitespace-nowrap"
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
                    Convert to CSV
                  </Link>
                )}
              <EditorActions
                hasContent={Boolean(processedJSON && validation.isValid)}
                onCopy={copyToClipboard}
              />
            </div>
            <div>
              <TextEditorContainer
                id="json-wizard-output"
                ref={outputEditorRef}
                value={processedJSON || ""}
                readOnly
                placeholder="Formatted JSON will appear here..."
                height="h-[calc(100vh-400px)] min-h-[360px]"
                wrap={viewMode === "minified" || viewMode === "escaped"}
                renderContent={
                  !searchTerm && outputJsonSyntaxRenderer
                    ? outputJsonSyntaxRenderer
                    : undefined
                }
                renderLineContent={
                  searchTerm && processedJSON
                    ? (line, index) => {
                        const outputMatchIndex =
                          inputToOutputMatchMap.get(currentMatchIndex) ?? -1;
                        return renderLine(
                          line,
                          index,
                          true,
                          outputMatchIndex,
                          outputSyntaxTheme,
                        );
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
      {ToastComponent}
    </>
  );
}
