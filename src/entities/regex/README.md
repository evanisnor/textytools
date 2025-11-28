# Regex Entity

This entity provides core regex matching functionality with highlighting capabilities for the application.

## Structure

```
regex/
├── lib/               # Core business logic
│   └── matchHighlighter.ts  # Regex matching and highlighting logic
├── model/             # Types and hooks
│   ├── flags.ts       # Regex flag definitions
│   ├── types.ts       # Core regex types (RegexMatch, RegexFlag)
│   └── useRegexMatchHighlighter.ts  # React hook for match highlighting
├── ui/                # UI components (if needed)
└── index.ts           # Public API exports
```

## Key Components

### Types

- **RegexMatch**: Represents a single regex match with capture groups, named groups, and position information
- **RegexFlag**: Describes a regex flag (g, i, m, s, u, y) with its description

### Core Logic

- **highlightMatches**: Pure function that performs regex matching and generates highlight ranges
- **isPositionHighlighted**: Check if a character position is within a match
- **getMatchIndexAtPosition**: Get the match index for a character position

### Hooks

- **useRegexMatchHighlighter**: React hook that provides match information and highlighting utilities

## Usage

```typescript
import { useRegexMatchHighlighter, FLAGS } from "@/entities/regex";

function MyComponent() {
  const { matches, error, isHighlighted } = useRegexMatchHighlighter(
    "\\d+",
    "g",
    "Numbers: 123 and 456"
  );
  
  // Use matches and highlighting info...
}
```

## Design Principles

- **Separation of Concerns**: Core logic is separated from React hooks
- **Testability**: Pure functions in `lib/` can be tested independently
- **Reusability**: The regex matching logic can be used across features
- **Type Safety**: Strong TypeScript types throughout
