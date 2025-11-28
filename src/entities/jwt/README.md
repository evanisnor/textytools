# JWT Entity

Domain logic for JSON Web Token (JWT) validation and manipulation.

## Overview

The JWT entity provides core utilities for working with JWTs:
- Type definitions for encoded and decoded tokens
- Validation of standard claims (exp, iat, nbf)
- Date formatting utilities

## Structure

```
jwt/
├── lib/
│   └── validators.ts    # Claim validation functions
├── model/
│   └── types.ts         # Type definitions
├── ui/
│   └── JwtHighlighter.tsx # JWT syntax highlighting component
└── index.ts             # Public API
```

## Usage

### Types

```typescript
import type { EncodedJWT, DecodedJWT } from "@/entities/jwt";

// Encoded JWT (raw header/payload structure)
const header: EncodedJWT = {
  alg: "HS256",
  typ: "JWT"
};

// Decoded JWT (with parsed claims)
const decoded: DecodedJWT = {
  header: { alg: "HS256", typ: "JWT" },
  payload: { sub: "1234", exp: 1735344000 },
  signature: "abc123...",
  isValid: true,
  algorithm: "HS256",
  expiresAt: new Date("2024-12-28"),
  issuedAt: new Date("2024-11-27"),
};
```

###Validation

```typescript
import { isExpired, isNotYetValid } from "@/entities/jwt";

// Check if token is expired
const expired = isExpired(decoded.expiresAt);

// Check if token is not yet valid
const notYet = isNotYetValid(decoded.notBefore);
```

### Date Formatting

```typescript
import { formatDate } from "@/entities/jwt";

const formatted = formatDate(new Date());
// "Nov 27, 2024, 09:15:00 PM PST"
```

### JWT Highlighting

```typescript
import { highlightJWT } from "@/entities/jwt";

function TokenDisplay({ token }: { token: string }) {
  return <div>{highlightJWT(token)}</div>;
}
```

This returns a React element with color-coded sections:
- Header: Blue background
- Payload: Green background
- Signature: Purple background

## API Reference

### Types

**`EncodedJWT`**
```typescript
interface EncodedJWT {
  [key: string]: unknown;
}
```
Represents JWT components (header/payload) in their raw form.

**`DecodedJWT`**
```typescript
interface DecodedJWT {
  header: EncodedJWT;
  payload: EncodedJWT;
  signature: string;
  isValid: boolean;
  algorithm?: string;
  expiresAt?: Date;
  issuedAt?: Date;
  notBefore?: Date;
}
```
Represents a fully decoded JWT with parsed standard claims.

### Functions

**`isExpired(expiresAt: Date | undefined): boolean`**

Checks if the expiration date has passed.

**`isNotYetValid(notBefore: Date | undefined): boolean`**

Checks if the "not before" date is in the future.

**`formatDate(date: Date): string`**

Formats a date for display with locale-aware formatting.

**`highlightJWT(jwt: string): JSX.Element`**

Returns a React element with color-coded JWT sections. If the string is not a valid 3-part JWT, returns the string unchanged.

## Standard JWT Claims

This entity supports validation of standard JWT claims:

- `exp` (Expiration Time) - Converted to `expiresAt` Date
- `iat` (Issued At) - Converted to `issuedAt` Date
- `nbf` (Not Before) - Converted to `notBefore` Date

## Design Principles

- **Type safety**: Full TypeScript support for JWT structures
- **Pure functions**: All validators are side-effect free
- **Reusability**: Designed for use across multiple features
- **RFC 7519 compliance**: Follows JWT standard

## Used By

- [converter/jwt](../converter/jwt) - JWT decoding
- [jwt-decoder feature](../../features/jwt-decoder) - JWT decoder tool
