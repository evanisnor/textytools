# TOML Entity

Parsing, formatting, and statistics utilities for TOML documents.

## Features

- **Parse TOML** - Convert TOML strings to JavaScript objects with error handling
- **Validate TOML** - Check TOML validity without parsing
- **Format TOML** - Serialize data to TOML with formatting options
- **Statistics** - Extract metadata (table count, validity)

## Usage

```typescript
import {
  parseTOML,
  validateTOML,
  formatTOML,
  getTOMLStats,
} from "@/entities/toml";

// Parse TOML
const result = parseTOML("[database]\nserver = '192.168.1.1'");
if (result.success) {
  console.log(result.data); // { database: { server: '192.168.1.1' } }
}

// Validate TOML
const { valid, error } = validateTOML("invalid = [unclosed");
console.log(valid); // false

// Format data as TOML
const tomlString = formatTOML(
  { database: { server: "192.168.1.1", port: 5432 } },
  { formatting: "expanded" },
);
console.log(tomlString);

// Get statistics
const stats = getTOMLStats({ database: {}, server: {} });
console.log(stats); // { tableCount: 2, valid: true }
```

## Dependencies

- `@iarna/toml` - TOML parsing and serialization
