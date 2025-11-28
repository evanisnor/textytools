# JWT Decoder

JWT (JSON Web Token) decoding and parsing.

## Overview

This converter decodes base64url-encoded JWTs and parses standard claims. It uses the [jwt entity](../../jwt) for type definitions and validation utilities.

## Structure

```
jwt/
├── lib/
│   └── decoder.ts       # JWT decoding logic
├── model/
│   └── types.ts         # Conversion result types
└── index.ts             # Public API
```

## Usage

### Decoding JWTs

```typescript
import { decodeJWT } from "@/entities/converter";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.abc123";

try {
  const decoded = decodeJWT(token);
  console.log(decoded.header);   // { alg: "HS256", typ: "JWT" }
  console.log(decoded.payload);  // { sub: "1234" }
  console.log(decoded.algorithm);// "HS256"
} catch (error) {
  console.error("Invalid JWT:", error.message);
}
```

### Standard Claims

The decoder automatically parses standard JWT claims:

```typescript
const decoded = decodeJWT(tokenWithClaims);

// Expiration time (exp)
if (decoded.expiresAt) {
  console.log("Expires:", decoded.expiresAt);
}

// Issued at (iat)
if (decoded.issuedAt) {
  console.log("Issued:", decoded.issuedAt);
}

// Not before (nbf)
if (decoded.notBefore) {
  console.log("Not before:", decoded.notBefore);
}
```

### Validation

```typescript
import { decodeJWT, isExpired, isNotYetValid } from "@/entities/converter";

const decoded = decodeJWT(token);

if (isExpired(decoded.expiresAt)) {
  console.log("Token has expired");
}

if (isNotYetValid(decoded.notBefore)) {
  console.log("Token not yet valid");
}
```

## API Reference

### `decodeJWT(token: string): DecodedJWT`

Decodes a JWT token string.

**Process:**
1. Splits token into header, payload, signature
2. Base64url-decodes header and payload
3. Parses JSON
4. Extracts standard claims (exp, iat, nbf)
5. Converts Unix timestamps to Date objects

**Parameters:**
- `token` - JWT string in format `header.payload.signature`

**Returns:** `DecodedJWT` object

**Throws:**
- Invalid JWT format (not 3 parts)
- Invalid base64url encoding
- Invalid JSON in header/payload

### Re-exported Functions

These functions are re-exported from the [jwt entity](../../jwt):

**`isExpired(expiresAt: Date | undefined): boolean`**
- Checks if expiration date has passed

**`isNotYetValid(notBefore: Date | undefined): boolean`**
- Checks if "not before" date is in the future

**`formatDate(date: Date): string`**
- Formats date for display

## Types

```typescript
interface JWTDecodeResult {
  success: boolean;
  decoded: DecodedJWT | null;
  error: string | null;
}
```

See [jwt entity types](../../jwt#types) for `DecodedJWT` and `EncodedJWT` definitions.

## Security Notes

- This decoder **does NOT verify signatures**
- It only decodes and parses the token structure
- For production use, always verify JWT signatures server-side
- This tool is for inspection and debugging only

## Base64url Encoding

JWTs use base64url encoding (RFC 4648):
- URL-safe: `-` instead of `+`, `_` instead of `/`
- No padding characters (`=`) in the encoded string
- The decoder handles padding automatically

## Dependencies

This converter imports from:
- `@/entities/jwt` - Type definitions and validation utilities

## Design Principles

- **Read-only**: Decodes tokens without modification
- **Client-side**: No server communication required
- **RFC 7519 compliant**: Follows JWT standard
- **Error handling**: Clear error messages for invalid tokens

## Used By

- [jwt-decoder feature](../../../features/jwt-decoder) - JWT decoder tool
