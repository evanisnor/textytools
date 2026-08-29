let sequence = 0;

export function createId(): string {
  sequence += 1;
  return `test-id-${sequence}`;
}

export function init() {
  return createId;
}

export function isCuid(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("test-id-");
}
