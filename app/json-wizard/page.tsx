"use client";

import { ToolFrame } from "@/shared/ui/tool-frame/ToolFrame";
import { TOOL_NAMES } from "@/shared/lib/constants";
import { JsonWizardShell, JsonWizardHeader, useJsonWizard } from "@/features/json-wizard";

export default function JSONWizard() {
  const wizard = useJsonWizard();

  return (
    <ToolFrame
      title="JSON Wizard"
      description="Format, validate, and search JSON with real-time feedback."
      toolName={TOOL_NAMES.JSON_WIZARD}
      headerRight={
        <JsonWizardHeader
          keys={wizard.stats.keys}
          depth={wizard.stats.depth}
          size={wizard.stats.size}
          isValid={wizard.validation.isValid}
          hasInput={Boolean(wizard.input.trim())}
          mounted={wizard.mounted}
        />
      }
    >
      <JsonWizardShell
        input={wizard.input}
        setInput={wizard.setInput}
        viewMode={wizard.viewMode}
        setViewMode={wizard.setViewMode}
        indentSize={wizard.indentSize}
        setIndentSize={wizard.setIndentSize}
        searchTerm={wizard.searchTerm}
        setSearchTerm={wizard.setSearchTerm}
        caseSensitive={wizard.caseSensitive}
        setCaseSensitive={wizard.setCaseSensitive}
        sortKeys={wizard.sortKeys}
        setSortKeys={wizard.setSortKeys}
        currentMatchIndex={wizard.currentMatchIndex}
        setCurrentMatchIndex={wizard.setCurrentMatchIndex}
        validation={wizard.validation}
        stats={wizard.stats}
        processedJSON={wizard.processedJSON}
        searchMatches={wizard.searchMatches}
        matchPositions={wizard.matchPositions}
        outputSearchMatches={wizard.outputSearchMatches}
        inputToOutputMatchMap={wizard.inputToOutputMatchMap}
        outputMatchPositions={wizard.outputMatchPositions}
        totalMatches={wizard.totalMatches}
        goToNextMatch={wizard.goToNextMatch}
        goToPreviousMatch={wizard.goToPreviousMatch}
      />
    </ToolFrame>
  );
}

