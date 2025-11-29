import {
  useCaseConversion,
  type CaseType,
} from "@/entities/transform/text-case";

import { usePersistedState } from "@/shared/hooks";

export function useCaseConverter() {
  const { state, updateState } = usePersistedState({
    storageKey: "case-converter-state",
    initialState: {
      text: "",
      selectedCase: "upper" as CaseType,
    },
  });

  const convertedText = useCaseConversion({
    text: state.text,
    caseType: state.selectedCase,
  });

  return {
    text: state.text,
    setText: (newText: string) => updateState({ text: newText }),
    selectedCase: state.selectedCase,
    setSelectedCase: (newCase: CaseType) =>
      updateState({ selectedCase: newCase }),
    convertedText,
  };
}
