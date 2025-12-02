/**
 * XML entity - Parsing and formatting for XML documents
 */

// Parsing and validation
export { parseXML, validateXML } from "./lib/parse";
export type { XmlParseResult } from "./lib/parse";

// Formatting
export { formatXML, jsonToXML, xmlToJSON } from "./lib/format";
export type { XmlFormatOptions } from "./lib/format";

// Statistics
export { getXMLStats } from "./lib/stats";
export type { XmlStats } from "./lib/stats";
