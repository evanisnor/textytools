/**
 * Export Registry
 * Defines all available export formats
 */

import { ExportDefinition, ExportType } from "../model/types";

// Helper function to detect output type
function detectOutputType(data: string): "json" | "csv" | "text" {
  // Try to parse as JSON
  try {
    JSON.parse(data);
    return "json";
  } catch {
    // Not JSON
  }

  // Check if it looks like CSV (has commas and consistent columns)
  const lines = data.trim().split("\n");
  if (lines.length > 1) {
    const firstLineCommas = (lines[0].match(/,/g) || []).length;
    if (firstLineCommas > 0) {
      // Check if other lines have similar comma count
      const allSimilar = lines
        .slice(1, Math.min(5, lines.length))
        .every((line) => {
          const commas = (line.match(/,/g) || []).length;
          return Math.abs(commas - firstLineCommas) <= 1;
        });
      if (allSimilar) {
        return "csv";
      }
    }
  }

  // Default to text
  return "text";
}

export const EXPORT_REGISTRY: Record<ExportType, ExportDefinition> = {
  "smart-download": {
    type: "smart-download",
    name: "Download",
    description: "Download as .txt, .json, or .csv based on content",
    icon: "⬇️",
    acceptsInput: ["text", "csv", "json"],
    propertySchema: [],
    defaultProperties: {},
    execute: (data) => {
      const outputType = detectOutputType(data);

      let filename: string;
      let mimeType: string;

      switch (outputType) {
        case "json":
          filename = "output.json";
          mimeType = "application/json";
          break;
        case "csv":
          filename = "output.csv";
          mimeType = "text/csv";
          break;
        default:
          filename = "output.txt";
          mimeType = "text/plain";
          break;
      }

      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
  },

  "copy-clipboard": {
    type: "copy-clipboard",
    name: "Copy to Clipboard",
    description: "Copy final output to clipboard",
    icon: "📋",
    acceptsInput: ["text", "csv", "json"],
    propertySchema: [],
    defaultProperties: {},
    execute: (data) => {
      navigator.clipboard.writeText(data);
    },
  },
};
