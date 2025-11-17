import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    linterOptions: {
      // Treat unused disable directives as errors
      reportUnusedDisableDirectives: "error",
    },
    // Convert all warnings to errors at the rule level
    rules: {
      // This ensures all rules produce errors instead of warnings
      // Individual rules will still be configured by nextVitals and nextTs above
    },
  },
]);

export default eslintConfig;
