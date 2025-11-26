import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { CsvJsonConverterShell } from "@/features/csv-json-converter";

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
