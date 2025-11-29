/**
 * Utility functions for generating editor styling classes
 */

interface EditorStyleOptions {
  /** Height class for the container (e.g., "h-64", "h-96") */
  height?: string;
  /** Additional classes for the outer container */
  containerClassName?: string;
  /** Additional classes for the editor content */
  editorClassName?: string;
  /** Whether text should wrap */
  wrap?: boolean;
  /** Whether the editor has custom rendering (syntax highlighting) */
  hasCustomRendering?: boolean;
}

/**
 * Generates the container wrapper class names
 */
export function getContainerClasses(options: EditorStyleOptions): string {
  const { height = "h-64", containerClassName = "" } = options;
  return `bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 ${height} ${containerClassName}`.trim();
}

/**
 * Generates the scroll container class names
 */
export function getScrollContainerClasses(editorClassName?: string): string {
  return `h-full overflow-auto p-4 ${editorClassName || ""}`.trim();
}

/**
 * Generates text wrapping class names
 */
export function getWrapClasses(wrap: boolean): string {
  return wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre";
}

/**
 * Generates textarea class names based on mode and rendering
 */
export function getTextareaClasses(options: {
  hasCustomRendering: boolean;
  readOnly: boolean;
  wrap: boolean;
}): string {
  const { hasCustomRendering, readOnly, wrap } = options;
  const wrapClasses = getWrapClasses(wrap);

  const baseClasses = `bg-transparent resize-none focus:outline-none ${wrapClasses}`;
  const textColorClasses = hasCustomRendering
    ? "text-transparent"
    : "text-zinc-900 dark:text-zinc-50";
  const placeholderClasses = "placeholder-zinc-400 dark:placeholder-zinc-600";
  const selectionClasses = !readOnly
    ? "selection:bg-blue-200/50 dark:selection:bg-blue-800/50"
    : "";
  const sizeClasses = hasCustomRendering ? "absolute inset-0" : "w-full h-full";
  const overflowClasses = hasCustomRendering ? "overflow-hidden" : "";

  return `${sizeClasses} ${baseClasses} ${textColorClasses} ${placeholderClasses} ${selectionClasses} ${overflowClasses}`.trim();
}

/**
 * Generates content overlay class names
 */
export function getContentOverlayClasses(wrap: boolean): string {
  const wrapClasses = getWrapClasses(wrap);
  return `absolute inset-0 pointer-events-none ${wrapClasses}`.trim();
}

/**
 * Generates simple mode container classes (no line numbers, no custom rendering)
 */
export function getSimpleModeContainerClasses(className?: string): string {
  return `w-full min-h-full flex flex-col ${className || ""}`.trim();
}

/**
 * Generates simple mode textarea classes
 */
export function getSimpleModeTextareaClasses(wrap: boolean): string {
  const wrapClasses = getWrapClasses(wrap);
  return `w-full flex-1 bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none font-mono text-sm ${wrapClasses}`.trim();
}
