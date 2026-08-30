import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable source maps in production
  productionBrowserSourceMaps: true,
  env: {
    // VERCEL_ENV is server-only by default. Inline it so the browser-side event
    // gate makes the same Production-versus-Preview decision as the layout.
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? "",
  },
};
export default nextConfig;
