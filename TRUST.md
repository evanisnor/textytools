# Product trust language and state contract

This document defines how Textytools describes the certainty, safety, processing,
and persistence of a result. It is a language and semantic-interface contract,
not a visual design system. Product copy, accessible names, help content, tests,
and analytics vocabulary must use these meanings even when the visual treatment
changes.

## Verification envelope

- Contract version: 1
- Established: 2026-09-06
- Capability baseline: [`CAPABILITIES.md`](CAPABILITIES.md)
- Fixture contract: [`FIXTURES.md`](FIXTURES.md)
- Source state reviewed: [`4328625`](https://github.com/tidalsoft/textytools/commit/43286251e877e81a23074f33fc3e9c4e77662e97)

The terms below describe different dimensions and may be combined. For example,
a converter may produce a **partial** result from an **inferred** format, keep the
source **temporary**, and warn that exporting the result is **lossy**. Do not
replace these specific facts with a generic success, warning, or error label.

## Required structure for a trust state

A visible trust state must answer the applicable questions in this order:

1. **What happened?** Name the result and its certainty or condition.
2. **What is the evidence or limit?** State what was checked, assumed, omitted,
   or changed.
3. **Is the source preserved?** Say whether the original input is still available.
4. **Can the action be reversed?** Distinguish restoring the source from deriving
   the source from the result.
5. **Where was content processed and retained?** Use the processing and persistence
   vocabulary below.
6. **What is the next safe action?** Offer correction, review, retry, copy, export,
   clear, or cancellation as appropriate.

Put the result first and keep supporting detail adjacent or directly reachable.
Do not rely on color, an icon, punctuation, or position to communicate the state.
The state name must remain understandable in plain text and to assistive
technology.

## Result and certainty vocabulary

### Exact

Use **exact** only when the displayed result follows completely and
deterministically from the stated input, options, and named algorithm or standard.
The evidence boundary must be reproducible; exact does not mean universally true.

- State the unit, algorithm, standard, or evaluation boundary when it could change
  the answer.
- Preserve the source when a person may need to verify the result.
- Say whether the operation is reversible independently of whether the source is
  still visible.
- Do not use exact for model-dependent estimates, heuristics, format guesses, or
  claims that depend on an unverified external fact.
- Next safe action: use, copy, or export the result; retain a route back to the
  source when verification remains useful.

Example: `42 characters` is exact for the current text and counting rules.
`42 GPT tokens` is not exact without naming and executing the tokenizer whose
result is being reported.

### Estimated

Use **estimated** when a defined method approximates a quantity but the value may
differ from the quantity charged, accepted, or produced by the eventual system.

- Name the estimator or basis and the material reason the actual value may differ.
- Keep the source available so the estimate can be recalculated with another basis.
- An estimate is not reversible or irreversible; that property belongs to the
  operation performed on the source.
- Next safe action: choose the relevant basis when available or verify with the
  destination system before relying on the value.

### Inferred

Use **inferred** when Textytools selects a meaning or value from evidence in the
input, but another interpretation remains possible.

- Name the inferred property and the rule or evidence used.
- Make the assumption inspectable and correctable before a consequential or lossy
  action.
- Preserve the original representation; the inferred value alone may not contain
  enough information to reverse the interpretation.
- Next safe action: accept the inference or choose the intended value or type.

Examples include interpreting CSV text `true` as a Boolean or a dotted header as
a nested object path.

### Detected

Use **detected** when a defined check identifies a property that is present in the
input. Detection reports evidence; it does not prove authenticity, safety, or a
broader meaning.

- Name what was detected and the scope of the check.
- If more than one result is plausible, combine detected with **ambiguous** or use
  **inferred** instead.
- Preserve the source when the person may need to inspect or override the finding.
- Next safe action: continue when the finding is unambiguous, or inspect and choose
  when it is not.

### Partial

Use **partial** when some requested output is usable and some is missing, skipped,
truncated, or could not be produced.

- Quantify completed and omitted portions when possible and explain why completion
  stopped.
- Never present a partial result through an unqualified success state.
- Preserve the complete source and identify whether the partial result can be
  safely used on its own.
- Next safe action: review omissions, correct the source or options, and retry; copy
  or export only with the limitation attached or clearly visible.

Do not use partial when no output is trustworthy; use **invalid** instead.

### Ambiguous

Use **ambiguous** when the available evidence supports more than one materially
different interpretation and Textytools cannot safely choose one.

- Name the plausible choices and the evidence that failed to distinguish them.
- Do not silently select a default when the choice can change, discard, or expose
  data.
- Preserve the source unchanged.
- Next safe action: ask the person to choose or edit the source; preview the effect
  of each choice when useful.

### Invalid

Use **invalid** when the input or requested operation violates a named syntax,
shape, range, compatibility rule, or required precondition.

- Identify the failed rule and location when known without exposing content in
  logs or analytics.
- Say what remains safe. Keep the source and valid settings intact while the person
  corrects the problem.
- Do not use invalid to mean unverified, expired, unexpected, unsupported, or
  merely empty unless the relevant contract makes that state invalid.
- Next safe action: focus or link to the correction point, explain an accepted
  form, and allow retry without re-entering unaffected work.

### Lossy

Use **lossy** before an operation that cannot represent every material distinction
in the source and after it when the result is displayed.

- Name the distinctions that may be normalized, flattened, omitted, rounded, or
  otherwise changed.
- Preserve the original source by default. A preserved source makes recovery
  possible in the interface, but it does not make the transformation reversible
  from its output.
- Require a preview or explicit confirmation when the loss is not obvious and the
  result will replace, download over, or be sent in place of the source.
- Next safe action: inspect the preview, change options, keep both versions, or
  cancel.

## Safety and lifecycle vocabulary

### Destructive

Use **destructive** for an action that removes or overwrites source, saved state, or
another value the product cannot restore completely.

- Name the affected object and scope in the action label and confirmation.
- State whether any recovery path exists and how long it remains available.
- Keep the safe cancellation path at least as clear as confirmation. Confirmation
  is required when scope or consequence is not already obvious at the point of
  action.
- Next safe action: cancel, export or copy a backup, or confirm the specifically
  named destructive effect.

`Clear input` is destructive if it removes the only recoverable copy. `Delete` must
not be used for a reversible hide or removal from a view.

### Temporary

Use **temporary** when state has a bounded product or browser lifetime and is not a
durable saved record.

- Name the lifetime in customer terms when known, such as `kept in this tab for
  this browser session`.
- State what ends the lifetime and whether browser restore behavior can extend it.
- Do not promise an exact deletion time when the browser owns cleanup.
- Next safe action: copy or export content that must survive the temporary lifetime,
  or clear it now.

### Recovered

Use **recovered** only after Textytools has restored usable work or safely returned
to a known state following an interruption, corrupt saved value, or failed action.

- Name what was restored, reset, or lost; recovery is not synonymous with success.
- Preserve any trustworthy source and avoid overwriting recoverable content during
  automatic recovery.
- State whether the recovered state is temporary or saved.
- Next safe action: review the recovered result, retry the interrupted operation,
  or clear the affected state.

### Saved locally

Use **saved locally** only when Textytools deliberately writes a durable value to
storage controlled by the current browser or device and can identify it again.

- Name the device or browser scope, whether an account or synchronization is
  involved, and the deletion control.
- Do not use saved locally for React memory, a one-time handoff, `sessionStorage`, a
  downloaded file, a browser clipboard, a server record, or a promise that content
  never leaves the device.
- Local storage does not by itself make content encrypted, backed up, private from
  other users of the device, or available in another browser.
- Next safe action: reopen, export a backup, or delete the named local record.

No catalogued Textytools tool in the reviewed capability baseline creates a value
that qualifies as **saved locally**. Their persisted editor state is
**temporary**.

## Processing and persistence vocabulary

Certainty terms do not imply privacy behavior. Add a separate disclosure wherever
processing or retention affects whether a person should provide or keep content.

| Phrase | Required meaning |
|---|---|
| `Processed in this browser` | The named operation executes in client-side code. It does not claim that analytics, feedback, extensions, browser synchronization, or other page behavior makes no network request. |
| `Kept in this tab for this browser session` | The named state is written to same-origin `sessionStorage`. It may survive reload and browser session restoration; it is not a durable Textytools record. |
| `Transferred once to [tool]` | The result is written to the named one-time `sessionStorage` handoff key, consumed by the destination, and removed after consumption. The destination may then retain it as its own temporary state. |
| `Copied to the clipboard` | The browser accepted a clipboard write. Clipboard retention and access are controlled outside Textytools. |
| `Sent as feedback` | The submitted name, email, and message leave the browser through the feedback service. Tool contents are excluded unless the person puts them in the message. |
| `Not retained by Textytools` | Use only when verified across application storage, servers, logs, analytics, and configured providers for the named content and operation. Browser-owned copies must still be described separately. |

Avoid `stays on your device`, `never leaves your browser`, `private`, and `secure`
as shortcuts. Each can imply a broader guarantee than client-side tool processing
proves.

## Semantic interface treatments

Every treatment has a text meaning first. Color and icons may reinforce it but may
not replace it.

| Condition | Required semantic treatment | Required action |
|---|---|---|
| Exact or detected result with no material caveat | A named result or status adjacent to the output; include the evaluation boundary where it is not obvious. | Continue, copy, export, or inspect source. |
| Estimated or inferred result | A visible qualifier in the result label and an adjacent explanation of basis or assumption. | Verify or change the basis or assumption. |
| Partial or ambiguous result | A persistent status and explanation before output actions; associate affected output and controls programmatically. | Review omissions, choose an interpretation, edit, or retry. |
| Invalid input or operation | An inline error associated with the source and a summary when the error is outside the current viewport. Preserve the source. | Move to the correction point and retry. |
| Lossy operation | A pre-action warning or preview that names the loss, followed by a qualified result state. | Keep source, adjust, confirm, or cancel. |
| Destructive action | A specifically labelled control and proportional confirmation when consequence or scope is not already clear. | Cancel, back up, or confirm. |
| Temporary or saved state | A persistence statement near the first input or save control and wherever loss would otherwise be surprising. | Export, reopen, or clear/delete as applicable. |
| Recovered state | A non-blocking status that names restored and lost state and remains available long enough to review. | Review, retry, or clear. |

Use `role="alert"` only for a new condition that requires immediate attention.
Use a polite status announcement for non-urgent asynchronous changes. Static
instructions and statuses do not need a live region. Move focus only when it helps
the person recover or when opening a modal confirmation; restore focus after the
modal closes.

## Action vocabulary

- **Preview** shows an effect without changing or replacing the source.
- **Convert**, **format**, **sanitize**, and **apply** produce a result; their labels
  should name the result when the operation is lossy or otherwise consequential.
- **Copy** writes the named value to the clipboard and does not save it.
- **Export** or **download** creates a file or external representation and does not
  imply a saved Textytools record.
- **Clear** removes current working content or settings. Name the scope when more
  than one value can be cleared.
- **Delete** removes a saved object. Use it only when an object actually exists and
  state the recovery behavior.
- **Reset** restores named defaults; it must not silently mean delete or clear.

Success copy names the completed effect (`Copied JSON`) rather than claiming that
the broader task succeeded. Failure copy names what failed and leaves a next action
(`Could not copy JSON. Select the output and copy it manually.`).

## Reconciliation against representative current screens

This review resolves the vocabulary to use in later implementation and prevents a
current label from becoming precedent. It does not claim that the reviewed screens
already expose every required treatment.

| Current surface | Contract decision | Source, reversibility, processing, and retention |
|---|---|---|
| Text Counter token count | Use `Estimated tokens (cl100k_base)`, not the broader `Tokens (GPT-4+)` as an exact claim. Explain that a model or provider may tokenize differently. | Source stays editable; counting does not alter it. Processing is in the browser and the source is kept temporarily in the tab session. |
| JSON Wizard syntax state | `Valid JSON` means the current complete input parsed under JSON syntax. A reported line and column are detected from runtime error information and may be unavailable. Automatically unescaping a JSON string must be disclosed as a detected representation change. | Input remains alongside output. Formatting is reversible only while that source remains; sorted, minified, or unescaped output need not preserve the original representation. State is temporary. |
| CSV / JSON Converter direction and values | Direction may be `Detected JSON` only after a successful JSON parse. Treating every other input as CSV is not detection proof; when both interpretations or delimiter choices are plausible, use ambiguous and ask for a choice. Mark converted scalar types as inferred. Disclose flattening, dotted-path expansion, and unsupported quoted newlines as lossy, inferred, or invalid as applicable. | Preserve the original input and show the selected direction and delimiter. Conversion may not be reversible from output alone. Processing is in the browser and state is temporary. |
| JWT Decoder status | Use `Decoded JWT` for successful parsing, never `Valid JWT` or `verified`. Claim times are detected and interpreted against the current device clock; signature, issuer, audience, and trust chain are not verified. Expired and not-yet-valid describe time-claim results, not token authenticity. | Preserve the compact token while decoded fields are shown. Decoding is reversible only while the token remains. Processing is in the browser; the token is kept temporarily and should be cleared on shared devices. |
| Text Sanitizer output | Treat enabled removal, normalization, sorting, and reversal operations as a preview of a potentially lossy result. Name active operations; broad categories such as emoji or punctuation remain bounded by fixtures rather than implying universal classification. | Keep original and result separately. The result alone may not restore removed characters or ordering. Processing is in the browser and state is temporary. |
| Restored or corrupt tool state | A reload that restores session state is temporary restoration, not `saved locally`. If corrupt state is discarded, use recovered only when the interface can state what reset and what was lost. | A clear action removes the current app-managed session value, while browser cleanup and restoration remain browser-controlled. Provide copy/export before clearing content that matters. |

## Change control

Any new product term for result certainty, safety, processing, persistence, or
recovery must be reconciled with this vocabulary. Update the contract when a new
meaning is genuinely required; do not create synonyms that make two different
states look equivalent.

Behavior changes remain subject to the acceptance and regression contracts in
[`CAPABILITIES.md`](CAPABILITIES.md) and [`TESTING.md`](TESTING.md). Public privacy
claims and tool documentation must reflect implemented behavior and use these
definitions, but this contract does not authorize new retention, network,
analytics, destructive, or transformation behavior.
