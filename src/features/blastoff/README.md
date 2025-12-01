# Blastoff

A linear transform pipeline feature for text and data transformations. Blastoff allows users to chain multiple transformations together in sequence, creating reusable workflows for common data processing tasks.

## Overview

Blastoff enables users to:

1. Start with text input (or load existing documents)
2. Apply a sequence of transforms in order (sanitize → convert → analyze)
3. Export the final result (smart download or clipboard)
4. Save documents locally for reuse

**Key Design Principle:** Single linear pipeline only - one input flows through transforms in sequence to produce one output. No branching, no fan-out/fan-in.

## Integration in App

### Routes

- [`/blastoff`](../../../app/blastoff/page.tsx) - New document creation page (shows input form and document list)
- [`/blastoff/[id]`](../../../app/blastoff/[id]/page.tsx) - Document editor page (shows full pipeline)

### Navigation

Users can access Blastoff from the main tools page. Once in Blastoff:

- The document list (sidebar) persists across document views
- Users can switch between documents by clicking in the list
- Creating transforms from the input page automatically creates a new document and navigates to it

### Storage

Documents are persisted in browser localStorage with the prefix `blastoff-doc-`. No backend required.

## Use Cases

### 1. CSV Data Cleanup

**Scenario:** Clean messy CSV export from legacy system

**Workflow:**
1. Input: Paste CSV with extra spaces, inconsistent casing
2. Transform: Sanitize Text (trim lines, remove empty lines)
3. Transform: CSV to JSON (parse with delimiter detection)
4. Transform: Format JSON (pretty print, sort keys)
5. Export: Download as clean JSON

### 2. Log File Analysis

**Scenario:** Extract structured data from error logs

**Workflow:**
1. Input: Upload log file (1000 lines)
2. Transform: Regex Extract with pattern `(?<timestamp>.*) ERROR (?<message>.*)`
3. Transform: CSV to JSON (parse extracted data)
4. Export: Download CSV for spreadsheet analysis

### 3. JWT Token Inspection

**Scenario:** Debug API authentication

**Workflow:**
1. Input: Paste JWT token from API response
2. Transform: JWT Verify (decode and validate)
3. Transform: Format JSON (indent: 2)
4. Export: Copy to clipboard or download

### 4. Text Encoding Pipeline

**Scenario:** Encode data for transmission

**Workflow:**
1. Input: Plain text API payload
2. Transform: Encode (Base64)
3. Transform: Text Statistics (verify size)
4. Export: Copy encoded result

## Engine Architecture

### Core Model

The data model is simple and linear:

```typescript
interface Document {
  id: string;
  name: string;
  inputType: "text" | "csv" | "json" | "file";
  inputData: string;
  transforms: TransformStep[];
  createdAt: number;
  updatedAt: number;
}

interface TransformStep {
  id: string;
  documentId: string;
  order: number;                              // Sequential: 0, 1, 2...
  transformType: TransformType;
  properties: Record<string, unknown>;        // Transform-specific config
  output: string;                             // Cached output
  createdAt: number;
}
```

**Key Characteristics:**

- Each document has exactly one input
- Transforms are strictly ordered by their `order` field
- Each transform stores its output for fast replay
- No explicit connections needed - step N → step N+1 is implicit

### Pipeline Engine

The [PipelineEngine](lib/engine.ts) handles execution:

```typescript
class PipelineEngine {
  // Execute entire pipeline from input to final output
  static async executePipeline(document: Document): Promise<string>

  // Execute a single transform step
  static async executeStep(
    input: string,
    transformType: TransformType,
    properties: Record<string, unknown>
  ): Promise<string>

  // Get the current output type (used for filtering available transforms)
  static getCurrentOutputType(document: Document): string

  // Get transforms compatible with current output
  static getAvailableTransforms(currentOutputType: string): TransformDefinition[]

  // Get exports compatible with current output
  static getAvailableExports(currentOutputType: string): ExportDefinition[]
}
```

**Execution Flow:**

1. Start with `document.inputData`
2. For each transform step in order:
   - Get transform definition from registry
   - Execute `transform.execute(currentData, step.properties)`
   - Store result in `step.output`
   - Use result as input for next step
3. Return final output

**Type Safety:** The engine validates that each transform accepts the previous step's output type:

- Input block produces `document.inputType` (text, csv, json, file)
- Each transform declares `acceptsInput: string[]` and `producesOutput: string`
- Only compatible transforms appear in the palette

### Transform Registry

All transforms are defined in [registry.ts](lib/registry.ts). Each transform is a pure function:

```typescript
interface TransformDefinition {
  type: TransformType;
  name: string;                    // Display name
  description: string;             // Help text
  category: "text" | "data" | "analysis" | "encoding";

  // Type compatibility
  acceptsInput: string[];          // e.g., ["text", "csv"]
  producesOutput: string;          // e.g., "json"

  // Configuration
  defaultProperties: Record<string, unknown>;
  propertySchema: PropertySchema[];

  // Execution
  execute: (input: string, properties: Record<string, unknown>) => string;

  // Optional: compute stats shown in transform block
  getStats?: (output: string, input: string, properties: Record<string, unknown>)
    => Record<string, string | number | boolean> | null;

  // Optional: hide syntax selector if transform has fixed output format
  hideSyntaxSelector?: boolean;
}
```

**Available Transforms:**

#### Text Operations
- **Sanitize Text** - Remove empty lines, trim, normalize whitespace, sort, etc.
- **Convert Case** - Transform to camelCase, snake_case, kebab-case, etc.
- **Text Statistics** - Count characters, words, lines, GPT-4 tokens
- **Regex Replace** - Find and replace using regular expressions

#### Data Conversion
- **CSV to JSON** - Parse CSV with configurable delimiter and header detection
- **JSON to CSV** - Convert JSON arrays to CSV format
- **Format JSON** - Pretty print, minify, sort keys

#### Analysis
- **Regex Extract** - Extract matches to CSV (supports named capture groups)
- **JWT Verify** - Decode JWT token and validate claims

#### Encoding
- **Encode** - Encode text (Base64, Base58, URL, Hex, Binary, Morse, etc.)
- **Decode** - Decode from various formats

Each transform delegates to entity-layer functions imported from `@/entities/transform`, ensuring consistency with standalone tools.

### Property Schemas

Transforms expose configurable properties through schemas:

```typescript
interface PropertySchema {
  key: string;
  type: PropertyType;  // "text" | "select" | "boolean" | "toggle" | "toggle-group"
  label: string;
  placeholder?: string;
  options?: string[] | { value: string; label: string }[];
}
```

**UI Rendering:**

- **text** - Text input field (debounced for performance)
- **select** - Dropdown menu
- **boolean** - Checkbox
- **toggle** - Single toggle button (on/off)
- **toggle-group** - Mutually exclusive toggle buttons
- **multi-select** - Multiple checkboxes

Properties update immediately (or with 500ms debounce for text inputs) and re-execute the entire pipeline on change.

### Export Registry

Exports are defined in [exports.ts](lib/exports.ts):

```typescript
interface ExportDefinition {
  type: ExportType;
  name: string;
  description: string;
  icon: string;
  acceptsInput: string[];
  propertySchema: PropertySchema[];
  defaultProperties: Record<string, unknown>;
  execute: (data: string, properties: Record<string, unknown>, doc: Document) => void;
}
```

**Available Exports:**

- **Smart Download** - Auto-detects format (JSON/CSV/TXT) and downloads with correct extension
- **Copy to Clipboard** - Copies final output to clipboard

The smart download export analyzes the output:
- Valid JSON → `output.json` with `application/json` MIME type
- CSV-like (commas, consistent columns) → `output.csv` with `text/csv`
- Otherwise → `output.txt` with `text/plain`

## UI Components

### Component Hierarchy

```
BlastoffShell                    (src/features/blastoff/ui/BlastoffShell.tsx)
├── DocumentList                 (src/features/blastoff/ui/DocumentList.tsx)
│   └── Document cards with click navigation
└── WorkspacePanel               (src/features/blastoff/ui/WorkspacePanel.tsx)
    ├── Input Form               (when no document)
    └── TransformPipeline        (src/features/blastoff/ui/TransformPipeline.tsx)
        ├── DataBlock            (src/features/blastoff/ui/DataBlock.tsx)
        │   └── TextEditor       (from @/entities/editor)
        ├── TransformBlock       (src/features/blastoff/ui/TransformBlock.tsx)
        │   ├── DataBlock        (with inline property controls)
        │   └── Stats display
        ├── TransformPalette     (src/features/blastoff/ui/TransformPalette.tsx)
        │   ├── Transform tiles
        │   └── Export buttons
        └── ExportSelector       (src/features/blastoff/ui/ExportSelector.tsx)
```

### DataBlock Component

The [DataBlock](ui/DataBlock.tsx) is the core reusable component for displaying text with controls:

**Features:**
- Header with title, subtitle (optional), and controls
- Integrated TextEditor with line numbers
- Word wrap toggle
- Copy to clipboard
- Clear button (for input blocks)
- Remove button (for transform blocks)
- Syntax highlighting selector (CSV, JSON, JWT, or plain text)
- Stats row (for transform validation info)
- Inline property controls (for transform configuration)

**Debouncing:** Text inputs use 500ms debounce to prevent re-execution on every keystroke while maintaining responsive UI via local state.

**Syntax Highlighting:** Uses syntax highlighters from [lib/syntax-highlight.tsx](lib/syntax-highlight.tsx) to render CSV, JSON, and JWT with appropriate colors.

### TransformBlock Component

The [TransformBlock](ui/TransformBlock.tsx) displays a single transform step:

**Layout:**
- Arrow connector (visual separator)
- DataBlock showing transform output
- Inline property controls in DataBlock's subheader
- Stats/validation info (if transform provides `getStats`)
- Remove button to delete the step

**Property Rendering:** Dynamically renders controls based on the transform's `propertySchema`:
- Text inputs (debounced)
- Select dropdowns
- Toggle buttons
- Toggle groups (mutually exclusive)
- Multi-select checkboxes

**Auto-execution:** Any property change triggers pipeline re-execution via `updateTransformStep`.

### TransformPalette Component

The [TransformPalette](ui/TransformPalette.tsx) shows available transforms as clickable tiles:

**Behavior:**
- Shows all transforms as horizontal button tiles
- Click applies transform with default properties immediately
- No configuration UI in MVP (properties editable inline after adding)
- Export buttons appear at bottom when document has transforms

**Quick Apply:** Clicking a transform tile:
1. Creates new document if needed (from input text)
2. Adds transform with default properties
3. Executes pipeline
4. Navigates to document editor (if new)

### Document List

The [DocumentList](ui/DocumentList.tsx) sidebar shows saved documents:

**Features:**
- Sorted by most recently updated
- Shows document name and last updated timestamp
- Click to navigate to document editor
- Delete button (with confirmation)
- Sticky sidebar (full height, scrollable)

**Auto-naming:** Documents are auto-named from the first 30 characters of the first line of input.

## State Management

### BlastoffProvider

The [BlastoffProvider](model/BlastoffProvider.tsx) uses React Context to avoid prop drilling:

```typescript
const {
  // Document management
  documents,
  currentDocument,
  createDocument,
  deleteDocument,

  // Input state
  inputText,
  setInputText,
  handleSubmitInput,
  handleUpdateInput,

  // Transform management
  handleAddTransform,
  handleRemoveTransform,
  updateTransformStep,
  availableTransforms,

  // Output & exports
  currentOutputType,
  finalOutput,
  availableExports,
  handleExport,

  // Document metadata
  handleUpdateName
} = useBlastoffContext();
```

**Key Hook:** [useBlastoff](model/useBlastoff.ts) composes document manager and pipeline engine:

- Wraps `useDocumentManager` for CRUD operations
- Computes `finalOutput` from last transform's output
- Computes `availableTransforms` based on current output type
- Handles pipeline re-execution on any change

### Document Manager

The [useDocumentManager](model/useDocumentManager.ts) hook manages localStorage persistence:

**Operations:**
- `createDocument(inputData)` - Generate ID, save to localStorage
- `getDocument(id)` - Retrieve by ID
- `updateDocument(id, updates)` - Partial update with auto-timestamp
- `addTransformStep(docId, type, properties)` - Append transform
- `updateTransformStep(docId, stepId, updates)` - Update properties
- `removeTransformStep(docId, stepId)` - Delete and reorder
- `deleteDocument(id)` - Remove from localStorage

**Storage Format:** `localStorage["blastoff-doc-{id}"] = JSON.stringify(document)`

**Reactivity:** All mutations call `loadDocuments()` to trigger React re-render.

## Data Flow

### Creating a Document

1. User enters text in input form
2. User clicks a transform tile
3. `handleSubmitInput()` creates document: `createDocument(inputText)`
4. `handleAddTransform(type, defaultProperties, newDocId)` adds transform
5. `PipelineEngine.executePipeline()` computes outputs
6. Navigate to `/blastoff/{newDocId}`

### Adding a Transform

1. User clicks transform tile in palette
2. `handleAddTransform(type, defaultProperties)` called
3. `documentManager.addTransformStep()` appends to `document.transforms`
4. `PipelineEngine.executePipeline(document)` re-runs entire pipeline
5. Each `step.output` updated
6. `documentManager.updateDocument()` saves to localStorage
7. UI re-renders with new transform block

### Updating Properties

1. User changes a property (e.g., toggles "trim lines")
2. `handlePropertyChange()` updates local state immediately
3. After debounce (text) or immediately (other inputs):
   - `updateTransformStep(stepId, { properties: newProps })`
   - `PipelineEngine.executePipeline(document)` re-runs
   - All downstream transforms recalculate
   - UI updates with new outputs

### Removing a Transform

1. User clicks remove button on TransformBlock
2. `handleRemoveTransform(stepId)` called
3. `documentManager.removeTransformStep()` filters and reorders
4. `PipelineEngine.executePipeline()` re-runs
5. UI updates (transform block disappears, downstream outputs recalculate)

### Exporting

1. User clicks export button (e.g., "Download")
2. `handleExport("smart-download", defaultProperties)` called
3. `EXPORT_REGISTRY["smart-download"].execute(finalOutput, props, document)`
4. Export detects format and triggers browser download

## Entity Integration

Blastoff reuses domain logic from existing tools by importing from entity layer:

### From `@/entities/transform`

- `sanitizeText()` - Used by text-sanitizer tool
- `convertCase()` - Used by case-converter tool
- `csvToJson()` / `jsonToCsv()` - Used by csv-json-converter tool
- `encodeText()` / `decodeText()` - Used by text-encoder tool

### From `@/entities/jwt`

- `decodeJWT()` - Used by jwt-decoder tool
- `isExpired()` / `isNotYetValid()` / `formatDate()` - Validation helpers

### From `@/entities/counter`

- `countTokens()` - Used by text-counter tool for GPT-4 token estimation

### From `@/entities/editor`

- `TextEditor` - Shared textarea component with line numbers and syntax highlighting

This ensures **consistency**: a transform in Blastoff produces identical output to the standalone tool.

## Performance Considerations

### Debouncing

Text inputs in both DataBlock and TransformBlock use 500ms debounce:
- Local state updates immediately (no lag in UI)
- Actual onChange fires after user stops typing
- Prevents expensive pipeline re-execution on every keystroke

### Memoization

The [useBlastoff](model/useBlastoff.ts) hook uses `useMemo` for computed values:
- `currentOutputType` - Depends only on document structure
- `availableTransforms` - Depends only on output type
- `availableExports` - Depends only on output type
- `finalOutput` - Depends only on last transform output

### Caching

Each transform step stores its output in `step.output`:
- Fast document switching (no re-execution needed)
- Enables "undo" by removing last transform (future feature)
- localStorage persists cached outputs across sessions

### Pipeline Execution

The entire pipeline re-runs on any change:
- Simple implementation (no incremental updates)
- Fast enough for typical workflows (< 10 transforms, < 1MB data)
- Could optimize in future by tracking "dirty" steps

## Limitations & Future Enhancements

### Current Limitations

- **Linear only** - No branching, conditional logic, or parallel paths
- **Single input** - Cannot merge multiple data sources
- **Client-side storage** - No cloud sync or sharing
- **No undo/redo** - Can only remove last transforms
- **No version history** - Overwrites on every change

### Potential Future Features

- **Branching workflows** - Fan-out/fan-in with conditional logic
- **Multiple inputs** - Join, merge, compare operations
- **Visual canvas** - Drag-and-drop block connections
- **Template marketplace** - Share and reuse workflows
- **Cloud storage** - Backend persistence and collaboration
- **Undo/redo** - Full history with time travel
- **Export variations** - PDF, Markdown reports, HTML
- **Advanced transforms** - API calls, file uploads, database queries

## File Structure

```
src/features/blastoff/
├── README.md                    # This file
├── index.ts                     # Public API exports
│
├── model/                       # State management
│   ├── BlastoffProvider.tsx     # Context provider
│   ├── useBlastoff.ts          # Main state hook
│   ├── useDocumentManager.ts   # localStorage CRUD
│   └── types.ts                # TypeScript definitions
│
├── lib/                         # Business logic
│   ├── engine.ts               # Pipeline execution
│   ├── registry.ts             # Transform definitions
│   ├── exports.ts              # Export definitions
│   └── syntax-highlight.tsx    # Syntax highlighters
│
└── ui/                          # Components
    ├── BlastoffShell.tsx       # Root layout
    ├── WorkspacePanel.tsx      # Input or pipeline view
    ├── DocumentList.tsx        # Sidebar with saved docs
    ├── TransformPipeline.tsx   # Input + transforms + palette
    ├── DataBlock.tsx           # Text display with controls
    ├── TransformBlock.tsx      # Single transform step
    ├── TransformPalette.tsx    # Available transforms
    ├── TransformSelector.tsx   # Transform picker (unused in MVP)
    └── ExportSelector.tsx      # Export options (unused in MVP)
```

## Adding New Transforms

To add a new transform:

1. **Define the transform** in [registry.ts](lib/registry.ts):

```typescript
"my-transform": {
  type: "my-transform",
  name: "My Transform",
  description: "What it does",
  category: "text",
  acceptsInput: ["text"],
  producesOutput: "text",
  defaultProperties: { option: "value" },
  propertySchema: [
    {
      key: "option",
      type: "select",
      label: "Option",
      options: ["value1", "value2"]
    }
  ],
  execute: (input, props) => {
    // Your transformation logic
    return transformedOutput;
  },
  getStats: (output, input, props) => {
    // Optional: return { "Stat Name": value }
    return null;
  }
}
```

2. **Add the type** to [types.ts](model/types.ts):

```typescript
export type TransformType =
  | "text-sanitize"
  | "my-transform"  // Add here
  | ...
```

3. **Test it:**
   - Start blastoff
   - Create new document with compatible input
   - Transform should appear in palette
   - Click to apply with defaults
   - Edit properties inline in transform block

That's it! The engine handles the rest automatically.
