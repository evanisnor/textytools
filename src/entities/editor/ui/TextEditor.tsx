"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import {
  getContainerClasses,
  getScrollContainerClasses,
  getWrapClasses,
  getTextareaClasses,
  getContentOverlayClasses,
  getSimpleModeContainerClasses,
  getSimpleModeTextareaClasses,
} from "../lib/editor-styles";
import type { TextEditorProps, TextEditorRef } from "../model/types";

/**
 * TextEditor - A textarea component with line numbers, word wrap, and syntax highlighting support
 *
 * Features:
 * - Line numbers that auto-adjust width based on total lines
 * - Word wrap support with proper line height alignment
 * - Read-only mode for displaying formatted output
 * - Custom line rendering for syntax highlighting or search highlighting
 * - Custom line styling for error highlighting
 * - Monospace font optimized for code/data
 * - Configurable container styling with height and padding
 * - Scroll synchronization between content and textarea
 *
 * This component merges the functionality of the old TextEditor and TextEditorContainer
 * into a single, cohesive API that better follows FSD principles by separating
 * presentation logic (via lib/editor-styles.ts) from component logic.
 *
 * @example Basic usage
 * ```tsx
 * <TextEditor
 *   value={text}
 *   onChange={setText}
 *   placeholder="Enter text..."
 * />
 * ```
 *
 * @example With syntax highlighting
 * ```tsx
 * <TextEditor
 *   value={json}
 *   readOnly
 *   renderContent={(content) => <JsonHighlighter content={content} />}
 * />
 * ```
 *
 * @example With scroll control
 * ```tsx
 * const editorRef = useRef<TextEditorRef>(null);
 *
 * <TextEditor
 *   ref={editorRef}
 *   value={text}
 *   onChange={setText}
 *   height="h-96"
 * />
 *
 * // Later: editorRef.current?.scrollTo({ top: 0 });
 * ```
 */
export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(
  (
    {
      value,
      onChange,
      placeholder = "Enter text...",
      readOnly = false,
      className = "",
      renderLineContent,
      highlightLine,
      lineClassName,
      renderContent,
      showLineNumbers = true,
      wrap = false,
      id,
      height = "h-64",
      containerClassName = "",
    },
    ref,
  ) => {
    const outerContainerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const innerContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState<number>(0);
    const [lineHeights, setLineHeights] = useState<number[]>([]);
    const [baseLineHeight, setBaseLineHeight] = useState<number>(20);

    const arraysEqual = (a: number[], b: number[]) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    };

    const lines = value.split("\n");
    const lineNumberWidth = String(lines.length).length;
    const hasCustomRendering = renderContent || renderLineContent;
    const showNumbers = showLineNumbers && Boolean(value); // Only show line numbers when there's content
    const wrapClasses = getWrapClasses(wrap);
    const normalizedPlaceholder = placeholder?.includes("\\n")
      ? placeholder.replace(/\\n/g, "\n")
      : placeholder;

    useImperativeHandle(ref, () => ({
      scrollTo: (options: ScrollToOptions) => {
        scrollContainerRef.current?.scrollTo(options);
      },
      getScrollContainer: () => scrollContainerRef.current,
      getInnerContainer: () => innerContainerRef.current,
    }));

    useLayoutEffect(() => {
      if (!contentRef.current) return;

      const node = contentRef.current;

      const updateMetrics = () => {
        if (!textareaRef.current) return;
        const computed = window.getComputedStyle(textareaRef.current);
        const lineHeightValue = parseFloat(computed.lineHeight);
        if (!Number.isNaN(lineHeightValue)) {
          setBaseLineHeight((prev) =>
            prev === lineHeightValue ? prev : lineHeightValue,
          );
        }
        const width = node.clientWidth;
        setContentWidth((prev) => (prev === width ? prev : width));
      };

      updateMetrics();

      const resizeObserver = new ResizeObserver(() => {
        updateMetrics();
      });

      resizeObserver.observe(node);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useLayoutEffect(() => {
      if (!wrap || !showNumbers) {
        return;
      }
      if (!measureRef.current) return;

      const nodes = Array.from(
        measureRef.current.querySelectorAll<HTMLDivElement>("[data-line]"),
      );
      const measuredHeights = nodes.map((node) => {
        return node.getBoundingClientRect().height || baseLineHeight;
      });

      setLineHeights((prev) =>
        arraysEqual(prev, measuredHeights) ? prev : measuredHeights,
      );
    }, [value, wrap, showNumbers, contentWidth, baseLineHeight]);

    // Sync scroll between parent container and textarea
    useEffect(() => {
      if (!textareaRef.current || !scrollContainerRef.current || readOnly)
        return;

      const textarea = textareaRef.current;
      const container = scrollContainerRef.current;

      let syncingFromTextarea = false;
      let syncingFromContainer = false;

      const handleTextareaScroll = () => {
        if (syncingFromContainer) return;
        const topChanged = container.scrollTop !== textarea.scrollTop;
        const leftChanged = container.scrollLeft !== textarea.scrollLeft;
        if (!topChanged && !leftChanged) {
          return;
        }
        syncingFromTextarea = true;
        if (topChanged) {
          container.scrollTop = textarea.scrollTop;
        }
        if (leftChanged) {
          container.scrollLeft = textarea.scrollLeft;
        }
        syncingFromTextarea = false;
      };

      const handleContainerScroll = () => {
        if (syncingFromTextarea) return;
        const topChanged = textarea.scrollTop !== container.scrollTop;
        const leftChanged = textarea.scrollLeft !== container.scrollLeft;
        if (!topChanged && !leftChanged) {
          return;
        }
        syncingFromContainer = true;
        if (topChanged) {
          textarea.scrollTop = container.scrollTop;
        }
        if (leftChanged) {
          textarea.scrollLeft = container.scrollLeft;
        }
        syncingFromContainer = false;
      };

      textarea.addEventListener("scroll", handleTextareaScroll);
      container.addEventListener("scroll", handleContainerScroll);

      return () => {
        textarea.removeEventListener("scroll", handleTextareaScroll);
        container.removeEventListener("scroll", handleContainerScroll);
      };
    }, [readOnly]);

    // Simple mode: no line numbers and no custom rendering
    if (!showLineNumbers && !hasCustomRendering) {
      return (
        <div
          ref={outerContainerRef}
          className={getContainerClasses({ height, containerClassName })}
        >
          <div
            ref={scrollContainerRef}
            className={getScrollContainerClasses(className)}
          >
            <div
              ref={innerContainerRef}
              className={getSimpleModeContainerClasses()}
              onClick={() => {
                // Allow clicking anywhere to focus the textarea
                if (!readOnly && textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
            >
              <textarea
                ref={textareaRef}
                id={id}
                value={value}
                onChange={
                  onChange ? (e) => onChange(e.target.value) : undefined
                }
                placeholder={normalizedPlaceholder}
                readOnly={readOnly}
                className={getSimpleModeTextareaClasses(wrap)}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={outerContainerRef}
        className={getContainerClasses({ height, containerClassName })}
      >
        <div
          ref={scrollContainerRef}
          className={getScrollContainerClasses(className)}
        >
          <div
            ref={innerContainerRef}
            className={`flex min-h-full font-mono text-sm`}
          >
            {/* Line numbers */}
            {showNumbers && (
              <div
                className="select-none text-zinc-400 dark:text-zinc-600 text-right pr-4 border-r border-zinc-200 dark:border-zinc-800"
                style={{ minWidth: `${lineNumberWidth + 2}ch` }}
              >
                {lines.map((_, index) => {
                  const lineNumber = index + 1;
                  const isHighlighted = highlightLine?.(lineNumber);
                  const customClassName = lineClassName?.(lineNumber);
                  const height = wrap
                    ? (lineHeights[index] ?? baseLineHeight)
                    : baseLineHeight;
                  return (
                    <div
                      key={index}
                      className={
                        customClassName ||
                        (isHighlighted
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold"
                          : "")
                      }
                      style={{
                        height,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                      }}
                    >
                      {lineNumber}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Content area */}
            <div
              ref={contentRef}
              className={`flex-1 ${showNumbers ? "pl-4" : ""} relative flex flex-col`}
              onClick={() => {
                // Allow clicking anywhere in the content area to focus the textarea
                if (!readOnly && textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
            >
              {readOnly ? (
                // Read-only mode: overlay rendered content on top of readonly textarea
                <div className="relative flex-1">
                  {hasCustomRendering && (
                    <div className={getContentOverlayClasses(wrap)}>
                      {renderContent
                        ? renderContent(value)
                        : lines.map((line, index) => {
                            const lineNumber = index + 1;
                            const isHighlighted = highlightLine?.(lineNumber);
                            const lineContent = renderLineContent
                              ? renderLineContent(line, index)
                              : line;
                            return (
                              <div
                                key={index}
                                className={
                                  isHighlighted
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                    : "text-zinc-900 dark:text-zinc-50"
                                }
                              >
                                {lineContent}
                              </div>
                            );
                          })}
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    id={id}
                    value={value}
                    readOnly
                    placeholder={normalizedPlaceholder}
                    className={getTextareaClasses({
                      hasCustomRendering: Boolean(hasCustomRendering),
                      readOnly: true,
                      wrap,
                    })}
                    spellCheck={false}
                  />
                </div>
              ) : (
                // Editable mode: overlay transparent textarea on top of rendered content
                <div className="relative flex-1">
                  {hasCustomRendering && (
                    <div className={getContentOverlayClasses(wrap)}>
                      {renderContent
                        ? renderContent(value)
                        : lines.map((line, index) => {
                            const lineNumber = index + 1;
                            const isHighlighted = highlightLine?.(lineNumber);
                            const lineContent = renderLineContent
                              ? renderLineContent(line, index)
                              : line;
                            return (
                              <div
                                key={index}
                                className={
                                  isHighlighted
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                    : "text-zinc-900 dark:text-zinc-50"
                                }
                              >
                                {lineContent}
                              </div>
                            );
                          })}
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    id={id}
                    value={value}
                    onChange={
                      onChange ? (e) => onChange(e.target.value) : undefined
                    }
                    placeholder={normalizedPlaceholder}
                    className={getTextareaClasses({
                      hasCustomRendering: Boolean(hasCustomRendering),
                      readOnly: false,
                      wrap,
                    })}
                    spellCheck={false}
                    style={
                      hasCustomRendering
                        ? {
                            caretColor: "var(--caret-color)",
                          }
                        : undefined
                    }
                  />
                </div>
              )}
              {showNumbers && wrap && (
                <div
                  ref={measureRef}
                  aria-hidden
                  className={`absolute inset-0 select-none opacity-0 pointer-events-none ${wrapClasses}`}
                  style={{
                    zIndex: -1,
                    visibility: "hidden",
                    lineHeight: `${baseLineHeight}px`,
                  }}
                >
                  {lines.map((line, index) => (
                    <div key={index} data-line>
                      {line || "\u200b"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TextEditor.displayName = "TextEditor";
