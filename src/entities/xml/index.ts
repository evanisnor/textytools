/**
 * XML entity - Parsing and formatting for XML documents
 */

// Parsing and validation
export { parseXML, validateXML, isXML } from "./lib/parse";
export type { XmlParseResult } from "./lib/parse";

// Formatting
export { formatXML, jsonToXML, xmlToJSON } from "./lib/format";
export type { XmlFormatOptions } from "./lib/format";

// Statistics
export { getXMLStats } from "./lib/stats";
export type { XmlStats } from "./lib/stats";

// UI components
export { highlightXml, DEFAULT_XML_THEME } from "./ui/XmlHighlighter";
export type { XmlSyntaxTheme } from "./ui/XmlHighlighter";

// Hooks
export { useXmlSyntaxHighlighter } from "./model/useXmlSyntaxHighlighter";
export type { XmlSyntaxRenderer } from "./model/useXmlSyntaxHighlighter";
