"use client";

import { Fragment, useRef, useEffect, useMemo } from "react";

import { useDiffViewerContext } from "../model/DiffViewerProvider";
import type { DiffType } from "../model/types";

import { trackClearEvent } from "@/shared/lib/analytics";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { SearchBox } from "@/shared/ui/search-box/SearchBox";
import {
  TextEditorContainer,
  type TextEditorContainerRef,
} from "@/shared/ui/text-editor/TextEditorContainer";
import { useToast } from "@/shared/ui/toast/Toast";

export function DiffViewerShell() {
  const {
    input,
    setInput,
    output,
    setOutput,
    searchTerm,
    setSearchTerm,
    caseSensitive,
    setCaseSensitive,
    currentMatchIndex,
    setCurrentMatchIndex,
    diffLines,
    searchMatches,
    totalMatches,
    inputMatchMap,
    outputMatchMap,
    goToNextMatch,
    goToPreviousMatch,
  } = useDiffViewerContext();
  const inputEditorRef = useRef<TextEditorContainerRef>(null);
  const outputEditorRef = useRef<TextEditorContainerRef>(null);
  const { ToastComponent } = useToast();

  // Scroll to current match in both panes
  useEffect(() => {
    if (!searchTerm || searchMatches.length === 0) return;

    const currentMatch = searchMatches[currentMatchIndex];
    if (!currentMatch) return;

    setTimeout(() => {
      const scrollToLine = (
        editorRef: React.RefObject<TextEditorContainerRef | null>,
      ) => {
        const container = editorRef.current?.getScrollContainer();
        if (!container) return;

        const overlay = container.querySelector(".pointer-events-none");
        if (!overlay) return;

        const lineDivs = overlay.querySelectorAll(":scope > div");
        const targetLine = lineDivs[currentMatch.lineIndex] as HTMLElement;

        if (targetLine) {
          const elementRect = targetLine.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          const relativeTop =
            elementRect.top - containerRect.top + container.scrollTop;
          const centerOffset =
            container.clientHeight / 2 - elementRect.height / 2;

          editorRef.current?.scrollTo({
            top: relativeTop - centerOffset,
            behavior: "smooth",
          });
        }
      };

      scrollToLine(inputEditorRef);
      scrollToLine(outputEditorRef);
    }, 0);
  }, [currentMatchIndex, searchMatches, searchTerm]);

  const renderHighlightedText = (
    text: string,
    lineIndex: number,
    pane: "input" | "output",
  ) => {
    if (!searchTerm) return text;

    const positions = pane === "input" ? inputMatchMap : outputMatchMap;
    const lineMatches = positions.get(lineIndex);
    if (!lineMatches || lineMatches.size === 0) return text;

    const regex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      caseSensitive ? "g" : "gi",
    );

    const currentMatch = searchMatches[currentMatchIndex];
    const isCurrentMatchLine =
      currentMatch && currentMatch.lineIndex === lineIndex;

    const parts: Array<{ text: string; isMatch: boolean; isCurrent: boolean }> =
      [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.index),
          isMatch: false,
          isCurrent: false,
        });
      }

      const isCurrent = isCurrentMatchLine && lineMatches.has(match.index);

      parts.push({
        text: match[0],
        isMatch: true,
        isCurrent,
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        isMatch: false,
        isCurrent: false,
      });
    }

    return parts.map((part, index) => {
      if (part.isMatch) {
        return (
          <span
            key={index}
            className={
              part.isCurrent
                ? "bg-green-300 dark:bg-green-600 text-black font-bold"
                : "bg-yellow-300 dark:bg-yellow-600 text-black"
            }
          >
            {part.text}
          </span>
        );
      }
      return <Fragment key={index}>{part.text}</Fragment>;
    });
  };

  const inputLineDiffType = useMemo(() => {
    const map = new Map<number, DiffType>();
    diffLines.forEach((line) => {
      if (line.inputLineNumber !== null && line.type !== "unchanged") {
        if (line.type !== "added") {
          map.set(line.inputLineNumber - 1, line.type);
        }
      }
    });
    return map;
  }, [diffLines]);

  const outputLineDiffType = useMemo(() => {
    const map = new Map<number, DiffType>();
    diffLines.forEach((line) => {
      if (line.outputLineNumber !== null && line.type !== "unchanged") {
        if (line.type !== "removed") {
          map.set(line.outputLineNumber - 1, line.type);
        }
      }
    });
    return map;
  }, [diffLines]);

  const renderDiffLine = (
    text: string,
    lineIndex: number,
    pane: "input" | "output",
  ) => {
    const diffType =
      pane === "input"
        ? inputLineDiffType.get(lineIndex)
        : outputLineDiffType.get(lineIndex);

    let bgClass = "";
    switch (diffType) {
      case "added":
        bgClass = "bg-green-200/60 dark:bg-green-800/40";
        break;
      case "removed":
        bgClass = "bg-red-200/60 dark:bg-red-800/40";
        break;
      case "modified":
        bgClass = "bg-yellow-200/60 dark:bg-yellow-800/40";
        break;
      default:
        bgClass = "";
    }

    const content = searchTerm
      ? renderHighlightedText(text, lineIndex, pane)
      : text;

    const displayContent = text === "" ? "\u00A0" : content;

    if (bgClass) {
      return (
        <span className={`${bgClass} px-0.5 block`}>{displayContent}</span>
      );
    }

    return displayContent;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2 min-h-9">
                <label
                  htmlFor="diff-input"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Left
                </label>
                {input.trim() && (
                  <button
                    onClick={() => {
                      trackClearEvent({ tool: TOOL_NAMES.DIFF_VIEWER });
                      setInput("");
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
              <TextEditorContainer
                id="diff-input"
                ref={inputEditorRef}
                value={input}
                onChange={setInput}
                placeholder="Paste first text here..."
                height="h-[600px]"
                renderLineContent={(line, index) =>
                  renderDiffLine(line, index, "input")
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 min-h-9">
                <label
                  htmlFor="diff-output"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Right
                </label>
                {output.trim() && (
                  <button
                    onClick={() => {
                      trackClearEvent({ tool: TOOL_NAMES.DIFF_VIEWER });
                      setOutput("");
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
              <TextEditorContainer
                id="diff-output"
                ref={outputEditorRef}
                value={output}
                onChange={setOutput}
                placeholder="Paste second text here..."
                height="h-[600px]"
                renderLineContent={(line, index) =>
                  renderDiffLine(line, index, "output")
                }
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div>
            <div className="mb-2 min-h-9">
              <label
                htmlFor="diff-search"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Search
              </label>
            </div>
            <div className="space-y-2">
              <SearchBox
                id="diff-search"
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentMatchIndex(0);
                }}
                onEnter={goToNextMatch}
                placeholder="Search in both panes..."
              />

              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="case-sensitive"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="case-sensitive"
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => {
                      setCaseSensitive(e.target.checked);
                      setCurrentMatchIndex(0);
                    }}
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Case Sensitive
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousMatch}
                    disabled={!searchTerm || totalMatches === 0}
                    className="p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous match"
                  >
                    ←
                  </button>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 min-w-[60px] text-center">
                    {searchTerm && totalMatches > 0
                      ? `${currentMatchIndex + 1} / ${totalMatches}`
                      : "0 / 0"}
                  </span>
                  <button
                    onClick={goToNextMatch}
                    disabled={!searchTerm || totalMatches === 0}
                    className="p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next match"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2">
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Legend
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200/60 dark:bg-green-800/40 rounded border border-green-300 dark:border-green-700"></div>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Added lines
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200/60 dark:bg-red-800/40 rounded border border-red-300 dark:border-red-700"></div>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Removed lines
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200/60 dark:bg-yellow-800/40 rounded border border-yellow-300 dark:border-yellow-700"></div>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Modified lines
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {ToastComponent}
    </>
  );
}
