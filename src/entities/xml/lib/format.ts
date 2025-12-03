/**
 * XML formatting utilities for Apogee transforms
 */

export interface XmlFormatOptions {
  indentation?: number | "tab";
}

/**
 * Format XML Document with indentation
 * Note: Browser XMLSerializer doesn't preserve formatting, so we need custom logic
 */
export function formatXML(
  doc: Document,
  options: XmlFormatOptions = {},
): string {
  const { indentation = 2 } = options;
  const indent = indentation === "tab" ? "\t" : " ".repeat(indentation);

  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(doc);

  // Basic formatting: add newlines and indentation
  return prettifyXml(xmlString, indent);
}

/**
 * Convert JavaScript object to XML string
 */
export function jsonToXML(
  data: unknown,
  options: {
    rootElementName?: string;
    preferAttributes?: boolean;
    indentation?: number | "tab";
  } = {},
): string {
  const {
    rootElementName = "root",
    preferAttributes = false,
    indentation,
  } = options;

  const doc = document.implementation.createDocument(null, rootElementName);
  const root = doc.documentElement;

  buildXmlNode(root, data, preferAttributes);

  return formatXML(doc, indentation !== undefined ? { indentation } : {});
}

/**
 * Convert XML Document to JavaScript object
 */
export function xmlToJSON(doc: Document): unknown {
  const root = doc.documentElement;
  return parseXmlNode(root);
}

/**
 * Helper: Build XML nodes from data
 */
function buildXmlNode(
  parent: Element,
  data: unknown,
  preferAttributes: boolean,
): void {
  if (data === null || data === undefined) {
    return;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    for (const [key, value] of Object.entries(data)) {
      if (
        preferAttributes &&
        (typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean")
      ) {
        parent.setAttribute(key, String(value));
      } else {
        const child = parent.ownerDocument.createElement(key);
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          child.textContent = String(value);
        } else {
          buildXmlNode(child, value, preferAttributes);
        }
        parent.appendChild(child);
      }
    }
  } else if (Array.isArray(data)) {
    for (const item of data) {
      const child = parent.ownerDocument.createElement("item");
      buildXmlNode(child, item, preferAttributes);
      parent.appendChild(child);
    }
  } else {
    parent.textContent = String(data);
  }
}

/**
 * Helper: Parse XML node to JavaScript object
 */
function parseXmlNode(node: Element): unknown {
  // Check if node has only text content
  if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
    return node.textContent;
  }

  const result: Record<string, unknown> = {};

  // Parse attributes
  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i];
    result[`@${attr.name}`] = attr.value;
  }

  // Parse child elements
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.nodeType === 1) {
      // Element node
      const element = child as Element;
      const key = element.tagName;
      const value = parseXmlNode(element);

      if (result[key]) {
        // Multiple elements with same name - convert to array
        if (!Array.isArray(result[key])) {
          result[key] = [result[key]];
        }
        (result[key] as unknown[]).push(value);
      } else {
        result[key] = value;
      }
    }
  }

  return Object.keys(result).length > 0 ? result : node.textContent;
}

/**
 * Prettify XML string with indentation
 */
function prettifyXml(xml: string, indent: string): string {
  const reg = /(>)(<)(\/*)/g;
  let formatted = "";
  let pad = 0;

  xml = xml.replace(reg, "$1\n$2$3");

  xml.split("\n").forEach((node) => {
    let indent_level = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      // Same line open/close tag
      indent_level = 0;
    } else if (node.match(/^<\/\w/)) {
      // Closing tag
      if (pad > 0) pad -= 1;
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      // Opening tag
      indent_level = 1;
    }

    const padding = indent.repeat(pad);
    formatted += padding + node + "\n";
    pad += indent_level;
  });

  return formatted.trim();
}
