# CSV-JSON Converter

Bidirectional conversion between CSV and JSON formats.

## Overview

This converter orchestrates the conversion between CSV and JSON formats by combining:
- CSV parsing from the [csv entity](../../csv)
- JSON manipulation from the [json entity](../../json)

## Structure

```
csv-json/
├── lib/
│   ├── detection.ts     # Format auto-detection
│   ├── csv-to-json.ts   # CSV → JSON conversion
│   └── json-to-csv.ts   # JSON → CSV conversion
├── model/
│   └── types.ts         # Type definitions
└── index.ts             # Public API
```

## Usage

### Format Detection

```typescript
import { detectInputFormat } from "@/entities/converter";

detectInputFormat('[{"name":"Alice"}]');  // "json"
detectInputFormat('name,age\nAlice,30');  // "csv"
```

### CSV to JSON

```typescript
import { csvToJson } from "@/entities/converter";

const csv = `name,age,city
Alice,30,Seattle
Bob,25,Portland`;

const result = csvToJson(csv, ",", true);
// result.success: true
// result.output: [
//   {"name":"Alice","age":30,"city":"Seattle"},
//   {"name":"Bob","age":25,"city":"Portland"}
// ]
```

**Without headers:**

```typescript
const csv = `Alice,30,Seattle
Bob,25,Portland`;

const result = csvToJson(csv, ",", false);
// Generates headers: a, b, c
// result.output: [
//   {"a":"Alice","b":30,"c":"Seattle"},
//   {"a":"Bob","b":25,"c":"Portland"}
// ]
```

**Nested objects with dot notation:**

```typescript
const csv = `user.name,user.age,user.address.city
Alice,30,Seattle`;

const result = csvToJson(csv, ",", true);
// result.output: [{
//   "user": {
//     "name": "Alice",
//     "age": 30,
//     "address": {"city": "Seattle"}
//   }
// }]
```

### JSON to CSV

```typescript
import { jsonToCsv } from "@/entities/converter";

const json = `[
  {"name":"Alice","age":30},
  {"name":"Bob","age":25}
]`;

const result = jsonToCsv(json, ",", true);
// result.output:
// name,age
// Alice,30
// Bob,25
```

**Nested objects:**

```typescript
const json = `[{
  "name": "Alice",
  "address": {"city": "Seattle", "zip": 98101}
}]`;

const result = jsonToCsv(json, ",", true);
// result.output:
// address.city,address.zip,name
// Seattle,98101,Alice
```

## API Reference

### `detectInputFormat(input: string): FormatType`

Auto-detects whether input is JSON or CSV.

**Detection Rules:**
1. Starts with `[` or `{` → JSON
2. Parses as valid JSON → JSON
3. Otherwise → CSV

**Parameters:**
- `input` - String to analyze

**Returns:** `"json"` or `"csv"`

### `csvToJson(csvString: string, delimiter: string, hasHeaders: boolean): ConversionResult`

Converts CSV to JSON array.

**Features:**
- Auto-generates headers if not present (a, b, c, ...)
- Creates nested objects from dot notation
- Infers types (numbers, booleans, null)
- Validates row column counts

**Parameters:**
- `csvString` - CSV data
- `delimiter` - Field separator (`,`, `;`, `\t`, `|`)
- `hasHeaders` - Whether first row contains headers

**Returns:** `ConversionResult` with success, output, and error

### `jsonToCsv(jsonString: string, delimiter: string, includeHeaders: boolean): ConversionResult`

Converts JSON array to CSV.

**Features:**
- Flattens nested objects with dot notation
- Handles arrays (small arrays indexed, large arrays as JSON)
- Properly escapes values (RFC 4180)
- Collects all keys from all objects

**Parameters:**
- `jsonString` - JSON array string
- `delimiter` - Field separator
- `includeHeaders` - Whether to include header row

**Returns:** `ConversionResult` with success, output, and error

## Types

```typescript
type FormatType = "json" | "csv";

interface ConversionResult {
  success: boolean;
  output: string;
  error: string | null;
  detectedFormat: FormatType;
}
```

## Dependencies

This converter imports from:
- `@/entities/csv` - CSV parsing and escaping
- `@/entities/json` - Object flattening and type parsing

## Design Principles

- **Composability**: Builds on lower-level csv and json entities
- **Type safety**: Infers types during CSV→JSON conversion
- **Reversibility**: JSON→CSV→JSON preserves structure (via dot notation)
- **Error handling**: Validates input and provides clear error messages

## Used By

- [csv-json-converter feature](../../../features/csv-json-converter) - CSV/JSON conversion tool
