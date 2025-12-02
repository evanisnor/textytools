/**
 * YAML statistics utilities for Apogee transforms
 */

export interface YamlStats {
  documentCount: number;
  valid: boolean;
}

/**
 * Calculate statistics for YAML data
 * Note: js-yaml.loadAll can parse multi-document YAML
 */
export function getYAMLStats(data: unknown): YamlStats {
  // For now, we only support single documents
  // Multi-document support can be added later
  return {
    documentCount: 1,
    valid: data !== null && data !== undefined,
  };
}
