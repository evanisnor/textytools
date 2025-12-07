# DateTime Entity

A reusable entity for parsing, formatting, and converting date/time strings across various formats.

## Purpose

This entity consolidates all date/time handling logic into a single, testable module that can be used across different transforms and features. It provides a clean API for working with dates while abstracting away the complexity of format conversions and parsing.

## Features

- **Multiple Format Support**: ISO 8601, RFC 3339, Unix timestamps, Apache logs, and custom formats
- **Format Conversion**: Converts between strftime and ISO8601 pattern syntaxes
- **Type-Safe**: Full TypeScript support with clear result types
- **Error Handling**: Returns structured results with success/error states
- **Custom Patterns**: Supports both strftime (`%Y-%m-%d`) and ISO8601 (`YYYY-MM-DD`) custom patterns
- **Non-Standard Support**: Handles AM/PM notation even though it's not part of ISO 8601

## Architecture

```
datetime/
├── types.ts                      # Type definitions
├── lib/
│   ├── format.ts                # Core parsing/formatting functions
│   └── formatConversion.ts      # Pattern syntax converters
├── index.ts                     # Public API
└── README.md                    # This file
```

## Usage

### Basic Date Conversion

```typescript
import { convertDateFormat } from "@/entities/datetime";

// Convert from ISO 8601 to Unix timestamp
const result = convertDateFormat(
  "2025-01-15",
  { format: "iso8601" },
  { format: "unix-seconds" }
);

if (result.success) {
  console.log(result.formatted); // "1736899200"
}
```

### Custom Format Patterns

```typescript
import { convertDateFormat } from "@/entities/datetime";

// Using strftime patterns
const result = convertDateFormat(
  "15/Jan/2025:14:30:45 +0000",
  {
    format: "custom-strftime",
    customFormat: "%d/%b/%Y:%H:%M:%S %z"
  },
  {
    format: "custom-strftime",
    customFormat: "%Y-%m-%d"
  }
);

// Using ISO8601 patterns
const result2 = convertDateFormat(
  "01/15/2025 02:30 PM",
  {
    format: "custom-iso8601",
    customFormat: "MM/DD/YYYY hh:mm a"
  },
  { format: "iso8601-datetime" }
);
```

### Parsing Dates

```typescript
import { parseDateString } from "@/entities/datetime";

const parseResult = parseDateString("2025-01-15T14:30:45Z", {
  format: "rfc3339",
});

if (parseResult.success && parseResult.date) {
  // Work with the Date object
  console.log(parseResult.date.getFullYear()); // 2025
}
```

### Formatting Dates

```typescript
import { formatDateToString } from "@/entities/datetime";

const date = new Date("2025-01-15T14:30:45Z");

const formatResult = formatDateToString(date, {
  format: "iso8601-time",
});

if (formatResult.success) {
  console.log(formatResult.formatted); // "14:30:45"
}
```

## Supported Formats

### Canned Formats

| Format ID | Description | Example |
|-----------|-------------|---------|
| `iso8601` | ISO 8601 Date only | `2025-01-15` |
| `iso8601-time` | ISO 8601 Time only | `14:30:45` |
| `iso8601-datetime` | ISO 8601 DateTime (permissive) | `2025-01-15T14:30:45Z` |
| `rfc3339` | RFC 3339 (strict subset of ISO 8601) | `2025-01-15T14:30:45Z` |
| `unix-seconds` | Unix timestamp in seconds | `1736899200` |
| `unix-milliseconds` | Unix timestamp in milliseconds | `1736899200000` |
| `apache-log` | Apache log format | `15/Jan/2025:14:30:45 +0000` |

### Custom Formats

| Format ID | Pattern Syntax | Example Pattern |
|-----------|---------------|-----------------|
| `custom-strftime` | strftime codes | `%Y-%m-%d %H:%M:%S` |
| `custom-iso8601` | ISO8601-style tokens | `YYYY-MM-DD HH:mm:ss` |

## Format Differences

### ISO 8601 vs RFC 3339

**ISO 8601 DateTime** (`iso8601-datetime`):
- More permissive
- Accepts both `T` and space as separator: `2025-01-15 14:30:45` or `2025-01-15T14:30:45`
- Timezone optional (defaults to local if omitted)

**RFC 3339** (`rfc3339`):
- Strict subset of ISO 8601
- Requires `T` separator
- Requires timezone (`Z` or offset like `+00:00`)

## Pattern Syntax

### Strftime Patterns

Common strftime codes:
- `%Y` - 4-digit year (2025)
- `%m` - Month (01-12)
- `%d` - Day (01-31)
- `%H` - Hour 24-hour (00-23)
- `%I` - Hour 12-hour (01-12)
- `%M` - Minute (00-59)
- `%S` - Second (00-59)
- `%p` - AM/PM

### ISO8601 Patterns

Common ISO8601 tokens:
- `YYYY` - 4-digit year (2025)
- `MM` - Month (01-12)
- `DD` - Day (01-31)
- `HH` - Hour 24-hour (00-23)
- `hh` - Hour 12-hour (01-12)
- `mm` - Minute (00-59)
- `ss` - Second (00-59)
- `a` - AM/PM (non-standard)

## Error Handling

All functions return result objects with `success` boolean:

```typescript
interface ParseDateResult {
  success: boolean;
  date?: Date;
  error?: string;
}

interface FormatDateResult {
  success: boolean;
  formatted?: string;
  error?: string;
}
```

Always check `success` before accessing the result:

```typescript
const result = convertDateFormat(input, inputOpts, outputOpts);
if (!result.success) {
  console.error("Conversion failed:", result.error);
  return;
}
// Safe to use result.formatted here
```

## Design Decisions

### Why Separate strftime and ISO8601 Custom Formats?

Users familiar with different ecosystems expect different pattern syntaxes:
- **strftime**: Used in Python, Ruby, C, Unix tools
- **ISO8601 tokens**: Used in JavaScript libraries, Java SimpleDateFormat, many modern APIs

Providing both reduces friction and makes the tool more accessible.

### Why Use date-fns Internally?

- Consistent behavior across browsers
- Better locale support
- More reliable parsing of edge cases
- Actively maintained

### Result Objects vs Throwing

Using result objects instead of throwing errors makes error handling explicit and prevents uncaught exceptions from breaking transforms mid-pipeline.

## Testing

When writing tests for functions using this entity:

```typescript
import { convertDateFormat } from "@/entities/datetime";

test("converts ISO date to Unix timestamp", () => {
  const result = convertDateFormat(
    "2025-01-15",
    { format: "iso8601" },
    { format: "unix-seconds" }
  );

  expect(result.success).toBe(true);
  expect(result.formatted).toBe("1736899200");
});
```

## Future Enhancements

Potential additions:
- [ ] Relative date parsing ("2 days ago", "next week")
- [ ] Duration formatting ("2h 30m")
- [ ] Locale-aware formatting
- [ ] Timezone conversion support
- [ ] Calendar system support (Gregorian, Islamic, Hebrew, etc.)
