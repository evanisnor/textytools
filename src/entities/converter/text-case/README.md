# Text Case Entity

Domain logic for text case conversion and word boundary detection. This entity provides reusable functions for transforming text between different case formats.

## Overview

The text-case entity encapsulates the core algorithms for:
- Detecting word boundaries in various case formats
- Converting between 11 different case types
- Providing type-safe case type definitions

## Structure

```
text-case/
├── lib/
│   ├── case-converters.ts    # Case conversion functions
│   └── word-detection.ts      # Word boundary detection
├── model/
│   └── types.ts               # Type definitions
└── index.ts                   # Public API
```

## Usage

### Basic Case Conversion

```typescript
import { convertCase } from "@/entities/converter/text-case";

const result = convertCase("hello world", "camel");
// Result: "helloWorld"
```

### Individual Case Converters

```typescript
import {
  toCamelCase,
  toSnakeCase,
  toKebabCase
} from "@/entities/text-case";

toCamelCase("hello world");    // "helloWorld"
toSnakeCase("HelloWorld");     // "hello_world"
toKebabCase("hello_world");    // "hello-world"
```

### Word Detection

```typescript
import { toWords } from "@/entities/text-case";

toWords("camelCaseString");     // ["camel", "Case", "String"]
toWords("snake_case_string");   // ["snake", "case", "string"]
toWords("PascalCaseString");    // ["Pascal", "Case", "String"]
```

## Supported Case Types

| Type | Example | Description |
|------|---------|-------------|
| `upper` | `HELLO WORLD` | All uppercase |
| `lower` | `hello world` | All lowercase |
| `title` | `Hello World` | First letter of each word capitalized |
| `sentence` | `Hello world` | First letter of sentences capitalized |
| `camel` | `helloWorld` | First word lowercase, rest capitalized |
| `pascal` | `HelloWorld` | All words capitalized, no spaces |
| `snake` | `hello_world` | Lowercase with underscores |
| `kebab` | `hello-world` | Lowercase with hyphens |
| `constant` | `HELLO_WORLD` | Uppercase with underscores |
| `dot` | `hello.world` | Lowercase with dots |
| `path` | `hello/world` | Lowercase with slashes |

## Types

```typescript
type CaseType =
  | "upper" | "lower" | "title" | "sentence"
  | "camel" | "pascal" | "snake" | "kebab"
  | "constant" | "dot" | "path";

interface CaseOption {
  id: CaseType;
  label: string;
  description: string;
}
```

## API Reference

### `convertCase(text: string, caseType: CaseType): string`

Main conversion function that handles all case types.

**Parameters:**
- `text` - Input text to convert
- `caseType` - Target case format

**Returns:** Converted text

### Individual Converters

- `toTitleCase(str: string): string`
- `toSentenceCase(str: string): string`
- `toCamelCase(str: string): string`
- `toPascalCase(str: string): string`
- `toSnakeCase(str: string): string`
- `toKebabCase(str: string): string`
- `toConstantCase(str: string): string`
- `toDotCase(str: string): string`
- `toPathCase(str: string): string`

### `toWords(str: string): string[]`

Splits a string into words by detecting boundaries in various formats.

**Handles:**
- camelCase → `["camel", "Case"]`
- PascalCase → `["Pascal", "Case"]`
- snake_case → `["snake", "case"]`
- kebab-case → `["kebab", "case"]`
- dot.case → `["dot", "case"]`
- path/case → `["path", "case"]`

## Design Principles

- **Pure functions**: All converters are side-effect free
- **Type safety**: Full TypeScript support with strict types
- **Reusability**: Designed for use across multiple features
- **Performance**: Efficient regex-based word detection

## Used By

- [case-converter](../../features/case-converter) - Main case conversion tool
