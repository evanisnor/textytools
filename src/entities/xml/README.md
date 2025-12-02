# XML Entity

Parsing, formatting, and statistics utilities for XML documents using browser APIs.

## Features

- **Parse XML** - Convert XML strings to DOM Document with error handling
- **Validate XML** - Check XML validity without parsing
- **Format XML** - Pretty-print XML with customizable indentation
- **JSON ↔ XML** - Convert between JSON and XML formats
- **Statistics** - Extract metadata (node count, namespace count)

## Usage

```typescript
import {
  parseXML,
  validateXML,
  formatXML,
  jsonToXML,
  xmlToJSON,
  getXMLStats,
} from "@/entities/xml";

// Parse XML
const result = parseXML("<root><item>value</item></root>");
if (result.success && result.data) {
  console.log(result.data);
}

// Validate XML
const { valid, error } = validateXML("<invalid>");
console.log(valid); // false

// Format XML
const xmlDoc = parseXML("<root><item>value</item></root>").data;
if (xmlDoc) {
  const formatted = formatXML(xmlDoc, { indentation: 2 });
  console.log(formatted);
}

// JSON to XML
const xmlString = jsonToXML(
  { name: "Alice", age: 30 },
  { rootElementName: "person", preferAttributes: false },
);
console.log(xmlString);

// XML to JSON
const json = xmlToJSON(xmlDoc);
console.log(json);

// Get statistics
const stats = getXMLStats(xmlDoc);
console.log(stats); // { nodeCount: 2, namespaceCount: 0 }
```

## Dependencies

- Browser APIs: `DOMParser`, `XMLSerializer`
