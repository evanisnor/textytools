// Types
export type {
  SearchMatch,
  DualPaneSearchResult,
  SearchConfig,
} from "./model/types";

// Core search utilities
export {
  escapeRegex,
  createSearchRegex,
  findTextMatches,
  findDualPaneMatches,
  createMatchMap,
  createMatchPositionMap,
  createCurrentMatchMap,
  getNextMatchIndex,
  getPreviousMatchIndex,
} from "./lib/search-utils";

// Highlighting utilities
export { HIGHLIGHT_COLORS } from "./ui/highlight-utils";
