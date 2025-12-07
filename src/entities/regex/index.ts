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

// Validation utilities
export {
  validateNoNestedQuantifiers,
  validateNoEmptyMatches,
  validatePattern,
} from "./lib/validation";
export type { ValidationResult } from "./lib/validation";

// Group extraction utilities
export {
  extractNamedGroups,
  hasNamedGroups,
  extractNamedGroupValues,
} from "./lib/groups";

// Regex execution utilities
export { executeWithNamedGroups, executeSimpleMatch } from "./lib/execution";

// Hooks
export { useRegexMatchHighlighter } from "./model/useRegexMatchHighlighter";
export type { RegexHighlighterResult } from "./model/useRegexMatchHighlighter";
