/**
 * Binary encoding and decoding transformations
 */

export function toBinary(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

export function fromBinary(str: string): string {
  try {
    return str
      .split(/\s+/)
      .filter((bin) => bin.length > 0)
      .map((bin) => String.fromCharCode(parseInt(bin, 2)))
      .join("");
  } catch {
    return "Error: Invalid binary string";
  }
}
