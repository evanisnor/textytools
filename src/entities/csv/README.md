# CSV Entity

Domain logic for CSV parsing, escaping, and manipulation according to RFC 4180.

## Overview

The CSV entity provides:
- RFC 4180 compliant CSV parsing
- Proper escaping of CSV values
- Column letter generation for headerless data

## Structure

```
csv/
├── lib/
│   ├── parser.ts           # CSV parsing and escaping
│   └── column-generator.ts # Column letter generation
└── index.ts                # Public API
```

## Usage

### Parsing CSV Lines

```typescript
import { parseCsvLine } from "@/entities/csv";

const fields = parseCsvLine('name,age,"city, state"', ',');
// Result: ["name", "age", "city, state"]

// Handles escaped quotes
const fields2 = parseCsvLine('"John ""The Man"" Doe",42', ',');
// Result: ['John "The Man" Doe', "42"]
```

### Escaping CSV Values

```typescript
import { escapeCsvValue } from "@/entities/csv";

escapeCsvValue("simple", ",");           // "simple"
escapeCsvValue("with, comma", ",");      // "\"with, comma\""
escapeCsvValue('has "quotes"', ",");     // "\"has \"\"quotes\"\"\""
```

### Generating Column Letters

```typescript
import { generateColumnLetter } from "@/entities/csv";

generateColumnLetter(0);   // "a"
generateColumnLetter(25);  // "z"
generateColumnLetter(26);  // "aa"
generateColumnLetter(27);  // "ab"
```

## API Reference

### `parseCsvLine(line: string, delimiter: string): string[]`

Parses a single CSV line according to RFC 4180.

**Features:**
- Handles quoted values
- Supports escaped quotes (doubled quotes)
- Custom delimiter support

**Parameters:**
- `line` - CSV line to parse
- `delimiter` - Field delimiter (e.g., ",", ";", "\t")

**Returns:** Array of field values

### `escapeCsvValue(value: string, delimiter: string): string`

Escapes a value for CSV output according to RFC 4180.

**Rules:**
- Values containing delimiters are quoted
- Values containing quotes are quoted and quotes are doubled
- Values containing newlines are quoted

**Parameters:**
- `value` - String to escape
- `delimiter` - Field delimiter

**Returns:** Properly escaped CSV value

### `generateColumnLetter(index: number): string`

Generates Excel-style column letters.

**Parameters:**
- `index` - Zero-based column index

**Returns:** Column letter (a, b, ..., z, aa, ab, ...)

## RFC 4180 Compliance

This entity follows [RFC 4180](https://tools.ietf.org/html/rfc4180) for CSV formatting:

1. Fields containing line breaks, quotes, or delimiters are enclosed in quotes
2. Quotes within fields are escaped by doubling them
3. Line breaks within quoted fields are preserved
4. Custom delimiters are supported

## Used By

- [converter/csv-json](../converter/csv-json) - CSV/JSON conversion
- [csv-json-converter feature](../../features/csv-json-converter) - CSV/JSON tool
