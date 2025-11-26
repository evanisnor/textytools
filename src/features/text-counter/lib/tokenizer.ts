import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";

/**
 * Estimates the number of GPT-4 tokens in the given text.
 * Uses the cl100k_base encoding (GPT-4, GPT-3.5-turbo).
 */
export async function estimateTokenCount(text: string): Promise<number> {
  if (text.trim() === "") return 0;

  try {
    const encoding = new Tiktoken(cl100k_base);
    const tokens = encoding.encode(text.trim());
    return tokens.length;
  } catch (error) {
    console.error("Error encoding tokens:", error);
    throw error;
  }
}
