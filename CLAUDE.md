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

Never call setState synchronously within useEffect. Effects should only:
1. Sync with external systems (DOM, APIs)
2. Subscribe to external updates (calling setState in callbacks only)

**Bad:**
```typescript
useEffect(() => {
  if (value === "") {
    setState("default"); // ❌ Synchronous setState
    return;
  }
  // async work...
}, [value]);
```

**Good:**
```typescript
useEffect(() => {
  if (value === "") {
    return; // ✓ Early return, let useMemo handle empty case
  }
  // async work only...
}, [value]);
```

Remove unnecessary dependencies from useEffect. Only include values that should trigger the effect.