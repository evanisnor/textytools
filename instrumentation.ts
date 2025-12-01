export async function register() {
  // Sentry removed: no-op register function left for compatibility.
  return;
}

export const onRequestError = () => {
  // No-op: previously forwarded to Sentry.captureRequestError.
  // Keep this as a harmless placeholder to avoid breaking imports.
  return;
};
