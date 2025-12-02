/**
 * XML Convert Transform
 * Converts various formats to XML with formatting options
 */

import { detectFormat, parseToIntermediate } from "../../shared";
import type { TransformResult, PropertySchema } from "../../shared/types";

import {
  parseXML,
  formatXML,
  jsonToXML,
  getXMLStats,
  type XmlFormatOptions,
} from "@/entities/xml";

/**
 * Property schema for XML conversion options
 */
export const xmlConvertPropertySchema: PropertySchema[] = [
  {
    key: "indentation",
    label: "Indentation",
    type: "toggle-group",
    options: [
      { value: "2", label: "2 spaces" },
      { value: "4", label: "4 spaces" },
      { value: "tab", label: "Tab" },
    ],
    defaultValue: "2",
  },
  {
    key: "rootElementName",
    label: "Root Element Name",
    type: "text",
    placeholder: "root",
    defaultValue: "root",
  },
  {
    key: "preferAttributes",
    label: "Prefer Attributes",
    type: "toggle",
    defaultValue: false,
  },
];

/**
 * Default properties for XML conversion
 */
export const xmlConvertDefaultProperties: Record<string, unknown> = {
  indentation: "2",
  rootElementName: "root",
  preferAttributes: false,
};

/**
 * Detect input format and parse
 * XML is special - if input is XML, we keep the Document object for reformatting
 * Otherwise, parse to intermediate representation
 */
function parseInput(input: string): {
  success: boolean;
  data?: unknown;
  isXml?: boolean;
  xmlDoc?: Document;
  error?: string;
} {
  const format = detectFormat(input);

  if (format === "unknown") {
    return {
      success: false,
      error:
        "Unable to detect input format. Supported: XML, JSON, YAML, TOML, CSV",
    };
  }

  // Special case: If input is XML, keep the Document object for reformatting
  if (format === "xml") {
    const xmlResult = parseXML(input);
    if (xmlResult.success && xmlResult.data) {
      return { success: true, isXml: true, xmlDoc: xmlResult.data };
    }
    return {
      success: false,
      error: xmlResult.error || "Failed to parse XML",
    };
  }

  // For other formats, convert to intermediate representation
  const parsed = parseToIntermediate(input, format);
  return {
    success: parsed.success,
    data: parsed.data,
    isXml: false,
    error: parsed.error,
  };
}

/**
 * Execute XML conversion transform
 */
export function executeXmlConvert(
  input: string,
  properties: Record<string, unknown>,
): TransformResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      data: "",
      error: "Input is empty",
      mimeType: "text/plain",
    };
  }

  const parseResult = parseInput(input);
  if (!parseResult.success) {
    return {
      success: false,
      data: "",
      error: parseResult.error || "Failed to parse input",
      mimeType: "text/plain",
    };
  }

  try {
    let output: string;
    let stats;

    if (parseResult.isXml && parseResult.xmlDoc) {
      // Input was already XML - just reformat
      const indentationValue = properties.indentation as string;
      const indentation =
        indentationValue === "tab" ? "tab" : Number(indentationValue);

      const formatOptions: XmlFormatOptions = { indentation };
      output = formatXML(parseResult.xmlDoc, formatOptions);
      stats = getXMLStats(parseResult.xmlDoc);
    } else {
      // Convert from other format to XML
      const rootElementName = (properties.rootElementName as string) || "root";
      const preferAttributes = properties.preferAttributes as boolean;

      output = jsonToXML(parseResult.data, {
        rootElementName,
        preferAttributes,
      });

      // Parse the generated XML to get stats
      const xmlResult = parseXML(output);
      if (xmlResult.success && xmlResult.data) {
        stats = getXMLStats(xmlResult.data);
      }
    }

    return {
      success: true,
      data: output,
      mimeType: "application/xml",
      stats: stats
        ? [
            { label: "Nodes", value: stats.nodeCount },
            { label: "Namespaces", value: stats.namespaceCount },
          ]
        : undefined,
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: `Failed to format XML: ${err instanceof Error ? err.message : "Unknown error"}`,
      mimeType: "text/plain",
    };
  }
}
