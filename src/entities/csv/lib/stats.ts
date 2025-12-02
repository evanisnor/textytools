/**
 * CSV statistics utilities for Apogee transforms
 */

export interface CsvStats {
  rowCount: number;
  columnCount: number;
}

/**
 * Calculate statistics for CSV data
 */
export function getCSVStats(data: string[][]): CsvStats {
  if (!data || data.length === 0) {
    return {
      rowCount: 0,
      columnCount: 0,
    };
  }

  return {
    rowCount: data.length,
    columnCount: data[0]?.length || 0,
  };
}
