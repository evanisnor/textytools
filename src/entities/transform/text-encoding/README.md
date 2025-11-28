# Text Encoding Entity

Bidirectional text encoding and transformation functions following FSD principles.

## Overview

The text-encoding entity provides pure transformation functions for encoding and decoding text in various formats. All transformations are stateless, testable, and reusable across features.

## Structure

```
text-encoding/
├── index.ts                    # Public API exports
├── README.md                   # Documentation
├── model/
│   └── types.ts               # Type definitions
└── lib/
    ├── constants.ts           # Shared lookup tables
    ├── encoding/              # Base encoding formats
    │   ├── base64.ts
    │   ├── base58.ts
    │   ├── base91.ts
    │   ├── ascii85.ts
    │   └── z85.ts
    └── text/                  # Text transformations
        ├── url.ts
        ├── html.ts
        ├── hex.ts
        ├── binary.ts
        ├── unicode.ts
        ├── rot13.ts
        ├── morse.ts
        └── quoted-printable.ts
```

## Supported Encodings

### Base Encodings
- **Base64**: Standard base64 encoding/decoding
- **Base58**: Bitcoin-style base58 (no 0, O, I, l)
- **Base91**: Efficient printable ASCII encoding
- **ASCII85**: Adobe's base-85 encoding (with `<~` `~>` delimiters)
- **Z85**: ZeroMQ's base-85 variant

### Text Transformations
- **URL**: URL encoding/decoding (percent-encoding)
- **HTML**: HTML entity encoding/decoding
- **Hex**: Hexadecimal encoding/decoding
- **Binary**: Binary (base-2) encoding/decoding
- **Unicode**: Unicode escape sequences (`\uXXXX`)
- **ROT13**: ROT13 cipher (its own inverse)
- **Morse**: Morse code encoding/decoding
- **Quoted-Printable**: MIME quoted-printable encoding

## Usage

```typescript
import {
  toBase64,
  fromBase64,
  toHex,
  fromHex,
  toMorse,
  fromMorse,
} from "@/entities/transform";

// Base64
const encoded = toBase64("Hello, World!");  // "SGVsbG8sIFdvcmxkIQ=="
const decoded = fromBase64(encoded);        // "Hello, World!"

// Hexadecimal
const hex = toHex("ABC");                   // "41 42 43"
const text = fromHex("41 42 43");          // "ABC"

// Morse Code
const morse = toMorse("SOS");              // "... --- ..."
const original = fromMorse("... --- ...");  // "SOS"
```

## Type Safety

```typescript
import type { EncodingType, TransformDirection } from "@/entities/transform";

const type: EncodingType = "base64"; // Type-safe encoding selection
const direction: TransformDirection = "encode"; // "encode" | "decode"
```

## Design Principles

- **Pure functions**: All transformations are stateless
- **Bidirectional**: Each encoding has both encode and decode functions
- **Error handling**: Returns error messages as strings (no exceptions)
- **Browser-compatible**: Uses standard Web APIs where possible
- **Type-safe**: Full TypeScript support

## Dependencies

- `bs58`: For Base58 encoding/decoding

## Adding New Encodings

1. Create a new file in `lib/encoding/` or `lib/text/`
2. Implement `toX` and `fromX` functions
3. Export from `index.ts`
4. Add to `EncodingType` in `model/types.ts`
5. Update this README
