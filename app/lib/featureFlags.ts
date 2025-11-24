type FeatureFlagValue = "off" | "development" | "production";

/**
 * Add feature flags here.
 * - "off": always disabled
 * - "development": enabled only in development
 * - "production": always enabled
 *
 * @example
 * {
 *   feedbackForm: "development"
 * }
 */
const featureFlags = {
  regexTester: "development" as FeatureFlagValue,
} as const satisfies Record<string, FeatureFlagValue>;

export type FeatureFlags = typeof featureFlags;

/**
 * Initializes a runtime toggle for a given feature flag.
 *
 * @param flag - The feature flag value.
 * @returns A function that returns true if the feature is enabled, false otherwise.
 */
function initializeToggle(flag: FeatureFlagValue): () => boolean {
  return () =>
    flag === "production" ||
    (flag === "development" && process.env.NODE_ENV === "development");
}

// Auto-generate typed flag checker functions
export const isRegexTesterEnabled = initializeToggle(featureFlags.regexTester);
