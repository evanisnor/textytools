# YAML Entity

Parsing, formatting, and statistics utilities for YAML documents.

## Features

- **Parse YAML** - Convert YAML strings to JavaScript objects with error handling
- **Validate YAML** - Check YAML validity without parsing
- **Format YAML** - Serialize data to YAML with customizable indentation and version
- **Statistics** - Extract metadata (document count, validity)

## Usage

```typescript
import {
  parseYAML,
  validateYAML,
  formatYAML,
  getYAMLStats,
} from "@/entities/yaml";

// Parse YAML
const result = parseYAML("key: value");
if (result.success) {
  console.log(result.data); // { key: 'value' }
}

// Validate YAML
const { valid, error } = validateYAML("invalid: [unclosed");
console.log(valid); // false

// Format data as YAML
const yamlString = formatYAML(
  { name: "Alice", age: 30 },
  { indentation: 2, version: "1.2" },
);
console.log(yamlString);
// name: Alice
// age: 30

// Get statistics
const stats = getYAMLStats({ key: "value" });
console.log(stats); // { documentCount: 1, valid: true }
```

## Dependencies

- `js-yaml` - YAML parsing and serialization
