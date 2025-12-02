/**
 * SHA (Secure Hash Algorithm) transformations
 * Uses the Web Crypto API for secure, native implementations
 */

export async function toSha1(str: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "Error: SHA-1 hashing failed";
  }
}

export async function toSha256(str: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "Error: SHA-256 hashing failed";
  }
}

export async function toSha384(str: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-384", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "Error: SHA-384 hashing failed";
  }
}

export async function toSha512(str: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "Error: SHA-512 hashing failed";
  }
}
