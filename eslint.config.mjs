import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundariesPlugin from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  {
    linterOptions: {
      // Treat unused disable directives as errors
      reportUnusedDisableDirectives: "error",
    },
    plugins: {
      import: importPlugin,
      boundaries: boundariesPlugin,
    },
    settings: {
      "boundaries/elements": [
        {
          type: "app",
          pattern: "app/*",
        },
        {
          type: "features",
          pattern: "src/features/*",
          capture: ["featureName"],
        },
        {
          type: "entities",
          pattern: "src/entities/*",
          capture: ["entityName"],
        },
        {
          type: "shared",
          pattern: "src/shared/*",
        },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    // Convert all warnings to errors at the rule level
    rules: {
      // This ensures all rules produce errors instead of warnings
      // Individual rules will still be configured by nextVitals and nextTs above

      // FSD: Import order rules
      "import/order": [
        "error",
        {
          pathGroups: [
            {
              pattern: "~/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/app/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/features/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/entities/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/shared/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // FSD: Public API enforcement
      // Disabled: too restrictive for pragmatic FSD implementation
      // We rely on boundaries/element-types for layer isolation instead
      // "import/no-internal-modules": "off",

      // FSD: Layer boundaries - enforce architectural dependencies
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: ["features", "entities", "shared"],
            },
            {
              from: "features",
              allow: [
                "entities",
                "shared",
                ["features", { featureName: "${from.featureName}" }],
              ],
            },
            {
              from: "entities",
              allow: ["entities", "shared"],
            },
            {
              from: "shared",
              allow: ["shared"],
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
