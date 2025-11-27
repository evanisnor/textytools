import { CsvJsonConverterShell } from "@/features/csv-json-converter";

import { TOOL_NAMES } from "@/shared/lib/constants";
import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";

export default function CsvJsonConverter() {
  return (
    <ToolFrame
      title="CSV / JSON Converter"
      description="Convert between JSON and CSV formats with automatic format detection"
      toolName={TOOL_NAMES.CSV_JSON_CONVERTER}
    >
      <CsvJsonConverterShell />
    </ToolFrame>
  );
}
