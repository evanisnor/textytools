# Public capability baseline

This document records what the public Textytools catalog does today. It is a
versioned delivery contract, not a roadmap. When this document and the product
disagree, verify the product and update both the implementation and this baseline
in the same change.

## Verification envelope

- Baseline version: 1
- Verified: 2026-08-30
- Source commit: [`a01fec0`](https://github.com/tidalsoft/textytools/commit/a01fec02fa59b7ba956de60db0cb801736a4ee25)
- Production deployment: GitHub deployment `6162062688`, reported successful for
  the same commit
- Production routes: the home page and all nine catalogued routes returned HTTP
  200 after redirecting to `https://www.textytools.dev`
- Automated coverage: no test directly targets any of the nine catalogued tools
  at this baseline; the only current Jest coverage targets analytics configuration
  and the uncatalogued Apogee implementation

Route reachability was checked separately from behavior. The behavioral baseline
below was reconciled against the implementation at the source commit. The
uncatalogued `/apogee` and `/blastoff` route families are outside this baseline
pending an explicit product decision.

## Shared behavior and boundaries

The nine tools execute their primary transformations in the browser. Their tool
state is stored in same-origin `sessionStorage`, so entered content can survive a
reload in the same browser session but is not durable account data. A supported
cross-tool action writes output to a one-time `sessionStorage` transfer key and
navigates to the destination route. The destination consumes and removes that key.

Production analytics emits interaction metadata, including the route, tool name,
selected modes or options for some actions, match counts for regex handoffs, and
conversion source and destination. The application does not intentionally attach
raw editor contents to these events. All tools can emit `tool_view`,
`tool_activation`, `feedback_open`, and `feedback_submit`; additional events are
listed below. Analytics is disabled by default outside the Vercel Production
environment.

The feedback form is a separate network path available from every tool. When a
visitor submits it, their name, email address, and message are sent to the
`/api/send-feedback` route and then to the configured Resend email recipient.
Tool editor contents are not automatically included. Clipboard actions use the
browser Clipboard API.

## Capability matrix

| Tool | Primary job | State key | Supported handoffs | Additional analytics |
|---|---|---|---|---|
| [Text Counter](#text-counter) | Count properties of text | `text-counter-state` | None | None |
| [Diff Viewer](#diff-viewer) | Compare two texts line by line | `diff-viewer-state` | Receives `cross-tool-input-diff-viewer` | `clear_button_click` |
| [Case Converter](#case-converter) | Apply one of 11 case transformations | `case-converter-state` | None | `copy_button_click`, `clear_button_click` |
| [Text Sanitizer](#text-sanitizer) | Apply an ordered set of 12 cleanup operations | `text-sanitizer-state` | None | `copy_button_click`, `clear_button_click`, `toggle_all_click` |
| [JSON Wizard](#json-wizard) | Validate, search, and render JSON | `json-wizard-state` | Receives JSON; sends to Text Encoder or CSV / JSON Converter | `copy_button_click`, `clear_button_click`, `tool_conversion` |
| [CSV / JSON Converter](#csv--json-converter) | Convert CSV to JSON or JSON to CSV | `csv-json-converter-state` | Receives CSV or JSON; sends converted JSON to JSON Wizard | `copy_button_click`, `clear_button_click`, `tool_conversion` |
| [Text Encoder](#text-encoder) | Encode, decode, or hash text | `text-encoder-state` | Receives `cross-tool-input-text-encoder` | `copy_button_click` |
| [JWT Decoder](#jwt-decoder) | Decode and inspect a three-part JWT | `jwt-decoder-state` | Receives a token; sends decoded JSON to JSON Wizard | `copy_button_click`, `clear_button_click`, `tool_conversion` |
| [Regex Tester](#regex-tester) | Execute JavaScript regex patterns and inspect matches | `regex-tester-state` | Receives test text; sends captured matches to JSON Wizard or CSV / JSON Converter | `copy_button_click`, `clear_button_click`, `tool_conversion` |

Every tool also has a return-to-home action and the shared feedback path.

## Text Counter

- Route: `/text-counter`
- Primary job: count characters, whitespace-delimited words, lines,
  blank-line-delimited paragraphs, and `cl100k_base` tokens as text changes.
- Input: one text value.
- Output: five displayed counts. Character and line counts use the original value;
  word, paragraph, and token counts use a trimmed value.
- Failure states: tokenization failure displays `ERR`; the other counters have no
  user-facing error state. Editing the input triggers another calculation.
- Next actions: clear the input, return home, or submit feedback. There is no copy
  action or outgoing tool handoff.
- Privacy: input is stored in `sessionStorage` under `text-counter-state`.
- Current automated tests: none.
- Regression contract: empty and whitespace-only text; Unicode and line endings;
  paragraph boundaries; known `cl100k_base` examples; tokenization failure.
- Known claim gap: the interface says “Tokens (GPT-4+)”, while the implementation
  specifically uses `cl100k_base`. That is not proof of token counts for every
  model described by “GPT-4+”.

## Diff Viewer

- Route: `/diff-viewer`
- Primary job: compare original and modified text using a line-based diff, display
  added, removed, modified, and unchanged lines, and search both panes.
- Inputs: original text, modified text, a search term, and a case-sensitivity
  toggle. The search term itself is not persisted.
- Output: aligned line rows, change statistics, search highlights, and previous or
  next match navigation.
- Failure states: no user-facing comparison error state. Corrupt saved state is
  logged and defaults are used. There is no copy or export action.
- Next actions: clear either pane, search the comparison, return home, or submit
  feedback. The route can receive text through its transfer key, but no catalogued
  tool currently sends to it.
- Privacy: both texts and the case-sensitivity setting are stored in
  `sessionStorage` under `diff-viewer-state`.
- Current automated tests: none.
- Regression contract: equal text; insertion, deletion, and replacement blocks;
  empty panes; trailing newlines; dual-pane search and case sensitivity.
- Known claim gap: the public description accurately says side-by-side highlighting,
  but no automated evidence currently protects alignment or search behavior.

## Case Converter

- Route: `/case-converter`
- Primary job: transform text into upper, lower, title, sentence, camel, Pascal,
  snake, kebab, constant, dot, or path case.
- Inputs: text and one of the 11 case selections.
- Output: converted text.
- Failure states: conversion has no user-facing error state. Clipboard rejection is
  logged without an inline error.
- Next actions: select another case, copy output, clear input, return home, or
  submit feedback. There is no cross-tool handoff.
- Privacy: input and selected case are stored in `sessionStorage` under
  `case-converter-state`.
- Current automated tests: none.
- Regression contract: all 11 formats; acronyms and existing camel case; punctuation,
  whitespace, Unicode, and multi-line input; clipboard failure.
- Known claim gap: the advertised count of 11 formats matches the implementation,
  but their word-boundary semantics have no fixture-backed public contract.

## Text Sanitizer

- Route: `/text-sanitizer`
- Primary job: apply enabled cleanup operations in their defined order. The 12
  operations trim lines; remove empty or duplicate lines, extra spaces, non-ASCII
  characters, emoji, numbers, punctuation, or special characters; normalize
  whitespace; sort lines; or reverse lines.
- Inputs: text and the enabled state of each operation.
- Output: sanitized text and the active operation count.
- Failure states: transformation has no user-facing error state. Clipboard rejection
  is logged without an inline error.
- Next actions: toggle individual operations, enable or disable all, copy output,
  clear input, return home, or submit feedback. There is no cross-tool handoff.
- Privacy: input and the complete option set are stored in `sessionStorage` under
  `text-sanitizer-state`.
- Current automated tests: none.
- Regression contract: every operation alone; order-sensitive combinations;
  Unicode, emoji, punctuation, duplicate lines, and whitespace; enable/disable all.
- Known claim gap: the advertised count of 12 operations matches the implementation,
  but terms such as “emoji”, “punctuation”, and “special characters” are not yet
  bounded by published fixtures.

## JSON Wizard

- Route: `/json-wizard`
- Primary job: parse and validate JSON, render pretty, minified, or escaped output,
  optionally sort object keys recursively, show statistics, and search input and
  output.
- Inputs: JSON text, view mode, indentation from 2 through 8 spaces, and sort-keys
  setting. Search and case sensitivity are session-only component state rather than
  persisted tool state.
- Output: transformed JSON, syntax status with line and column when derivable,
  statistics, and synchronized search matches. A JSON string containing valid JSON
  is automatically unescaped before rendering.
- Failure states: invalid JSON displays its parse error and does not enable output
  actions. If a runtime does not expose a parse position, line and column may be
  absent. Clipboard rejection is logged without an inline error.
- Next actions: change view and indentation, sort or search, copy, clear, send
  minified or escaped output to Text Encoder, send non-escaped output to CSV / JSON
  Converter, return home, or submit feedback.
- Privacy: input and render options are stored in `sessionStorage` under
  `json-wizard-state`; inbound handoffs use `cross-tool-input-json-wizard`.
- Current automated tests: none.
- Regression contract: all JSON scalar and container types; invalid syntax and
  position reporting; recursive sorting; escaped JSON; all views and indentation;
  search mapping; both outgoing handoffs.
- Known claim gap: “line/column error reporting” is best-effort because JavaScript
  parse-error messages vary by runtime. No browser matrix or fixtures currently
  bound that claim.

## CSV / JSON Converter

- Route: `/csv-json-converter`
- Primary job: detect JSON versus CSV and convert in the opposite direction.
- Inputs: CSV or JSON text, delimiter (comma, semicolon, tab, or pipe), and whether
  CSV headers are present or should be emitted.
- Output: pretty JSON arrays for CSV input or CSV for JSON input. CSV values are
  type-inferred; dotted headers can create nested objects; JSON objects are flattened
  to dotted columns.
- Failure states: invalid JSON shape or syntax and inconsistent CSV column counts
  produce an inline conversion error. Input that does not parse as JSON is treated
  as CSV, so ambiguous data can be classified unexpectedly. Clipboard rejection is
  logged without an inline error.
- Next actions: change delimiter or header handling, copy, clear, send successful
  CSV-to-JSON output to JSON Wizard, return home, or submit feedback.
- Privacy: input and conversion options are stored in `sessionStorage` under
  `csv-json-converter-state`; inbound handoffs use
  `cross-tool-input-csv-json-converter`.
- Current automated tests: none.
- Regression contract: each direction and delimiter; headers on and off; quoted
  delimiters and quotes; empty values and inferred types; nested values; malformed
  JSON; uneven CSV rows; cross-tool transfer.
- Known claim gap: the implementation splits CSV input into physical lines before
  parsing each row, so quoted fields containing newlines are not supported. Broad
  claims of “proper CSV parsing” or CSV compliance must remain bounded accordingly.

## Text Encoder

- Route: `/text-encoder`
- Primary job: encode and decode text with Base64, Base58, Base91, ASCII85, Z85,
  URL encoding, HTML entities, hexadecimal, binary, Unicode escapes,
  quoted-printable, ROT13, or Morse code; or create MD5, SHA-1, SHA-256, or SHA-512
  hashes.
- Inputs: text, one of 17 formats, and encode or decode mode. Selecting decode while
  a one-way hash is active resets the format to Base64.
- Output: transformed text or a hash value.
- Failure states: invalid encoded input and unavailable transformation APIs return
  an `Error:` string in the output. Clipboard rejection is logged without an inline
  error.
- Next actions: change mode or format, copy output, clear input, return home, or
  submit feedback. It accepts JSON Wizard handoffs but has no outgoing handoff.
- Privacy: input, format, and mode are stored in `sessionStorage` under
  `text-encoder-state`; inbound handoffs use `cross-tool-input-text-encoder`.
- Current automated tests: none.
- Regression contract: round trips for every reversible format; published standard
  vectors where applicable; Unicode and binary boundaries; malformed input; four
  hash vectors; one-way mode behavior; inbound transfer.
- Known claim gap: the advertised 17-format count matches the selector, but no
  automated standard-vector suite currently proves interoperability for each format.

## JWT Decoder

- Route: `/jwt-decoder`
- Primary job: base64url-decode the header and payload of a three-part JWT and
  inspect its signature text and `alg`, `exp`, `iat`, and `nbf` claims.
- Input: a JWT string.
- Output: formatted header, payload, and signature plus interpreted temporal-claim
  status.
- Failure states: wrong part count, invalid base64url, or non-JSON header or payload
  produces an inline decode error. Clipboard rejection is logged without an inline
  error.
- Next actions: copy decoded JSON, clear, send decoded JSON to JSON Wizard, return
  home, or submit feedback.
- Privacy: the token is stored in `sessionStorage` under `jwt-decoder-state`;
  inbound handoffs use `cross-tool-input-jwt-decoder`.
- Current automated tests: none.
- Regression contract: valid and malformed compact JWTs; Unicode JSON; missing and
  malformed claims; expired and not-yet-valid times; copy and JSON handoff.
- Known claim gap: the tool does **not** cryptographically verify the signature,
  issuer, audience, or trust chain. “Valid” currently describes decodability and
  temporal checks, so public uses of “validate” or “verify” can overstate the result.

## Regex Tester

- Route: `/regex-tester`
- Primary job: execute JavaScript regular expressions against text, highlight
  matches, expose indices and capture groups, and navigate among results.
- Inputs: JavaScript regex pattern, flags (`g`, `i`, `m`, `s`, `u`, `y`), and test
  text.
- Output: highlighted text, match count and details, capture groups, and generated
  JSON or CSV when captures exist.
- Failure states: invalid JavaScript regex syntax is shown inline. A guard also
  rejects detected nested quantifiers and patterns that match empty strings. Clipboard
  rejection is logged without an inline error.
- Next actions: toggle flags, navigate matches, copy all matches, send captured
  results to JSON Wizard or CSV / JSON Converter, clear pattern or text, return home,
  or submit feedback.
- Privacy: pattern, flags, and test text are stored in `sessionStorage` under
  `regex-tester-state`; inbound handoffs use `cross-tool-input-regex-tester`.
- Current automated tests: none.
- Regression contract: all flags; named and unnamed captures; zero and many matches;
  Unicode; generated JSON and CSV escaping; invalid and guarded patterns; both
  outgoing handoffs.
- Known claim gap: “real-time” behavior has no defined input-size or execution-time
  bound, and the safety checks are pattern heuristics rather than an execution
  timeout.

## Change control

Any change to a catalogued route's job, accepted input, output semantics, failure
behavior, next action, persistence, network behavior, analytics payload, or public
claim must update this file. A capability should not be described as protected until
its regression and end-to-end evidence exists.
