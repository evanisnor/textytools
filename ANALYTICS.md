# Analytics contract

This document defines the information Textytools may emit through application
analytics. It is a versioned data contract and measurement boundary, not a claim
that every reserved event is implemented.

## Contract status

- Contract version: 1
- Decision authority: Linear issue `TEXT-8`
- Approved: 2026-08-30
- Scope: application-authored analytics events
- Implementation status: decision only; current instrumentation does not yet
  conform completely

Vendor-controlled automatic collection, consent, retention, deletion, and account
configuration require their own privacy and delivery review. This contract does
not treat a vendor default as approved merely because the application did not set
it explicitly.

## Measurement principles

Textytools measures completed customer outcomes separately from page views,
interactions, offers, and attempts. An event must answer a defined product question;
availability in an analytics SDK is not a reason to collect it.

Application events may contain only:

- centrally allow-listed event names and parameter names;
- controlled enum values;
- booleans;
- static route templates;
- the nine approved tool slugs; and
- coarse predefined quantity, size, or duration buckets.

Application events must never contain:

- tool input or output, including snippets, hashes, encodings, tokens, patterns,
  claims, captured groups, extracted values, or rejected records;
- exact content-derived counts, lengths, sizes, timings, row counts, match counts,
  error positions, or line numbers;
- filenames, document names, preset names, field names, headings, or labels supplied
  by a visitor;
- document, revision, preset, transfer, session, or user identifiers created by the
  application;
- full URLs, query strings, URL fragments, dynamic route identifiers, referrer
  contents, or arbitrary page titles;
- raw exception text, validation messages, stack traces, HTTP response bodies, or
  provider errors;
- arbitrary strings, objects, lists, or option arrays; or
- values copied from browser storage, the clipboard, uploaded files, feedback, or
  network responses.

Google Analytics may maintain its own client and session behavior. Textytools must
not add another application identity layer unless a separate privacy decision
explicitly authorizes it.

## Common parameters

Every event requires exactly these common parameters:

| Parameter | Allowed value |
|---|---|
| `schema_version` | The integer `1` |
| `tool_name` | One slug from the public tool catalog |
| `route_template` | The tool's static route, such as `/json-wizard`; never a concrete dynamic URL |

An event may add only the parameters listed for that event below. Tool-specific
parameters such as an encoding, case style, delimiter, view mode, or output format
must use a centrally registered enum and must be necessary for a named measurement
question. A generic custom-parameter escape hatch is prohibited.

### Approved buckets

Exact values must be reduced in memory to one of these values before an event is
constructed. The exact value must not be retained in the analytics payload.

| Bucket | Values |
|---|---|
| `quantity_bucket` | `zero`, `one`, `few` (2–5), `several` (6–20), `many` (21–100), `very_many` (101+) |
| `size_bucket` | `empty`, `under_1_kb`, `1_to_10_kb`, `10_to_100_kb`, `100_kb_to_1_mb`, `over_1_mb` |
| `duration_bucket` | `under_100_ms`, `100_to_499_ms`, `500_to_1999_ms`, `2_to_9_s`, `10_s_or_more` |

These thresholds are part of contract version 1. Changing them requires a versioned
contract change so results from different definitions are not silently combined.

## Outcome definitions

| Outcome | Meaning |
|---|---|
| `valid` | The tool produced a complete result that satisfies its published capability contract. |
| `partial` | The tool produced an explicitly identified usable subset while also reporting rejected, skipped, truncated, or unsupported parts. |
| `ambiguous` | The tool produced or proposed a result that depends on an unconfirmed inference or multiple plausible interpretations. |
| `failure` | The tool produced no usable result for the requested job. |

A successful function call, button click, rendered component, non-empty string, or
HTTP 200 is not by itself a valid customer outcome. Tools that cannot distinguish
these states must not emit `tool_result` until their result contract can do so.

Recovery means a result moves from `partial`, `ambiguous`, or `failure` to a more
useful outcome after a visitor action. A clear or reset interaction is not
automatically a recovery.

## Event contracts

Events described as reserved remain prohibited in production until the corresponding
product capability and runtime schema are implemented and validated.

| Event | When it may be emitted | Additional allowed parameters | Status |
|---|---|---|---|
| `tool_view` | An approved static tool route becomes usable | None | Current acquisition event; not an outcome |
| `tool_activation` | The first meaningful tool input in a page session can cause the tool to evaluate a result | `activation_kind`: `typed`, `pasted`, `uploaded`, `option_changed` | Current name; semantics need alignment |
| `tool_result` | A completed evaluation can be classified under the published tool contract | `operation`, `outcome`, `error_code`, `input_size_bucket`, `output_size_bucket`, `quantity_bucket`, `duration_bucket`, `inference_used` | Reserved |
| `tool_recovery` | A prior non-valid result becomes valid or explicitly more useful | `operation`, `prior_outcome`, `outcome`, `recovery_action`, `error_code`, `duration_bucket` | Reserved |
| `tool_output` | Copy or download completes successfully for a usable result | `operation`, `output_action`: `copy` or `download`; `output_format`, `outcome` | Reserved replacement for copy clicks |
| `continuation_offered` | A specific approved next action is rendered and available for a usable result | `operation`, `destination_tool`, `continuation_kind`, `outcome` | Reserved |
| `continuation_completed` | The destination confirms receipt and successful evaluation of transferred work | `operation`, `source_tool`, `continuation_kind`, `outcome`, `duration_bucket` | Reserved |
| `preset_reused` | Applying an existing preset successfully changes the active tool configuration | `operation`, `preset_kind`: `built_in` or `user_saved`; `preset_family` | Reserved; no approved preset capability exists yet |
| `document_lifecycle` | A browser-local document action completes | `document_action`: `save`, `reopen`, `restore`, or `delete`; `document_kind`, `storage_kind`: `browser_local` | Reserved; no approved document capability exists yet |
| `feedback_open` | The feedback form is opened from a tool | None | Current support interaction; not an outcome |
| `feedback_submit` | The feedback endpoint accepts the submission | None | Current support interaction; feedback fields are never analytics parameters |

`operation`, `error_code`, `output_format`, `continuation_kind`, `preset_family`,
and `document_kind` have no global free-form values. Each must be enumerated beside
the capability that introduces it. Error codes describe stable classes such as
`invalid_syntax` or `unsupported_shape`; they must never interpolate a parser or
provider message.

Continuation completion belongs to the destination, not the source click. The
source can establish that an action was offered, but only the destination can prove
that transferred work was received and evaluated.

## Interaction events outside the outcome contract

Controls such as clear, reset, toggle-all, search, previous, and next may be useful
for focused usability research, but they are not customer outcomes. They must not
be retained as permanent production events without a named question, a bounded
observation period, and a separate allow-list entry. They must never be used as a
proxy for success or recovery.

## Current implementation differences

The production implementation at baseline commit `a01fec0` differs from this
contract in material ways:

- analytics functions accept arbitrary custom parameters through
  `[key: string]: unknown` rather than event-specific allow-lists;
- every application event adds `window.location.href` as `page_location`, which can
  include prohibited query strings or fragments;
- `page_path` is a concrete browser path rather than a registered static route
  template;
- regex copy and continuation events send exact `matchCount` values derived from
  visitor content;
- Text Sanitizer sends an array of enabled option identifiers;
- several interactions send exact configuration counts or loosely named custom
  parameters;
- `tool_conversion` is emitted before navigation, so it proves a source interaction
  rather than destination completion;
- `copy_button_click` usually describes a click or source-side clipboard call rather
  than a uniformly verified successful output action;
- tool activation is captured from any input event inside the tool frame and can be
  triggered by the feedback form rather than the tool's primary input;
- clear and toggle-all events are interactions with no stated outcome relationship;
  and
- no production event represents valid, partial, ambiguous, failed, or recovered
  results.

Current automated tests prove environment enablement only. They do not enforce
event names, parameter names, enum membership, bucket conversion, prohibited data,
or payload shape.

This inventory is a delivery input, not authorization to change production
instrumentation in `TEXT-8`.

## Requirements for later implementation

A separately authorized delivery issue must:

- replace generic parameter records with event-specific runtime and TypeScript
  schemas that reject unknown keys and values;
- centralize tool, route, operation, error, format, and workflow enums;
- strip or reject prohibited URL and dynamic identifier data before calling a
  provider;
- bucket exact values before payload construction and prove the exact value cannot
  escape through another field;
- test every approved and rejected payload shape, including adversarial strings in
  every caller-controlled value;
- verify interaction and outcome timing at the browser boundary;
- inspect representative payloads without sending them to the production property;
  staging may use an explicitly configured test property or a local intercepted
  transport; and
- reconcile the provider's automatic collection and configuration with the approved
  privacy contract.

## Change control

New events and parameters are denied by default. A contract change must state the
product question, why existing aggregate data cannot answer it, its privacy risk,
allowed values, validation, owner, and removal condition. Contract changes and
instrumentation changes must be reviewable independently.
