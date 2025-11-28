# Compare Entity - Text Diff

This entity provides text comparison and diff functionality using a line-based diff algorithm.

## Features

- **Line-by-line diff computation**: Compares two text strings and identifies changes
- **Smart change detection**: Detects additions, removals, modifications, and unchanged lines
- **Block merging**: Consecutive removed and added blocks are intelligently merged as modifications
- **React hook integration**: Easy-to-use hook with memoization for performance

## API

### `useTextDiff(input: string, output: string): UseTextDiffResult`

React hook that computes the diff between two text strings.

**Parameters:**
- `input` (string): The original/left text to compare
- `output` (string): The modified/right text to compare

**Returns:**
- `diffLines` (DiffLine[]): Array of diff lines with type and content information
- `stats` (object): Statistics about the diff
  - `added` (number): Count of added lines
  - `removed` (number): Count of removed lines
  - `modified` (number): Count of modified lines

### Types

#### `DiffType`
```typescript
type DiffType = "unchanged" | "added" | "removed" | "modified";
```

#### `DiffLine`
```typescript
interface DiffLine {
  type: DiffType;
  inputLineNumber: number | null; // null for added lines
  outputLineNumber: number | null; // null for removed lines
  inputContent: string;
  outputContent: string;
}
```

## Usage Example

```typescript
import { useTextDiff } from "@/entities/compare";

function MyDiffComponent() {
  const [input, setInput] = useState("Line 1\nLine 2\nLine 3");
  const [output, setOutput] = useState("Line 1\nLine 2 modified\nLine 3");

  const { diffLines, stats } = useTextDiff(input, output);

  return (
    <div>
      <div>Added: {stats.added}, Removed: {stats.removed}, Modified: {stats.modified}</div>
      {diffLines.map((line, index) => (
        <div key={index} className={`diff-${line.type}`}>
          <span>{line.inputLineNumber}</span>
          <span>{line.inputContent}</span>
          <span>{line.outputLineNumber}</span>
          <span>{line.outputContent}</span>
        </div>
      ))}
    </div>
  );
}
```

## Algorithm Details

The diff algorithm uses the `diff` library's `diffLines` function with the following enhancements:

1. **Empty content handling**: Returns an empty array when both inputs are empty
2. **Line splitting**: Properly handles line breaks and normalizes line arrays
3. **Block pairing**: When a removed block is immediately followed by an added block, they are paired and treated as modifications
4. **Line numbering**: Tracks line numbers for both input and output, with `null` values for lines that don't exist in one side

### Diff Types Explained

- **unchanged**: Lines that are identical at the same position in both texts
- **added**: Lines that exist only in the output (right side)
- **removed**: Lines that exist only in the input (left side)
- **modified**: Lines that exist in both but have different content

## Implementation Notes

- The hook uses `useMemo` to avoid recomputing diffs on every render
- Statistics are computed separately and also memoized
- Line numbers start at 1 (not 0) for human-readable display
- Empty lines at the end of text are automatically trimmed during processing

## Dependencies

- `diff` library: For the core diffLines algorithm
- React: For the hook implementation and memoization
