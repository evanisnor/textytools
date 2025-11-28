# Text Hash Entity

Cryptographic and non-cryptographic hash functions for text following FSD principles.

## Overview

The text-hash entity provides hash functions for generating fixed-size digests from text input. These are one-way transformations (not reversible).

## Structure

```
text-hash/
├── index.ts                    # Public API exports
├── README.md                   # Documentation
├── model/
│   └── types.ts               # Type definitions
└── lib/
    ├── md5.ts                 # MD5 hash
    ├── md5-utils.ts           # MD5 internal utilities
    └── sha.ts                 # SHA family (SHA-1, SHA-256, SHA-512)
```

## Supported Hash Functions

### MD5
- **Algorithm**: MD5 (Message Digest 5)
- **Output**: 128-bit (32 hex characters)
- **Warning**: Cryptographically broken, use for non-security purposes only
- **Implementation**: Pure JavaScript

### SHA Family (Web Crypto API)
- **SHA-1**: 160-bit (40 hex characters) - Deprecated for security
- **SHA-256**: 256-bit (64 hex characters) - Recommended
- **SHA-512**: 512-bit (128 hex characters) - High security

## Usage

```typescript
import { toMd5, toSha256, toSha512 } from "@/entities/transform";

// MD5 (synchronous)
const md5Hash = toMd5("Hello, World!");
// "65a8e27d8879283831b664bd8b7f0ad4"

// SHA-256 (async)
const sha256Hash = await toSha256("Hello, World!");
// "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f"

// SHA-512 (async)
const sha512Hash = await toSha512("Hello, World!");
// "374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6c..."
```

## Type Safety

```typescript
import type { HashType } from "@/entities/transform";

const hashType: HashType = "sha256"; // "md5" | "sha1" | "sha256" | "sha512"
```

## Security Considerations

### ⚠️ Not for Security
- **MD5**: Completely broken, collisions easily generated
- **SHA-1**: Deprecated, collisions demonstrated

### ✅ Suitable for Security
- **SHA-256**: Industry standard, widely used
- **SHA-512**: Higher security margin, future-proof

### Use Cases

**MD5**: 
- Checksums for non-security purposes
- Legacy system compatibility
- Fast hashing for non-critical data

**SHA-256/SHA-512**:
- Password hashing (with salt and iterations)
- Digital signatures
- Data integrity verification
- Secure tokens

## Implementation Details

- **MD5**: Pure JavaScript implementation (synchronous)
- **SHA**: Web Crypto API (`crypto.subtle.digest`) (asynchronous)
- **Error Handling**: Returns error message strings on failure
- **Browser Support**: All modern browsers support Web Crypto API

## Design Principles

- **One-way**: Hash functions are not reversible
- **Deterministic**: Same input always produces same output
- **Fixed-size**: Output length determined by algorithm
- **Type-safe**: Full TypeScript support
- **Async-aware**: SHA functions return Promises

## Adding New Hash Functions

1. Create a new file in `lib/` or add to existing file
2. Implement `toX` function (async if using Web Crypto)
3. Export from `index.ts`
4. Add to `HashType` in `model/types.ts`
5. Update this README with security considerations
