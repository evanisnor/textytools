export type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot"
  | "path";

export interface CaseOption {
  id: CaseType;
  label: string;
  description: string;
}
