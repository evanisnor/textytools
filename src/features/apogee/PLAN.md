# Apogee Implementation Plan

This document outlines the component build order for implementing the Apogee feature. The sequence prioritizes foundational infrastructure before higher-level features, ensuring each component can be tested in isolation before integration.

**Note:** This plan aligns with the phase structure in README.md, which organizes by implementation order rather than by spec sections.

## Build Order Overview

1. **Core Data Model & Types** - Foundation for all subsequent work
2. **Format Entity Layer** - Reusable parsing/serialization utilities  
3. **Transform Implementations** - Build transforms from README.md Section 5 (Transform Catalog)
4. **State Management** - Document lifecycle and pipeline execution
5. **Transform Catalog Expansion** - Complete remaining transforms from Section 5
6. **UI Components** - Presentational layer (README.md Section 6)
7. **Advanced UI Features** - Lens panel, stats bar, palette enhancements
8. **Export Actions & Polish** - Final user-facing features

---

## Phase 1: Core Infrastructure

### 1.1 Data Model & Types
**File:** `src/features/apogee/model/types.ts`

Build the complete type system that defines the pipeline architecture:

- `TransformStep` interface (id, documentId, order, transformType, inputSelection, properties, output)
- `Document` interface (id, name, inputType, inputData, transforms, timestamps)
- `TransformType` union (all transform categories)
- `TransformResult` interface (success, data, error, mimeType, stats)
- `TransformStat` interface (label, value, alert)
- `PropertySchema` interface (key, label, type, options, defaultValue, validation)
- `TransformDefinition` interface (type, name, description, category, acceptsInput, producesOutput, propertySchema, execute)
- `ExportDefinition` interface (type, name, description, acceptsInput, propertySchema, execute)
- `ExportResult` interface (success, error, stats)

**Testing:** Create sample type instances to validate structure completeness.

**Dependencies:** None

---

### 1.2 Transform Registry (Empty Shell)
**File:** `src/features/apogee/lib/registry.ts`

Create the registry structure with placeholder transforms:

- `TRANSFORM_REGISTRY` object (initially empty or with one dummy transform)
- Registry access functions:
  - `getTransform(type: TransformType): TransformDefinition | undefined`
  - `getAllTransforms(): TransformDefinition[]`
  - `getTransformsByCategory(category: string): TransformDefinition[]`

**Testing:** Verify registry can store and retrieve transform definitions.

**Dependencies:** Types (1.1)

---

### 1.3 Execution Engine (Minimal)
**File:** `src/features/apogee/lib/engine.ts`

Implement the pipeline execution logic without lens support initially:

- `ApogeeEngine.executePipeline(document: Document): Promise<string>`
  - Iterate through transforms
  - Execute each transform with previous output
  - Cache results in `step.output`
  - Handle errors gracefully (continue pipeline on failure)
- `ApogeeEngine.executeFromStep(document: Document, fromStepIndex: number): Promise<void>`
  - Incremental execution from modified step onwards

**Testing:** Create a test document with 2-3 dummy transforms and verify sequential execution.

**Dependencies:** Types (1.1), Registry (1.2)

---

## Phase 2: Format Entity Layer

### 2.1 JSON Entity (Augment Existing)
**Location:** `src/entities/json/`

Enhance existing JSON utilities to support Apogee requirements:

- **File:** `src/entities/json/lib/parse.ts`
  - `parseJSON(input: string): unknown` with detailed error messages
  - `validateJSON(input: string): { valid: boolean; error?: string }`
- **File:** `src/entities/json/lib/format.ts`
  - `formatJSON(data: unknown, options: { indentation: number | "tab"; sortKeys: boolean; minify: boolean }): string`
  - `getJSONStats(data: unknown): { keyCount: number; depth: number; size: number }`

**Testing:** Test with valid JSON, invalid JSON, nested objects, arrays, edge cases (empty objects, null values).

**Dependencies:** None

---

### 2.2 CSV Entity (Augment Existing)
**Location:** `src/entities/csv/`

Enhance existing CSV utilities:

- **File:** `src/entities/csv/lib/parse.ts`
  - `parseCSV(input: string, options: { delimiter: string; hasHeaders: boolean }): string[][]`
  - `detectDelimiter(input: string): string` (comma, tab, semicolon, pipe)
- **File:** `src/entities/csv/lib/format.ts`
  - `formatCSV(data: string[][], options: { delimiter: string; quoteChar: string }): string`
  - `escapeCSVValue(value: string, delimiter: string, quoteChar: string): string`
- **File:** `src/entities/csv/lib/stats.ts`
  - `getCSVStats(data: string[][]): { rowCount: number; columnCount: number }`

**Testing:** Test with standard CSV, edge cases (quotes, delimiters in values, empty cells, multiline values).

**Dependencies:** None

---

### 2.3 YAML Entity (New)
**Location:** `src/entities/yaml/`

Create YAML parsing and serialization utilities:

- **File:** `src/entities/yaml/lib/parse.ts`
  - `parseYAML(input: string): unknown` using `js-yaml` library
  - `validateYAML(input: string): { valid: boolean; error?: string }`
- **File:** `src/entities/yaml/lib/format.ts`
  - `formatYAML(data: unknown, options: { indentation: number; version: "1.1" | "1.2" }): string`
  - `getYAMLStats(data: unknown): { documentCount: number; valid: boolean }`

**Testing:** Test with YAML documents, multi-document YAML, anchors/aliases, edge cases.

**Dependencies:** `js-yaml` package

---

### 2.4 XML Entity (New)
**Location:** `src/entities/xml/`

Create XML parsing and serialization utilities:

- **File:** `src/entities/xml/lib/parse.ts`
  - `parseXML(input: string): Document` using DOMParser
  - `validateXML(input: string): { valid: boolean; error?: string }`
- **File:** `src/entities/xml/lib/format.ts`
  - `formatXML(doc: Document, options: { indentation: number | "tab" }): string`
  - `jsonToXML(data: unknown, options: { rootElementName: string; preferAttributes: boolean }): string`
  - `xmlToJSON(doc: Document): unknown`
- **File:** `src/entities/xml/lib/stats.ts`
  - `getXMLStats(doc: Document): { nodeCount: number; namespaceCount: number }`

**Testing:** Test with valid XML, invalid XML, namespaces, attributes vs elements.

**Dependencies:** DOMParser (browser API)

---

### 2.5 TOML Entity (New)
**Location:** `src/entities/toml/`

Create TOML parsing and serialization utilities:

- **File:** `src/entities/toml/lib/parse.ts`
  - `parseTOML(input: string): unknown` using `@iarna/toml` or `toml` library
  - `validateTOML(input: string): { valid: boolean; error?: string }`
- **File:** `src/entities/toml/lib/format.ts`
  - `formatTOML(data: unknown, options: { formatting: "compact" | "expanded" }): string`
  - `getTOMLStats(data: unknown): { tableCount: number; valid: boolean }`

**Testing:** Test with TOML documents, nested tables, arrays, edge cases.

**Dependencies:** `@iarna/toml` or similar package

---

## Phase 3: Basic Transform Implementations

### 3.1 JSON Convert Transform (New)
**Location:** `src/entities/transform/json-convert/`

Implement the first working transform:

- **File:** `src/entities/transform/json-convert/lib/jsonConvert.ts`
  - `execute(input: string, properties: Record<string, unknown>): TransformResult`
  - Parse input (auto-detect JSON, CSV, YAML, XML)
  - Convert to JSON with formatting options
  - Generate stats (valid, keyCount, depth, size)
- **File:** `src/entities/transform/json-convert/model/types.ts`
  - Property schema definition
  - Default properties
- **File:** `src/entities/transform/json-convert/index.ts`
  - Export `TransformDefinition` for registry

**Testing:** Test with various input formats (JSON, CSV, YAML, XML), verify stats generation.

**Dependencies:** JSON entity (2.1), CSV entity (2.2), YAML entity (2.3), XML entity (2.4)

---

### 3.2 CSV Convert Transform (New)
**Location:** `src/entities/transform/csv-convert/`

Implement CSV conversion:

- **File:** `src/entities/transform/csv-convert/lib/csvConvert.ts`
  - `execute(input: string, properties: Record<string, unknown>): TransformResult`
  - Parse input (auto-detect JSON, CSV)
  - Convert to CSV with delimiter/header options
  - Generate stats (rowCount, columnCount)
- **File:** `src/entities/transform/csv-convert/model/types.ts`
  - Property schema definition
- **File:** `src/entities/transform/csv-convert/index.ts`
  - Export `TransformDefinition`

**Testing:** Test JSON-to-CSV, CSV-to-CSV with different delimiters.

**Dependencies:** CSV entity (2.2), JSON entity (2.1)

---

### 3.3 Text Encoding Transform (Augment Existing)
**Location:** `src/entities/transform/text-encoding/`

Enhance existing encoding utilities to match TransformDefinition interface:

- **File:** `src/entities/transform/text-encoding/lib/base64.ts`
  - Create `base64EncodeDefinition: TransformDefinition`
  - Implement `execute()` with options (urlSafe, padding, lineWidth)
  - Generate stats (outputSize, expansionRatio)
- **File:** `src/entities/transform/text-encoding/lib/base58.ts`
  - Create `base58EncodeDefinition: TransformDefinition`
- **File:** `src/entities/transform/text-encoding/lib/hex.ts`
  - Create `hexEncodeDefinition: TransformDefinition`
- **File:** `src/entities/transform/text-encoding/lib/url.ts`
  - Create `urlEncodeDefinition: TransformDefinition`
- **File:** `src/entities/transform/text-encoding/lib/html.ts`
  - Create `htmlEncodeDefinition: TransformDefinition`
- **File:** `src/entities/transform/text-encoding/index.ts`
  - Export all encoding `TransformDefinition` instances

**Testing:** Test each encoding with various inputs, verify reversibility (encode then decode).

**Dependencies:** Types (1.1)

---

### 3.4 Text Hashing Transform (Augment Existing)
**Location:** `src/entities/transform/text-hash/`

Enhance existing hashing utilities:

- **File:** `src/entities/transform/text-hash/lib/md5.ts`
  - Create `md5HashDefinition: TransformDefinition`
  - Implement `execute()` with options (outputEncoding, hmacKey)
  - Generate stats (outputBitLength, collisionResistance warning)
- **File:** `src/entities/transform/text-hash/lib/sha256.ts`
  - Create `sha256HashDefinition: TransformDefinition`
- **File:** `src/entities/transform/text-hash/lib/sha512.ts`
  - Create `sha512HashDefinition: TransformDefinition`
- **File:** `src/entities/transform/text-hash/index.ts`
  - Export all hash `TransformDefinition` instances

**Testing:** Test hashing with known inputs, verify HMAC support, check warning stats for deprecated algorithms.

**Dependencies:** Types (1.1), crypto libraries (Web Crypto API or js-sha256/js-sha512)

---

### 3.5 Register Transforms
**File:** `src/features/apogee/lib/registry.ts`

Populate the registry with completed transforms:

- Import all transform definitions from entities
- Add to `TRANSFORM_REGISTRY` object
- Verify category filtering works

**Testing:** Call `getTransformsByCategory("convert")` and verify JSON/CSV transforms appear.

**Dependencies:** All Phase 3 transforms (3.1-3.4)

---

## Phase 4: Document State Management

### 4.1 Document Manager Hook
**File:** `src/features/apogee/model/useDocumentManager.ts`

Implement state management for the pipeline:

- `useDocumentManager()` hook:
  - `currentDocument: Document | null`
  - `documents: Document[]` (for multi-document support later)
  - `createDocument(inputData: string, inputType: string): void`
  - `updateInputData(data: string): void`
  - `addTransform(type: TransformType): void`
  - `updateTransformProperties(stepId: string, properties: Record<string, unknown>): void`
  - `removeTransform(stepId: string): void`
  - `executeFromStep(stepIndex: number): Promise<void>` (calls engine)
- LocalStorage persistence (save/load documents)
- Auto-execution on property changes (debounced 500ms)

**Testing:** Create document, add transforms, modify properties, verify execution and persistence.

**Dependencies:** Types (1.1), Engine (1.3)

---

### 4.2 Document Context Provider
**File:** `src/features/apogee/model/ApogeeProvider.tsx`

Create React Context for document state:

- `ApogeeProvider` component wrapping `useDocumentManager()`
- `useApogeeContext()` hook for consuming context
- Error boundary for context access

**Testing:** Verify context provides all document manager functions to child components.

**Dependencies:** Document Manager (4.1)

---

## Phase 5: Transform Catalog Expansion

**Goal:** Complete the remaining transforms from README.md Section 5 (Transform Catalog)

### 5.1 Additional Convert Transforms
Implement remaining format conversions (currently have JSON, CSV, YAML, XML, TOML):
- Additional format converters as needed
- Enhanced options for existing converters

**Location:** `src/entities/transform/`

---

### 5.2 Additional Encode/Decode Transforms
Expand encoding coverage (currently have Base64, Base58, Hex, URL, HTML Entity):
- Base91, ASCII85, Z85, Quoted-Printable, ROT13, Morse
- Corresponding decode transforms

**Location:** `src/entities/transform/text-encoding/`

---

### 5.3 Additional Hash Transforms
Add more hash algorithms (currently have MD5, SHA-1, SHA-256, SHA-512):
- SHA-384, SHA-3, BLAKE3, Murmur3

**Location:** `src/entities/transform/text-hash/`

---

### 5.4 Additional Modify Transforms
Expand text manipulation (currently have text-sanitize, case-convert):
- Regex Replace
- Sort Lines
- Extract Lines

**Location:** `src/entities/transform/`

---

### 5.5 Compress/Decompress Transforms
Implement compression algorithms:
- Gzip, Bzip2, Brotli, Zstd, LZMA2, XZ

**Location:** `src/entities/transform/`

---

### 5.6 Analyze Transforms
Implement data analysis and visualization:
- Chart Generator
- Frequency Distribution
- Time Series Plot
- Data Validator
- Pattern Heatmap

**Location:** `src/entities/transform/`

---

## Phase 6: UI Components (README.md Section 6)

### 6.1 DataBlock Component
**File:** `src/features/apogee/ui/DataBlock.tsx`

Create the core output display component:

- Props: `title`, `value`, `readOnly`, `onChange`, `onRemove`, `onClear`
- Header with title and control buttons (Wrap, Copy, Remove, Clear)
- TextEditor integration (reuse existing `TextEditor` component)
- Syntax highlighting selector (JSON, CSV, YAML, XML, text)
- Copy-to-clipboard functionality

**Testing:** Render with different values, test read-only mode, verify controls work.

**Dependencies:** Existing `TextEditor` component from `src/entities/editor/`

---

### 6.3 TransformBlock Component
**File:** `src/features/apogee/ui/TransformBlock.tsx`

Create the transform step display:

- Header with step number, transform name, minimize/remove buttons
- Configuration panel (schema-driven form generation from `propertySchema`)
- Output DataBlock (read-only)
- Minimize/expand functionality
- Call `updateTransformProperties()` on option changes

**Testing:** Render with different transforms, verify property updates trigger re-execution.

**Dependencies:** DataBlock (6.1), ConfigurationPanel (6.4), Apogee Context (4.2)

---

### 6.4 Schema-Driven Form Generation (ConfigurationPanel)
**File:** `src/features/apogee/ui/ConfigurationPanel.tsx`

Create form controls based on property schemas:

- `renderControl(schema: PropertySchema)` function:
  - `type="text"` → Text input
  - `type="number"` → Number input
  - `type="select"` → Dropdown
  - `type="toggle"` → Toggle button
  - `type="toggle-group"` → Radio button group
  - `type="multi-select"` → Checkbox group
- Validation handling (client-side validation from schema)
- Debounced input (500ms) for text fields

**Testing:** Test each control type with different schemas, verify validation works.

**Dependencies:** None (pure React)

---

### 6.5 TransformPipeline Component
**File:** `src/features/apogee/ui/TransformPipeline.tsx`

Create the main pipeline display:

- Render InputForm (when no document)
- Render DataBlock for input + TransformBlock list (when document loaded)
- Step connectors (visual arrows between steps)
- Transform palette for adding transforms
- Call execution engine on mount and updates

**Testing:** Create document, verify pipeline renders, add/remove transforms.

**Dependencies:** InputForm (6.2), TransformBlock (6.3), DataBlock (6.1), Apogee Context (4.2)

---

## Phase 7: Advanced UI Features

### 7.1 StatsBar Component
**File:** `src/features/apogee/ui/StatsBar.tsx`

Create the metadata display bar:

- `StatsBar({ stats: TransformStat[] })` component
- `StatPill` sub-component with label, value, alert badge
- Alert variants: info (blue), warning (yellow), error (red), default (zinc)
- Tooltip support for technical details

**Testing:** Render with different stat configurations, verify alert styling.

**Dependencies:** None

---

### 7.2 Enhance DataBlock with Stats
**File:** `src/features/apogee/ui/DataBlock.tsx`

Integrate StatsBar into DataBlock:

- Add `stats?: TransformStat[]` prop
- Render StatsBar below header when stats provided
- Update TransformBlock to pass stats from TransformResult

**Testing:** Execute transforms, verify stats appear correctly.

**Dependencies:** StatsBar (7.1)

---

### 7.3 Lens Execution Logic
**File:** `src/features/apogee/lib/lens.ts`

Implement the Input Lens Pass:

- `executeLensPass(input: string, selection: TransformStep['inputSelection']): Promise<LensResult>`
  - Mode: "all" (pass-through) ✅ DONE
  - Mode: "regex" (pattern extraction with flags) ✅ DONE
  - Mode: "csv-column" (column extraction) ✅ DONE (basic)
  - Mode: "jsonpath" (JSONPath query execution) - Placeholder for Phase 8
  - Mode: "xml-xpath" (XPath query execution) - Placeholder for Phase 8
- `parseData(data: string, format: string): string` (parse as JSON/CSV/YAML/XML/TOML)
- Error handling for invalid patterns/queries

**Testing:** Test each lens mode with various inputs, verify extraction and parsing.

**Dependencies:** Types (1.1), Format entities (2.1-2.5), `jsonpath` library (for JSONPath support)

---

### 7.4 LensPanel Component
**File:** `src/features/apogee/ui/LensConfig.tsx`

Create the lens configuration UI:

- Mode selector (All, Regex, JSONPath, CSV Column, XPath)
- Mode-specific inputs:
  - Regex: pattern, flags, parseAs selector
  - JSONPath: query input, parseAs selector
  - CSV Column: column index/name input
  - XPath: query input, parseAs selector
- Live preview (match count, extracted preview)
- Debounced input (500ms)
- Call `updateTransformProperties()` to update `inputSelection` in step

**Testing:** Configure different lens modes, verify live preview updates, test extraction.

**Dependencies:** Apogee Context (4.2)

---

### 7.5 Integrate Lens into TransformBlock
**File:** `src/features/apogee/ui/TransformBlock.tsx`

Add LensPanel to TransformBlock:

- Render LensPanel above ConfigurationPanel
- Show lens panel only for transforms where `supportsInputSelection !== false`
- Default to collapsed for non-Convert transforms
- Pass `inputSelection` from step to LensPanel

**Testing:** Add Convert transform, configure lens, verify extraction before conversion.

**Dependencies:** LensPanel (7.4)

---

### 7.6 Enhanced TransformPalette
**File:** `src/features/apogee/ui/TransformPalette.tsx`

Enhance the transform selection UI (currently basic in Phase 6):

- Search/filter functionality
- Transform icons/visual indicators
- Detailed tooltips (description, input/output types, examples)
- Filter transforms by current output type (call `ApogeeEngine.getAvailableTransforms()`)
- Keyboard shortcuts for common transforms

**Testing:** Search transforms, verify compatibility filtering, test keyboard shortcuts.

**Dependencies:** Apogee Context (4.2), Engine (1.3)

---

### 7.7 Syntax Highlighting Integration
**File:** `src/features/apogee/ui/DataBlock.tsx`

Add syntax highlighting to DataBlock:

- Use `mimeType` prop to select highlighter
- Integrate syntax highlighting library (e.g., Prism, Highlight.js, or Shiki)
- Support JSON, CSV, YAML, XML, TOML highlighting
- Manual override selector (dropdown in header)

**Testing:** Display different data types, verify highlighting works, test manual override.

**Dependencies:** Syntax highlighting library

---

## Phase 8: Advanced Features & Polish

### 8.1 JSONPath & XPath Support
**File:** `src/features/apogee/lib/lens.ts`

Implement advanced lens modes:

- JSONPath support (integrate `jsonpath` library)
- XPath support (use browser DOMParser)
- Update lens.ts to remove placeholders
- Add comprehensive error handling

**Testing:** Test JSONPath queries on JSON data, XPath queries on XML data.

**Dependencies:** jsonpath library

---

### 8.2 Export Actions
**File:** `src/features/apogee/lib/export.ts`

Implement export functionality:

- Export document as JSON (with full pipeline state)
- Download output as file (respecting mimeType)
- Copy pipeline URL (for sharing)
- Generate shareable template

**Testing:** Export documents, verify download works, test URL sharing.

**Dependencies:** Apogee Context (4.2)

---

### 8.3 Additional Encode Transforms (Future)
**Locations:**
- `src/entities/transform/text-encoding/lib/base91.ts`
- `src/entities/transform/text-encoding/lib/ascii85.ts`
- `src/entities/transform/text-encoding/lib/z85.ts`
- `src/entities/transform/text-encoding/lib/quotedPrintable.ts`
- `src/entities/transform/text-encoding/lib/rot13.ts`
- `src/entities/transform/text-encoding/lib/morse.ts`

Implement remaining Encode transforms:

- Base91, ASCII85, Z85, Quoted-Printable, ROT13, Morse Code
- Each as separate `TransformDefinition`
- Line-by-line mode support (`supportsLineByLine: true`)
- Generate appropriate stats

**Testing:** Encode/decode with each format, test line-by-line mode.

**Dependencies:** Text Encoding entity (3.3), encoding libraries (base91, ascii85, etc.)

---

### 8.4 Decode Transforms (Future)
**Locations:**
- `src/entities/transform/text-encoding/lib/jwtDecode.ts`
- `src/entities/transform/text-encoding/lib/base64Decode.ts`
- `src/entities/transform/text-encoding/lib/unicodeDecode.ts`

Implement Decode transforms:

- JWT Decode (with signature verification, claim validation)
- Base64/Base58/Hex Decoders (with auto-detection)
- Unicode Decoder
- Line-by-line mode support
- Generate appropriate stats (algorithm, status, decoded size)

**Testing:** Decode valid/invalid inputs, test JWT expiration/validation, verify auto-detection.

**Dependencies:** Text Encoding entity (3.3), JWT libraries (jsonwebtoken or jose)

---

### 8.5 Additional Hash Transforms (Future)
**Locations:**
- `src/entities/transform/text-hash/lib/sha1.ts`
- `src/entities/transform/text-hash/lib/sha384.ts`
- `src/entities/transform/text-hash/lib/sha3.ts`
- `src/entities/transform/text-hash/lib/blake3.ts`
- `src/entities/transform/text-hash/lib/murmur3.ts`

Implement remaining Hash transforms:

- SHA-1, SHA-384, SHA-3 variants, BLAKE3, Murmur3
- HMAC support for cryptographic hashes
- Line-by-line mode support
- Generate collision resistance warnings

**Testing:** Hash known inputs, verify HMAC, test line-by-line mode.

**Dependencies:** Text Hash entity (3.4), hash libraries (sha3, blake3, murmurhash)

---

### 8.6 Modify Transforms (Future)
**Locations:**
- `src/entities/transform/text-sanitize/` (augment existing)
- `src/entities/transform/text-case/` (augment existing)
- `src/entities/transform/regex-replace/` (new)
- `src/entities/transform/sort-lines/` (new)
- `src/entities/transform/extract-lines/` (new)

Implement Modify category:

- Sanitize (augment existing with all options)
- Change Case (augment existing with all case types)
- Regex Replace (pattern, replacement, capture groups)
- Sort Lines (ascending/descending, alphabetical/numerical/length)
- Extract Lines (contains, starts with, ends with, regex match)
- Line-by-line mode support
- Generate appropriate stats

**Testing:** Test each transform with various inputs, verify regex capture groups, test sorting.

**Dependencies:** Existing sanitize/case entities, regex libraries

---

### 8.7 Compress/Decompress Transforms (Future)
**Location:** `src/entities/transform/compression/`

Implement compression transforms:

- Gzip, Bzip2, Brotli, Zstd (compression and decompression)
- Output encoding options (Base64, Hex, Binary Download)
- Generate stats (original size, compressed size, savings percentage)
- Note: Requires WASM libraries for browser support (pako, brotli-wasm, etc.)

**Testing:** Compress and decompress data, verify round-trip integrity.

**Dependencies:** Compression libraries (pako for gzip, brotli-wasm, fflate)

---

### 8.8 Analyze Transforms (Future)
**Locations:**
- `src/entities/transform/chart-generator/`
- `src/entities/transform/frequency-distribution/`
- `src/entities/transform/time-series-plot/`
- `src/entities/transform/data-validator/`
- `src/entities/transform/pattern-heatmap/`

Implement Analyze category:

- Chart Generator (bar, line, pie, scatter using SVG or Canvas)
- Frequency Distribution (words, characters, values)
- Time Series Plot (timestamped data visualization)
- Data Validator (JSON Schema, CSV column types)
- Pattern Heatmap (character distribution, word positions)
- Generate SVG/HTML output for visualization

**Testing:** Test with various datasets, verify chart rendering, validate schemas.

**Dependencies:** Chart libraries (d3.js, chart.js, or custom SVG generation), JSON Schema validator

---

### 8.2 ExportRow Component
**File:** `src/features/apogee/ui/ExportRow.tsx`

Create the export action UI:

- Export buttons (Download, PDF, Clipboard)
- Filter exports by current output type (call `ApogeeEngine.getAvailableExports()`)
- Execute export on button click
- Show confirmation stats after export

**Testing:** Click export buttons, verify actions complete, check confirmation feedback.

**Dependencies:** Export Registry (8.1), Engine (1.3)

---

### 8.3 Integrate Exports into Pipeline
**File:** `src/features/apogee/ui/TransformPipeline.tsx`

Add ExportRow below TransformPalette:

- Show only when pipeline has transforms
- Pass current output data and type

**Testing:** Add transforms, verify exports appear, test export actions.

**Dependencies:** ExportRow (8.2)

---

### 8.4 Document List Sidebar (Future)
**File:** `src/features/apogee/ui/DocumentList.tsx`

Create multi-document management UI:

- List of saved documents (from localStorage)
- Document card with name, timestamp, transform count
- Create new document button
- Load document on click
- Delete document action

**Testing:** Create multiple documents, switch between them, delete documents.

**Dependencies:** Apogee Context (4.2)

---

### 8.5 ApogeeShell Component
**File:** `src/features/apogee/ui/ApogeeShell.tsx`

Create the root layout component:

- DocumentList sidebar (collapsible)
- TransformPipeline workspace area
- Responsive layout (mobile: single column, desktop: sidebar + workspace)

**Testing:** Render full UI, verify responsive layout.

**Dependencies:** DocumentList (8.4), TransformPipeline (5.5)

---

### 8.6 Page Integration
**File:** `app/apogee/page.tsx`

Create the Next.js page:

- Wrap ApogeeShell in ApogeeProvider
- Use ToolFrame for consistent layout
- Add to home page tool grid

**Testing:** Navigate to /apogee, verify full feature works.

**Dependencies:** ApogeeProvider (4.2), ApogeeShell (8.5), ToolFrame (existing)

---

### 8.7 Keyboard Shortcuts
**File:** `src/features/apogee/model/useKeyboardShortcuts.ts`

Implement keyboard navigation:

- `Cmd/Ctrl + E` - Export current output
- `Cmd/Ctrl + Backspace` - Delete focused step
- `Cmd/Ctrl + ↑/↓` - Navigate between steps
- `Cmd/Ctrl + Enter` - Add transform (opens palette)

**Testing:** Test all shortcuts, verify accessibility.

**Dependencies:** Apogee Context (4.2)

---

### 8.9 Performance Optimizations (Future)

#### 8.9.1 Web Workers for Heavy Transforms
**File:** `src/features/apogee/lib/worker.ts`

Offload expensive operations:

- Create Web Worker for compression, large JSON parsing
- `executeInWorker(transformId, input, options): Promise<TransformResult>`
- Fallback to main thread for small inputs

**Testing:** Test with large inputs (>100KB), verify UI stays responsive.

**Dependencies:** Web Worker API

---

#### 8.9.2 Virtual Scrolling for Large Outputs
**File:** `src/features/apogee/ui/DataBlock.tsx`

Optimize rendering for large outputs:

- Integrate `react-window` for outputs >10,000 lines
- Maintain syntax highlighting performance
- Smooth scrolling experience

**Testing:** Render outputs with 50,000+ lines, verify smooth scrolling.

**Dependencies:** `react-window` library

---

#### 8.9.3 Debounced Property Updates
**File:** `src/features/apogee/model/useDocumentManager.ts`

Optimize re-execution:

- Debounce property updates (500ms) ✅ DONE
- Update local state immediately (no cursor jump)
- Trigger execution after idle period ✅ DONE

**Testing:** Type in text inputs, verify smooth typing with delayed execution.

**Dependencies:** Lodash debounce or custom implementation

---

### 8.10 Error Handling & Edge Cases

- Empty input states with helpful placeholders
- Invalid transform configurations (validation in property schemas)
- Missing transforms in registry (graceful degradation)
- Large data sets (virtual scrolling, web workers)
- LocalStorage quota exceeded (fallback to session storage)

**Testing:** Test all error scenarios, verify user-friendly messages.

---

### 8.11 Accessibility & Dark Mode

- Ensure all interactive elements are keyboard accessible
- ARIA labels for screen readers
- Dark mode support (inherit from existing theme)
- Focus indicators for keyboard navigation
- Semantic HTML structure


**Testing:** Test with keyboard only, verify screen reader compatibility.

---

## Summary of Phases

1. **Phase 1**: Core Infrastructure ✅ DONE
   - Types, transform registry, execution engine, lens placeholders

2. **Phase 2**: Format Entity Layer ✅ DONE
   - JSON, CSV, YAML, XML, TOML parsers/serializers

3. **Phase 3**: Initial Transform Implementations ✅ DONE
   - 22 transforms across 5 categories (Convert, Encode, Decode, Hash, Modify)

4. **Phase 4**: State Management ✅ DONE
   - useDocumentManager hook, ApogeeProvider context, LocalStorage persistence

5. **Phase 5**: Transform Catalog Expansion ❌ TODO
   - Additional Convert (YAML↔XML↔TOML)
   - Additional Encode/Decode (Base91, ASCII85, Z85, JWT, etc.)
   - Additional Hash (SHA-384, SHA-3, BLAKE3, Murmur3)
   - Additional Modify (regex-replace, sort-lines, extract-lines)
   - Compress/Decompress (Gzip, Bzip2, Brotli, Zstd)
   - Analyze (charts, frequency, validator, heatmap)

6. **Phase 6**: UI Components ✅ DONE
   - ConfigurationPanel, DataBlock, InputForm, TransformBlock, TransformPipeline

7. **Phase 7**: Advanced UI Features ❌ TODO
   - StatsBar, Lens configuration panel, Enhanced TransformPalette
   - Syntax highlighting integration

8. **Phase 8**: Advanced Features & Polish ❌ TODO
   - JSONPath & XPath support
   - Export actions (download, share, templates)
   - Additional transforms (future)
   - Performance optimizations (Web Workers, virtual scrolling)
   - Error handling & accessibility

Each phase builds on the previous, ensuring components can be tested in isolation before integration. The core execution engine worked by Phase 3, basic UI is functional after Phase 6, and advanced features are progressively added in Phases 7-8.

