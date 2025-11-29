// Domain types
export type {
  BaseSearchMatch,
  SearchConfig,
  SearchResult,
} from "./model/types";

// Search utilities
export {
  escapeRegex,
  createSearchRegex,
  findTextMatches,
  createMatchPositionMap,
  getNextMatchIndex,
  getPreviousMatchIndex,
} from "./lib/search-utils";

// Highlighting utilities
export {
  segmentText,
  renderHighlightedSegments,
  highlightText,
  HIGHLIGHT_COLORS,
  type TextSegment,
  type HighlightOptions,
} from "./ui/highlight-utils";

// Hooks
export { useSearch } from "./model/useSearch";
