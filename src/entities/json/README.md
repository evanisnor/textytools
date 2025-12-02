# JSON Entity

Domain logic for JSON manipulation, including parsing, formatting, flattening nested structures, and statistics.

## Overview

The JSON entity provides:
- **Parsing & Validation** - Parse JSON with detailed error messages (Apogee support)
- **Formatting** - Format JSON with indentation, key sorting, and minification (Apogee support)
- **Statistics** - Calculate key count, depth, and size (Apogee support)
- **Object Flattening** - Flatten nested objects with dot notation for CSV conversion
- **Nested Value Setting** - Reconstruct nested objects from dot notation
- **Type Parsing** - Infer types for CSV-to-JSON conversion

## Structure

```
json/
├── lib/
│   ├── parse.ts        # Parse and validate JSON (Apogee)
│   ├── format.ts       # Format JSON with options (Apogee)
│   ├── stats.ts        # Calculate JSON statistics (Apogee)
│   ├── flatten.ts      # Flatten nested objects
│   ├── unflatten.ts    # Set nested values
│   └── type-parser.ts  # Parse string types
├── model/
│   └── types.ts        # Type definitions
└── index.ts            # Public API
```

## Usage

### Parsing JSON (Apogee Support)

```typescript
import { parseJSON, validateJSON } from "@/entities/json";

// Parse JSON with error handling
const result = parseJSON('{"name":"Alice","age":30}');
if (result.success) {
  console.log(result.data); // { name: "Alice", age: 30 }
} else {
  console.error(result.error); // Detailed error message
}

// Validate JSON without parsing
const { valid, error } = validateJSON('{"invalid": }');
console.log(valid); // false
console.log(error); // "Invalid JSON: Unexpected token..."
```

### Formatting JSON (Apogee Support)

```typescript
import { formatJSON } from "@/entities/json";

const data = { name: "Alice", age: 30, city: "Seattle" };

// Pretty print with 2-space indentation
formatJSON(data, { indentation: 2 });
// {
//   "name": "Alice",
//   "age": 30,
//   "city": "Seattle"
// }

// Sort keys alphabetically
formatJSON(data, { indentation: 2, sortKeys: true });
// {
//   "age": 30,
//   "city": "Seattle",
//   "name": "Alice"
// }

// Minify
formatJSON(data, { minify: true });
// {"name":"Alice","age":30,"city":"Seattle"}

// Use tab indentation
formatJSON(data, { indentation: "tab" });
```

### JSON Statistics (Apogee Support)

```typescript
import { getJSONStats, countKeys, getDepth } from "@/entities/json";

const data = {
  users: [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
  ]
};

// Get comprehensive stats
const stats = getJSONStats(data);
console.log(stats);
// {
//   keyCount: 5,    // Total keys across all nested objects
//   depth: 3,       // Maximum nesting depth
//   size: 89        // Size in bytes
// }

// Individual stat functions
countKeys(data);  // 5
getDepth(data);   // 3
```

### Flattening Objects

```typescript
import { flattenObject } from "@/entities/json";

const nested = {
  name: "John",
  address: {
    city: "Seattle",
    zip: 98101
  }
};

const flat = flattenObject(nested);
// Result: {
//   "name": "John",
//   "address.city": "Seattle",
//   "address.zip": 98101
// }
```

### Handling Arrays

```typescript
// Small primitive arrays (≤10 items)
flattenObject({ tags: ["a", "b", "c"] });
// Result: { "tags.0": "a", "tags.1": "b", "tags.2": "c" }

// Array of objects
flattenObject({
  users: [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 }
  ]
});
// Result: {
//   "users.0.name": "Alice",
//   "users.0.age": 30,
//   "users.1.name": "Bob",
//   "users.1.age": 25
// }
```

### Setting Nested Values

```typescript
import { setNestedValue } from "@/entities/json";

const obj = {};
setNestedValue(obj, "address.city", "Seattle");
// obj is now: { address: { city: "Seattle" } }

// Supports array indices
const obj2 = {};
setNestedValue(obj2, "items.0.name", "First");
setNestedValue(obj2, "items.1.name", "Second");
// obj2 is now: {
//   items: [
//     { name: "First" },
//     { name: "Second" }
//   ]
// }
```

### Type Parsing

```typescript
import { parseValue } from "@/entities/json";

parseValue("42");      // 42 (number)
parseValue("true");    // true (boolean)
parseValue("false");   // false (boolean)
parseValue("null");    // null
parseValue("");        // "" (empty string)
parseValue("hello");   // "hello" (string)
```

## API Reference

### Apogee Support Functions

#### `parseJSON(input: string): JsonParseResult`

Parse JSON string with detailed error messages.

**Returns:** `{ success: boolean, data?: unknown, error?: string }`

**Example:**
```typescript
const result = parseJSON('{"valid": true}');
if (result.success) {
  console.log(result.data);
}
```

#### `validateJSON(input: string): { valid: boolean, error?: string }`

Validate JSON without parsing to full structure.

**Returns:** Validation result with error message if invalid.

#### `formatJSON(data: unknown, options?: JsonFormatOptions): string`

Format JSON with customizable options.

**Options:**
- `indentation?: number | "tab"` - Indentation (default: 2)
- `sortKeys?: boolean` - Sort keys alphabetically (default: false)
- `minify?: boolean` - Remove whitespace (default: false)

**Returns:** Formatted JSON string

#### `getJSONStats(data: unknown): JsonStats`

Calculate comprehensive statistics for JSON data.

**Returns:** `{ keyCount: number, depth: number, size: number }`

#### `countKeys(obj: unknown): number`

Count total number of keys in nested structure.

#### `getDepth(obj: unknown): number`

Calculate maximum nesting depth.

### CSV Conversion Functions

#### `flattenObject(obj: unknown, prefix?: string): Record<string, string | number | boolean | null>`

Recursively flattens nested objects using dot notation.

**Array Handling:**
- Primitive arrays (≤10 items): Indexed keys (`arr.0`, `arr.1`)
- Object arrays: Indexed with nested keys (`arr.0.name`)
- Large/complex arrays: Converted to JSON string

**Parameters:**
- `obj` - Object to flatten
- `prefix` - Optional key prefix for recursion

**Returns:** Flattened object with dot-notation keys

### `setNestedValue(obj: JsonObject, path: string, value: unknown): void`

Sets a value in an object using dot notation path.

**Features:**
- Creates intermediate objects/arrays as needed
- Detects array indices (numeric keys)
- Mutates the input object

**Parameters:**
- `obj` - Target object to modify
- `path` - Dot-notation path (e.g., "user.address.city")
- `value` - Value to set

### `parseValue(value: string): string | number | boolean | null`

Infers type from string value for CSV conversion.

**Type Inference:**
- `"null"` → `null`
- `"true"/"false"` → boolean
- Numeric strings → number
- Everything else → string

**Parameters:**
- `value` - String to parse

**Returns:** Parsed value with inferred type

## Types

```typescript
interface JsonObject {
  [key: string]: unknown;
}
```

## Design Principles

- **Dot notation**: Standard format for nested keys
- **Type safety**: Full TypeScript support
- **CSV-friendly**: Optimized for tabular data conversion
- **Reversible**: Flatten/unflatten operations preserve structure

## Used By

- **[apogee feature](../../features/apogee)** - JSON Convert transform
- [converter/csv-json](../converter/csv-json) - CSV/JSON conversion
- [csv-json-converter feature](../../features/csv-json-converter) - CSV/JSON tool
