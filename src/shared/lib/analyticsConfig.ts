export interface AnalyticsEnvironment {
  nodeEnv?: string;
  vercelEnv?: string;
  explicitlyEnabled?: string;
}

/**
 * Decide whether this deployment may load analytics or emit analytics events.
 * Vercel Preview builds use NODE_ENV=production, so VERCEL_ENV must take
 * precedence whenever it is available.
 */
export function isAnalyticsEnabled({
  nodeEnv = process.env.NODE_ENV,
  vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV,
  explicitlyEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
}: AnalyticsEnvironment = {}): boolean {
  if (explicitlyEnabled === "true") return true;

  if (vercelEnv) return vercelEnv === "production";

  return nodeEnv === "production";
}
