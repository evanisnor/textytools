// Domain types
export type { JsonObject } from "./model/types";

// Object flattening and unflattening
export { flattenObject } from "./lib/flatten";
export { setNestedValue } from "./lib/unflatten";

// Type parsing
export { parseValue } from "./lib/type-parser";
