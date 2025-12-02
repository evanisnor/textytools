/**
 * TOML formatting utilities for Apogee transforms
 */

import * as TOML from "@iarna/toml";

export interface TomlFormatOptions {
  formatting?: "compact" | "expanded";
}

/**
 * Format data as TOML with customizable options
 */
export function formatTOML(
  data: unknown,
  options: TomlFormatOptions = {},
): string {
  const { formatting = "expanded" } = options;

  try {
    // @iarna/toml doesn't support formatting options directly
    // We'll use the default formatter
    const tomlString = TOML.stringify(data as TOML.JsonMap);

    // Apply formatting preference
    if (formatting === "compact") {
      // Remove extra blank lines
      return tomlString.replace(/\n\n+/g, "\n");
    }

    return tomlString;
  } catch (err) {
    throw new Error(
      `Failed to format TOML: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }
}
