export function isExpired(expiresAt: Date | undefined): boolean {
  if (!expiresAt) return false;
  return expiresAt < new Date();
}

export function isNotYetValid(notBefore: Date | undefined): boolean {
  if (!notBefore) return false;
  return notBefore > new Date();
}

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
