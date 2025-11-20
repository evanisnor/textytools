import featureFlags from "../../featureflags.json";

export interface FeatureFlags {
  feedbackForm: boolean;
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  // Check for environment variable override first
  // Environment variables should be prefixed with NEXT_PUBLIC_FEATURE_
  // Must access env vars directly by name for proper Next.js bundling
  let envValue: string | undefined;
  if (feature === "feedbackForm") {
    envValue = process.env.NEXT_PUBLIC_FEATURE_FEEDBACKFORM;
  }

  if (envValue !== undefined) {
    // Parse string values to boolean
    return envValue === "true" || envValue === "1";
  }

  // Fall back to JSON config
  return featureFlags[feature] ?? false;
}

export { featureFlags };
