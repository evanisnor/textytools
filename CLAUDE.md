Read the README.md file

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