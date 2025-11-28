/**
 * Checks if a JWT expiration date has passed.
 */
export function isExpired(expiresAt: Date | undefined): boolean {
  if (!expiresAt) return false;
  return expiresAt < new Date();
}

/**
 * Checks if a JWT is not yet valid based on the "not before" claim.
 */
export function isNotYetValid(notBefore: Date | undefined): boolean {
  if (!notBefore) return false;
  return notBefore > new Date();
}

/**
 * Formats a date for display.
 */
export function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}
