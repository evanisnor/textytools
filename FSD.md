# Feature-Sliced Design (FSD) for textytools

This document maps the current `textytools` repo to the Feature-Sliced Design (FSD) architecture and provides a pragmatic, incremental migration plan.

## Overview
- Goal: Organize by business value (each tool = a feature slice), enforce clear layer import rules, and keep reusable infrastructure in `shared`.
- Keep Next.js `app/` routing in place — route files stay thin and compose feature slices.

## High-level mapping (FSD layers → repo)
- **App**: Global providers and layout (`app/layout.tsx`, `app/globals.css`, top-level composition).
- **Pages**: Next.js route entry files in `app/<tool>/page.tsx` — thin composition layers that import features/widgets/entities.
- **Widgets**: Large reusable UI blocks (e.g. `ToolFrame`, stats panels). These should live under `src/widgets/*` or `src/shared/ui/*` depending on reuse scope.
- **Features**: Each utility (case-converter, csv-json-converter, json-wizard, jwt-decoder, text-counter, text-encoder, text-sanitizer, diff-viewer) becomes a `feature` slice under `src/features/*` and contains the UI and interaction logic specific to that tool.
- **Entities**: Domain models (text normalization/tokenization, CSV parser, JSON validation, JWT decoding, encoding helpers). Put domain logic, parsing and types under `src/entities/*`.
- **Shared**: UI primitives and infra utilities (currently `app/components/*` and `app/lib/*`) move to `src/shared/*`.

## Recommended folder layout
Keep `app/` routes thin and use `src/` for FSD layers and slices:

```
src/
  app/                 # Next.js route pages (thin)
  features/
    case-converter/
      ui/
      model/
      lib/
      index.ts
    csv-json-converter/
    json-wizard/
    ...
  entities/
    text/
    csv/
    json/
    jwt/
  widgets/
    tool-frame/
    stats-cards/
  shared/
    ui/                # Modal, Toast, TextEditor, ToolCard, etc.
    lib/               # analytics, constants, helpers
    hooks/             # syntax highlighters, small common hooks
```

Notes:
- Move `app/components/*` → `src/shared/ui/*` for reusable presentation components.
- Split `app/lib/*` into `src/shared/lib/*` (infrastructure/utilities) and `src/entities/*` (domain logic) depending on responsibility.
- Each slice should expose a public API via `index.ts` and pages/widgets should import only from that root.

## TypeScript paths
Add/maintain `tsconfig` path aliases for clarity and to enforce boundaries:

```
"paths": {
  "@/app/*": ["src/app/*"],
  "@/features/*": ["src/features/*"],
  "@/entities/*": ["src/entities/*"],
  "@/widgets/*": ["src/widgets/*"],
  "@/shared/*": ["src/shared/*"]
}
```

## Import rules & conventions
- Layer import rule (enforce via ESLint): app → processes → pages → widgets → features → entities → shared.
- Slices should export only a small public API (`index.ts`). Import from slice roots only.
- No cross-slice imports within the same layer; compose at a higher layer or lift shared logic to `entities`/`shared`.
- Keep UI stateless; place business logic in `model/` segments (hooks, parsers, helpers).

## Standard segments within a slice
Use these segments where needed (FSD doesn't require every segment for small features):
- `ui/` — presentational components
- `model/` — hooks, business logic, types
- `api/` — data fetching or persistent operations
- `lib/` — feature-specific helpers
- `config/` — constants and configuration

## Pragmatic Next.js guidance
- Keep `app/<tool>/page.tsx` as the route entry. It should import the feature's public API (e.g. `import { CaseConverter } from '@/features/case-converter'`) and render it inside `ToolFrame`.
- Avoid placing implementation logic inside `app/` routes — routes should orchestrate composition only.

### Composing features with ToolFrame headerRight
For features that need to display stats/info cards in the header (next to the title/description), split the feature UI into two components:

1. **Header component** - Displays stats/metrics (e.g., `JwtDecoderHeader`, `TextCounterHeader`)
2. **Shell component** - Main feature UI (e.g., `JwtDecoderShell`, `TextCounterShell`)

The page then:
- Calls the feature's hook (e.g., `useJwtDecoder()`) to get state
- Passes state to the Header component via `ToolFrame`'s `headerRight` prop
- Renders the Shell component as children

**Example:**
```tsx
// app/jwt-decoder/page.tsx
"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import {
  JwtDecoderShell,
  JwtDecoderHeader,
  useJwtDecoder,
} from "@/features/jwt-decoder";

export default function JWTDecoder() {
  const { result } = useJwtDecoder();

  return (
    <ToolFrame
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens (JWT) with real-time validation"
      toolName={TOOL_NAMES.JWT_DECODER}
      headerRight={<JwtDecoderHeader decoded={result.decoded} />}
    >
      <JwtDecoderShell />
    </ToolFrame>
  );
}
```

**Feature structure:**
```
src/features/jwt-decoder/
  ui/
    JwtDecoderHeader.tsx    # Stats display (algorithm, issued at, expires at)
    JwtDecoderShell.tsx     # Main UI (input/output editors)
  model/
    useJwtDecoder.ts        # Shared hook providing state
  index.ts                  # Export Header, Shell, hook, and types
```

This pattern keeps the page layer thin while allowing features to control both header stats and main content presentation.

## Example mapping (concrete)
- `app/components/ToolFrame.tsx` → `src/shared/ui/tool-frame/ToolFrame.tsx`
- `app/lib/csv.ts` → `src/entities/csv/lib/convert.ts` (domain) or `src/shared/lib/csv.ts` (infrastructure) depending on use
- `app/hooks/useCsvSyntaxHighlighter.tsx` → `src/shared/hooks/useCsvSyntaxHighlighter.ts`
- `app/json-wizard` implementation → `src/features/json-wizard/*` with `app/json-wizard/page.tsx` importing the feature root

## Migration plan (incremental, low-risk)
1. Add `src/` and update `tsconfig` path aliases.
2. Move shared UI primitives: create `src/shared/ui/` and move `ToolFrame`, `ToolCard`, `Modal`, `Toast`, `TextEditor*` there. Export via `src/shared/ui/index.ts`.
3. Move shared libs/hooks: move `app/lib/*` and `app/hooks/*` to `src/shared/lib` and `src/shared/hooks`.
4. Extract entities: identify domain logic (CSV/JSON parsing, token counting, encoding/decoding) and move to `src/entities/*` with a public `index.ts`.
5. Convert utilities into features: create `src/features/<tool>/` for each utility, moving feature-specific UI and model code there. Keep `app/<tool>/page.tsx` as a thin wrapper that imports the feature root.
6. Add `index.ts` public APIs for all slices and update imports across `app/` pages.
7. Run the TypeScript compiler and tests; fix import errors and adjust any server/client boundaries.
8. Add ESLint import rules (or the FSD ESLint plugin) to enforce layer import rules and prevent regressions.

## Concrete example — Case Converter
- `src/features/case-converter/`
  - `ui/CaseConverterShell.tsx` (composition + small presentational components)
  - `model/useCaseConverter.ts` (conversion logic, presets)
  - `lib/detection.ts` (word boundary detection)
  - `index.ts` (public API)
- `app/case-converter/page.tsx` imports `CaseConverterShell` from `@/features/case-converter` and renders inside `ToolFrame`.

## Practical decisions & tradeoffs
- Keep `app/` for Next.js routing (minimal Next-specific changes). Implement slices under `src/` to avoid moving route behavior.
- Move highly reused UI to `shared` first for immediate benefits.
- For small features, start with `ui/` + `model/` only; expand segments as complexity grows.

## Testing guidance
- Shared: unit tests for utils and UI primitives.
- Entities: unit tests for parsing/validation/formatting.
- Features: integration tests for user interactions.
- Pages: E2E tests for flows if needed.

## Why this helps
- Isolates domain logic, encourages reuse, makes features testable and replaceable, and enforces predictable import patterns so the codebase scales as more utilities are added.

## Pragmatic migration guide

### Phase 1: Foundation (zero breaking changes)
Start with infrastructure that has no feature-specific dependencies. These moves are safe and create the foundation for future work.

**Step 1.1: Create directory structure**
```bash
mkdir -p src/shared/{ui,lib,hooks}
mkdir -p src/entities
mkdir -p src/features
```

**Step 1.2: Add TypeScript path aliases**
Update `tsconfig.json` paths:
```json
"paths": {
  "@/app/*": ["app/*"],
  "@/shared/*": ["src/shared/*"],
  "@/entities/*": ["src/entities/*"],
  "@/features/*": ["src/features/*"]
}
```

**Step 1.3: Move infrastructure utilities to `src/shared/lib/`**
These have no domain logic, just infrastructure:
- `app/lib/analytics.ts` → `src/shared/lib/analytics.ts` (uses gtag for GA4)
- `app/lib/constants.ts` → `src/shared/lib/constants.ts` (includes REGEX_TESTER)
- `app/lib/featureFlags.ts` → `src/shared/lib/featureFlags.ts` (new ToggleMode enum pattern)

Create `src/shared/lib/index.ts`:
```typescript
export * from './analytics';
export * from './constants';
export * from './featureFlags';
```

Update imports across the codebase: `@/app/lib/analytics` → `@/shared/lib/analytics`

**Note on analytics.ts changes:**
The file now uses a direct gtag integration instead of dataLayer, with an `analyticsEnabled` flag that can be controlled via `NEXT_PUBLIC_ENABLE_ANALYTICS`. The migration is otherwise identical.

### Phase 2: Extract domain entities
Move pure business logic that multiple features might use.

**Step 2.1: Create CSV entity**
- `app/lib/csv.ts` → `src/entities/csv/lib/parser.ts`

Create `src/entities/csv/index.ts`:
```typescript
export { parseCsvLine } from './lib/parser';
```

This is used by both csv-json-converter and the CSV syntax highlighter.

**Step 2.1b: Create JSON entity**
- `app/lib/jsonSyntaxError.ts` → `src/entities/json/lib/error-parser.ts`

Create `src/entities/json/index.ts`:
```typescript
export * from './lib/error-parser';
```

This is used by json-wizard for parsing and formatting JSON syntax errors.

**Step 2.2: Update CSV syntax highlighter**
- `app/hooks/useCsvSyntaxHighlighter.tsx` → `src/shared/hooks/useCsvSyntaxHighlighter.tsx`
- Update import: `@/app/lib/csv` → `@/entities/csv`

**Step 2.3: Update JSON syntax highlighter**
- `app/hooks/useJsonSyntaxHighlighter.tsx` → `src/shared/hooks/useJsonSyntaxHighlighter.tsx`

**Step 2.4: Update Regex match highlighter**
- `app/hooks/useRegexMatchHighlighter.tsx` → `src/shared/hooks/useRegexMatchHighlighter.tsx`

Create `src/shared/hooks/index.ts`:
```typescript
export * from './useCsvSyntaxHighlighter';
export * from './useJsonSyntaxHighlighter';
export * from './useRegexMatchHighlighter';
```

### Phase 3: Move shared UI components
Move presentational components that are reused across tools.

**Step 3.1: Move foundational UI**
Move these to `src/shared/ui/`:
- `app/components/Modal.tsx` → `src/shared/ui/modal/Modal.tsx`
- `app/components/Toast.tsx` → `src/shared/ui/toast/Toast.tsx`
- `app/components/ToolCard.tsx` → `src/shared/ui/tool-card/ToolCard.tsx`

**Step 3.2: Move editor components**
- `app/components/TextEditor.tsx` → `src/shared/ui/text-editor/TextEditor.tsx`
- `app/components/TextEditorContainer.tsx` → `src/shared/ui/text-editor/TextEditorContainer.tsx`
- `app/components/SearchBox.tsx` → `src/shared/ui/search-box/SearchBox.tsx`

**Step 3.3: Move tool frame**
- `app/components/ToolFrame.tsx` → `src/shared/ui/tool-frame/ToolFrame.tsx`
- `app/components/FeedbackModal.tsx` → `src/shared/ui/tool-frame/FeedbackModal.tsx` (used only by ToolFrame)

Create `src/shared/ui/index.ts`:
```typescript
export { Modal } from './modal/Modal';
export { Toast, useToast } from './toast/Toast';
export { ToolCard } from './tool-card/ToolCard';
export { TextEditor } from './text-editor/TextEditor';
export { TextEditorContainer } from './text-editor/TextEditorContainer';
export { SearchBox } from './search-box/SearchBox';
export { ToolFrame } from './tool-frame/ToolFrame';
```

Update all tool pages: `@/app/components/ToolFrame` → `@/shared/ui`

### Phase 4: Extract features (one at a time)
Convert each tool from an inline page to a feature slice. Start with the simplest.

**Step 4.1: Case Converter (simplest - self-contained logic)**

Create `src/features/case-converter/`:
```
case-converter/
  ui/
    CaseConverterShell.tsx    # Main component (extracted from page.tsx)
  model/
    useCaseConverter.ts       # Conversion logic + state
    types.ts                  # CaseType, CaseOption
  lib/
    converters.ts             # toTitleCase, toCamelCase, etc.
    detection.ts              # toWords function
  index.ts
```

Extract conversion functions to `lib/converters.ts`, word detection to `lib/detection.ts`, create a `useCaseConverter` hook in `model/`, then wrap UI in `ui/CaseConverterShell.tsx`.

Update `app/case-converter/page.tsx` to import from `@/features/case-converter` and render `<CaseConverterShell />` inside `<ToolFrame>`.

**Step 4.2: Text Counter**
Similar pattern - logic in `model/useTextCounter.ts`, stats calculation in `lib/stats.ts`.

**Step 4.3: Text Sanitizer**
Filter definitions in `model/filters.ts`, application logic in `model/useTextSanitizer.ts`.

**Step 4.4: Text Encoder**
Encoding/decoding logic in `lib/encoders.ts` and `lib/decoders.ts`.

**Step 4.5: JWT Decoder**
JWT parsing in `src/entities/jwt/lib/parser.ts` (reusable domain logic), UI in `src/features/jwt-decoder/`.

**Step 4.6: CSV/JSON Converter**
Uses `src/entities/csv/` (already created). Conversion logic in `lib/converter.ts`.

**Step 4.7: JSON Wizard**
JSON operations in `lib/operations.ts`, search logic in `model/useJsonSearch.ts`.

**Step 4.8: Diff Viewer**
Diff algorithm in `lib/diff.ts` or use a library, presentation in `ui/`.

**Step 4.9: Regex Tester**
Regex execution logic in `lib/matcher.ts`, flag management in `model/useRegexTester.ts`, CSV conversion logic in `lib/capture-to-csv.ts`.

### Phase 5: Enforce boundaries
Add linting rules to prevent regression.

**Step 5.1: Install FSD ESLint plugin** (optional)
```bash
npm install -D @feature-sliced/eslint-config
```

**Step 5.2: Add import rules**
Configure ESLint to enforce:
- No imports from feature internals (must use `index.ts`)
- No cross-slice imports within same layer
- Respect layer hierarchy (features can't import from widgets/pages)

### Order of execution (minimum viable increments)

1. **Week 1**: Phase 1 (foundation) - Move lib files, add paths, verify builds
2. **Week 2**: Phase 2 (entities) - Extract CSV entity, move hooks
3. **Week 3**: Phase 3 (shared UI) - Move all components, update imports
4. **Week 4+**: Phase 4 (features) - One feature per week, starting with case-converter

Each step is independently deployable. Verify TypeScript compilation and tests after each move.

### lib/ folder breakdown

| Current file | Destination | Rationale |
|-------------|-------------|-----------|
| `app/lib/analytics.ts` | `src/shared/lib/analytics.ts` | Infrastructure - gtag/GA4 tracking utilities |
| `app/lib/constants.ts` | `src/shared/lib/constants.ts` | Infrastructure - tool name constants (9 tools) |
| `app/lib/featureFlags.ts` | `src/shared/lib/featureFlags.ts` | Infrastructure - ToggleMode enum pattern |
| `app/lib/csv.ts` | `src/entities/csv/lib/parser.ts` | Domain logic - CSV parsing rules |
| `app/lib/jsonSyntaxError.ts` | `src/entities/json/lib/error-parser.ts` | Domain logic - JSON error parsing/formatting |

### hooks/ folder breakdown

| Current file | Destination | Rationale |
|-------------|-------------|-----------|
| `app/hooks/useCsvSyntaxHighlighter.tsx` | `src/shared/hooks/useCsvSyntaxHighlighter.tsx` | Shared UI logic - uses CSV entity |
| `app/hooks/useJsonSyntaxHighlighter.tsx` | `src/shared/hooks/useJsonSyntaxHighlighter.tsx` | Shared UI logic - JSON tokenization/highlighting |
| `app/hooks/useRegexMatchHighlighter.tsx` | `src/shared/hooks/useRegexMatchHighlighter.tsx` | Shared UI logic - regex match highlighting for regex-tester |

### Tool-specific logic extraction (future work)

For each feature, look for these patterns to extract:

**Case Converter** (`app/case-converter/page.tsx`):
- `toWords`, `toCamelCase`, `toPascalCase`, etc. → `lib/converters.ts`
- `CaseType`, `CaseOption` → `model/types.ts`
- `caseOptions` array → `model/presets.ts`

**Text Counter** (`app/text-counter/page.tsx`):
- Counting logic → `lib/counters.ts`
- Token estimation → `lib/tokenizer.ts` or `src/entities/text/lib/tokenizer.ts`

**Text Sanitizer** (`app/text-sanitizer/page.tsx`):
- Filter definitions → `model/filters.ts`
- Filter application logic → `lib/apply.ts`

**Text Encoder** (`app/text-encoder/page.tsx`):
- Encoder/decoder implementations → `lib/encoders.ts`, `lib/decoders.ts`
- Format definitions → `model/formats.ts`

**CSV/JSON Converter** (`app/csv-json-converter/page.tsx`):
- JSON-to-CSV logic → `lib/json-to-csv.ts`
- CSV-to-JSON logic → `lib/csv-to-json.ts`
- Type detection → `lib/type-inference.ts`

**JWT Decoder** (`app/jwt-decoder/page.tsx`):
- Base64 decoding → `src/entities/jwt/lib/decoder.ts`
- Claim validation → `src/entities/jwt/lib/validator.ts`

**JSON Wizard** (`app/json-wizard/page.tsx`):
- Validation → `lib/validator.ts`
- Formatting → `lib/formatter.ts`
- Search → `model/useJsonSearch.ts`
- Key sorting → `lib/sort.ts`

**Diff Viewer** (`app/diff-viewer/page.tsx`):
- Diff algorithm → `lib/diff-engine.ts`
- Line comparison → `lib/compare.ts`

**Regex Tester** (`app/regex-tester/page.tsx`):
- Flag definitions → `model/flags.ts`
- Match execution → `lib/matcher.ts`
- Capture group extraction → `lib/capture-groups.ts`
- CSV conversion logic → `lib/convert-to-csv.ts`
- State persistence → `model/useRegexTester.ts`

---
File created from review of `README.md` and the article: "Feature-Sliced Design Architecture in React with TypeScript: A Comprehensive Guide". https://medium.com/@codewithxohii/feature-sliced-design-architecture-in-react-with-typescript-a-comprehensive-guide-b2652283c6b2
