/**
 * Single search match in text
 */
export interface SearchMatch {
  lineIndex: number;
  matchIndex: number;
  columnStart: number;
  metadata?: unknown; // For feature-specific extensions (e.g., jsonPath)
}

/**
 * Result of searching in dual panes (left/right or input/output)
 */
export interface DualPaneSearchResult {
  leftMatches: SearchMatch[];
  rightMatches: SearchMatch[];
  totalMatches: number; // Total across both panes
}

/**
 * Configuration for search behavior
 */
export interface SearchConfig {
  searchTerm: string;
  caseSensitive: boolean;
}
