/**
 * Editor Entity
 *
 * A textarea component with line numbers, word wrap, and syntax highlighting support.
 * This entity represents a configurable text editor for displaying and editing code,
 * CSV data, JSON, JWT tokens, and other structured text formats.
 *
 * Features:
 * - Line numbers with auto-adjusting width
 * - Word wrap with proper vertical alignment
 * - Syntax highlighting support via render hooks
 * - Read-only mode for formatted output
 * - Custom line styling and highlighting
 * - Scroll synchronization
 */

// Types
export type { TextEditorProps, TextEditorRef } from "./model/types";

// UI Components
export { TextEditor } from "./ui/TextEditor";

// Utilities
export {
  getContainerClasses,
  getScrollContainerClasses,
  getWrapClasses,
  getTextareaClasses,
  getContentOverlayClasses,
  getSimpleModeContainerClasses,
  getSimpleModeTextareaClasses,
} from "./lib/editor-styles";
