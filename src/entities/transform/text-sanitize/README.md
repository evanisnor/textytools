# Text Sanitize

Text sanitization and cleaning operations for removing unwanted characters, normalizing whitespace, and organizing text content.

## Overview

The text-sanitize entity provides a comprehensive set of text cleaning operations that can be applied individually or in combination to sanitize and normalize text content.

## Features

- **Line Operations**: Trim lines, remove empty/duplicate lines, sort, reverse
- **Whitespace Control**: Remove extra spaces, normalize whitespace
- **Character Filtering**: Remove non-ASCII, emoji, numbers, punctuation, special characters
- **React Hook**: Pre-built `useTextSanitize` hook for easy integration

## Usage

### Basic Sanitization

```typescript
import { sanitizeText, defaultOptions } from "@/entities/transform";

const text = "Hello   World!\n\n\nExtra spaces   here";

// Enable specific options
const options = defaultOptions.map((opt) => ({
  ...opt,
  enabled: opt.id === "removeExtraSpaces" || opt.id === "removeEmptyLines",
}));

const cleaned = sanitizeText(text, options);
// Result: "Hello World!\nExtra spaces here"
```

### Using the Hook

```typescript
import { useTextSanitize } from "@/entities/transform";

function SanitizerComponent() {
  const {
    text,
    setText,
    options,
    sanitizedText,
    toggleOption,
    enableAll,
    disableAll,
    activeCount,
  } = useTextSanitize();

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />

      <button onClick={enableAll}>Enable All</button>
      <button onClick={disableAll}>Disable All</button>
      <p>Active: {activeCount}</p>

      {options.map((opt) => (
        <label key={opt.id}>
          <input
            type="checkbox"
            checked={opt.enabled}
            onChange={() => toggleOption(opt.id)}
          />
          {opt.label}
        </label>
      ))}

      <pre>{sanitizedText}</pre>
    </div>
  );
}
```

### With Initial Configuration

```typescript
import { useTextSanitize, defaultOptions } from "@/entities/transform";

const customOptions = defaultOptions.map((opt) => ({
  ...opt,
  enabled: opt.id === "trimLines" || opt.id === "removeEmptyLines",
}));

const sanitizer = useTextSanitize({
  initialText: "Some initial text",
  initialOptions: customOptions,
});
```

## Available Options

| Option ID                | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `trimLines`              | Remove leading/trailing whitespace from lines  |
| `removeEmptyLines`       | Delete all blank lines                         |
| `removeDuplicateLines`   | Keep only unique lines                         |
| `removeExtraSpaces`      | Replace multiple spaces with single space     |
| `removeNonAscii`         | Strip non-ASCII characters (0-127 only)        |
| `removeEmoji`            | Remove all emoji characters                    |
| `removeNumbers`          | Strip numeric digits (0-9)                     |
| `removePunctuation`      | Remove punctuation marks                       |
| `removeSpecialChars`     | Keep only letters, numbers, basic whitespace   |
| `normalizeWhitespace`    | Convert all whitespace to single spaces        |
| `sortLines`              | Sort lines alphabetically                      |
| `reverseLines`           | Reverse the order of lines                     |

## API

### `sanitizeText(text: string, options: SanitizationOption[]): string`

Apply sanitization operations to text based on enabled options.

**Parameters:**

- `text` - The input text to sanitize
- `options` - Array of sanitization options with enabled flags

**Returns:** The sanitized text

### `useTextSanitize(config?: UseTextSanitizeOptions): UseTextSanitizeResult`

React hook for managing text sanitization state and operations.

**Config Options:**

- `initialText?: string` - Initial text value
- `initialOptions?: SanitizationOption[]` - Initial options configuration

**Returns:**

- `text: string` - Current input text
- `setText: (text: string) => void` - Update input text
- `options: SanitizationOption[]` - Current options configuration
- `setOptions: (options: SanitizationOption[]) => void` - Update options
- `sanitizedText: string` - The sanitized output (computed)
- `toggleOption: (id: string) => void` - Toggle a specific option
- `enableAll: () => void` - Enable all options
- `disableAll: () => void` - Disable all options
- `activeCount: number` - Number of enabled options

### `defaultOptions: SanitizationOption[]`

Default configuration with all options disabled. Use this as a starting point for customization.

## Types

```typescript
interface SanitizationOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

type SanitizationOptionId =
  | "trimLines"
  | "removeEmptyLines"
  | "removeDuplicateLines"
  | "removeExtraSpaces"
  | "removeNonAscii"
  | "removeEmoji"
  | "removeNumbers"
  | "removePunctuation"
  | "removeSpecialChars"
  | "normalizeWhitespace"
  | "sortLines"
  | "reverseLines";
```

## Design Notes

- Operations are applied sequentially in the order they appear in the options array
- Line-based operations preserve newline characters between lines
- The hook is stateless and doesn't include persistence logic (that's feature-level concern)
- All operations are synchronous and perform transformations in-memory
