# Textytools Product Strategy

## Product vision

Textytools is the private, immediate workspace for understanding and transforming text and structured data in the browser.

It should help people move from raw input to a trustworthy, reusable result without uploading their work, creating an account, or stitching together a series of unrelated websites.

The product is not defined by the number of utilities it offers. It wins when each tool resolves a meaningful job quickly, explains its result clearly, and makes the user's next step obvious.

## Product position

Textytools competes with one-off utility sites, editor extensions, command-line tools, spreadsheets, and improvised scripts. Its advantage is not that it can perform transformations those products cannot. Its advantage is that a user can inspect sensitive content, understand what will happen, transform it, verify the result, and continue working without setup or upload.

The product serves one-off tasks immediately while adding optional value for recurring tasks through presets, saved documents, and history.

## Personas and valuable use cases

Personas describe recurring needs rather than demographic segments. One person may use Textytools as several personas during the same workday.

### Maya, the backend developer debugging an integration

Maya receives an API payload, webhook, token, or configuration file that another system rejected. The content may contain customer data or credentials, so she does not want to upload it to an unknown service.

She needs to:

1. Identify the content type and the first validation failure.
2. Inspect nested values, encoded fields, timestamps, and tokens.
3. Convert among JSON, YAML, and TOML when systems or repositories require different formats.
4. Understand which values, comments, or format-specific constructs cannot survive the conversion unchanged.
5. Correct or reshape the payload without losing the original.
6. Compare the corrected result with the source.
7. Copy or download the exact output expected by the destination system.

Textytools creates value when structured-data validation and conversion, JWT Decoder, Text Encoder, date conversion, and Diff Viewer work as a coherent debugging path. The result is not merely valid syntax; it is a configuration or payload Maya understands and can confidently submit.

### Jordan, the analyst turning messy text into rows

Jordan receives survey responses, copied reports, email exports, lists, or operational notes. The source is semi-structured: it contains recurring labels and patterns but is not valid CSV or JSON.

Jordan needs to:

1. Clean inconsistent whitespace, punctuation, line breaks, and repeated boilerplate.
2. Identify recurring records and fields.
3. Extract named values into columns.
4. See which records failed or produced ambiguous fields.
5. Correct the extraction rules without starting over.
6. Export the result as CSV or JSON and continue validating it.

This is a first-class unstructured-to-structured use case. Textytools should support extraction based on patterns, delimiters, labeled values, and line structure; preview the resulting table; distinguish successful, partial, and failed records; and send the result into CSV / JSON Converter or JSON Wizard. The original text must remain available for comparison.

The outcome is a reviewable dataset, not an opaque bulk conversion.

### Rafael, the support or operations engineer investigating logs

Rafael pastes logs from several systems while responding to an incident. Lines contain timestamps, request IDs, status codes, messages, and occasional stack traces.

He needs to:

1. Remove irrelevant lines and normalize recurring noise.
2. Find and highlight incidents matching one or more patterns.
3. Extract fields such as timestamp, service, request ID, status, and message.
4. Group or sort results to reveal frequency and sequence.
5. Export evidence or compare logs from before and after a change.
6. Save the extraction setup for the next incident without saving sensitive log content unintentionally.

Textytools creates value by joining Text Sanitizer, Regex Tester, structured extraction, counting, and Diff Viewer into a repeatable investigation workflow.

### Priya, the AI application developer managing context

Priya is preparing prompts, retrieved documents, or examples for several model families. She needs more than a generic word counter.

She needs to:

1. Compare exact token counts where local tokenizers are available.
2. Understand when a count is only an estimate.
3. See which sections consume the most context.
4. Work toward a target context limit.
5. Compare the original prompt with a shortened version.
6. Revisit recurring prompt drafts and their prior counts.

Textytools creates value when Text Counter explains tokenization, exposes model differences, and connects naturally to sanitizing, comparing, and saving prompt drafts without claiming unsupported precision.

### Elena, the technical writer cleaning and adapting content

Elena moves content among documents, content systems, spreadsheets, and developer tools. Copied text often contains malformed whitespace, smart punctuation, duplicate lines, inconsistent headings, or identifiers in the wrong case.

She needs to:

1. Inspect counts and content limits.
2. Apply a repeatable sequence of cleanup actions.
3. Preview destructive changes.
4. Adapt headings, identifiers, or lists to the target format.
5. Verify the final version against the original.
6. Reuse a cleanup preset for recurring publishing work.

Textytools creates value by making cleanup sequences explainable, reversible, and reusable rather than offering a collection of unrelated checkboxes.

### Sam, the security-conscious developer inspecting encoded content

Sam encounters a JWT, hash, Base64 value, URL-encoded parameter, or suspicious invisible character while debugging authentication or transport behavior.

He needs to:

1. Identify the likely representation.
2. Decode or inspect it without transmitting it.
3. Understand the distinction between decoding, verification, hashing, and encryption.
4. Validate claims or integrity when local verification is possible.
5. Inspect the revealed JSON or bytes in the appropriate tool.
6. Redact sensitive values before copying a diagnostic result.

Textytools creates value by reducing security mistakes and presenting a safe next action, not simply displaying decoded text.

## Priority use cases

### Turn unstructured text into structured data

This is a product-level workflow, not a minor Regex Tester export feature.

Supported inputs should include copied reports, repeated text records, labeled fields, logs, lists, and delimiter-like text that is not yet valid CSV. Users should be able to move through four distinct stages:

1. Prepare: normalize or remove noise without destroying the source.
2. Define: identify record boundaries and name the fields to extract.
3. Review: inspect a tabular preview and isolate partial or failed records.
4. Deliver: export CSV or JSON, or continue refining the structured result.

Product improvements required to support the use case:

- Regex Tester adds extraction-oriented results, named fields, record-level failures, replacement preview, and reusable patterns.
- Text Sanitizer adds ordered cleanup sequences, previews, and locally saved presets.
- A dedicated Data Extractor becomes warranted when guided field extraction and record review outgrow the primary job of Regex Tester.
- CSV / JSON Converter adds a reviewable table, column controls, and explicit type decisions.
- JSON Wizard adds querying, reshaping, and validation of extracted results.
- Diff Viewer compares cleaned or extracted work with the original.
- Cross-tool actions preserve the source, field names, and relevant choices.

Success means a non-programmer can produce a usable table from recurring text patterns, while a technical user retains enough control to diagnose every rejected record.

### Diagnose and repair structured data

Users should be able to locate an error, understand it, make or preview a correction, validate the result, and compare it with the source. JSON is the initial foundation; YAML and TOML join the same workflow in Phase 2.

### Convert among structured-data formats

Users should be able to move among JSON, YAML, and TOML without visiting separate pairwise converters. The workflow should let them:

1. Paste or open data in any supported format.
2. Confirm or correct the detected source format.
3. Validate the source before conversion.
4. Select a destination format and preview the result.
5. Review warnings about comments, duplicate keys, ambiguous scalar values, dates, numeric precision, ordering, and structures the destination cannot represent faithfully.
6. Compare the meaning and shape of the result with the source.
7. Copy, download, or continue editing in the destination format.

JSON, YAML, and TOML share enough developer use cases to form one structured-data workflow, but they are not interchangeable representations. Textytools should never promise a lossless round trip when a source feature has no destination equivalent.

CSV remains connected but distinct because converting nested data to rows requires explicit choices about columns, arrays, and types. XML remains a later candidate because attributes, namespaces, and mixed content introduce a different conversion model and a greater risk of misleading output.

### Extract evidence from logs and text

Users should be able to filter lines, test patterns, navigate matches, extract named fields, review unmatched content, and export evidence without losing the surrounding source.

### Prepare content for model context limits

Users should be able to count accurately where possible, set a target, identify expensive sections, refine the text, and verify the reduction. Estimates must remain visibly distinct from exact counts.

### Clean recurring text safely

Users should be able to build a named cleanup sequence, preview its cumulative effect, compare before and after, and reuse it on new content. The sequence is reusable; sensitive content is not saved unless the user deliberately saves it.

### Inspect and convert encoded developer data

Users should be able to identify likely encodings, inspect bytes or claims, perform supported conversions, understand irreversible operations, and continue in the correct structured-data tool.

### Compare meaningful changes

Users should be able to compare prose, code, logs, and structured data while controlling common sources of noise such as whitespace, line endings, case, or key ordering.

## Strategic choices

### Depth before breadth

Existing tools should become stronger at their primary jobs before the catalog grows significantly. New capabilities are valuable when they improve completion, confidence, or a common next step—not simply because they are technically possible.

Each mature tool should offer:

- A fast default path.
- Advanced controls that remain out of the way until needed.
- An explanation of important assumptions and limitations.
- A useful next action.
- Examples and documentation specific to the task.

### A workspace, not a suite

Tools remain independently useful and independently discoverable. Connections between them should shorten real workflows, not require users to understand a product hierarchy.

The product should not force users into a project, pipeline, or document model before they can complete a one-off task.

### Privacy as product value

Browser-only processing is a primary reason to choose Textytools, especially for source code, tokens, logs, configuration, and business data.

The product should state plainly when content is temporary, when it is saved on the device, and how it can be removed. Saved work must be opt-in or clearly expected from the interaction. Sharing and cloud synchronization are outside the current vision.

### Trust over cleverness

Exact results must be distinguished from estimates. Automatic detection, repair, inference, and normalization should be visible and reversible when they can materially change meaning.

The product should favor an honest limitation over a confident but inaccurate result.

## Adversarial review of the opportunity

### More features can make the tools worse

A long option list can bury the primary job, increase decision fatigue, and make a fast utility feel like enterprise software. Feature depth should therefore be progressive: immediate defaults first, specialist controls second.

### More tools can dilute discoverability

Closely related tools can compete with one another, confuse navigation, and create shallow pages. A new public tool needs a distinct user intent, a credible standalone job, and enough depth to deserve its own destination.

### Integration can become navigation clutter

Users do not need every possible conversion. They need the few next actions that commonly follow the result in front of them. Connections should be contextual and ranked, with generic discovery kept secondary.

### History can violate the privacy promise

Automatic durable storage of pasted secrets, tokens, logs, or personal data could surprise users. Draft recovery, saved documents, recent activity, and revision history are different promises and must not be conflated.

### Token counting can overpromise accuracy

Different model families use different tokenization rules, and some vendors do not offer an exact browser-local method. Textytools must not turn a convenient estimate into a misleading cost or context claim.

### Documentation can become search-engine filler

Generic or repetitive copy will not create trust or durable discoverability. Documentation must answer questions raised by the tool, use the same language as the interface, and disclose behavior that affects results.

### A productivity product needs repeat value

Search traffic may bring users to a single utility, but a larger feature catalog alone will not create retention. Repeat value comes from saved preferences, reusable presets, connected workflows, and reliable return to prior work—without slowing down first use.

## Concrete product commitments

- Every public tool will define its primary job, supported use cases, inputs, outputs, failure states, and next actions.
- Every public tool will provide task-specific documentation, examples, limitations, and privacy behavior on the page.
- Text Counter will expand beyond a legacy model count into model-context comparison, target limits, and deeper text analysis.
- Regex Tester will support matching, extraction, replacement, explanation, and review of records that fail extraction.
- Text Sanitizer will support ordered, previewable, reusable cleanup sequences.
- JSON Wizard will support finding, validating, querying, reshaping, and comparing JSON—not formatting alone.
- Structured-data tools will extend this inspection model to YAML and TOML and support conversion among all three formats with fidelity warnings.
- CSV / JSON Converter will expose tabular previews, column decisions, type decisions, and malformed records before export.
- Diff Viewer will compare at useful levels of detail and let users control irrelevant differences.
- JWT Decoder will distinguish inspection from verification and guide users toward safe handling of claims and secrets.
- Text Encoder will clearly separate reversible encodings, one-way hashes, ciphers, and byte inspection.
- Case Converter will address identifier conventions, word-boundary ambiguity, and batch conversion.
- High-value outputs will offer a small number of contextual next actions that preserve the source and result.
- Users will be able to use every tool once without saving content, and later choose to save recurring work locally.

## Product principles for scope decisions

A proposed capability should satisfy at least one of these tests:

- It materially improves completion of the tool's primary job.
- It prevents a common or costly mistake.
- It explains a result users would otherwise distrust.
- It removes a recurring manual step between existing tools.
- It creates repeat value without adding friction to one-off use.
- It serves a distinct, demonstrated user intent not already covered well.

A capability should be rejected, deferred, or separated when:

- It primarily increases the option count.
- It requires an account or server processing for an otherwise local workflow.
- Its result cannot be described honestly as exact or approximate.
- It makes the default experience harder to understand.
- It duplicates an existing tool without a distinct user job.
- It stores sensitive content in a way users would not reasonably expect.

## Phased product plan

Phases represent product outcomes and learning gates, not calendar commitments. A phase should not expand until its core experience is understandable, measurable, and reliable.

### Phase 1: Earn trust through depth

#### Objective

Make the most valuable existing tools substantially more capable while preserving immediate first use.

#### Scope

- Reposition Text Counter as a text and model-context analyzer, with exact and estimated counts labeled honestly.
- Deepen JSON Wizard around inspection, validation, querying, and controlled transformation.
- Deepen Regex Tester around extraction, named fields, replacement, explanation, and review of unmatched records.
- Improve CSV / JSON Converter with a tabular preview that makes detection, column choices, type decisions, malformed records, and conversion loss visible.
- Let users complete an initial unstructured-to-structured workflow: clean recurring text, extract named fields, review exceptions, and export CSV or JSON.
- Add ordered cleanup and before-and-after review to Text Sanitizer.
- Add tool-specific documentation to every public tool, beginning with the four priority tools.
- Establish consistent language for privacy, accuracy, destructive actions, and inferred behavior.

#### Explicitly deferred

- Global document history.
- Broad expansion of the public tool catalog.
- Accounts, sharing, cloud synchronization, and collaboration.
- Exact token claims for model families that cannot be counted exactly in the browser.

#### Success signals

- More visitors interact with a tool after landing.
- More activated sessions reach a meaningful result or output action.
- Priority tools generate deeper use without increasing early abandonment.
- Feedback shows that users understand important limitations and inferred behavior.
- Documentation attracts relevant entry traffic and supports feature use rather than merely page views.
- Users successfully turn representative logs, labeled records, and repeated text blocks into reviewable structured output.

#### Exit criteria

- Priority tools have a clear fast path and discoverable advanced path.
- The unstructured-to-structured workflow handles successful, partial, and failed records without hiding exceptions.
- Every public tool explains its purpose, behavior, privacy, and limitations.
- Accuracy language is consistent across the product.
- No priority feature relies on server-side processing of tool content.

### Phase 2: Connect tools and structured-data formats

#### Objective

Reduce copying, re-pasting, and loss of context between related tasks.

#### Scope

- Add contextual next actions to high-confidence workflows.
- Preserve source context when work continues in another tool.
- Allow transformed results to be compared with their source.
- Standardize copy, download, reset, and continuation behavior.
- Expand structured-data support from JSON to YAML and TOML validation, formatting, inspection, and conversion.
- Offer conversion among JSON, YAML, and TOML as one coherent workflow rather than a collection of pairwise utilities.
- Warn before conversion when the destination cannot faithfully represent source content or meaning.
- Let users compare source and converted data and identify changes in structure or interpretation.
- Expand depth in Diff Viewer, Text Sanitizer, and JWT Decoder where it strengthens connected workflows.
- Decide whether guided structured extraction has earned a dedicated Data Extractor based on use of the initial extraction workflow and observed failure points.
- Introduce a small number of format-focused tools only when they complete obvious gaps in existing workflows.

Priority workflow families are:

- Inspect JSON, YAML, or TOML; validate and reshape it; convert it; and compare the result.
- Prepare messy text, define records and fields, review extraction failures, and continue in a data tool.
- Clean text, analyze it, convert its case, and verify the change.
- Decode or inspect encoded data, then validate the revealed format.

#### Explicitly deferred

- A universal workflow builder.
- Arbitrary tool chaining as a primary interface.
- A destination menu showing every possible tool.
- Durable storage of every transfer by default.
- XML conversion until its distinct representation and fidelity rules receive dedicated product treatment.

#### Success signals

- Users take relevant next actions without returning to the homepage.
- Connected sessions include more completed tasks, not merely more page views.
- Fewer users repeat paste-and-configure steps across tools.
- Destination tools receive content in a state users can understand and undo.
- Users reuse successful extraction and cleanup setups on new content.
- Users complete JSON, YAML, and TOML conversions while understanding any warnings or loss of fidelity.

#### Exit criteria

- The highest-value workflow families have clear, contextual continuation paths.
- JSON, YAML, and TOML have consistent validation, inspection, and conversion journeys.
- Format conversion reports meaningful differences instead of treating syntactic success as proof of equivalence.
- Cross-tool actions preserve provenance and never silently discard destination work.
- Integration choices remain limited enough to be understandable.

### Phase 3: Support return and reuse

#### Objective

Create repeat value through browser-local documents while protecting one-off use and privacy.

#### Scope

- Let users deliberately save and name work within each tool.
- Surface recent and saved work within its relevant tool.
- Provide a global place to find saved work across tools.
- Distinguish temporary drafts from deliberately saved documents.
- Allow users to duplicate, rename, export, import, and delete saved work.
- Communicate what is stored, where it is stored, and how long it remains.
- Provide recovery behavior for interrupted work without implying permanent retention.

#### Explicitly deferred

- Cloud backup or synchronization.
- Public or private sharing links.
- Team workspaces and collaboration.
- Indefinite automatic capture of all inputs.
- Detailed revision history.

#### Success signals

- Returning users reopen saved work and complete another meaningful action.
- Saving is used intentionally rather than triggered accidentally.
- Users can confidently remove all locally retained content.
- Support and feedback do not indicate surprise about persistence.

#### Exit criteria

- Temporary, recovered, recent, and saved states are clearly distinguishable.
- Saved work is accessible both per tool and globally.
- Users can inspect, export, and delete their locally retained work.
- Sensitive-content warnings are proportionate and visible at the point of saving.

### Phase 4: Add meaningful history

#### Objective

Help users understand, revisit, and safely reverse meaningful changes to saved work.

#### Scope

- Record revisions at meaningful user and workflow moments.
- Show how a result was derived from earlier work.
- Let users preview and restore a prior revision.
- Let users compare revisions before restoring.
- Give users control over retention and deletion.
- Extend reusable presets for recurring transformations where demand is demonstrated.

#### Explicitly deferred

- Keystroke-level playback.
- Permanent retention by default.
- Cloud-hosted history.
- Social, approval, or collaborative workflows.

#### Success signals

- Users successfully recover from unwanted transformations.
- Revisions are opened or restored often enough to justify their storage and interface cost.
- Presets reduce repeated configuration for returning users.
- History strengthens trust without creating concern about hidden retention.

#### Exit criteria

- Revision creation corresponds to events users recognize as meaningful.
- Restore behavior is previewable and reversible.
- Retention controls are understandable without documentation.

### Phase 5: Expand the catalog selectively

#### Objective

Serve additional high-intent jobs that reinforce the existing text and data workspace.

#### Candidate areas

- XML validation and conversion, with explicit handling of attributes, namespaces, and mixed content.
- JSONPath exploration.
- Unicode and invisible-character inspection.
- Line-oriented cleanup and set operations.
- Timestamp and date-format conversion.
- Compression and decompression.

Candidates are not commitments. Each must demonstrate:

- A distinct search and user intent.
- A complete browser-local experience.
- Meaningful depth beyond a single trivial action.
- A natural relationship to existing workflows.
- Documentation sufficient to establish trust.

#### Success signals

- New tools attract qualified users rather than redistributing existing traffic.
- New-tool visitors complete the intended job.
- A meaningful portion discover or continue into a related tool.
- Catalog growth does not reduce comprehension of the homepage or product promise.

## Measurement framework

Measurement should reflect completed work, not raw activity.

### Acquisition

- Qualified visits to individual tool pages.
- Search intent alignment by landing page.
- New visitors who reach a first useful result.

### Activation

- First meaningful input.
- First valid result, match, comparison, or conversion.
- Time from landing to first useful result.

### Completion

- Copy, download, save, successful conversion, or completed comparison.
- Error recovery after invalid input.
- Abandonment before versus after a useful result.

### Continuity

- Relevant next-tool actions.
- Successful continuation in the destination tool.
- Return to recent or saved work.
- Reuse of saved presets or documents.

### Trust and quality

- Corrections or reversals following automatic inference.
- Destructive actions undone or restored.
- Feedback about accuracy, privacy, and unclear behavior.
- Performance and failure rates for large inputs.

No tool content should be collected for product measurement. Events should describe interaction outcomes, not the user's text or data.

## Product risks and guardrails

### Scope sprawl

Maintain a primary job statement for every tool. Features outside that statement require evidence that they complete an adjacent job better than a separate tool would.

### Expert complexity overwhelming casual use

Keep advanced controls progressive and preserve a useful default result.

### Inaccurate or lossy transformations

Expose assumptions, preserve original input, and make consequential changes previewable.

### Sensitive local retention

Do not treat browser-local as automatically harmless. Make saving intentional, deletion easy, and retention understandable.

### Catalog fragmentation

Prefer deepening an existing tool when the user intent and working context are substantially the same. Create a new tool only when it deserves independent discovery and a focused experience.

### Productivity theater

Do not use document counts, activity streaks, dashboards, or decorative analytics as substitutes for helping users finish work.

## Non-goals

Textytools is not currently pursuing:

- User accounts or identity.
- Cloud storage or cross-device synchronization.
- Sharing, publishing, or real-time collaboration.
- Server-side processing of tool input.
- A general-purpose code editor or integrated development environment.
- A universal automation platform.
- AI-generated transformations that require sending user content to a model.
- Feature parity with every specialist desktop application.

## Product definition of done

A product capability is complete when:

- Its target job and intended user are clear.
- The default path reaches value quickly.
- Empty, invalid, large, and ambiguous inputs receive deliberate treatment.
- Accuracy and limitations are stated honestly.
- The user can understand and reverse consequential changes.
- Privacy and persistence behavior match reasonable expectations.
- The capability has useful documentation and examples.
- Its success can be evaluated without collecting user content.
- It strengthens the product promise rather than merely increasing the feature count.
