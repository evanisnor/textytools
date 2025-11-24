/*
 * Feature flag (Toggle) management for the application.
 */

enum ToggleMode {
  Off,
  Development,
  Production,
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Off, Development, Production } = ToggleMode;

/**
 * Initializes a runtime toggle for a given feature flag.
 *
 * @param flag - The feature flag value.
 * @returns A function that returns true if the feature is enabled, false otherwise.
 */
function initializeToggle(flag: ToggleMode): () => boolean {
  return () =>
    flag === Production ||
    (flag === Development && process.env.NODE_ENV === "development");
}

/*****************************************************************************/

/*
 * Define feature flags below.
 */
const toggle = {
  regexTester: Production,
} as const satisfies Record<string, ToggleMode>;

export const isRegexTesterEnabled = initializeToggle(toggle.regexTester);
