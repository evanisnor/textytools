/**
 * Core text editor types and interfaces
 */

/**
 * Props for the TextEditor component
 */
export interface TextEditorProps {
  /** The text content to display/edit */
  value: string;
  /** Called when text changes (not called in readOnly mode) */
  onChange?: (value: string) => void;
  /** Placeholder text shown when value is empty */
  placeholder?: string;
  /** If true, disables editing (shows as static content) */
  readOnly?: boolean;
  /** Additional CSS classes for the editor */
  className?: string;
  /**
   * Custom render function for individual line content
   * (e.g., for search highlighting)
   */
  renderLineContent?: (line: string, lineIndex: number) => React.ReactNode;
  /** Function to determine if a line should be highlighted */
  highlightLine?: (lineNumber: number) => boolean;
  /** Function to return custom className for a line number */
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
  /** ID for the textarea element (for label association) */
  id?: string;
  /**
   * Height class for the container (e.g., "h-64", "h-96")
   * @default "h-64"
   */
  height?: string;
  /** Additional classes for the outer container */
  containerClassName?: string;
}

/**
 * Ref interface for controlling the TextEditor
 */
export interface TextEditorRef {
  /** Scroll the editor to a specific position */
  scrollTo: (options: ScrollToOptions) => void;
  /** Get the scroll container element */
  getScrollContainer: () => HTMLDivElement | null;
  /** Get the inner container element */
  getInnerContainer: () => HTMLDivElement | null;
}
