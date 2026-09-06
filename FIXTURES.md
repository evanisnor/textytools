# Representative fixture contract

This document defines the test-data boundary and scenario catalog for Textytools.
It is a versioned decision artifact, not evidence that the fixtures or their tests
have been implemented. The verified product behavior that fixtures must exercise
is defined in [`CAPABILITIES.md`](CAPABILITIES.md).

## Contract status

- Contract version: 1
- Decision authority: Linear issue `TEXT-9`
- Approved: 2026-09-01
- Implementation status: `TEXT-12` materializes one reviewed primary-job record
  for each public tool. The wider required scenario catalog remains an inventory,
  not a claim of complete coverage.

## Data boundary

Fixtures are entirely synthetic by default. Authors must not derive them from,
paste them from, or make them resemble an identifiable customer's or visitor's
content. This prohibition includes:

- customer data and company-confidential material;
- copied production inputs, analytics payloads, feedback, logs, tokens, or error
  messages;
- production material described as anonymized, de-identified, redacted, sampled,
  hashed, or scrambled; and
- third-party examples whose licence or redistribution right has not been verified.

Synthetic fixtures may use reserved example domains, documentation IP address
ranges, conspicuously fictional names, invented identifiers, and deterministic
timestamps. Secrets, credentials, live endpoints, routable private infrastructure,
and realistic bearer tokens are prohibited. JWT examples must use an unmistakable
test-only payload and signature.

A future proposal to admit non-synthetic material is denied by default. Its review
record must identify the source, owner, purpose, licence, redistribution terms,
privacy analysis, transformations, retention, and reviewer approval before the
material enters the repository. Approval to view material is not approval to use it
as a fixture.

## Fixture classes

Every protected capability needs the applicable classes below. A class may require
several fixtures; one convenient example cannot stand in for the class.

| Class | Required question |
|---|---|
| `successful` | Does a representative supported input produce the approved semantic result? |
| `empty` | What happens for absent, empty, and whitespace-only input or panes? |
| `invalid` | Is malformed or unsupported input rejected through the approved failure path? |
| `ambiguous` | Is an input with multiple plausible interpretations classified or explained without an unsupported claim? |
| `adversarial` | Does hostile structure, encoding, repetition, or syntax remain bounded and preserve the data boundary? |
| `large` | Does a declared size class remain correct and usable within an approved performance envelope? |
| `boundary` | What happens immediately below, at, and above a semantic or size boundary? |
| `round_trip` | Where reversibility is promised, does encoding followed by decoding preserve the defined value? |
| `state` | Do reload, reset, corrupt stored state, and one-time transfers follow the capability contract? |
| `interaction` | Do copy, search, navigation, options, errors, and handoffs expose the approved user-visible state? |

Large and adversarial are different claims. A large valid input measures scale; an
adversarial input tries to trigger pathological or unsafe behavior. Neither may be
silently omitted merely because a small happy-path fixture passes.

## Fixture record

Every materialized fixture or deterministic fixture family must have a machine-
readable record with these fields. The storage format and repository path will be
selected by the delivery issue that implements the corpus; logical identifiers must
not depend on that path.

| Field | Requirement |
|---|---|
| `id` | Stable lowercase dotted identifier: `<tool>.<job>.<scenario>` |
| `version` | Positive integer incremented when input or approved expectations change |
| `tool` | One slug from the public capability catalog |
| `job` | The specific operation or user-visible behavior exercised |
| `classes` | One or more fixture classes from this contract |
| `description` | Content-free statement of the risk or behavior represented |
| `input` | Inline synthetic value, repository-relative artifact reference, or generator reference |
| `configuration` | Explicit modes, options, flags, environment, and browser preconditions |
| `size_class` | `tiny`, `small`, `medium`, `large`, or `stress`, with the exact generation parameters recorded separately |
| `oracle_status` | `approved`, `characterization`, or `decision_required` |
| `expected_outcome` | `valid`, `partial`, `ambiguous`, or `failure`, using the analytics outcome definitions |
| `assertions` | Semantic properties and user-visible states; never only an undifferentiated snapshot |
| `test_layers` | Intended unit, component, integration, regression, accessibility, performance, Playwright, or usability consumers |
| `provenance` | Author, creation date, and `synthetic`; an approved exception must include its review record |
| `licence` | Repository licence for original synthetic material, or the approved source licence for an exception |
| `sensitive_data` | Must be `none`; any other value rejects the fixture |
| `references` | Capability section and any Linear decision, defect, or known-difference issue |

Configuration and expectations must be explicit enough that two test layers do not
silently exercise different behavior under the same fixture identifier.

### Oracle status

- `approved` protects an intentional product contract. A regression against it
  fails the applicable gate.
- `characterization` records verified current behavior that is not yet an approved
  product promise. It may detect change but must not be presented as product
  correctness.
- `decision_required` represents a necessary scenario whose correct behavior is
  unresolved. It cannot be converted into a passing regression test until the
  product decision is recorded.

The `expected_outcome` uses the definitions in
[`analytics/ANALYTICS.md`](analytics/ANALYTICS.md). A rendered component, HTTP 200,
non-empty output, or lack of an exception is not a sufficient semantic assertion.
Known implementation differences must reference a Linear issue; a test must not
weaken an approved expectation merely to match current code.

## Determinism and size

Small, reviewable inputs and exact standard vectors may be committed directly.
Large, stress, combinatorial, and repetition-heavy inputs must normally be produced
by deterministic generators rather than committed as bulky artifacts. A generator
record must include:

- stable generator identifier and version;
- fixed seed when a pseudo-random sequence is used;
- exact record, character, byte, nesting, match, or line parameters;
- character encoding and line-ending policy;
- expected digest when byte-for-byte reproduction matters; and
- an upper execution bound appropriate to its test layer.

Tests must not depend on current wall-clock time, locale, timezone, network access,
analytics delivery, random seeds, or mutable third-party data. Time-sensitive JWT
fixtures use a fixed clock. Token-count fixtures pin the tokenizer and vocabulary
named by the capability contract.

A stress fixture belongs in an explicitly bounded performance job and must not make
the ordinary regression suite unreliable. Reducing a fixture for a faster layer is
permitted only under a distinct identifier and size class.

## Required scenario catalog

The catalog below is the minimum decision inventory. It does not claim that a
fixture exists until a later delivery issue records and validates it.

### Shared browser behavior

- Empty, valid, and corrupt `sessionStorage` state for every persisted tool.
- Reload restoration without a network request containing editor content.
- One-time cross-tool transfer consumption, removal, missing transfer, and corrupt
  transfer for every supported handoff.
- Clipboard success and rejection for every copy action.
- Feedback submission with synthetic contact data, provider failure, and proof that
  tool editor content is not attached automatically.
- Analytics interception proving that approved payloads contain no fixture content,
  exact content-derived values, dynamic URLs, or raw errors.

### Text Counter

- Empty, whitespace-only, single-line, multiline, blank-line paragraph, CRLF, and
  unusual Unicode-whitespace inputs.
- Combining marks, emoji sequences, non-Latin scripts, and mixed normalization
  forms, with separate assertions for characters, words, lines, and paragraphs.
- Published `cl100k_base` token vectors and a deterministic tokenization-failure
  path.
- Generated boundary and large inputs for each displayed counter.

### Diff Viewer

- Equal text; empty left, right, and both panes; insertion; deletion; replacement;
  adjacent change blocks; trailing newline; CRLF; Unicode; and repeated lines.
- Search with zero, one, and repeated matches across both panes, case sensitivity,
  and previous/next boundary navigation.
- A generated large line set with sparse and dense changes.

### Case Converter

- Each of the 11 formats over simple words, acronyms, existing camel and Pascal
  case, digits, punctuation, unusual whitespace, Unicode, and multiline input.
- Empty and punctuation-only input, idempotence where promised, and copy rejection.
- Word-boundary cases remain `decision_required` until their published semantics
  are approved.

### Text Sanitizer

- Each cleanup operation alone, enable/disable all, and order-sensitive operation
  sequences.
- Duplicate and empty lines, tabs, mixed line endings, repeated spaces, punctuation,
  numbers, emoji sequences, non-ASCII scripts, and unusual Unicode whitespace.
- Destructive cleanup sequences that can erase all content or cause one operation
  to remove the evidence needed by the next.
- Definitions of emoji, punctuation, special characters, and non-ASCII remain
  `decision_required` until their intended character sets are approved.

### JSON Wizard

- Every JSON scalar and container type; empty containers; nested objects and arrays;
  escaped strings; Unicode; unusual whitespace; and every indentation and view mode.
- Invalid syntax at the start, middle, and end, with runtime-specific position
  assertions kept separate from portable validity assertions.
- Recursive key sorting, search mapping, JSON encoded inside a JSON string, and
  both outgoing handoffs.
- Duplicate object keys, extreme nesting, very large scalar values, large arrays,
  and adversarial strings that resemble HTML, URLs, credentials, or analytics
  fields without containing real data.

### CSV / JSON Converter

- Each direction, delimiter, and header mode; quoted delimiters and quotes; empty
  values; uneven rows; repeated labelled records; inferred booleans, numbers,
  null-like strings, and leading-zero identifiers.
- Nested JSON, arrays, heterogeneous objects, dotted keys, missing properties,
  duplicate headers, empty headers, and flatten/unflatten collisions.
- Quoted fields containing physical newlines, CRLF, a trailing newline, unusual
  whitespace, Unicode, and large generated tables.
- Ambiguous text that could be interpreted as JSON or CSV, conversion failure, and
  the JSON Wizard handoff.

### Text Encoder

- Published standard vectors and round trips for every reversible format, with
  Unicode and binary boundaries kept distinct from text-only formats.
- Empty input, malformed encoded input, invalid padding or alphabet, unavailable
  transformation APIs, and four fixed hash vectors.
- One-way mode transitions, very large generated input, and inbound handoff.

### JWT Decoder

- Three-part synthetic tokens with fixed-clock temporal claims, Unicode JSON, and
  missing, malformed, expired, and not-yet-valid claims.
- Wrong part count, invalid base64url, non-JSON header or payload, empty signature,
  unusual algorithms, and very large claims.
- Copy and JSON Wizard handoff. Assertions must state that decoding does not prove
  signature, issuer, audience, or trust-chain validity.

### Regex Tester

- Every supported flag; named, unnamed, optional, and repeated captures; zero, one,
  and many matches; Unicode; multiline input; and generated JSON and CSV escaping.
- Repeated labelled records, unmatched records, and invented common log layouts:
  access-style lines, timestamp/severity/message lines, and key-value lines with
  controlled variations and malformed entries.
- Invalid syntax, detected nested quantifiers, empty-string matches, zero-width
  behavior, overlapping expectations, and large or adversarial input.
- Navigation, copy, and both outgoing handoffs.

## Decisions required before implementation can claim coverage

These questions are deliberately unresolved. Their fixtures use
`decision_required` until a product decision establishes an oracle:

1. What Unicode word-boundary behavior does Case Converter promise for every case
   mode?
2. Which exact character sets do Text Sanitizer's emoji, punctuation, special-
   character, and non-ASCII operations remove?
3. Should duplicate JSON object keys be rejected, warned about, or accepted with a
   documented winner?
4. Is quoted multiline CSV an intended supported capability or an explicitly
   documented rejection?
5. How should duplicate, empty, dotted, or colliding CSV headers be represented?
6. Which ambiguous JSON-versus-CSV inputs require user confirmation rather than
   automatic classification?
7. What input-size and execution-time envelopes bound “real-time” behavior for
   Regex Tester and the other interactive tools?
8. Which browser-dependent parse errors, clipboard failures, and Unicode behaviors
   require portable semantics versus browser-specific expectations?

Answers belong in the relevant capability or product contract before a regression
test treats them as correct behavior.

## Materialization and review requirements

A later fixture-delivery issue must:

- create every fixture record before or with its data or generator;
- review all committed values for privacy, confidentiality, licences, and realistic
  secrets;
- validate deterministic reproduction on a clean checkout;
- demonstrate at least one intended consumer for each fixture family;
- distinguish approved regression assertions from characterization evidence and
  unresolved decisions;
- prevent snapshots from becoming the sole oracle for semantic output;
- document intentionally omitted classes and the issue that will resolve each gap;
  and
- update this contract when it changes the catalog, metadata, or data boundary.

Fixture existence alone is not regression coverage. The applicable test must run in
the required gate and make assertions that prove the approved product outcome.
