# Search Entity

Reusable search functionality for text-based features including match finding, navigation, and highlighting.

## Purpose

This entity provides common search capabilities used across multiple features like diff-viewer and json-wizard. It handles:

- Text search with case sensitivity
- Match position tracking
- Navigation between matches
- Standardized highlighting (current match vs other matches)

## Architecture

```
search/
├── lib/
│   └── search-utils.ts       # Core search and navigation logic
├── model/
│   ├── types.ts              # Domain types
│   └── useSearch.ts          # Search state management hook
├── ui/
│   └── highlight-utils.tsx   # Text highlighting utilities
└── index.ts                  # Public API
```

## Usage

### Basic Text Search

```tsx
import {
  findTextMatches,
  createMatchPositionMap,
  createSearchRegex,
  escapeRegex
} from "@/entities/search";

// Find all matches in text
const matches = findTextMatches(text, searchTerm, caseSensitive);

// Create a position map for quick lookup
const matchPositions = createMatchPositionMap(matches);

// Or manually create regex for custom search logic
const regex = createSearchRegex(searchTerm, caseSensitive);

// Or just escape a search term
const escapedTerm = escapeRegex(searchTerm);
```

### Search State Management

```tsx
import { useSearch } from "@/entities/search";

function MyComponent() {
  const {
    searchTerm,
    setSearchTerm,
    caseSensitive,
    setCaseSensitive,
    currentMatchIndex,
    goToNextMatch,
    goToPreviousMatch,
  } = useSearch();

  // Use with your search results
  const totalMatches = matches.length;

  return (
    <SearchBox
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      caseSensitive={caseSensitive}
      onCaseSensitiveChange={setCaseSensitive}
      currentMatch={currentMatchIndex + 1}
      totalMatches={totalMatches}
      onNext={() => goToNextMatch(totalMatches)}
      onPrevious={() => goToPreviousMatch(totalMatches)}
    />
  );
}
```

### Text Highlighting

The entity provides utilities for highlighting search matches with standardized colors.

```tsx
import {
  highlightText,
  segmentText,
  renderHighlightedSegments,
  HIGHLIGHT_COLORS
} from "@/entities/search";

function renderLine(text: string, lineIndex: number) {
  const currentMatchPositions = /* Set of column positions for current match */;
  const allMatchPositions = /* Set of all match column positions on this line */;

  // Simple approach: use the highlightText convenience function
  return highlightText(
    text,
    {
      searchTerm,
      caseSensitive,
      currentMatchPositions,
      allMatchPositions,
    },
    "match", // ID prefix for match elements
    matchIndex // match index for unique IDs
  );
}

// Advanced approach: segment and render separately
function renderLineAdvanced(text: string) {
  const segments = segmentText(
    text,
    searchTerm,
    caseSensitive,
    currentMatchPositions,
    allMatchPositions
  );

  return renderHighlightedSegments(segments, "match", matchIndex);
}

// Access colors directly for custom rendering
console.log(HIGHLIGHT_COLORS.currentMatch); // "bg-green-300 dark:bg-green-600 text-black"
console.log(HIGHLIGHT_COLORS.otherMatch);   // "bg-yellow-300 dark:bg-yellow-600 text-black"
```

## Color Scheme

The entity uses standardized colors for highlighting:
- **Current match**: Green (`bg-green-300 dark:bg-green-600`)
- **Other matches**: Yellow (`bg-yellow-300 dark:bg-yellow-600`)

## API Reference

### Utilities

- `escapeRegex(term: string): string` - Escapes special regex characters
- `createSearchRegex(searchTerm: string, caseSensitive: boolean): RegExp` - Creates a global regex
- `findTextMatches(text: string, searchTerm: string, caseSensitive: boolean): BaseSearchMatch[]` - Finds all matches
- `createMatchPositionMap(matches: BaseSearchMatch[]): Map<number, Map<number, number>>` - Creates position lookup map
- `getNextMatchIndex(currentIndex: number, totalMatches: number): number` - Calculate next match index
- `getPreviousMatchIndex(currentIndex: number, totalMatches: number): number` - Calculate previous match index

### Highlighting

- `segmentText(...)` - Splits text into highlighted/non-highlighted segments
- `renderHighlightedSegments(...)` - Renders segments as React nodes
- `highlightText(...)` - Convenience function combining segment + render
- `HIGHLIGHT_COLORS` - Standard color constants

### Hook

- `useSearch()` - Returns search state and navigation functions

## Extending for Feature-Specific Needs

Features can extend `BaseSearchMatch` with additional fields:

```tsx
import type { BaseSearchMatch } from "@/entities/search";

interface MySearchMatch extends BaseSearchMatch {
  customField: string;
  jsonPath?: string; // Example: json-wizard adds path tracking
}
```

Features can implement their own search logic while reusing the shared utilities. See:
- [diff-viewer/lib/search.ts](../../features/diff-viewer/lib/search.ts) - Dual-pane search implementation
- [json-wizard/lib/search.ts](../../features/json-wizard/lib/search.ts) - JSON-aware search with path tracking
