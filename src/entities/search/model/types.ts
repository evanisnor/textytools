/**
 * Basic search match information
 */
export interface BaseSearchMatch {
  lineIndex: number; // The line number where this match occurs
  matchIndex: number; // Global index of this match
  columnStart: number; // Column position where the match starts
}

/**
 * Configuration for search behavior
 */
export interface SearchConfig {
  searchTerm: string;
  caseSensitive: boolean;
}

/**
 * Result of a search operation
 */
export interface SearchResult<T extends BaseSearchMatch = BaseSearchMatch> {
  matches: T[];
  totalMatches: number;
}
