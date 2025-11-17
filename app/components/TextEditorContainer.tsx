"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import {
  TextEditor,
  type TextEditorProps,
  type TextEditorRef,
} from "./TextEditor";

export interface TextEditorContainerProps extends TextEditorProps {
  /**
   * Height class for the container (e.g., "h-64", "h-96")
   * @default "h-64"
   */
  height?: string;
  /**
   * Additional classes for the outer container
   */
  containerClassName?: string;
}

export interface TextEditorContainerRef {
  scrollTo: (options: ScrollToOptions) => void;
  getScrollContainer: () => HTMLDivElement | null;
  getEditor: () => TextEditorRef | null;
}

/**
 * TextEditorContainer - A styled container wrapper for TextEditor
 *
 * Provides:
 * - Consistent border, background, and padding
 * - Proper scroll container structure (padding outside scrollable area)
 * - Configurable height
 * - Ref forwarding for scroll control
 *
 * @example
 * ```tsx
 * const editorRef = useRef<TextEditorContainerRef>(null);
 *
 * <TextEditorContainer
 *   ref={editorRef}
 *   value={text}
 *   onChange={setText}
 *   height="h-96"
 * />
 * ```
 */
export const TextEditorContainer = forwardRef<
  TextEditorContainerRef,
  TextEditorContainerProps
>(({ height = "h-64", containerClassName = "", ...editorProps }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<TextEditorRef>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: (options: ScrollToOptions) => {
      scrollContainerRef.current?.scrollTo(options);
    },
    getScrollContainer: () => scrollContainerRef.current,
    getEditor: () => editorRef.current,
  }));

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 ${height} ${containerClassName}`}
    >
      <div ref={scrollContainerRef} className="h-full overflow-auto p-4">
        <TextEditor ref={editorRef} {...editorProps} />
      </div>
    </div>
  );
});

TextEditorContainer.displayName = "TextEditorContainer";
