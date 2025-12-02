/**
 * TOML statistics utilities for Apogee transforms
 */

export interface TomlStats {
  tableCount: number;
  valid: boolean;
}

/**
 * Calculate statistics for TOML data
 */
export function getTOMLStats(data: unknown): TomlStats {
  if (!data || typeof data !== "object") {
    return {
      tableCount: 0,
      valid: false,
    };
  }

  return {
    tableCount: countTables(data),
    valid: true,
  };
}

/**
 * Count top-level tables in TOML data
 */
function countTables(obj: unknown): number {
  if (!obj || typeof obj !== "object") {
    return 0;
  }

  return Object.keys(obj).length;
}
