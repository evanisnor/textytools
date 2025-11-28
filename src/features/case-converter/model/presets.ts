import type { CaseOption } from "@/entities/transform/text-case";

export const caseOptions: CaseOption[] = [
  { id: "upper", label: "UPPER CASE", description: "ALL CHARACTERS UPPERCASE" },
  { id: "lower", label: "lower case", description: "all characters lowercase" },
  {
    id: "title",
    label: "Title Case",
    description: "Capitalize First Letter Of Each Word",
  },
  {
    id: "sentence",
    label: "Sentence case",
    description: "Capitalize first letter of sentences",
  },
  {
    id: "camel",
    label: "camelCase",
    description: "firstWordLowercaseRestCapitalized",
  },
  {
    id: "pascal",
    label: "PascalCase",
    description: "AllWordsCapitalizedNoSpaces",
  },
  {
    id: "snake",
    label: "snake_case",
    description: "words_separated_by_underscores",
  },
  {
    id: "kebab",
    label: "kebab-case",
    description: "words-separated-by-hyphens",
  },
  {
    id: "constant",
    label: "CONSTANT_CASE",
    description: "UPPER_CASE_WITH_UNDERSCORES",
  },
  { id: "dot", label: "dot.case", description: "words.separated.by.dots" },
  { id: "path", label: "path/case", description: "words/separated/by/slashes" },
];
