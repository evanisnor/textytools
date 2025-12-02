/**
 * YAML formatting utilities for Apogee transforms
 */

import * as yaml from "js-yaml";

export interface YamlFormatOptions {
  indentation?: number;
  version?: "1.1" | "1.2";
}

/**
 * Format data as YAML with customizable options
 */
export function formatYAML(
  data: unknown,
  options: YamlFormatOptions = {},
): string {
  const { indentation = 2, version = "1.2" } = options;

  try {
    return yaml.dump(data, {
      indent: indentation,
      lineWidth: -1, // No line wrapping
      noRefs: true, // No anchors/references
      schema: version === "1.1" ? yaml.FAILSAFE_SCHEMA : yaml.DEFAULT_SCHEMA,
    });
  } catch (err) {
    throw new Error(
      `Failed to format YAML: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }
}
