import type { RegexMatch } from "@/entities/regex";

import { trackToolConversion } from "@/shared/lib/analytics";

export function navigateToJsonWizard(
  matches: RegexMatch[],
  jsonOutput: string,
) {
  const hasNamedGroups = matches[0]?.groupNames.some((name) => name !== null);

  // Save JSON for json-wizard
  sessionStorage.setItem("cross-tool-input-json-wizard", jsonOutput);

  // Track the conversion
  trackToolConversion({
    sourceTool: "regex-tester",
    destinationTool: "json-wizard",
    matchCount: matches.length,
    hasNamedGroups,
  });

  // Navigate to json-wizard
  window.location.href = "/json-wizard";
}

export function navigateToCsvConverter(
  matches: RegexMatch[],
  csvOutput: string,
) {
  const hasNamedGroups = matches[0]?.groupNames.some((name) => name !== null);

  // Save CSV for csv-json-converter
  sessionStorage.setItem("cross-tool-input-csv-json-converter", csvOutput);

  // Track the conversion
  trackToolConversion({
    sourceTool: "regex-tester",
    destinationTool: "csv-json-converter",
    matchCount: matches.length,
    hasNamedGroups,
  });

  // Navigate to csv-json-converter
  window.location.href = "/csv-json-converter";
}
