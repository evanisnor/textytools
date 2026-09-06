import type { ToolSlug } from "@/shared/lib/toolCatalog";

type FixtureClass =
  | "successful"
  | "empty"
  | "invalid"
  | "ambiguous"
  | "adversarial"
  | "large"
  | "boundary"
  | "round_trip"
  | "state"
  | "interaction";

type OracleStatus = "approved" | "characterization" | "decision_required";
type ExpectedOutcome = "valid" | "partial" | "ambiguous" | "failure";
type TestLayer =
  | "unit"
  | "component"
  | "integration"
  | "regression"
  | "accessibility"
  | "performance"
  | "playwright"
  | "usability";

interface FixtureRecord<TInput> {
  id: `${ToolSlug}.${string}`;
  version: number;
  tool: ToolSlug;
  job: string;
  classes: FixtureClass[];
  description: string;
  input: TInput;
  configuration: Record<string, string | number | boolean>;
  size_class: "tiny" | "small" | "medium" | "large" | "stress";
  oracle_status: OracleStatus;
  expected_outcome: ExpectedOutcome;
  assertions: string[];
  test_layers: TestLayer[];
  provenance: {
    author: "Tidalsoft";
    created: "2026-09-05";
    source: "synthetic";
  };
  licence: "MIT";
  sensitive_data: "none";
  references: string[];
}

const provenance = {
  author: "Tidalsoft",
  created: "2026-09-05",
  source: "synthetic",
} as const;

function fixture<TInput>(
  record: Omit<
    FixtureRecord<TInput>,
    "version" | "size_class" | "provenance" | "licence" | "sensitive_data"
  >,
): FixtureRecord<TInput> {
  return {
    ...record,
    version: 1,
    size_class: "tiny",
    provenance,
    licence: "MIT",
    sensitive_data: "none",
  };
}

export const ACTIVE_PRODUCT_FIXTURES = {
  textCounter: fixture({
    id: "text-counter.count.successful",
    tool: "text-counter",
    job: "count representative text",
    classes: ["successful"],
    description: "Counts a short multiline synthetic value.",
    input: "Alpha beta\nGamma",
    configuration: {},
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["16 characters", "3 words", "2 lines", "1 paragraph"],
    test_layers: ["unit", "playwright"],
    references: ["CAPABILITIES.md#text-counter", "TEXT-12"],
  }),
  diffViewer: fixture({
    id: "diff-viewer.compare.replacement",
    tool: "diff-viewer",
    job: "compare a changed line",
    classes: ["successful", "interaction"],
    description: "Classifies one replacement between two short texts.",
    input: { left: "alpha\nbeta", right: "alpha\ngamma", search: "alpha" },
    configuration: { caseSensitive: false },
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["the replacement is highlighted", "search finds both panes"],
    test_layers: ["playwright"],
    references: ["CAPABILITIES.md#diff-viewer", "TEXT-12"],
  }),
  caseConverter: fixture({
    id: "case-converter.convert.snake",
    tool: "case-converter",
    job: "convert words to snake case",
    classes: ["successful", "interaction"],
    description:
      "Converts an unambiguous ASCII phrase with the snake-case mode.",
    input: "Project Baseline",
    configuration: { case: "snake" },
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["output equals project_baseline"],
    test_layers: ["playwright", "accessibility"],
    references: ["CAPABILITIES.md#case-converter", "TEXT-12"],
  }),
  textSanitizer: fixture({
    id: "text-sanitizer.clean.extra-spaces",
    tool: "text-sanitizer",
    job: "remove extra ASCII spaces",
    classes: ["successful", "interaction"],
    description: "Collapses repeated ASCII spaces using one enabled operation.",
    input: "alpha   beta",
    configuration: { option: "removeExtraSpaces" },
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["output equals alpha beta", "one filter is active"],
    test_layers: ["playwright"],
    references: ["CAPABILITIES.md#text-sanitizer", "TEXT-12"],
  }),
  jsonWizard: fixture({
    id: "json-wizard.format.pretty",
    tool: "json-wizard",
    job: "validate and pretty-print JSON",
    classes: ["successful"],
    description: "Formats a small object containing a synthetic marker.",
    input: '{"status":"synthetic","count":2}',
    configuration: { viewMode: "pretty", indentSize: 2, sortKeys: false },
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["input is valid", "output preserves status and count"],
    test_layers: ["component", "playwright"],
    references: ["CAPABILITIES.md#json-wizard", "TEXT-12"],
  }),
  csvJsonConverter: fixture({
    id: "csv-json-converter.convert.csv-with-headers",
    tool: "csv-json-converter",
    job: "convert CSV with headers to JSON",
    classes: ["successful"],
    description: "Converts two synthetic labelled rows to typed JSON objects.",
    input: "name,count\nAlpha Example,2\nBeta Example,3",
    configuration: { delimiter: ",", includeHeaders: true },
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["output contains two objects", "count values are numeric"],
    test_layers: ["unit", "component", "playwright"],
    references: ["CAPABILITIES.md#csv--json-converter", "TEXT-12"],
  }),
  textEncoder: fixture({
    id: "text-encoder.encode.base64",
    tool: "text-encoder",
    job: "encode UTF-8 text as Base64",
    classes: ["successful", "round_trip"],
    description: "Encodes a short ASCII standard vector.",
    input: "Hello",
    configuration: { encoding: "base64", mode: "encode" },
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["output equals SGVsbG8="],
    test_layers: ["playwright"],
    references: ["CAPABILITIES.md#text-encoder", "TEXT-12"],
  }),
  jwtDecoder: fixture({
    id: "jwt-decoder.decode.three-part",
    tool: "jwt-decoder",
    job: "decode a synthetic three-part token",
    classes: ["successful"],
    description: "Decodes a conspicuously synthetic unsigned token payload.",
    input:
      "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJmaXh0dXJlLXVzZXIiLCJuYW1lIjoiQWRhIEV4YW1wbGUiLCJpYXQiOjE3MDQwNjcyMDB9.synthetic-signature",
    configuration: { clock: "2026-09-05T00:00:00Z" },
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["header and payload decode", "signature is not verified"],
    test_layers: ["unit", "playwright"],
    references: ["CAPABILITIES.md#jwt-decoder", "TEXT-12"],
  }),
  regexTester: fixture({
    id: "regex-tester.match.named-groups",
    tool: "regex-tester",
    job: "find repeated named captures",
    classes: ["successful", "interaction"],
    description: "Finds two synthetic labels with one named capture.",
    input: {
      pattern: "(?<label>[A-Za-z]+)",
      flags: "g",
      text: "alpha 42 beta",
    },
    configuration: {},
    oracle_status: "approved",
    expected_outcome: "valid",
    assertions: ["two matches are shown", "each match exposes label"],
    test_layers: ["unit", "playwright"],
    references: ["CAPABILITIES.md#regex-tester", "TEXT-12"],
  }),
} as const;
