// Domain types
export type { EncodedJWT, DecodedJWT } from "./model/types";

// Detection
export { isJWT } from "./lib/detect";

// Validation utilities
export { isExpired, isNotYetValid, formatDate } from "./lib/validators";

// UI components
export { highlightJWT } from "./ui/JwtHighlighter";

// Hooks
export { useJwtSyntaxHighlighter } from "./model/useJwtSyntaxHighlighter";
export type { JwtSyntaxRenderer } from "./model/useJwtSyntaxHighlighter";
