# Converter Entity

Domain logic for bidirectional data format conversion. This entity provides a modular architecture for implementing X-to-Y converters.

## Overview

The converter entity is organized by conversion type, allowing for multiple converter implementations that can be composed and reused across features.

## Structure

```
converter/
├── csv-json/           # CSV ↔ JSON conversion
│   ├── lib/
│   ├── model/
│   └── index.ts
└── index.ts            # Public API aggregating all converters
```

## Current Converters

### CSV-JSON Converter

Bidirectional conversion between CSV and JSON formats.

**See**: [csv-json/README.md](./csv-json/README.md) for detailed documentation.

**Usage:**
```typescript
import { csvToJson, jsonToCsv, detectInputFormat } from "@/entities/converter";

// Auto-detect format
const format = detectInputFormat(input); // "csv" or "json"

// CSV → JSON
const result = csvToJson(csvData, ",", true);

// JSON → CSV
const result = jsonToCsv(jsonData, ",", true);
```

## Adding New Converters

To add a new X-to-Y converter:

1. Create a new subdirectory: `converter/x-y/`
2. Implement conversion logic in `x-y/lib/`
3. Define types in `x-y/model/types.ts`
4. Export public API via `x-y/index.ts`
5. Re-export from `converter/index.ts`
6. Add documentation in `x-y/README.md`

**Example structure for a hypothetical YAML-JSON converter:**

```
converter/
├── yaml-json/
│   ├── lib/
│   │   ├── yaml-to-json.ts
│   │   └── json-to-yaml.ts
│   ├── model/
│   │   └── types.ts
│   ├── index.ts
│   └── README.md
└── index.ts  # exports from yaml-json
```

## Dependencies

This entity composes lower-level domain entities:
- `@/entities/csv` - CSV parsing and escaping
- `@/entities/json` - JSON manipulation utilities

## Design Principles

- **Modularity**: Each converter is self-contained
- **Composability**: Converters can use other entities
- **Type safety**: Full TypeScript support
- **Bidirectional**: Most converters should support both directions
- **Error handling**: Clear error messages for failed conversions

## Used By

- [csv-json-converter feature](../../features/csv-json-converter) - CSV/JSON conversion tool
