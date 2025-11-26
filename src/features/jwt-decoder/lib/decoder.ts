import type { DecodedJWT } from "../model/types";

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if needed
  const pad = base64.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error("Invalid base64url string");
    }
    base64 += new Array(5 - pad).join("=");
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } catch {
    throw new Error("Invalid base64url encoding");
  }
}

export function decodeJWT(token: string): DecodedJWT {
  const parts = token.trim().split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
  }

  try {
    const headerJson = base64UrlDecode(parts[0]);
    const payloadJson = base64UrlDecode(parts[1]);

    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);

    const result: DecodedJWT = {
      header,
      payload,
      signature: parts[2],
      isValid: true,
      algorithm: header.alg,
    };

    // Parse standard claims
    if (typeof payload.exp === "number") {
      result.expiresAt = new Date(payload.exp * 1000);
    }
    if (typeof payload.iat === "number") {
      result.issuedAt = new Date(payload.iat * 1000);
    }
    if (typeof payload.nbf === "number") {
      result.notBefore = new Date(payload.nbf * 1000);
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Decode error: ${error.message}`
        : "Failed to decode JWT",
    );
  }
}
