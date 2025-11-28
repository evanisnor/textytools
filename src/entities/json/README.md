# JSON Entity

Domain logic for JSON manipulation, including flattening nested structures and type inference.

## Overview

The JSON entity provides:
- Object flattening with dot notation for CSV conversion
- Nested value setting for object reconstruction
- Type parsing for CSV-to-JSON conversion

## Structure

```
json/
├── lib/
│   ├── flatten.ts      # Flatten nested objects
│   ├── unflatten.ts    # Set nested values
│   └── type-parser.ts  # Parse string types
├── model/
│   └── types.ts        # Type definitions
└── index.ts            # Public API
```

## Usage

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

### `flattenObject(obj: unknown, prefix?: string): Record<string, string | number | boolean | null>`

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

- [converter/csv-json](../converter/csv-json) - CSV/JSON conversion
- [csv-json-converter feature](../../features/csv-json-converter) - CSV/JSON tool
