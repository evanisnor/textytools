/**
 * ROT13 cipher transformation (its own inverse)
 */

export function toRot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= "Z" ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - start + 13) % 26) + start,
    );
  });
}

// ROT13 is its own inverse
export const fromRot13 = toRot13;
