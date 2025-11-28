import { useState, useCallback } from "react";

import { sanitizeText } from "../lib/sanitizer";

import type { SanitizationOption } from "./types";

export interface UseTextSanitizeOptions {
  initialText?: string;
  initialOptions: SanitizationOption[];
}

export interface UseTextSanitizeResult {
  text: string;
  setText: (text: string) => void;
  options: SanitizationOption[];
  setOptions: (options: SanitizationOption[]) => void;
  sanitizedText: string;
  toggleOption: (id: string) => void;
  enableAll: () => void;
  disableAll: () => void;
  activeCount: number;
}

export function useTextSanitize(
  config: UseTextSanitizeOptions,
): UseTextSanitizeResult {
  const [text, setText] = useState(config.initialText ?? "");
  const [options, setOptions] = useState<SanitizationOption[]>(
    config.initialOptions,
  );

  const sanitizedText = sanitizeText(text, options);

  const toggleOption = useCallback((id: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt,
      ),
    );
  }, []);

  const enableAll = useCallback(() => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, enabled: true })));
  }, []);

  const disableAll = useCallback(() => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, enabled: false })));
  }, []);

  const activeCount = options.filter((opt) => opt.enabled).length;

  return {
    text,
    setText,
    options,
    setOptions,
    sanitizedText,
    toggleOption,
    enableAll,
    disableAll,
    activeCount,
  };
}
