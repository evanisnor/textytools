# Transform Entity

Domain logic for bidirectional data format conversion and text transformation. This entity provides a modular architecture for implementing various transformation types.

## Overview

The transform entity is organized by transformation type, allowing for multiple transform implementations that can be composed and reused across features.

**Note**: Many transforms now include Apogee-compatible `TransformDefinition` exports for use in the Apogee pipeline. See individual transform READMEs for details.

## Structure

```
transform/
├── csv-convert/        # CSV conversion (Apogee)
├── csv-json/           # CSV ↔ JSON conversion (legacy)
├── json-convert/       # JSON conversion (Apogee)
├── jwt/                # JWT decoding
├── regex-match-csv/    # Regex match to CSV
├── regex-match-json/   # Regex match to JSON
├── text-case/          # Text case transformations
├── text-encoding/      # Text encoding/decoding (Apogee support)
├── text-hash/          # Cryptographic hashing (Apogee support)
├── text-sanitize/      # Text cleanup
├── toml-convert/       # TOML conversion (Apogee)
├── xml-convert/        # XML conversion (Apogee)
├── yaml-convert/       # YAML conversion (Apogee)
└── index.ts            # Public API aggregating all transforms
```

## Current Transforms

### Apogee Format Conversion Transforms

The following transforms are designed for use in the Apogee pipeline and include `TransformDefinition` exports:

#### JSON Convert
Parse and convert various formats (JSON, CSV, YAML, XML, TOML) to JSON with formatting options.

**Location**: [json-convert/](./json-convert/)

**Usage**:
```typescript
import { jsonConvertDefinition } from "@/entities/transform/json-convert";

// Register in Apogee pipeline or use directly
const result = jsonConvertDefinition.execute(input, {
  indentation: "2",
  sortKeys: true,
  minify: false,
});
```

#### CSV Convert
Convert JSON or CSV to CSV format with customizable delimiters.

**Location**: [csv-convert/](./csv-convert/)

#### YAML Convert
Parse and convert data to YAML format with version control.

**Location**: [yaml-convert/](./yaml-convert/)

#### XML Convert
Parse and convert data to XML with JSON interoperability.

**Location**: [xml-convert/](./xml-convert/)

#### TOML Convert
Parse and convert data to TOML configuration format.

**Location**: [toml-convert/](./toml-convert/)

### Text Encoding Transforms (Apogee Support)

Bidirectional encoding/decoding with `TransformDefinition` exports:

- **Base64 Encode/Decode** - Standard Base64 encoding
- **Base58 Encode/Decode** - Bitcoin-style encoding
- **Hex Encode/Decode** - Hexadecimal representation
- **URL Encode** - URL-safe encoding
- **HTML Entity Encode** - HTML special character encoding

**Location**: [text-encoding/](./text-encoding/)

**Usage**:
```typescript
import { base64EncodeDefinition } from "@/entities/transform/text-encoding";

// Use in Apogee pipeline
const result = base64EncodeDefinition.execute(input, {});
```

### Text Hashing Transforms (Apogee Support)

Cryptographic hashing with security warnings:

- **MD5 Hash** - Legacy, with deprecation warning
- **SHA-1 Hash** - Legacy, with deprecation warning
- **SHA-256 Hash** - Secure, recommended
- **SHA-512 Hash** - Maximum security

**Location**: [text-hash/](./text-hash/)

**Usage**:
```typescript
import { sha256HashDefinition } from "@/entities/transform/text-hash";

// Use in Apogee pipeline (async supported)
const result = await sha256HashDefinition.execute(input, {});
```

---

### Legacy Transforms

#### CSV-JSON Converter

Bidirectional conversion between CSV and JSON formats.

**See**: [csv-json/README.md](./csv-json/README.md) for detailed documentation.

**Usage:**
```typescript
import { csvToJson, jsonToCsv, detectInputFormat } from "@/entities/transform";

// Auto-detect format
const format = detectInputFormat(input); // "csv" or "json"

// CSV → JSON
const result = csvToJson(csvData, ",", true);

// JSON → CSV
const result = jsonToCsv(jsonData, ",", true);
```

### JWT Decoder

JWT (JSON Web Token) decoding and standard claim parsing.

**See**: [jwt/README.md](./jwt/README.md) for detailed documentation.

## Apogee Integration

Transforms with `TransformDefinition` exports are automatically registered in the Apogee pipeline via the transform registry:

```typescript
import { getTransform, getTransformsByCategory } from "@/features/apogee/lib/registry";

// Get a specific transform
const jsonTransform = getTransform("json-convert");

// Get all convert transforms
const convertTransforms = getTransformsByCategory("convert");
```

See [Apogee README](../../features/apogee/README.md) for pipeline documentation.

## Used By

- **[apogee feature](../../features/apogee)** - Transformation pipeline (primary consumer)
- [csv-json-converter feature](../../features/csv-json-converter) - CSV/JSON conversion tool
- [jwt-decoder feature](../../features/jwt-decoder) - JWT decoder tool
// Decode JWT
const decoded = decodeJWT(token);

// Validate claims
const expired = isExpired(decoded.expiresAt);
const notYet = isNotYetValid(decoded.notBefore);
```

### Text Encoding

Bidirectional text encoding and decoding transformations (Base64, Base58, URL, HTML, Hex, Binary, Morse, etc.).

**See**: [text-encoding/README.md](./text-encoding/README.md) for detailed documentation.

**Usage:**
```typescript
import { toBase64, fromBase64, toHex, fromHex, toMorse } from "@/entities/transform";

const encoded = toBase64("Hello");
const decoded = fromBase64(encoded);
const hex = toHex("ABC");
const morse = toMorse("SOS");
```

### Text Hashing

One-way cryptographic and non-cryptographic hash functions (MD5, SHA-1, SHA-256, SHA-512).

**See**: [text-hash/README.md](./text-hash/README.md) for detailed documentation.

**Usage:**
```typescript
import { toMd5, toSha256, toSha512 } from "@/entities/transform";

const md5 = toMd5("Hello");
const sha256 = await toSha256("Hello");
const sha512 = await toSha512("Hello");
```

## Adding New Transforms

To add a new X-to-Y transform:

1. Create a new subdirectory: `transform/x-y/`
2. Implement conversion logic in `x-y/lib/`
3. Define types in `x-y/model/types.ts`
4. Export public API via `x-y/index.ts`
5. Re-export from `transform/index.ts`
6. Add documentation in `x-y/README.md`

**Example structure for a hypothetical YAML-JSON transform:**

```
transform/
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
- `@/entities/jwt` - JWT types and validation

## Design Principles

- **Modularity**: Each transform is self-contained
- **Composability**: Transforms can use other entities
- **Type safety**: Full TypeScript support
- **Bidirectional**: Most transforms should support both directions
- **Error handling**: Clear error messages for failed transformations

## Used By

- [csv-json-converter feature](../../features/csv-json-converter) - CSV/JSON conversion tool
- [jwt-decoder feature](../../features/jwt-decoder) - JWT decoder tool
