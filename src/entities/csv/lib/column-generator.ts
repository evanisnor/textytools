/**
 * Generates column letters (a, b, c, ..., z, aa, ab, ...) for CSV columns.
 * Used when CSV data has no headers.
 */
export function generateColumnLetter(index: number): string {
  let result = "";
  let num = index;

  while (num >= 0) {
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26) - 1;
  }

  return result;
}
