# Counter Entity

The counter entity provides text analysis and counting functionality following FSD principles.

## Purpose

This entity encapsulates the business logic for counting various text metrics:
- Character count
- Line count
- Word count
- Paragraph count
- Token count (GPT-4 tokenization)

## Structure

```
counter/
├── index.ts              # Public API exports
├── lib/                  # Pure counting functions
│   ├── counters.ts       # Character, line, word, paragraph counting
│   └── tokenizer.ts      # Token estimation using js-tiktoken
└── model/                # React hooks
    └── useCounter.ts     # Hook for reactive text counting
```

## Usage

### Using the Hook

```typescript
import { useCounter } from "@/entities/counter";

function MyComponent() {
  const [text, setText] = useState("");
  const counts = useCounter(text);
  
  // Access counts
  console.log(counts.characterCount);  // number
  console.log(counts.lineCount);       // number
  console.log(counts.wordCount);       // string (formatted)
  console.log(counts.paragraphCount);  // string (formatted)
  console.log(counts.tokenCount);      // string (formatted, async)
}
```

### Using Pure Functions

```typescript
import { countCharacters, countWords, estimateTokenCount } from "@/entities/counter";

const text = "Hello world";
const chars = countCharacters(text);          // 11
const words = countWords(text);               // 2
const tokens = await estimateTokenCount(text); // ~2
```

## Features

- **Pure counting functions**: Stateless, testable functions for basic counts
- **Reactive hook**: `useCounter` hook that automatically updates counts when text changes
- **Debounced tokenization**: Token counting is debounced for performance with large texts
- **Formatted output**: Word, paragraph, and token counts are formatted with locale-aware number formatting
- **Error handling**: Token counting gracefully handles errors (displays "ERR")

## Dependencies

- `js-tiktoken`: For GPT-4 token estimation
- `lodash`: For debouncing token count calculations
- React: For the `useCounter` hook
