# Converter Entity

Domain logic for bidirectional data format conversion and text transformation. This entity provides a modular architecture for implementing various transformation types.

## Overview

The converter entity is organized by transformation type, allowing for multiple converter implementations that can be composed and reused across features.

## Structure

```
converter/
├── csv-json/           # CSV ↔ JSON conversion
│   ├── lib/
│   ├── model/
│   └── index.ts
├── jwt/                # JWT decoding
│   ├── lib/
│   ├── model/
│   └── index.ts
├── text-case/          # Text case transformations
│   ├── lib/
│   ├── model/
│   └── index.ts
├── text-encoding/      # Text encoding/decoding
│   ├── lib/
│   ├── model/
│   └── index.ts
├── text-hash/          # Cryptographic hashing
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

### JWT Decoder

JWT (JSON Web Token) decoding and standard claim parsing.

**See**: [jwt/README.md](./jwt/README.md) for detailed documentation.

**Usage:**
```typescript
import { decodeJWT, isExpired, isNotYetValid } from "@/entities/converter";

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
- `@/entities/jwt` - JWT types and validation

## Design Principles

- **Modularity**: Each converter is self-contained
- **Composability**: Converters can use other entities
- **Type safety**: Full TypeScript support
- **Bidirectional**: Most converters should support both directions
- **Error handling**: Clear error messages for failed conversions

## Used By

- [csv-json-converter feature](../../features/csv-json-converter) - CSV/JSON conversion tool
- [jwt-decoder feature](../../features/jwt-decoder) - JWT decoder tool
