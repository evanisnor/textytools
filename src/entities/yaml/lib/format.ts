/**
 * YAML formatting utilities for Apogee transforms
 */

import * as yaml from "js-yaml";

export interface YamlFormatOptions {
  indentation?: number;
  useTabs?: boolean;
  version?: "1.1" | "1.2";
}

/**
 * Format data as YAML with customizable options
 */
export function formatYAML(
  data: unknown,
  options: YamlFormatOptions = {},
): string {
  const { indentation = 2, useTabs = false, version = "1.2" } = options;

  try {
    // Always use 2-space indent with js-yaml to avoid dash-on-own-line issue
    let output = yaml.dump(data, {
      indent: 2,
      lineWidth: -1, // No line wrapping
      noRefs: true, // No anchors/references
      noArrayIndent: true, // Keep array items inline with dash
      schema: version === "1.1" ? yaml.FAILSAFE_SCHEMA : yaml.DEFAULT_SCHEMA,
    });

    // If indentation is not 2 or tabs requested, adjust indentation
    if (indentation !== 2 || useTabs) {
      const lines = output.split("\n");
      let prevWasDash = false;

      const adjusted = lines.map((line) => {
        // Match leading spaces
        const match = line.match(/^( *)/);
        if (!match || match[1].length === 0) {
          prevWasDash = false;
          return line;
        }

        const spaces = match[1].length;
        const content = line.substring(spaces);

        // Check if this line starts with a dash (array item)
        const isDashLine = content.startsWith("- ");

        // Determine indentation level
        // Lines with dashes are at their structural level
        // Lines following dashes (array item properties) have +2 offset
        let level: number;
        let extraOffset = 0;

        if (isDashLine) {
          level = spaces / 2;
          prevWasDash = true;
        } else if (prevWasDash && spaces > 0) {
          // This is a property of the previous array item
          // It has base level + 2 space offset
          level = (spaces - 2) / 2;
          extraOffset = 2;
          // Keep prevWasDash true for subsequent properties
        } else {
          level = spaces / 2;
          prevWasDash = false;
        }

        if (useTabs) {
          return "\t".repeat(level) + (extraOffset > 0 ? "  " : "") + content;
        } else {
          return " ".repeat(level * indentation + extraOffset) + content;
        }
      });
      output = adjusted.join("\n");
    }

    return output;
  } catch (err) {
    throw new Error(
      `Failed to format YAML: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }
}
