import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { countCharacters, countLines, countWords, countParagraphs } from "../lib/counters";
import { estimateTokenCount } from "../lib/tokenizer";

export function useTextCounter() {
  const [text, setText] = useState("");
  const [textTrimmed, setTextTrimmed] = useState("");
  const [mounted, setMounted] = useState(false);
  const [wordCount, setWordCount] = useState("0");
  const [paragraphCount, setParagraphCount] = useState("0");
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [tokenCount, setTokenCount] = useState("0");

  // Load persisted state on mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const persistedState = sessionStorage.getItem("text-counter-state");
      if (persistedState) {
        try {
          const state = JSON.parse(persistedState);
          if (state.text !== undefined) setText(state.text);
        } catch (err) {
          console.error("Failed to load persisted state:", err);
        }
      }
    }, 0);
  }, []);

  // Persist state whenever text changes
  useEffect(() => {
    if (!mounted) return;
    const state = { text };
    sessionStorage.setItem("text-counter-state", JSON.stringify(state));
  }, [text, mounted]);

  // Update trimmed text
  useEffect(() => {
    setTextTrimmed(text.trim());
  }, [text]);

  // Compute simple counts
  const characterCount = countCharacters(text);
  const lineCount = countLines(text);

  // Word counting
  useEffect(() => {
    const count = countWords(textTrimmed);
    setWordCount(count.toLocaleString());
  }, [textTrimmed]);

  // Paragraph counting
  useEffect(() => {
    const count = countParagraphs(textTrimmed);
    setParagraphCount(count.toLocaleString());
  }, [textTrimmed]);

  // Token counting (debounced for performance)
  useEffect(() => {
    if (!isTokenizing) {
      debounce(tokenize, 100)();
    }
    return;

    async function tokenize() {
      if (isTokenizing) {
        setTokenCount("...");
        return;
      } else if (textTrimmed === "") {
        setTokenCount("0");
        setIsTokenizing(false);
      } else {
        setIsTokenizing(true);
        try {
          const count = await estimateTokenCount(textTrimmed);
          setTokenCount(count.toLocaleString());
        } catch (error) {
          setTokenCount("ERR");
        }
        setIsTokenizing(false);
      }
    }
  }, [textTrimmed, isTokenizing]);

  return {
    text,
    setText,
    characterCount,
    wordCount,
    lineCount,
    paragraphCount,
    tokenCount,
  };
}
