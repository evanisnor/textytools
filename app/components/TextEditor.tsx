"use client";

import { useRef, forwardRef, useImperativeHandle, useEffect } from "react";

export interface TextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  renderLineContent?: (line: string, lineIndex: number) => React.ReactNode;
  highlightLine?: (lineNumber: number) => boolean;
  lineClassName?: (lineNumber: number) => string;
  /**
   * Custom render function for the entire content.
   * When provided, this takes precedence over renderLineContent.
   * Use this for syntax highlighting or custom formatting that spans multiple lines.
   */
  renderContent?: (content: string) => React.ReactNode;
  /**
   * Whether to show line numbers
   * @default true
   */
  showLineNumbers?: boolean;
  /**
   * Enable word wrap
   * @default false
   */
  wrap?: boolean;
  /**
   * ID for the textarea element (for label association)
   */
  id?: string;
}

export interface TextEditorRef {
  scrollTo: (options: ScrollToOptions) => void;
  getContainer: () => HTMLDivElement | null;
}

/**
 * TextEditor - A textarea component with line numbers
 *
 * Features:
 * - Line numbers that auto-adjust width based on total lines
 * - Read-only mode for displaying formatted output
 * - Custom line rendering for syntax highlighting or search highlighting
 * - Custom line styling for error highlighting
 * - Monospace font optimized for code/data
 *
 * @param value - The text content to display/edit
 * @param onChange - Called when text changes (not called in readOnly mode)
 * @param placeholder - Placeholder text shown when value is empty
 * @param readOnly - If true, disables editing (shows as static content)
 * @param className - Additional CSS classes for the container
 * @param renderLineContent - Optional function to render custom line content (e.g., for search highlighting)
 * @param highlightLine - Optional function to determine if a line should be highlighted
 * @param lineClassName - Optional function to return custom className for a line number
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
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      scrollTo: (options: ScrollToOptions) => {
        containerRef.current?.scrollTo(options);
      },
      getContainer: () => containerRef.current,
    }));

    // Sync scroll between parent container and textarea
    useEffect(() => {
      if (!textareaRef.current || !containerRef.current || readOnly) return;

      const textarea = textareaRef.current;
      const container = containerRef.current.parentElement; // Get parent scroll container

      if (!container) return;

      const handleTextareaScroll = () => {
        if (container.scrollTop !== textarea.scrollTop) {
          container.scrollTop = textarea.scrollTop;
        }
        if (container.scrollLeft !== textarea.scrollLeft) {
          container.scrollLeft = textarea.scrollLeft;
        }
      };

      const handleContainerScroll = () => {
        if (textarea.scrollTop !== container.scrollTop) {
          textarea.scrollTop = container.scrollTop;
        }
        if (textarea.scrollLeft !== container.scrollLeft) {
          textarea.scrollLeft = container.scrollLeft;
        }
      };

      textarea.addEventListener("scroll", handleTextareaScroll);
      container.addEventListener("scroll", handleContainerScroll);

      return () => {
        textarea.removeEventListener("scroll", handleTextareaScroll);
        container.removeEventListener("scroll", handleContainerScroll);
      };
    }, [readOnly]);

    const lines = value.split("\n");
    const lineNumberWidth = String(lines.length).length;
    const hasCustomRendering = renderContent || renderLineContent;
    const showNumbers = showLineNumbers && value; // Only show line numbers when there's content

    // Simple mode: no line numbers and no custom rendering
    if (!showLineNumbers && !hasCustomRendering) {
      return (
        <div
          ref={containerRef}
          className={`w-full min-h-full flex flex-col ${className}`}
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
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full flex-1 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none font-mono text-sm ${wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"}`}
            spellCheck={false}
          />
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={`flex min-h-full font-mono text-sm ${className}`}
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
              return (
                <div
                  key={index}
                  className={
                    customClassName ||
                    (isHighlighted
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold"
                      : "")
                  }
                >
                  {lineNumber}
                </div>
              );
            })}
          </div>
        )}

        {/* Content area */}
        <div
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
                <div
                  className={`absolute inset-0 pointer-events-none ${wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"}`}
                >
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
                id={id}
                value={value}
                readOnly
                placeholder={placeholder}
                className={`${hasCustomRendering ? "absolute inset-0" : "w-full h-full"} bg-transparent ${hasCustomRendering ? "text-transparent" : "text-zinc-900 dark:text-zinc-50"} resize-none focus:outline-none ${wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"} ${hasCustomRendering ? "overflow-hidden" : ""} placeholder-zinc-400 dark:placeholder-zinc-600`}
                spellCheck={false}
              />
            </div>
          ) : (
            // Editable mode: overlay transparent textarea on top of rendered content
            <div className="relative flex-1">
              {hasCustomRendering && (
                <div
                  className={`absolute inset-0 pointer-events-none ${wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"}`}
                >
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
                placeholder={placeholder}
                className={`${hasCustomRendering ? "absolute inset-0" : "w-full h-full"} bg-transparent ${hasCustomRendering ? "text-transparent" : "text-zinc-900 dark:text-zinc-50"} resize-none focus:outline-none ${wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"} ${hasCustomRendering ? "overflow-hidden" : ""} placeholder-zinc-400 dark:placeholder-zinc-600 selection:bg-blue-200/50 dark:selection:bg-blue-800/50`}
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
        </div>
      </div>
    );
  },
);

TextEditor.displayName = "TextEditor";
