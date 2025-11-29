import type { RegexMatch } from "@/entities/regex";

import { trackToolConversion } from "@/shared/lib/analytics";

export function navigateToJsonWizard(
  matches: RegexMatch[],
  jsonOutput: string,
  navigateToTool: (params: {
    destination: string;
    transferData: { key: string; value: string };
  }) => void,
) {
  const hasNamedGroups = matches[0]?.groupNames.some((name) => name !== null);

  trackToolConversion({
    sourceTool: "regex-tester",
    destinationTool: "json-wizard",
    matchCount: matches.length,
    hasNamedGroups,
  });

  navigateToTool({
    destination: "/json-wizard",
    transferData: {
      key: "cross-tool-input-json-wizard",
      value: jsonOutput,
    },
  });
}

export function navigateToCsvConverter(
  matches: RegexMatch[],
  csvOutput: string,
  navigateToTool: (params: {
    destination: string;
    transferData: { key: string; value: string };
  }) => void,
) {
  const hasNamedGroups = matches[0]?.groupNames.some((name) => name !== null);

  trackToolConversion({
    sourceTool: "regex-tester",
    destinationTool: "csv-json-converter",
    matchCount: matches.length,
    hasNamedGroups,
  });

  navigateToTool({
    destination: "/csv-json-converter",
    transferData: {
      key: "cross-tool-input-csv-json-converter",
      value: csvOutput,
    },
  });
}
