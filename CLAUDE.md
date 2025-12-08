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