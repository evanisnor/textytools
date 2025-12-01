# Apogee: The Next Generation Transformation Pipeline

Apogee is a linear data transformation pipeline that lets users convert, encode, hash, compress, and manipulate text data through a sequence of configurable steps. Each step takes input, optionally extracts a subset via an "Input Lens," applies a transformation, and produces output with metadata and statistics. The pipeline flows from top to bottom—no branching, no complexity—just a clear chain of transformations from raw input to final result.

The core innovation is the Input Lens: before any transformation executes, users can define how to parse the input (regex extraction, JSONPath queries, CSV column selection). This means you can extract a JSON blob from log files, convert it to YAML, encode it as Base64, and compress it—all in one visual pipeline. The lens handles the "what data" question, while the transform handles the "what to do with it" question.

Every transform returns structured results with validation stats, error alerts, and MIME type detection. This powers real-time UI feedback: see key counts for JSON, compression ratios for Gzip, collision resistance warnings for MD5. The system is built for discoverability—transforms are organized by action verbs (Convert, Encode, Hash, Compress) and automatically filter based on compatibility with the current output type.

## 1. Core Philosophy

### 1.1 Linear Workflow by Design

Apogee embraces **linear simplicity** as a feature, not a limitation. Users build transformation pipelines from top to bottom—no branching, no conditionals, no visual programming complexity. This constraint delivers:

- **Cognitive clarity**: Each step has one input (previous output) and one output (next input). No mental overhead tracking multiple data paths.
- **Predictable execution**: Steps run sequentially, always in the same order. No race conditions, no dependency graphs to manage.
- **Easy debugging**: When output is wrong, find the broken step and fix it. The linear flow makes troubleshooting trivial.
- **Shareable workflows**: Copy a document URL and share the entire transformation pipeline. Others can inspect each step, understand the logic, and clone it for their own use.

This philosophy mirrors UNIX pipes (`cat file.txt | grep pattern | sort | uniq`) but with visual feedback and inline configuration at each stage.

### 1.2 Feature-Sliced Architecture

Apogee follows **Feature-Sliced Design (FSD)**, organizing code by business value rather than technical layers:

```
src/
├── features/
│   └── apogee/              # Self-contained Apogee feature
│       ├── lib/             # Business logic
│       │   ├── engine.ts    # Pipeline execution
│       │   ├── registry.ts  # Transform registry
│       │   └── exports.ts   # Export action registry
│       ├── model/           # State management
│       │   ├── types.ts     # Document, TransformStep, Lens types
│       │   └── useDocumentManager.ts  # Pipeline state hooks
│       ├── ui/              # React components
│       │   ├── DataBlock.tsx
│       │   ├── TransformBlock.tsx
│       │   ├── TransformPalette.tsx
│       │   ├── LensConfig.tsx
│       │   └── ExportRow.tsx
│       └── index.ts         # Public API
│
├── entities/                # Reusable domain primitives
│   ├── json/                # JSON parsing, manipulation (ALREADY EXISTS)
│   │   ├── lib/
│   │   ├── model/
│   │   └── index.ts
│   ├── csv/                 # CSV parsing, escaping (ALREADY EXISTS)
│   │   ├── lib/
│   │   ├── model/
│   │   └── index.ts
│   ├── xml/                 # XML parsing, serialization (NEW)
│   │   ├── lib/
│   │   ├── model/
│   │   └── index.ts
│   ├── yaml/                # YAML parsing, serialization (NEW)
│   │   ├── lib/
│   │   ├── model/
│   │   └── index.ts
│   ├── toml/                # TOML parsing, serialization (NEW)
│   │   ├── lib/
│   │   ├── model/
│   │   └── index.ts
│   └── transform/           # Transform implementations (compose format entities)
│       ├── text-hash/       # Single entity, ALL hash algorithms (EXISTS)
│       │   ├── lib/
│       │   │   ├── md5.ts
│       │   │   ├── sha1.ts
│       │   │   ├── sha256.ts
│       │   │   └── sha512.ts
│       │   ├── model/
│       │   │   ├── types.ts      # HashType union
│       │   │   └── useTextHashing.ts
│       │   └── index.ts
│       ├── text-encoding/   # Single entity, ALL encodings (EXISTS)
│       │   ├── lib/
│       │   │   ├── base64.ts
│       │   │   ├── base58.ts
│       │   │   ├── url.ts
│       │   │   ├── html.ts
│       │   │   └── hex.ts
│       │   ├── model/
│       │   │   └── types.ts      # EncodingType union
│       │   └── index.ts
│       ├── text-case/       # Case transformations (EXISTS)
│       ├── text-sanitize/   # Text cleanup (EXISTS)
│       ├── json-convert/    # Uses entities/json (NEW)
│       ├── csv-convert/     # Uses entities/csv (NEW)
│       ├── xml-convert/     # Uses entities/xml (NEW)
│       ├── yaml-convert/    # Uses entities/yaml (NEW)
│       └── toml-convert/    # Uses entities/toml (NEW)
│
└── shared/
    └── ui/                  # Reusable UI components (buttons, inputs)
```

**Entity Organization Pattern:**

1. **Format Entities** (`entities/json`, `entities/csv`, etc.): Reusable parsing/serialization utilities for specific file formats. These are pure domain logic with no transform-specific concerns.

2. **Transform Entities** (`entities/transform/*`): Implement `TransformDefinition` interface and compose format entities. Single entity per algorithm family (e.g., `text-hash` handles md5, sha1, sha256, sha512).

3. **Composition**: Transform entities import and use format entities. For example, `entities/transform/json-convert` uses `entities/json` for parsing/stringification.

**Benefits:**
- **Isolation**: The apogee feature can be developed, tested, and deployed independently. No coupling to other features.
- **Discoverability**: New developers find all apogee-related code in one place. No hunting across `/components`, `/utils`, `/services`.
- **Scalability**: Adding a new hash algorithm? Add one file to `entities/transform/text-hash/lib/`. The registry auto-discovers it. Adding a new format? Create one entity in `entities/`.
- **Reusability**: Core transform logic (e.g., `base64-encode`) lives in `entities/` and can power both Apogee and future features (CLI tools, API endpoints).

### 1.3 Separation of Concerns

Apogee strictly separates **what**, **how**, and **where**:

1. **Configuration (What)**: `TransformStep.properties` defines user choices (indentation, delimiter, regex pattern). Stored in `Document` state, persisted to localStorage.
2. **Execution (How)**: `ApogeeEngine` orchestrates the pipeline. `TransformDefinition.execute()` contains pure transformation logic. No UI dependencies.
3. **Presentation (Where)**: UI components (`DataBlock`, `TransformPalette`) render state and dispatch actions. No business logic, only view concerns.

**Why this matters:**
- **Testing**: Execute transforms in Node.js without a browser. Unit test the engine without rendering React components.
- **Portability**: The same transform logic can run in web, CLI, or server environments. Only the presentation layer changes.
- **Maintainability**: Changing how Base64 encoding works? Edit one `execute()` function. UI updates automatically via the registry.

### 1.4 The Input Lens: Parsing as First-Class

Traditional transformation tools force each transform to handle parsing internally. If you want to hash a JSON field from a log file, you'd need a "Extract JSON from Logs" transform, then a "Get Field" transform, then a "Hash" transform.

Apogee inverts this: **every step includes a lens** that defines how to parse input before transforming it. The lens functionality is always available in the data model, defaulting to "all" (pass-through). The UI panel for configuring the lens appears only when users need to extract or parse structured data—primarily for Convert transforms.

**User workflow:**
1. Paste log file into input
2. Add "JSON Convert" transform
3. Configure lens: mode=regex, pattern=`(?<={).*(?=})`, parseAs=json
4. Configure transform: indentation=2
5. Output: Pretty-printed JSON extracted from logs

**Benefits:**
- **Composability**: Transforms become pure converters. They don't need custom extraction logic for every input format.
- **Reusability**: The same "JSON Convert" transform works on raw JSON, CSV-containing-JSON, logs-containing-JSON, or XML-containing-JSON. The lens handles extraction.
- **Discoverability**: Users see all transforms as available options. No more "I need to convert CSV to JSON" → search → "Wait, there's no CSV-to-JSON transform?" → give up. Just add "JSON Convert" and configure the lens to parse CSV.

**Lens Visibility**: The lens is primarily useful for Convert transforms where users need to extract structured data from unstructured input. For other transform categories (Encode, Hash, Manipulate), the lens defaults to "all" mode and the UI panel remains collapsed or hidden.

### 1.5 Unified Metadata: Stats as First-Class Citizens

Traditional transform tools return raw strings. Apogee returns **structured results**:

```typescript
interface TransformResult {
  success: boolean;
  data: string;
  error?: string;
  mimeType: string;
  stats?: TransformStat[];
}
```

**Why structured results matter:**
- **Real-time validation**: See "Valid JSON: ✓" immediately after parsing. No need to pipe to a separate validator.
- **Context-aware UI**: Show compression ratio for Gzip, key count for JSON, collision resistance warnings for MD5. The UI adapts to each transform type.
- **Error recovery**: Failed transforms return `success: false` with an error message. The pipeline continues, showing the error inline. Users don't lose their work.
- **Learning aid**: Stats teach users about their data. "Why is my CSV 50 rows but only 3 columns?" → Check stats → "Oh, I used the wrong delimiter."

### 1.6 Schema-Driven UI: Build Tools, Not Forms

Adding a new transform should not require writing custom UI. Apogee's **property schemas** auto-generate form controls:

```typescript
propertySchema: [
  { key: "indentation", type: "select", options: [2, 4, "tab"], defaultValue: 2 },
  { key: "sortKeys", type: "toggle", defaultValue: false }
]
```

The UI reads this schema and renders:
- A select dropdown for `indentation`
- A toggle button for `sortKeys`

**Benefits:**
- **Velocity**: Implement 10 new hash algorithms in one day. No UI work required.
- **Consistency**: All transforms use the same visual language. Users learn the pattern once.
- **Maintainability**: Change a property type from `select` to `toggle-group`? Update the schema. The UI updates automatically.

### 1.7 Workflow Goals

Apogee optimizes for **iterative exploration**, not one-shot execution:

- **Instant feedback**: See output after every step. Adjust options and watch results update in real-time (debounced).
- **Minimize mode-switching**: Configure transforms inline, not in modal dialogs. Copy output with one click, not through menus.
- **Visual permanence**: The entire pipeline is visible on screen. Scroll to review past steps without clicking "back" or navigating history.
- **Forgiving errors**: Broken steps show inline errors but don't halt the pipeline. Fix the regex and continue—no need to rebuild the entire chain.

**Target use cases:**
- **Developers**: Extract API responses from logs, decode JWTs, convert CSV to JSON for testing.
- **Data analysts**: Clean messy CSVs, extract columns, compute stats, export to formatted reports.
- **DevOps**: Decode Base64 configs, decompress Gzip logs, parse YAML manifests, validate against schemas.
- **Educators**: Demonstrate encoding schemes, hash algorithms, data transformations step-by-step with live examples.

## 2. Architecture & Data Model

### 2.1 The Transform Step Model
**Location:** `features/apogee/model/types.ts`

State management uses a structured three-phase approach: Lens (Parse) → Transform → Result.

```typescript
interface TransformStep {
  id: string;
  documentId: string;
  order: number;
  transformType: TransformType; // e.g., "json-convert", "base64-encode", "gzip-compress"

  // Phase 1: Input Lens (Selection + Parsing)
  // Determines WHAT data to extract and HOW to parse it
  inputSelection: {
    // Selection mode: how to extract data from previous output
    mode: "all" | "regex" | "jsonpath" | "csv-column" | "xml-xpath";

    // Mode-specific extraction parameters
    regexPattern?: string;      // e.g., "(?<=Data: ).*" for regex mode
    regexFlags?: string;        // e.g., "gm" for regex mode
    jsonPath?: string;          // e.g., "$.users[*].name" for jsonpath mode
    csvColumn?: number | string; // e.g., 0 or "email" for csv-column mode
    xpathQuery?: string;        // e.g., "//user/@id" for xml-xpath mode

    // Parsing hint: how to interpret the extracted data
    // Used by Convert transforms to determine input format
    parseAs?: "auto" | "text" | "json" | "csv" | "yaml" | "toml" | "xml";
  };

  // Phase 2: Transformation Configuration
  // Controls HOW the transformation is applied
  properties: Record<string, unknown>; // e.g., { delimiter: ",", indentation: 2 }

  // Phase 3: Cached Output
  output: string;          // Result from last execution
  createdAt: number;
}

interface Document {
  id: string;
  name: string;
  inputType: "text" | "csv" | "json" | "file";
  inputData: string;
  transforms: TransformStep[];
  createdAt: number;
  updatedAt: number;
}
```

### 2.2 Transform Type Catalog
All available transforms organized by category (verb):

```typescript
// Convert: Parse input and convert to target format
type ConvertTransform =
  | "json-convert"      // Convert any input to JSON (with formatting options)
  | "csv-convert"       // Convert any input to CSV (with delimiter, headers, etc.)
  | "yaml-convert"      // Convert any input to YAML (with indentation, version)
  | "toml-convert"      // Convert any input to TOML (with formatting style)
  | "xml-convert"       // Convert any input to XML (with element/attribute strategy)
  | "protobuf-convert"; // Convert to/from Protobuf (future)

// Encode: Represent data in transport formats
type EncodeTransform =
  | "base64-encode"     // Base64/Base64URL with padding options
  | "base58-encode"     // Base58 with alphabet selection
  | "base91-encode"     // Base91 standardized
  | "ascii85-encode"    // ASCII85 with format variants
  | "z85-encode"        // ZeroMQ Z85
  | "url-encode"        // URL encoding with mode options
  | "html-entity-encode"// HTML entities (decimal/hex/named)
  | "hex-encode"        // Hexadecimal with delimiter options
  | "quoted-printable"  // MIME Quoted-Printable
  | "rot13-encode"      // ROT13 cipher
  | "morse-encode";     // Morse code with custom chars

// Decode: Inspect and revert encodings
type DecodeTransform =
  | "jwt-decode"        // JWT with signature verification
  | "base64-decode"     // Base64 with strict/lenient modes
  | "base58-decode"     // Base58 decoder
  | "hex-decode"        // Hex decoder
  | "unicode-decode";   // Unicode escape sequences

// Hash: Generate cryptographic signatures
type HashTransform =
  | "md5-hash"          // MD5 with HMAC support
  | "sha1-hash"         // SHA-1 with HMAC
  | "sha256-hash"       // SHA-256 with HMAC
  | "sha384-hash"       // SHA-384 with HMAC
  | "sha512-hash"       // SHA-512 with HMAC
  | "sha3-hash"         // SHA-3 variants (256/384/512)
  | "blake3-hash"       // BLAKE3 with configurable output
  | "murmur3-hash";     // Murmur3 non-cryptographic

// Manipulate: String-level text operations
type ManipulateTransform =
  | "text-sanitize"     // Trim, remove empty/duplicate lines
  | "case-convert"      // camelCase, snake_case, etc.
  | "regex-replace"     // Find/replace with capture groups
  | "sort-lines"        // Sort by alpha/numeric/length
  | "extract-lines";    // Filter lines by pattern

// Compress: Size reduction algorithms
type CompressTransform =
  | "gzip-compress"     // Gzip with level 1-9
  | "bzip2-compress"    // Bzip2 with level 1-9
  | "brotli-compress"   // Brotli with quality 0-11
  | "zstd-compress"     // Zstandard with level 1-22
  | "lzma2-compress"    // LZMA2/7zip
  | "xz-compress";      // XZ with check types

// Decompress: Restore compressed data
type DecompressTransform =
  | "gzip-decompress"
  | "bzip2-decompress"
  | "brotli-decompress"
  | "zstd-decompress"
  | "lzma2-decompress"
  | "xz-decompress";

// Analyze: Visualization and insights
type AnalyzeTransform =
  | "chart-generator"       // Generate charts from CSV/JSON (bar, line, pie, scatter)
  | "frequency-distribution" // Histogram of word/character/value frequencies
  | "time-series-plot"      // Plot timestamped data over time
  | "data-validator"        // Schema validation with visual error reports
  | "pattern-heatmap";      // Visual heatmap of data patterns

type TransformType =
  | ConvertTransform
  | EncodeTransform
  | DecodeTransform
  | HashTransform
  | ManipulateTransform
  | CompressTransform
  | DecompressTransform
  | AnalyzeTransform;
```

### 2.3 The Transform Registry Definition
**Location:** `features/apogee/lib/registry.ts`

Each transform is defined with a comprehensive schema that drives both execution and UI.

```typescript
interface PropertySchema {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "toggle" | "toggle-group" | "multi-select";
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
  defaultValue: unknown;
  validation?: (value: unknown) => string | null; // Client-side validation
}

interface TransformDefinition {
  type: TransformType;
  name: string;              // Display name (e.g., "JSON Format")
  description: string;       // Help text
  category: "convert" | "encode" | "decode" | "hash" | "manipulate" | "compress" | "decompress" | "analyze";

  // Input/Output Type Compatibility
  acceptsInput: string[];    // e.g., ["text", "json"], ["text", "csv"]
  producesOutput: string;    // e.g., "json", "csv", "text"

  // UI Configuration Schema
  propertySchema: PropertySchema[];
  defaultProperties: Record<string, unknown>;

  // Execution
  execute: (input: string, properties: Record<string, unknown>) => TransformResult;

  // Optional: Disable lens for transforms that don't support it
  supportsInputSelection?: boolean; // Default: true

  // Optional: Enable line-by-line processing mode
  supportsLineByLine?: boolean; // Default: false (only for encode/decode/hash/manipulate)

  // Optional: Hide syntax selector if output type is fixed
  hideSyntaxSelector?: boolean;
}
```

### 2.4 The Execution Result
Transforms return structured results with metadata, not just strings.

```typescript
interface TransformStat {
  label: string;             // e.g., "Valid JSON", "Row Count", "Collision Resistance"
  value: string | number | boolean;
  alert?: "info" | "warning" | "error"; // Visual indicator for critical stats
}

interface TransformResult {
  success: boolean;
  data: string;              // The transformed output
  error?: string;            // Error message if success = false

  // Metadata for UI
  mimeType: string;          // e.g., "application/json", "text/csv", "text/plain"
  stats?: TransformStat[];   // Structured stats for StatsBar component
}
```

### 2.5 Export Actions (Separate from Transforms)
**Location:** `features/apogee/lib/exports.ts`

Exports are **actions on data**, not transformations. They deliver pipeline output to the user via downloads or clipboard, without modifying the data.

```typescript
// Export types: actions for delivering data
type ExportType =
  | "text-download"     // Download as text file
  | "pdf-download"      // Generate PDF
  | "clipboard-copy";   // Copy to clipboard

interface ExportDefinition {
  type: ExportType;
  name: string;
  description: string;

  acceptsInput: string[];  // Compatible input types

  // UI Configuration
  propertySchema: PropertySchema[];
  defaultProperties: Record<string, unknown>;

  // Execution (side effect + confirmation stats)
  execute: (input: string, properties: Record<string, unknown>) => ExportResult;
}

interface ExportResult {
  success: boolean;
  error?: string;
  stats?: TransformStat[];  // Confirmation feedback (e.g., "Downloaded as output.txt")
}
```

**Example Results:**

```typescript
// Success with stats
{
  success: true,
  data: '{"name":"Alice","age":30}',
  mimeType: "application/json",
  stats: [
    { label: "Valid JSON", value: true, alert: "info" },
    { label: "Keys", value: 2 },
    { label: "Depth", value: 1 }
  ]
}

// Error state
{
  success: false,
  data: "",
  error: "Expected valid JSON, received: Hello World",
  mimeType: "text/plain",
  stats: [
    { label: "Status", value: "Invalid JSON", alert: "error" }
  ]
}

// Hash with warning
{
  success: true,
  data: "5d41402abc4b2a76b9719d911017c592",
  mimeType: "text/plain",
  stats: [
    { label: "Output Bit Length", value: 128 },
    { label: "Collision Resistance", value: "⚠️ Weak (deprecated)", alert: "warning" }
  ]
}
```

## 3. Component Hierarchy

The UI follows a clean, hierarchical structure with the Input Lens and StatsBar as key additions.

```text
ApogeeShell
├── DocumentList (sidebar)
│   └── DocumentCard[]
│
└── WorkspacePanel
    ├── InputForm (when no document)
    │   └── DataBlock (editable, no lens)
    │
    └── TransformPipeline (when document loaded)
        │
        ├── DataBlock (Input)
        │   ├── Header
        │   │   ├── Title: "Input"
        │   │   └── Controls (Wrap, Copy, Clear)
        │   └── TextEditor (editable, syntax selector)
        │
        ├── StepConnector (visual arrow ↓)
        │
        ├── TransformBlock[] (one per transform step)
        │   │
        │   ├── StepHeader
        │   │   ├── Title: "Step N: Transform Name"
        │   │   ├── Minimize/Expand Toggle
        │   │   └── Remove Button
        │   │
        │   ├── LensPanel (Phase 1: Input Selection)
        │   │   ├── ModeToggle [All | Regex]
        │   │   └── RegexEditor (when mode = regex)
        │   │       ├── Pattern Input
        │   │       ├── Flags Input
        │   │       └── MatchPreview (live count)
        │   │
        │   ├── ConfigurationPanel (Phase 2: Options)
        │   │   │  *Schema-driven form generation*
        │   │   ├── TextInput (for type="text")
        │   │   ├── NumberInput (for type="number")
        │   │   ├── SelectDropdown (for type="select")
        │   │   ├── ToggleButton (for type="toggle")
        │   │   ├── ToggleGroup (for type="toggle-group")
        │   │   └── MultiSelect (for type="multi-select")
        │   │
        │   ├── StatsBar (when stats available)
        │   │   └── StatPill[]
        │   │       ├── Label (e.g., "Valid JSON")
        │   │       ├── Value (e.g., "✓")
        │   │       └── Alert Badge (info/warning/error)
        │   │
        │   └── DataBlock (Phase 3: Output)
        │       ├── Header
        │       │   ├── Output Type Badge (auto-detected from MIME)
        │       │   ├── Syntax Selector (user override)
        │       │   └── Controls (Wrap, Copy)
        │       └── TextEditor (read-only, syntax highlighted)
        │
        ├── StepConnector (↓)
        │
        └── TransformPalette
            │
            ├── CategoryRow[]
            │   ├── CategoryButton (e.g., "Convert", "Encode")
            │   └── TransformTiles[] (expanded on click)
            │       ├── TransformTile
            │       │   ├── Icon
            │       │   ├── Name
            │       │   └── Tooltip (description, input/output types)
            │       └── ...
            │
            └── ExportRow (shown when transforms.length > 0)
                └── ExportButton[] ("Download", "PDF", "Clipboard")
```

### Component Details

#### DataBlock
**Location:** `features/apogee/ui/DataBlock.tsx`

**Props:**
```typescript
interface DataBlockProps {
  title: string;
  subtitle?: string;          // NEW: e.g., "JSON" type badge
  value: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  onClear?: () => void;

  // NEW: Lens integration
  showLens?: boolean;
  lensMode?: "all" | "regex";
  onLensChange?: (mode: "all" | "regex") => void;
  regexPattern?: string;
  regexFlags?: string;
  onRegexChange?: (pattern: string, flags: string) => void;

  // Stats integration
  stats?: TransformStat[];

  // Configuration panel
  children?: React.ReactNode;
  defaultSyntax?: "none" | "csv" | "json" | "yaml" | "xml";
  hideSyntaxSelector?: boolean;
}
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Step 2: JSON Format              [Minimize] │ ← Header
├─────────────────────────────────────────────┤
│ Lens: [All] [Regex]                         │ ← LensPanel (optional)
├─────────────────────────────────────────────┤
│ Indent: [2▼] [✓ Sort Keys] [Minify]        │ ← ConfigurationPanel
├─────────────────────────────────────────────┤
│ [Valid JSON: ✓] [Keys: 42] [Depth: 3]      │ ← StatsBar
├─────────────────────────────────────────────┤
│ 1  {                                        │
│ 2    "name": "Alice",                       │ ← TextEditor
│ 3    "age": 30                              │   (MIME-based syntax)
│ 4  }                                        │
│                                             │
│                  [Wrap] [Copy]              │ ← Controls
└─────────────────────────────────────────────┘
```

#### LensPanel (New Component)
**Location:** `features/apogee/ui/LensConfig.tsx`

**Props:**
```typescript
interface LensPanelProps {
  mode: "all" | "regex" | "jsonpath" | "csv-column" | "xml-xpath";
  onModeChange: (mode: LensPanelProps['mode']) => void;

  // Regex mode
  regexPattern?: string;
  regexFlags?: string;
  onRegexChange?: (pattern: string, flags: string) => void;

  // JSONPath mode
  jsonPath?: string;
  onJsonPathChange?: (path: string) => void;

  // CSV column mode
  csvColumn?: number | string;
  onCsvColumnChange?: (column: number | string) => void;

  // XPath mode
  xpathQuery?: string;
  onXpathChange?: (query: string) => void;

  // Parse as hint
  parseAs?: "auto" | "text" | "json" | "csv" | "yaml" | "toml" | "xml";
  onParseAsChange?: (parseAs: string) => void;

  // Live preview metadata
  matchCount?: number;  // For regex/jsonpath/xpath modes
  extractedPreview?: string;  // First 100 chars of extracted data
}
```

**Behavior:**
- Default mode: "All" (pass-through)
- Mode selector shows all available modes
- Mode-specific inputs appear based on selection:
  - **Regex**: Pattern, Flags, ParseAs selector
  - **JSONPath**: Query input, ParseAs selector
  - **CSV Column**: Column index/name input
  - **XPath**: Query input, ParseAs selector
- Live preview: Run extraction against previous step's output, show match count or preview
- Debounced input (500ms) to avoid excessive re-execution

**Initial Implementation (Phase 3):**
- Ship with "All" and "Regex" modes only
- Other modes added in Phase 6

#### StatsBar (New Component)
**Location:** `features/apogee/ui/StatsBar.tsx`

**Props:**
```typescript
interface StatsBarProps {
  stats: TransformStat[];
}
```

**Rendering:**
```tsx
<div className="flex gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border-t">
  {stats.map(stat => (
    <StatPill
      key={stat.label}
      label={stat.label}
      value={stat.value}
      alert={stat.alert}
    />
  ))}
</div>
```

**StatPill Variants:**
- **info**: Blue background, informational (✓ Valid)
- **warning**: Yellow background, caution (⚠️ Weak)
- **error**: Red background, critical (✗ Failed)
- **default**: Zinc background, neutral stats

#### TransformPalette
**Location:** `features/apogee/ui/TransformPalette.tsx`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [Convert ▼] [Encode ▼] [Decode ▼] [Hash ▼] │ ← Category buttons
│                                             │
│ Convert:                                    │
│ [JSON] [CSV] [YAML] [TOML] [XML]           │ ← Expanded category
│                                             │
│ ──────────────────────────────────────────  │
│ [Download] [PDF] [Clipboard]               │ ← Export row (if steps > 0)
└─────────────────────────────────────────────┘
```

**Behavior:**
- Categories collapsed by default
- Click category button to expand/collapse
- Transform tiles apply with default properties (editable inline after)
- Export buttons only visible when pipeline has transforms

## 4. Execution Engine Logic
**Location:** `features/apogee/lib/engine.ts`

The Apogee execution engine implements a two-phase execution model: **Lens (Parse) → Transform**. This separation allows users to precisely extract and interpret data before applying transformations.

### 4.1 Pipeline Architecture

The core execution flow:

```typescript
export class ApogeeEngine {
  /**
   * Execute complete pipeline from start to finish
   */
  static async executePipeline(document: Document): Promise<string> {
    let currentData = document.inputData;

    for (const step of document.transforms) {
      const transform = TRANSFORM_REGISTRY[step.transformType];

      if (!transform) {
        // Graceful degradation for missing transforms
        step.output = `[Transform "${step.transformType}" no longer available]`;
        continue;
      }

      // PHASE 1: Lens Pass
      const lensResult = await this.executeLensPass(currentData, step.inputSelection);

      if (!lensResult.success) {
        // Lens extraction failed - halt this step
        step.output = lensResult.error || "[Lens extraction failed]";
        currentData = step.output;
        continue;
      }

      // PHASE 2: Transform Pass
      const transformResult = transform.execute(lensResult.data, step.properties);

      if (!transformResult.success) {
        // Transform failed - store error but continue pipeline
        step.output = transformResult.error || "[Transform failed]";
        currentData = step.output;
        continue;
      }

      // Success - cache output and continue
      step.output = transformResult.data;
      currentData = transformResult.data;
    }

    return currentData; // Final pipeline output
  }

  /**
   * Incremental execution: only re-run from modified step onwards
   */
  static async executeFromStep(
    document: Document,
    fromStepIndex: number
  ): Promise<void> {
    // Get starting data: either document input or previous step's output
    let currentData = fromStepIndex === 0
      ? document.inputData
      : document.transforms[fromStepIndex - 1].output;

    // Re-execute from modified step to end of pipeline
    for (let i = fromStepIndex; i < document.transforms.length; i++) {
      const step = document.transforms[i];
      const transform = TRANSFORM_REGISTRY[step.transformType];

      if (!transform) {
        step.output = `[Transform "${step.transformType}" no longer available]`;
        currentData = step.output;
        continue;
      }

      const lensResult = await this.executeLensPass(currentData, step.inputSelection);
      if (!lensResult.success) {
        step.output = lensResult.error || "[Lens extraction failed]";
        currentData = step.output;
        continue;
      }

      const transformResult = transform.execute(lensResult.data, step.properties);
      step.output = transformResult.success ? transformResult.data : transformResult.error || "";
      currentData = step.output;
    }
  }
}
```

### 4.2 Lens Pass: Data Selection and Parsing
**Location:** `features/apogee/lib/lens.ts` (lens execution logic)

The Lens Pass extracts and parses data before transformation. This allows precise targeting of specific data within the previous output.

```typescript
interface LensResult {
  success: boolean;
  data: string;          // Extracted/parsed data
  error?: string;
  metadata?: {
    mode: string;
    matchCount?: number;  // For regex mode
    extractedPath?: string; // For jsonpath/xpath modes
  };
}

static async executeLensPass(
  input: string,
  selection: TransformStep['inputSelection']
): Promise<LensResult> {
  const { mode, parseAs } = selection;

  // Step 1: Extract data based on mode
  let extracted: string;

  switch (mode) {
    case "all":
      // Pass through entire input unchanged
      extracted = input;
      break;

    case "regex":
      // Extract using regular expression
      if (!selection.regexPattern) {
        return {
          success: false,
          data: "",
          error: "Regex mode requires a pattern"
        };
      }

      try {
        const regex = new RegExp(
          selection.regexPattern,
          selection.regexFlags || ""
        );
        const matches = input.match(regex);

        if (!matches || matches.length === 0) {
          return {
            success: false,
            data: "",
            error: `Pattern not found: ${selection.regexPattern}`,
            metadata: { mode: "regex", matchCount: 0 }
          };
        }

        // Use first match or join all matches
        extracted = matches.join("\n");

        return {
          success: true,
          data: extracted,
          metadata: { mode: "regex", matchCount: matches.length }
        };
      } catch (err) {
        return {
          success: false,
          data: "",
          error: `Invalid regex: ${err.message}`
        };
      }

    case "jsonpath":
      // Extract using JSONPath query
      if (!selection.jsonPath) {
        return { success: false, data: "", error: "JSONPath mode requires a query" };
      }

      try {
        const parsed = JSON.parse(input);
        const result = jsonpath.query(parsed, selection.jsonPath);

        if (result.length === 0) {
          return {
            success: false,
            data: "",
            error: `No matches for path: ${selection.jsonPath}`
          };
        }

        extracted = JSON.stringify(result, null, 2);
        return {
          success: true,
          data: extracted,
          metadata: { mode: "jsonpath", extractedPath: selection.jsonPath }
        };
      } catch (err) {
        return {
          success: false,
          data: "",
          error: `JSONPath error: ${err.message}`
        };
      }

    case "csv-column":
      // Extract specific CSV column(s)
      if (selection.csvColumn === undefined) {
        return { success: false, data: "", error: "CSV mode requires column index/name" };
      }

      try {
        const rows = input.split("\n").map(line => line.split(","));
        const columnIndex = typeof selection.csvColumn === "number"
          ? selection.csvColumn
          : rows[0].indexOf(selection.csvColumn);

        if (columnIndex === -1) {
          return {
            success: false,
            data: "",
            error: `Column not found: ${selection.csvColumn}`
          };
        }

        const columnData = rows.map(row => row[columnIndex]).join("\n");
        extracted = columnData;
        break;
      } catch (err) {
        return { success: false, data: "", error: `CSV parse error: ${err.message}` };
      }

    case "xml-xpath":
      // Extract using XPath query
      if (!selection.xpathQuery) {
        return { success: false, data: "", error: "XPath mode requires a query" };
      }

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, "text/xml");
        const result = doc.evaluate(
          selection.xpathQuery,
          doc,
          null,
          XPathResult.STRING_TYPE,
          null
        );

        extracted = result.stringValue;

        if (!extracted) {
          return {
            success: false,
            data: "",
            error: `No matches for XPath: ${selection.xpathQuery}`
          };
        }
        break;
      } catch (err) {
        return { success: false, data: "", error: `XPath error: ${err.message}` };
      }

    default:
      return { success: false, data: "", error: `Unknown lens mode: ${mode}` };
  }

  // Step 2: Parse extracted data (if parseAs hint provided)
  // This is critical for Convert transforms
  if (parseAs && parseAs !== "auto" && parseAs !== "text") {
    try {
      const parsed = this.parseData(extracted, parseAs);
      return {
        success: true,
        data: parsed,
        metadata: { mode, parseAs }
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Parse error (${parseAs}): ${err.message}`
      };
    }
  }

  return { success: true, data: extracted, metadata: { mode } };
}

/**
 * Parse data according to format hint
 * Used when parseAs is specified in lens configuration
 */
static parseData(data: string, format: string): string {
  switch (format) {
    case "json":
      // Validate and normalize JSON
      return JSON.stringify(JSON.parse(data), null, 2);

    case "csv":
      // Normalize CSV (validate structure)
      const rows = data.split("\n").map(line => line.split(","));
      return rows.map(row => row.join(",")).join("\n");

    case "yaml":
      // Parse YAML to ensure validity
      const yamlObj = yaml.parse(data);
      return yaml.stringify(yamlObj);

    case "xml":
      // Parse and validate XML
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/xml");
      if (doc.querySelector("parsererror")) {
        throw new Error("Invalid XML");
      }
      return data;

    case "toml":
      // Parse TOML to ensure validity
      const tomlObj = toml.parse(data);
      return toml.stringify(tomlObj);

    default:
      return data;
  }
}
```

### 4.3 Transform Pass: Execute and Return Structured Result

After the Lens Pass extracts and parses data, the Transform Pass applies the actual transformation. Transforms return `TransformResult` with metadata, not raw strings.

```typescript
execute: (input: string, properties: Record<string, unknown>) => TransformResult
```

**Example: JSON Convert Transform**

```typescript
{
  type: "json-convert",
  name: "JSON",
  category: "convert",
  acceptsInput: ["text", "json", "csv", "yaml", "xml"],
  producesOutput: "json",

  execute: (input: string, properties: Record<string, unknown>): TransformResult => {
    const { indentation = 2, sortKeys = false, minify = false } = properties;

    try {
      // Parse input (could be JSON, CSV, YAML, etc. - lens handles this)
      let data: unknown;

      // Auto-detect format or trust lens parseAs hint
      try {
        data = JSON.parse(input);
      } catch {
        // Try parsing as CSV to JSON
        data = parseCSVToJSON(input);
      }

      // Convert to JSON with formatting options
      const output = minify
        ? JSON.stringify(data)
        : JSON.stringify(
            sortKeys ? sortObjectKeys(data) : data,
            null,
            indentation
          );

      // Compute stats inline - they're part of the result
      const stats: TransformStat[] = [
        { label: "Valid JSON", value: true, alert: "info" },
        { label: "Keys", value: countKeys(data) },
        { label: "Depth", value: getDepth(data) },
        { label: "Size", value: `${(output.length / 1024).toFixed(2)} KB` }
      ];

      return {
        success: true,
        data: output,
        mimeType: "application/json",
        stats
      };
    } catch (err) {
      return {
        success: false,
        data: "",
        error: `Failed to convert to JSON: ${err.message}`,
        mimeType: "text/plain",
        stats: [
          { label: "Status", value: "Invalid", alert: "error" }
        ]
      };
    }
  }
}
```

### 4.4 Output Type Tracking and Transform Filtering

The engine tracks output types to filter compatible transforms.

```typescript
/**
 * Get current output type at any point in pipeline
 * Used to filter available transforms in UI
 */
static getCurrentOutputType(document: Document): string {
  if (document.transforms.length === 0) {
    return document.inputType;
  }

  const lastTransform = TRANSFORM_REGISTRY[
    document.transforms[document.transforms.length - 1].transformType
  ];

  if (!lastTransform) {
    return "text"; // Fallback for missing transforms
  }

  return lastTransform.producesOutput;
}

/**
 * Filter transforms that accept current output type
 * Prevents invalid transform chains
 */
static getAvailableTransforms(currentOutputType: string): TransformDefinition[] {
  return Object.values(TRANSFORM_REGISTRY).filter(transform =>
    transform.acceptsInput.includes(currentOutputType)
  );
}

/**
 * Check if export is compatible with current output
 */
static getAvailableExports(currentOutputType: string): ExportDefinition[] {
  return Object.values(EXPORT_REGISTRY).filter(exp =>
    exp.acceptsInput.includes(currentOutputType)
  );
}
```

### 4.5 Error Handling and Graceful Degradation

The engine implements resilient error handling:

**Scenario 1: Lens extraction fails**
```typescript
// Step continues but shows error in output
step.output = "[Pattern not found: (?<=Data: ).*]";
// Pipeline continues to next step with error text
```

**Scenario 2: Transform fails**
```typescript
// TransformResult with success=false
{
  success: false,
  data: "",
  error: "Expected valid JSON, received: Hello World",
  stats: [{ label: "Status", value: "Invalid", alert: "error" }]
}
// Pipeline continues, UI shows error state
```

**Scenario 3: Transform no longer exists**
```typescript
// Missing from registry (user deleted custom transform)
step.output = "[Transform \"custom-parser\" no longer available]";
// Pipeline continues, preserves document integrity
```

### 4.6 Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   APOGEE PIPELINE EXECUTION                  │
└─────────────────────────────────────────────────────────────┘

Document Input: "Log: {\"user\":\"alice\"}\nMore logs..."
│
│
▼
┌──────────────────────────────────────────────────┐
│ STEP 1: JSON Convert                            │
├──────────────────────────────────────────────────┤
│ LENS PASS                                        │
│  - Mode: regex                                   │
│  - Pattern: (?<={).*(?=})                       │
│  - Extracted: "\"user\":\"alice\""              │
│  - ParseAs: json                                 │
│  - Result: {"user":"alice"}                      │
├──────────────────────────────────────────────────┤
│ TRANSFORM PASS                                   │
│  - Input: {"user":"alice"}                       │
│  - Execute: json-convert                         │
│  - Properties: { indentation: 2, sortKeys: true }│
│  - Output: {                                     │
│      "user": "alice"                             │
│    }                                             │
│  - MIME: application/json                        │
│  - Stats: [Valid: ✓, Keys: 1, Depth: 1]        │
└──────────────────────────────────────────────────┘
│
│ currentData = step.output
│
▼
┌──────────────────────────────────────────────────┐
│ STEP 2: Base64 Encode                           │
├──────────────────────────────────────────────────┤
│ LENS PASS                                        │
│  - Mode: all                                     │
│  - Extracted: (entire previous output)           │
│  - ParseAs: auto                                 │
├──────────────────────────────────────────────────┤
│ TRANSFORM PASS                                   │
│  - Input: {\n  "user": "alice"\n}               │
│  - Execute: base64-encode                        │
│  - Properties: { urlSafe: false, padding: true } │
│  - Output: ewogICJ1c2VyIjogImFsaWNlIgp9         │
│  - MIME: text/plain                              │
│  - Stats: [Size: 28 bytes, Expansion: 133%]    │
└──────────────────────────────────────────────────┘
│
│ currentData = step.output
│
▼
Final Output: "ewogICJ1c2VyIjogImFsaWNlIgp9"
```

### 4.7 Performance Optimizations

**Incremental Execution:**
- User changes Step 3 options
- Engine calls `executeFromStep(document, 2)`
- Steps 0-1: Use cached `step.output` (no re-execution)
- Steps 2-N: Re-execute with new configurations

**Web Workers for Heavy Transforms**:
```typescript
static async executeStep(
  input: string,
  step: TransformStep
): Promise<TransformResult> {
  const transform = TRANSFORM_REGISTRY[step.transformType];

  // Offload expensive operations (compression, large JSON)
  if (transform.useWebWorker && input.length > 100_000) {
    return await executeInWorker(transform.type, input, step.properties);
  }

  // Execute in main thread for fast operations
  return transform.execute(input, step.properties);
}
```

**Debounced Property Updates**:
- User types in text input (e.g., regex pattern)
- UI updates local state immediately (no cursor jump)
- After 500ms idle, trigger `executeFromStep()`
- Prevents excessive re-execution during typing


## 5. Transform Catalog

The Apogee registry organizes transforms by purpose, with each transform exposing configurable options and returning structured statistics.

### 5.1 Convert
**Focus:** Parsing structured data and re-serializing it between formats.
**Entity Locations:** `entities/json/`, `entities/csv/`, `entities/xml/`, `entities/yaml/`, `entities/toml/` (format entities)
**Transform Locations:** `entities/transform/json-convert/`, `entities/transform/csv-convert/`, etc.

**Lens Support:** Convert transforms are the primary use case for the Input Lens. Users can extract structured data from unstructured input (e.g., regex to extract JSON from logs) before conversion.

#### JSON **[Exists - Requires Augmentation]**
**Entity:** `entities/json/` | **Transform:** `entities/transform/json-convert/`
- **Options:**
  - Indentation: `2 | 4 | Tab`
  - Sort Keys: `True | False`
  - Minify: `True | False`
- **Stats:**
  - Valid JSON: `Boolean`
  - Key Count: `Number`
  - Depth: `Number`
- **MIME Type:** `application/json`

#### CSV **[Exists - Requires Augmentation]**
**Entity:** `entities/csv/` | **Transform:** `entities/transform/csv-convert/`
- **Options:**
  - Delimiter: `Comma | Tab | Semicolon | Pipe`
  - Has Headers: `True | False`
  - Quote Char: `" | '`
- **Stats:**
  - Row Count: `Number`
  - Column Count: `Number`
- **MIME Type:** `text/csv`

#### YAML **[Planned]**
**Entity:** `entities/yaml/` | **Transform:** `entities/transform/yaml-convert/`
- **Options:**
  - Indentation: `2 | 4`
  - Version: `1.1 | 1.2`
- **Stats:**
  - Document Count: `Number`
  - Valid YAML: `Boolean`
- **MIME Type:** `application/x-yaml`

#### TOML **[Planned]**
**Entity:** `entities/toml/` | **Transform:** `entities/transform/toml-convert/`
- **Options:**
  - Formatting: `Compact | Expanded`
- **Stats:**
  - Valid TOML: `Boolean`
  - Table Count: `Number`
- **MIME Type:** `application/toml`

#### XML **[Planned]**
**Entity:** `entities/xml/` | **Transform:** `entities/transform/xml-convert/`
- **Options:**
  - Indentation: `2 | 4 | Tab`
  - Root Element Name: `String` (when converting to XML)
  - Attributes vs Elements: `Prefer Attributes | Prefer Elements`
- **Stats:**
  - Valid XML: `Boolean`
  - Node Count: `Number`
  - Namespace Count: `Number`
- **MIME Type:** `application/xml`

#### Protobuf **[Future]**
- **Options:**
  - Schema Definition: `File Upload | Paste`
  - Output Format: `JSON Representation | Hex`
- **Stats:**
  - Field Count: `Number`
  - Message Type: `String`
- **MIME Type:** `application/protobuf`

### 5.2 Encode
**Focus:** Representing binary or text data in safe transport formats.
**Entity Location:** `entities/transform/text-encoding/` **[Exists - Requires Augmentation]** (single entity for all encodings)

**Line-by-Line Support:** All encode transforms support line-by-line mode (`supportsLineByLine: true`). When enabled, each line of input is encoded independently and joined with newlines. Useful for encoding lists of values (e.g., encode each password in a list separately).

#### Base64 / Base64URL **[Exists - Requires Augmentation]**
- **Options:**
  - URL Safe: `Toggle`
  - Padding: `Toggle`
  - Line Width: `None | 64 | 76` (split lines)
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Size: `Number (bytes)`
  - Expansion Ratio: `Number (%)` (vs original)
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Base58 **[Exists - Requires Augmentation]**
- **Options:**
  - Alphabet: `Bitcoin | Ripple | Flickr`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Size: `Number (bytes)`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Base91 **[Planned]**
- **Options:**
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Size: `Number (bytes)`
  - Compression Ratio: `Number (%)` (vs Base64)
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### ASCII85 **[Planned]**
- **Options:**
  - Format: `Adobe | btoa | RFC 1924`
  - Line Width: `None | 80`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Size: `Number (bytes)`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Z85 (ZeroMQ) **[Planned]**
- **Options:**
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Size: `Number (bytes)`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### URL Encode **[Exists - Requires Augmentation]**
- **Options:**
  - Mode: `Encode All | Special Only | RFC 3986`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Characters Encoded: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### HTML Entity **[Exists - Requires Augmentation]**
- **Options:**
  - Format: `Decimal | Hex | Named`
  - Encode: `All | Non-ASCII Only`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Entities Created: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/html`

#### Hex (Base16) **[Exists - Requires Augmentation]**
- **Options:**
  - Delimiter: `None | Space | Colon | 0x Prefix`
  - Case: `Upper | Lower`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Size: `Number (bytes)`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Quoted-Printable **[Planned]**
- **Options:**
  - Binary Mode: `Toggle`
  - Line Width: `76 | Custom`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Encoded Characters: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### ROT13 **[Planned]**
- **Options:**
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Characters Rotated: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Morse Code **[Planned]**
- **Options:**
  - Dot Character: `String` (default: `.`)
  - Dash Character: `String` (default: `-`)
  - Separator: `Space | / | Custom`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Character Count: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

### 5.3 Decode
**Focus:** Reverting encodings and inspecting payloads.
**Entity Location:** `entities/transform/text-encoding/` **[Exists - Requires Augmentation]** (single entity for all decodings, reusing encoding entity)

**Line-by-Line Support:** All decode transforms support line-by-line mode (`supportsLineByLine: true`). When enabled, each line of input is decoded independently and joined with newlines.

#### JWT (JSON Web Token) **[Exists - Requires Augmentation]**
- **Options:**
  - Secret/Public Key: `String` (optional, for signature verification)
  - Algorithm Override: `Auto | HS256 | RS256 | ES256`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Algorithm: `String` (from header)
  - Type: `String` (from header)
  - Issuer: `String` (from payload)
  - Subject: `String` (from payload)
  - Issued At: `Date`
  - Expiration: `Date`
  - Not Before: `Date`
  - Status: `Valid | Expired | Not Yet Valid | Invalid Signature` (alert level)
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `application/json`

#### Base64 / Base58 / Hex Decoders **[Exists - Requires Augmentation]**
- **Options:**
  - Ignore Non-Alphabet Chars: `Strict | Lenient`
  - Detect Encoding: `Auto | Force [Type]`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Decoded Size: `Number (bytes)`
  - Detected Encoding: `String` (with confidence %)
  - Invalid Characters Skipped: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain` (or detected)

#### Unicode **[Planned]**
- **Options:**
  - Output Format: `Code Point (U+XXXX) | CSS (\XXXX) | HTML (&#x) | JavaScript (\u)`
  - Encode: `All | Non-ASCII Only`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Code Points: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

### 5.4 Hash
**Focus:** Generating cryptographic signatures and checksums.
**Entity Location:** `entities/transform/text-hash/` **[Exists - Requires Augmentation]** (single entity for all hash algorithms)

**Line-by-Line Support:** All hash transforms support line-by-line mode (`supportsLineByLine: true`). When enabled, each line of input is hashed independently and output as separate hashes joined with newlines. Useful for hashing lists of passwords or values individually.

#### MD5 **[Exists - Requires Augmentation]**
- **Options:**
  - Output Encoding: `Hex | Base64`
  - HMAC Key: `String` (optional, enables HMAC-MD5)
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Bit Length: `128`
  - Collision Resistance: `⚠️ Weak (deprecated for security)` (alert: warning)
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`
- **Example:** Hash each password in a list → `password1\npassword2` → `5f4dcc3b...\n6cb75f...`

#### SHA-1 **[Exists - Requires Augmentation]**
- **Options:**
  - Output Encoding: `Hex | Base64`
  - HMAC Key: `String` (optional)
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Bit Length: `160`
  - Collision Resistance: `⚠️ Weak (use SHA-256+)` (alert: warning)
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### SHA-256 / SHA-384 / SHA-512 **[Exists - Requires Augmentation]**
- **Options:**
  - Output Encoding: `Hex | Base64`
  - HMAC Key: `String` (optional)
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Bit Length: `256 | 384 | 512`
  - Collision Resistance: `✓ Strong` (alert: info)
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### SHA-3 (256/384/512) **[Planned]**
- **Options:**
  - Variant: `SHA3-256 | SHA3-384 | SHA3-512`
  - Output Encoding: `Hex | Base64`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Bit Length: `256 | 384 | 512`
  - Algorithm: `Keccak (SHA-3)`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### BLAKE3 **[Planned]**
- **Options:**
  - Output Encoding: `Hex | Base64`
  - Output Length: `Custom (bytes)` (default: 32)
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Bit Length: `Configurable`
  - Performance: `✓ Fast & Secure`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Murmur3 (Non-Cryptographic) **[Planned]**
- **Options:**
  - Variant: `32-bit | 128-bit`
  - Seed: `Number` (default: 0)
  - Output Encoding: `Hex | Decimal`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Output Bit Length: `32 | 128`
  - Use Case: `Checksums, Hash Tables (not security)`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

### 5.5 Manipulate
**Focus:** String-level text operations and cleanup.
**Entity Locations:** `entities/transform/text-sanitize/` **[Exists]**, `entities/transform/text-case/` **[Exists]**, `entities/regex/` **[Planned]**

**Line-by-Line Support:** All manipulate transforms support line-by-line mode (`supportsLineByLine: true`). When enabled, the transformation is applied to each line independently.

#### Sanitize **[Exists - Requires Augmentation]**
- **Options:**
  - Trim Whitespace: `None | Start | End | Both`
  - Remove Empty Lines: `Toggle`
  - Remove Duplicate Lines: `Toggle`
  - Normalize Line Endings: `LF (\n) | CRLF (\r\n) | CR (\r)`
  - Remove Non-Printable: `Toggle`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Lines Removed: `Number`
  - Characters Removed: `Number`
  - Output Line Count: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Change Case **[Exists - Requires Augmentation]**
- **Options:**
  - Target Case: `camelCase | PascalCase | snake_case | kebab-case | CONSTANT_CASE | Train-Case | Title Case | lower | UPPER`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Transformations Applied: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`
- **Example:** Convert list of variable names → `user_name\norder_id` → `userName\norderId`

#### Regex Replace **[Planned]**
- **Options:**
  - Pattern: `String (Regex)`
  - Replacement: `String` (supports capture groups: `$1`, `$2`)
  - Flags: `Global | Case Insensitive | Multiline | Dotall`
  - Line-by-Line Mode: `Toggle`
- **Stats:**
  - Match Count: `Number`
  - Replacement Count: `Number`
  - Lines Processed: `Number` (when line-by-line enabled)
- **MIME Type:** `text/plain`

#### Sort Lines **[Planned]**
- **Options:**
  - Order: `Ascending | Descending`
  - Type: `Alphabetical | Numerical | Length`
  - Case Sensitive: `Toggle`
- **Stats:**
  - Lines Sorted: `Number`
- **MIME Type:** `text/plain`

#### Extract Lines **[Planned]**
- **Options:**
  - Mode: `Contains | Starts With | Ends With | Regex Match`
  - Pattern: `String`
  - Invert Match: `Toggle` (keep non-matching lines)
- **Stats:**
  - Lines Matched: `Number`
  - Lines Extracted: `Number`
- **MIME Type:** `text/plain`

### 5.6 Compress
**Focus:** Size reduction via compression algorithms.
**Entity Location:** `entities/transform/compression/` **[Planned]** (single entity for compress/decompress algorithms)

**Note:** Output rendered as Base64/Hex for text display, or binary download. Line-by-line mode not supported as compression requires full context.

#### Gzip **[Planned]**
- **Options:**
  - Compression Level: `1 (Fast) | 5 (Default) | 9 (Best)`
  - Output Encoding: `Base64 | Hex | Binary Download`
- **Stats:**
  - Original Size: `Number (bytes)`
  - Compressed Size: `Number (bytes)`
  - Savings: `Number (%)` (alert: info if > 50%)
- **MIME Type:** `application/gzip`

#### Bzip2 **[Planned]**
- **Options:**
  - Compression Level: `1-9`
  - Output Encoding: `Base64 | Hex | Binary Download`
- **Stats:**
  - Original Size: `Number (bytes)`
  - Compressed Size: `Number (bytes)`
  - Savings: `Number (%)`
- **MIME Type:** `application/x-bzip2`

#### Brotli **[Planned]**
- **Options:**
  - Quality Level: `0-11` (default: 11)
  - Mode: `Generic | Text | Font`
  - Output Encoding: `Base64 | Hex | Binary Download`
- **Stats:**
  - Original Size: `Number (bytes)`
  - Compressed Size: `Number (bytes)`
  - Savings: `Number (%)`
- **MIME Type:** `application/brotli`

#### Zstd **[Planned]**
- **Options:**
  - Compression Level: `1-22` (default: 3)
  - Output Encoding: `Base64 | Hex | Binary Download`
- **Stats:**
  - Original Size: `Number (bytes)`
  - Compressed Size: `Number (bytes)`
  - Savings: `Number (%)`
  - Compression Ratio: `Number:1`
- **MIME Type:** `application/zstd`

#### LZMA2 / 7zip **[Future]**
- **Options:**
  - Compression Level: `0-9`
  - Dictionary Size: `Auto | 16MB | 32MB | 64MB`
  - Output Encoding: `Base64 | Hex | Binary Download`
- **Stats:**
  - Original Size: `Number (bytes)`
  - Compressed Size: `Number (bytes)`
  - Savings: `Number (%)`
- **MIME Type:** `application/x-7z-compressed`

#### XZ **[Future]**
- **Options:**
  - Compression Level: `0-9`
  - Check Type: `CRC64 | SHA-256 | None`
  - Output Encoding: `Base64 | Hex | Binary Download`
- **Stats:**
  - Original Size: `Number (bytes)`
  - Compressed Size: `Number (bytes)`
  - Savings: `Number (%)`
- **MIME Type:** `application/x-xz`

### 5.7 Decompress
**Focus:** Restoring compressed data to original form.
**Entity Location:** `entities/transform/compression/` **[Planned]** (same entity as Compress)

**Note:** Line-by-line mode not supported as decompression requires full context.

#### Gzip / Bzip2 / Brotli / Zstd **[Planned]**
- **Options:**
  - Input Encoding: `Auto-Detect | Base64 | Hex | Binary`
- **Stats:**
  - Decompressed Size: `Number (bytes)`
  - Detected Format: `String` (e.g., "Gzip")
  - Compression Ratio: `Number:1` (original compression)
- **MIME Type:** `text/plain` (or detected from content)

#### LZMA2 / XZ **[Future]**
- **Options:**
  - Input Encoding: `Auto-Detect | Base64 | Hex | Binary`
- **Stats:**
  - Decompressed Size: `Number (bytes)`
  - Detected Format: `String`
  - Compression Ratio: `Number:1`
- **MIME Type:** `text/plain` (or detected from content)

### 5.8 Analyze
**Focus:** Visualizing data and generating insights through charts, graphs, and validation reports.
**Entity Locations:** `entities/transform/chart-generator/` **[Future]**, `entities/transform/data-validator/` **[Future]**, `entities/transform/pattern-analyzer/` **[Future]**

**Design Philosophy:** Analyze transforms convert raw data into visual representations. They accept structured data (CSV, JSON) or text, and produce either SVG/Canvas visualizations or formatted reports.

**Note:** Extraction and querying operations (regex, JSONPath, CSV columns) are handled by the **Input Lens** feature, not transforms. Line-by-line mode not supported as analysis requires full dataset context.

#### Chart Generator **[Future]**
- **Accepts Input:** `csv`, `json`
- **Options:**
  - Chart Type: `Bar | Line | Pie | Scatter | Area`
  - X-Axis Column: `String (column name or JSON path)`
  - Y-Axis Column: `String (column name or JSON path)`
  - Title: `String` (optional)
  - Width: `Number (px)` (default: 800)
  - Height: `Number (px)` (default: 400)
  - Color Scheme: `Blue | Green | Red | Purple | Rainbow`
- **Stats:**
  - Data Points: `Number`
  - X-Axis Range: `String` (e.g., "0-100")
  - Y-Axis Range: `String`
  - Chart Type: `String`
- **Output:** SVG chart embedded in DataBlock
- **MIME Type:** `image/svg+xml`

#### Frequency Distribution **[Future]**
- **Accepts Input:** `text`, `csv`, `json`
- **Options:**
  - Unit: `Words | Characters | Lines | Values (for CSV/JSON)`
  - Top N: `Number (10-100)` (show top N most frequent)
  - Case Sensitive: `Toggle`
  - Ignore Common Words: `Toggle` (for text analysis)
  - Chart Type: `Bar | Pie | Table`
- **Stats:**
  - Unique Items: `Number`
  - Total Count: `Number`
  - Most Frequent: `String (with count)`
- **Output:** SVG histogram/bar chart + data table
- **MIME Type:** `image/svg+xml` or `text/html` (for table)

#### Time Series Plot **[Future]**
- **Accepts Input:** `csv`, `json`, `text` (log lines)
- **Options:**
  - Timestamp Column: `String (column name or extraction pattern)`
  - Timestamp Format: `ISO 8601 | Unix | Custom (strftime)`
  - Value Column: `String (column name)`
  - Aggregation: `None | Sum | Average | Count` (per time bucket)
  - Time Bucket: `Second | Minute | Hour | Day | Week | Month`
  - Line Style: `Solid | Dotted | Area Fill`
- **Stats:**
  - Date Range: `String` (e.g., "2024-01-01 to 2024-12-31")
  - Data Points: `Number`
  - Trend: `String` (e.g., "↗ Increasing", "↘ Decreasing", "→ Stable")
  - Min/Max Values: `String`
- **Output:** Interactive SVG line chart
- **MIME Type:** `image/svg+xml`

#### Data Validator **[Future]**
- **Accepts Input:** `json`, `csv`, `yaml`
- **Options:**
  - Schema: `JSON Schema | CSV Column Types | Custom Rules`
  - Schema Definition: `Textarea (JSON Schema or column specs)`
  - Stop on First Error: `Toggle`
  - Output Format: `Visual Report | JSON Error List`
- **Stats:**
  - Valid Rows: `Number` (alert: info)
  - Invalid Rows: `Number` (alert: error if > 0)
  - Error Types: `String` (e.g., "Missing required fields, Type mismatches")
  - Validation Time: `String (ms)`
- **Output:** Color-coded validation report with highlighted errors
- **MIME Type:** `text/html` (formatted report) or `application/json` (error list)

#### Pattern Heatmap **[Future]**
- **Accepts Input:** `text`, `csv`, `json`
- **Options:**
  - Pattern Type: `Character Distribution | Word Positions | Numeric Ranges | Timestamp Density`
  - Granularity: `Coarse (10x10) | Medium (20x20) | Fine (50x50)`
  - Color Map: `Viridis | Heat | Cool | Grayscale`
  - Normalize: `Toggle` (normalize to 0-1 range)
- **Stats:**
  - Grid Size: `String` (e.g., "20x20")
  - Hotspots Detected: `Number`
  - Density Range: `String` (e.g., "0-145 occurrences")
- **Output:** SVG heatmap grid
- **MIME Type:** `image/svg+xml`

### 5.9 Export Actions
**Focus:** Delivering pipeline output to the user. Exports are **not transforms**—they're actions shown in the ExportRow component below the pipeline.
**Location:** `features/apogee/lib/exports.ts` (registry), `features/apogee/ui/ExportRow.tsx` (UI component)

**Note:** Export actions are separate from transforms and appear in a dedicated UI component below the transform pipeline.

#### Text File **[Planned]**
- **Options:**
  - Filename: `String` (default: `output.txt`)
  - Extension: `Auto | .txt | .log | .md | .json | .csv | .xml`
  - Line Ending Format: `LF (Unix) | CRLF (Windows) | CR (Classic Mac)`
- **Stats:**
  - File Size: `Number (bytes)`
  - Line Count: `Number`
- **Action:** Triggers browser download

#### PDF **[Future]**
- **Options:**
  - Page Size: `A4 | Letter | Legal | Custom`
  - Font Size: `8 | 10 | 12 | 14 | 16`
  - Margin: `Small | Medium | Large` (in mm)
  - Orientation: `Portrait | Landscape`
  - Wrap Text: `Toggle`
  - Font Family: `Monospace | Sans-Serif | Serif`
- **Stats:**
  - Page Count: `Number`
  - File Size: `Number (KB)`
- **Action:** Generates PDF using jsPDF or similar, triggers download

#### Clipboard **[Planned]**
- **Options:**
  - Format: `Plain Text | HTML | Rich Text (if applicable)`
- **Stats:**
  - Characters Copied: `Number`
- **Action:** Writes to `navigator.clipboard`

## 6. UI/UX Design Principles

Apogee follows a clean, minimal aesthetic with structural enhancements for metadata display.

### 6.1 Visual Design Language
- **Color Palette:** Zinc-based theme (neutral grays)
- **Typography:** Geist Sans & Geist Mono
- **Spacing:** Consistent 6-unit padding/gaps
- **Borders:** Zinc-200 (light) / Zinc-800 (dark)

### 6.2 StatsBar Component
A new horizontal stats display that renders below the transform header:

```tsx
<StatsBar>
  <StatPill label="Valid JSON" value="✓" variant="success" />
  <StatPill label="Keys" value="42" />
  <StatPill label="Depth" value="3" />
  <StatPill label="Size" value="1.2 KB" />
</StatsBar>
```

**Design:**
- Small pills with label + value
- Color-coded variants: success (green), warning (yellow), error (red), info (blue)
- Inline with transform options, not a separate section
- Tooltips for technical details

### 6.3 Input Lens Panel
Compact UI for selecting data before transformation:

```tsx
<LensPanel>
  <ModeToggle>
    <button selected>All</button>
    <button>Regex</button>
  </ModeToggle>

  {mode === "regex" && (
    <RegexInput>
      <input placeholder="Pattern: (?<=Data: ).*" />
      <input placeholder="Flags: g" />
      <MatchPreview>3 matches</MatchPreview>
    </RegexInput>
  )}
</LensPanel>
```

**Layout:** Appears above transform options in the same card header area.

### 6.4 Transform Palette Organization
Group transforms by verb (action) in horizontal rows:

```
Transform Pipeline:

[Convert] [Encode] [Decode] [Hash] [Manipulate]
[Compress] [Decompress] [Analyze] 
```

**Clicking a verb expands a row of specific transforms:**

```
Convert ▼
  [JSON] [CSV] [YAML] [TOML] [XML]

Encode ▼
  [Base64] [Base58] [Hex] [URL] [HTML Entity] [Morse]
```

**Design:** Category-based organization with collapsible sections.

### 6.5 DataBlock Enhancements
Minimal changes to maintain familiarity:

**Existing:**
- Header with title, controls (wrap, copy, clear, remove)
- TextEditor with line numbers
- Syntax highlighting selector

**New:**
- Stats row (appears below header when stats available)
- MIME-based auto-highlighting (still user-overridable)
- Lens panel (appears in header area when enabled)

### 6.6 Error States
Inline error messages with action buttons:

```
┌─────────────────────────────────────┐
│ Step 2: JSON to CSV                 │
│ ⚠️ Expected valid JSON              │
│ [Show Input] [Edit Pattern]         │
├─────────────────────────────────────┤
│ (output area shows error context)   │
└─────────────────────────────────────┘
```

**Design:** Red border, error icon, inline error text with actionable buttons.

## 7. Transform Catalog by Verb

Organize transforms as actionable verbs visible to users:

### Transform Groups

1. **Convert** - Parse and reserialize structured data
   - JSON, CSV, YAML, TOML, XML, Protobuf

2. **Encode** - Represent data in transport formats
   - Base64, Base58, Base91, ASCII85, Z85, URL, HTML Entity, Hex, Quoted-Printable, ROT13, Morse

3. **Decode** - Inspect and revert encodings
   - JWT, Base64, Base58, Hex, Unicode, (all encoders work in reverse)

4. **Hash** - Generate cryptographic signatures
   - MD5, SHA-1, SHA-256, SHA-384, SHA-512, SHA-3, BLAKE3, Murmur3

5. **Manipulate** - Transform text content
   - Sanitize, Change Case, Regex Replace, Sort Lines, Extract Lines

6. **Compress** - Reduce size
   - Gzip, Bzip2, Brotli, Zstd, LZMA2, XZ

7. **Decompress** - Restore compressed data
   - Gzip, Bzip2, Brotli, Zstd, LZMA2, XZ

8. **Analyze** - Visualize and validate
   - Chart Generator, Frequency Distribution, Time Series Plot, Data Validator, Pattern Heatmap

### Export Actions (Not Transforms)

Exports are shown in a separate **ExportRow** component below the pipeline. They're actions on the final output, not transformation steps:

- **Text File** - Download as .txt/.json/.csv/etc
- **PDF** - Generate and download PDF
- **Clipboard** - Copy to clipboard

### Why Separate Compress/Decompress?

**User Mental Model:**
- "I want to compress this" → Click **Compress** → Pick algorithm
- "I have compressed data" → Click **Decompress** → Pick format

**Implementation:**
- Still share underlying code (e.g., both use zlib)
- Different `TransformDefinition` entries with opposing logic
- Different default options (encode vs decode)

## 8. Advanced Features

### 8.1 Minimizable Transform Blocks
For long pipelines (5+ steps):

**Behavior:**
- Click header to collapse/expand
- Collapsed view shows: `Step N: Transform Name [Stats Pills] ▼`
- Expanded view shows full DataBlock + options
- Default: All expanded (user can minimize as needed)

### 8.2 Keyboard Shortcuts
Essential navigation for power users:

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + E` | Export current output |
| `Cmd/Ctrl + Backspace` | Delete focused step |
| `Cmd/Ctrl + ↑/↓` | Navigate between steps |
| `Cmd/Ctrl + Enter` | Add transform (opens palette) |

### 8.3 Transform Metadata
Hover tooltips in palette showing:

```
Base64 Encode
─────────────────────────────
Converts binary or text to Base64
ASCII representation.

Input:  text
Output: text

Use: API tokens, embedded images
```

### 8.4 MIME-Based Syntax Highlighting
Auto-select highlighter from transform output type:

| Output Type | Highlighter |
|-------------|-------------|
| JSON | JSON syntax |
| CSV | CSV (row coloring) |
| XML | XML syntax |
| YAML | YAML syntax |
| text | Plain text |

**User Override:** Dropdown still available for manual selection.

## 9. Performance Optimizations

### 9.1 Incremental Execution
Only re-run steps downstream of changes:

**Example:**
- User modifies Step 3 options
- Engine re-runs Steps 3, 4, 5
- Steps 1-2 use cached outputs

**Implementation:**
```typescript
static async executeFromStep(
  document: Document,
  fromStepIndex: number
): Promise<void> {
  let currentData = fromStepIndex === 0
    ? document.inputData
    : document.transforms[fromStepIndex - 1].output;

  for (let i = fromStepIndex; i < document.transforms.length; i++) {
    const step = document.transforms[i];
    const result = await this.executeStep(currentData, step);
    step.output = result.data;
    currentData = result.data;
  }
}
```

### 9.2 Web Workers for Heavy Transforms
Offload expensive operations (compression, large JSON parsing):

```typescript
// Worker thread
self.addEventListener("message", async (e) => {
  const { transformId, input, options } = e.data;
  const result = await executeTransform(transformId, input, options);
  self.postMessage(result);
});
```

**Benefit:** UI stays responsive during 2+ second operations.

### 9.3 Virtual Scrolling for Large Outputs
Use `react-window` for outputs > 10,000 lines:
- Render only visible rows + buffer
- Maintain syntax highlighting performance
- Smooth scrolling experience
