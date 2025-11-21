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
const featureFlags = {} as const satisfies Record<string, FeatureFlagValue>;

export type FeatureFlags = typeof featureFlags;

/**
 * Check if a feature flag is enabled.
 *
 * @example
 * if (isFeatureEnabled('feedbackForm')) {
 *   // Show feedback form
 * }
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flag = featureFlags[feature];
  return (
    flag === "production" ||
    (flag === "development" && process.env.NODE_ENV === "development")
  );
}
