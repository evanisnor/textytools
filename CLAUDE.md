Read the README.md file

## TypeScript

### Never Use `any` Types

The `any` type defeats the purpose of TypeScript and should be avoided. Use proper type assertions or type guards instead.

**Bad:**
```typescript
const result = convertFormat(input, options as any, output as any);
```

**Good:**
```typescript
// Define proper types
import type { ParseOptions, FormatOptions } from "./types";

const inputOptions: ParseOptions = { format: format as DateTimeFormat, customFormat };
const outputOptions: FormatOptions = { format: format as DateTimeFormat };
const result = convertFormat(input, inputOptions, outputOptions);
```

**When you need type assertions:**
- Use specific type assertions: `value as string`, `value as DateTimeFormat`
- Import and use the actual types from their definitions
- Document why the assertion is safe with a comment if non-obvious

**Alternatives to `any`:**
- `unknown` - for truly unknown types (forces type checking before use)
- Union types - `string | number | boolean`
- Generic types - `<T>` with constraints
- Type guards - `if (typeof x === 'string')`

## React Hooks

### Never call setState synchronously within useEffect

Effects should only:
1. Sync with external systems (DOM, APIs)
2. Subscribe to external updates (calling setState in callbacks only)

**Bad - Synchronous setState in effect:**
```typescript
useEffect(() => {
  if (value === "") {
    setState("default"); // ❌ Synchronous setState
    return;
  }
  // async work...
}, [value]);
```

**Good - Use derived state or memoization:**
```typescript
useEffect(() => {
  if (value === "") {
    return; // ✓ Early return, let useMemo handle empty case
  }
  // async work only...
}, [value]);
```

**Bad - Loading initial data with setState in effect:**
```typescript
const [data, setData] = useState([]);

useEffect(() => {
  const loadedData = loadFromStorage();
  setData(loadedData); // ❌ Synchronous setState
}, []);
```

**Good - Use lazy initialization:**
```typescript
// Pass function to useState - it runs only once on mount
const [data, setData] = useState(loadFromStorage);

// Or with arrow function if you need parameters
const [data, setData] = useState(() => loadFromStorage(key));
```

**Good - Async external system sync (like API calls):**
```typescript
useEffect(() => {
  let cancelled = false;

  fetchData().then((result) => {
    if (!cancelled) {
      setState(result); // ✓ Async callback is OK
    }
  });

  return () => { cancelled = true; };
}, [dependency]);
```

### Effect Dependencies

Remove unnecessary dependencies from useEffect. Only include values that should trigger the effect.

## Next.js Server-Side Rendering

### Avoid Hydration Mismatches

Server and client must render identical HTML. Common causes of hydration errors:

**Bad - Operations that differ between server and client:**
```typescript
// Inline sorting/filtering during render causes non-deterministic output
function DocumentList({ documents }) {
  return (
    <div>
      {documents
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt) // ❌ Unstable between renders
        .map((doc) => <Item key={doc.id} {...doc} />)}
    </div>
  );
}
```

**Good - Memoize derived data:**
```typescript
function DocumentList({ documents }) {
  // ✓ Stable, memoized sorting
  const sortedDocuments = useMemo(
    () => documents.slice().sort((a, b) => b.createdAt - a.createdAt),
    [documents],
  );

  return (
    <div>
      {sortedDocuments.map((doc) => <Item key={doc.id} {...doc} />)}
    </div>
  );
}
```

**Other hydration mismatch causes:**
- `Date.now()` or `Math.random()` called during render
- Browser-specific APIs: `window`, `localStorage`, `navigator`
- Date/time formatting without timezone handling
- Conditional rendering based on `typeof window !== 'undefined'`