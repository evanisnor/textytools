// Types
export type { RegexFlag, RegexMatch } from "./model/types";

// Constants
export { FLAGS } from "./model/flags";

// Core regex matching logic
export {
  highlightMatches,
  isPositionHighlighted,
  getMatchIndexAtPosition,
} from "./lib/matchHighlighter";
export type { MatchHighlighterResult } from "./lib/matchHighlighter";

// Hooks
export { useRegexMatchHighlighter } from "./model/useRegexMatchHighlighter";
export type { RegexHighlighterResult } from "./model/useRegexMatchHighlighter";
