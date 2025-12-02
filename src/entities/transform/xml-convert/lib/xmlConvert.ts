/**
 * XML Convert Transform
 * Converts various formats to XML with formatting options
 */

import type { TransformResult, PropertySchema } from "../../shared/types";

import { parseJSON } from "@/entities/json";
import { parseTOML } from "@/entities/toml";
import {
  parseXML,
  formatXML,
  jsonToXML,
  getXMLStats,
  type XmlFormatOptions,
} from "@/entities/xml";
import { parseYAML } from "@/entities/yaml";

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
 * Parse input data
 */
function parseInput(input: string): {
  success: boolean;
  data?: unknown;
  isXml?: boolean;
  xmlDoc?: Document;
  error?: string;
} {
  // Try XML first - if it's XML, keep the Document object
  const xmlResult = parseXML(input);
  if (xmlResult.success && xmlResult.data) {
    return { success: true, isXml: true, xmlDoc: xmlResult.data };
  }

  // Try JSON
  const jsonResult = parseJSON(input);
  if (jsonResult.success) {
    return { success: true, data: jsonResult.data };
  }

  // Try YAML
  const yamlResult = parseYAML(input);
  if (yamlResult.success) {
    return { success: true, data: yamlResult.data };
  }

  // Try TOML
  const tomlResult = parseTOML(input);
  if (tomlResult.success) {
    return { success: true, data: tomlResult.data };
  }

  return {
    success: false,
    error: "Unable to parse input. Supported formats: XML, JSON, YAML, TOML",
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
