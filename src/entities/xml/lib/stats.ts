/**
 * XML statistics utilities for Apogee transforms
 */

export interface XmlStats {
  nodeCount: number;
  namespaceCount: number;
}

/**
 * Calculate statistics for XML Document
 */
export function getXMLStats(doc: Document): XmlStats {
  const nodeCount = countNodes(doc.documentElement);
  const namespaceCount = countNamespaces(doc);

  return {
    nodeCount,
    namespaceCount,
  };
}

/**
 * Count all element nodes recursively
 */
function countNodes(element: Element): number {
  let count = 1; // Count this element

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (child.nodeType === 1) {
      // Element node
      count += countNodes(child as Element);
    }
  }

  return count;
}

/**
 * Count unique namespaces in document
 */
function countNamespaces(doc: Document): number {
  const namespaces = new Set<string>();

  function collectNamespaces(element: Element) {
    if (element.namespaceURI) {
      namespaces.add(element.namespaceURI);
    }

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      if (child.nodeType === 1) {
        collectNamespaces(child as Element);
      }
    }
  }

  collectNamespaces(doc.documentElement);
  return namespaces.size;
}
