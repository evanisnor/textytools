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
2. Start from a known log format instead of writing every extraction pattern from scratch.
3. Find and highlight incidents matching one or more patterns.
4. Extract fields such as timestamp, service, request ID, status, and message.
5. See which lines do not match the selected format and why.
6. Adapt the built-in pattern when a service uses a local variation.
7. Group or sort results to reveal frequency and sequence.
8. Export evidence or compare logs from before and after a change.
9. Save the extraction setup for the next incident without saving sensitive log content unintentionally.

Textytools creates value by joining built-in log patterns, Text Sanitizer, Regex Tester, structured extraction, counting, and Diff Viewer into a repeatable investigation workflow.

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

### Work deeply in JSON, YAML, and TOML, then convert between them

JSON Wizard, YAML Wizard, and TOML Wizard should be separate, independently discoverable tools. Each should reflect the concepts and common jobs of its own format rather than exposing only generic structured-data actions.

- JSON Wizard focuses on objects and arrays, querying, reshaping, schema-oriented validation, and API payloads.
- YAML Wizard focuses on configuration authoring, multi-document content, anchors and aliases, tags, scalar styles, and indentation-sensitive errors.
- TOML Wizard focuses on configuration authoring, tables, arrays of tables, dotted keys, and date and time values.

The tools should be deeply integrated so users can:

1. Paste or open data in any supported format.
2. Validate and inspect it using a specialist tool for that format.
3. Choose “Convert to JSON,” “Convert to YAML,” or “Convert to TOML.”
4. Preview the result in the destination specialist tool.
5. Review warnings about comments, duplicate keys, ambiguous scalar values, dates, numeric precision, ordering, and structures the destination cannot represent faithfully.
6. Compare the meaning and shape of the result with the source.
7. Copy, download, or continue editing in the destination format.

Separate destinations improve search discovery, documentation, and format-specific depth. Deep integration prevents that separation from recreating the friction of unrelated utility sites. Textytools should never promise a lossless round trip when a source feature has no destination equivalent.

CSV remains connected but distinct because converting nested data to rows requires explicit choices about columns, arrays, and types. XML remains a later candidate because attributes, namespaces, and mixed content introduce a different conversion model and a greater risk of misleading output.

### Extract evidence from logs and text

Users should be able to filter lines, start from common log formats, test and adapt patterns, navigate matches, extract named fields, review unmatched content, and export evidence without losing the surrounding source.

The initial built-in log pattern library should cover:

- Syslog in common RFC 3164 and RFC 5424 layouts.
- Apache and Nginx common and combined access logs.
- Common timestamp, severity, logger or service, and message layouts.
- Logfmt-style key-value records.
- Common application log prefixes with request, trace, or correlation identifiers.

Built-ins must expose their named fields, assumptions, and unmatched lines. They are editable starting points, not claims that every vendor variation is identical. JSON Lines should be detected and sent to structured-data inspection rather than treated as regex-shaped text.

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
- Regex Tester will include editable built-in patterns for common logging formats with named-field extraction and unmatched-line review.
- Text Sanitizer will support ordered, previewable, reusable cleanup sequences.
- JSON Wizard will support finding, validating, querying, reshaping, and comparing JSON—not formatting alone.
- YAML Wizard and TOML Wizard will become separate specialist tools, deeply connected to JSON Wizard through conversion and comparison actions with fidelity warnings.
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
- Deepen Regex Tester around extraction, named fields, replacement, explanation, review of unmatched records, and editable built-in patterns for common log formats.
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
- Users can extract named fields from supported common log formats without first authoring a pattern from scratch.

#### Exit criteria

- Priority tools have a clear fast path and discoverable advanced path.
- The unstructured-to-structured workflow handles successful, partial, and failed records without hiding exceptions.
- Built-in log patterns expose their assumptions and make local variations editable.
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
- Launch separate YAML Wizard and TOML Wizard experiences with format-specific validation, formatting, inspection, documentation, and examples.
- Connect JSON Wizard, YAML Wizard, and TOML Wizard through contextual conversion actions rather than a collection of pairwise converter pages.
- Warn before conversion when the destination cannot faithfully represent source content or meaning.
- Let users compare source and converted data and identify changes in structure or interpretation.
- Expand depth in Diff Viewer, Text Sanitizer, and JWT Decoder where it strengthens connected workflows.
- Decide whether guided structured extraction has earned a dedicated Data Extractor based on use of the initial extraction workflow and observed failure points.
- Introduce a small number of format-focused tools only when they complete obvious gaps in existing workflows.

Priority workflow families are:

- Inspect JSON, YAML, or TOML in its specialist tool; convert it into another format; and compare the result.
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
- JSON, YAML, and TOML each have a deep specialist experience and a consistent conversion journey between tools.
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

#### Exit criteria

- The catalog represents a coherent set of professional text and data jobs rather than an unstructured list of utilities.
- Tool groupings and common workflow relationships are supported by observed use.
- The accumulated tools, documents, history, presets, and cross-tool actions are substantial enough to expose the limits of the original information architecture.

### Phase 6: Redesign Textytools as a professional progressive web application

#### Objective

Replace the utility-site experience with a coherent, progressive workspace that feels familiar and productive to professionals who work with text and data throughout the day.

This is an information-architecture and interaction redesign, not a visual refresh. It follows the depth and workflow phases so the new experience is organized around demonstrated value rather than hypothetical platform features.

#### Product experience

The redesigned product should support two modes without forcing users to choose between them:

- A visitor arriving at a specific tool can immediately complete a one-off task with minimal interface overhead.
- A returning user can move efficiently among tools, open documents, recent work, presets, conversions, and history from a consistent workspace.

The experience should become progressively richer as users perform more complex or recurring work. Professional capability should be available without making first use feel like onboarding into enterprise software.

#### Scope

- Replace the flat catalog with an information architecture organized around user jobs such as inspect, clean, extract, convert, compare, encode, and analyze.
- Give every specialist tool a consistent place within the broader workspace while preserving its focused identity and direct destination.
- Introduce a persistent workspace model for navigating among tools, open documents, recent work, saved presets, and related actions.
- Support efficient switching among active pieces of work without losing context or requiring repeated copying and setup.
- Make search and command-oriented navigation useful for professionals who know what they want to do.
- Establish consistent professional conventions for opening, saving, duplicating, renaming, exporting, comparing, undoing, and closing work.
- Let users personalize working density, layout, editor behavior, and frequently used tools without creating a setup requirement.
- Make advanced controls progressively discoverable and preserve generous space for the content being worked on.
- Provide clear global awareness of unsaved work, saved local work, storage status, processing state, errors, and offline availability.
- Make keyboard operation, focus management, readable contrast, zoom, reduced motion, and assistive-technology support foundational to the redesigned experience.
- Deliver an effective experience across desktop, tablet, and mobile while recognizing that complex comparison and transformation work may be most productive on larger screens.
- Support installation and useful offline work where it strengthens the browser-local promise, while keeping ordinary web access fully capable.
- Preserve direct links, search discovery, tool documentation, and the fast landing experience throughout the transition.

#### Familiar professional patterns to evaluate

- A navigable tool and document sidebar.
- Tabs or another clear model for multiple active documents.
- A command palette and universal search.
- Recent and pinned tools, documents, and presets.
- Contextual action bars close to the active content.
- Resizable or focusable input, output, preview, and inspector areas.
- Visible breadcrumbs or provenance for derived documents and conversions.
- Recoverable sessions and clear unsaved-change indicators.

These are candidate interaction patterns, not requirements in isolation. Each must make the priority persona workflows faster or clearer in usability testing.

#### Explicitly deferred

- User accounts as a prerequisite for the redesigned experience.
- Cloud synchronization, sharing, and team workspaces.
- A native desktop or mobile application.
- An integrated development environment or general-purpose file manager.
- Social feeds, activity dashboards, gamification, and other engagement mechanics unrelated to completed work.
- Removing direct access to individual tools in favor of a mandatory workspace entry point.

#### Success signals

- New visitors reach the first useful result at least as quickly as before the redesign.
- Returning users find tools, documents, presets, and recent work faster.
- Multi-step workflows require fewer navigation, copying, and reconfiguration actions.
- Professionals successfully use keyboard and command-oriented navigation for recurring work.
- More users complete workflows spanning multiple tools without an increase in confusion or abandonment.
- Direct tool traffic and documentation discovery remain healthy after the information architecture changes.
- Users understand what is temporary, unsaved, saved locally, derived, or available offline.
- Accessibility evaluation shows that richer workspace interactions do not exclude keyboard or assistive-technology users.

#### Exit criteria

- The primary persona journeys can be completed end to end in the redesigned workspace.
- One-off visitors are not required to learn workspace concepts before using a tool.
- Navigation remains understandable as the catalog grows and tools gain deeper controls.
- Open work, saved work, history, presets, and cross-tool conversions have distinct and consistent places in the experience.
- Existing direct destinations and saved local work transition without unexpected loss.
- Offline and installation behavior is useful, optional, and clearly communicated.
- The redesign demonstrates measurable workflow improvement beyond aesthetic preference.

## Strategic horizon beyond Phase 6: installed Textytools applications

An installed Textytools application is a future distribution hypothesis: package the validated professional workspace as a signed application for desktop and, only where the use cases fit, mobile app stores.

Tauri is a credible candidate because it supports platform stores and signed installers across macOS, Windows, Linux, iOS, and Android. See the [Tauri distribution overview](https://v2.tauri.app/distribute/), [Apple App Store guidance](https://v2.tauri.app/distribute/app-store/), and [Microsoft Store guidance](https://v2.tauri.app/distribute/microsoft-store/).

This branch is not a committed phase and should not begin merely because the web interface can be packaged. The installed application must solve professional workflow problems that remain meaningfully constrained in the Phase 6 web experience.

### Why an installed application could create value

- Give professionals a durable place for frequent text work outside a browser tab.
- Improve discovery and trust through familiar app store and signed-download channels.
- Make offline availability predictable rather than dependent on prior web use.
- Support deliberate work with local files and folders while preserving local processing.
- Integrate with familiar operating-system actions such as Open With, file associations, recent files, native menus, and global shortcuts where appropriate.
- Handle larger or longer-running local work with clearer expectations.
- Provide a trusted installation and update path for a local TextyToolsMCP if that product hypothesis is validated.
- Reach users and organizations that prefer managed application distribution over utility websites.

The installed application should strengthen the privacy position: installation must not imply accounts, telemetry beyond the stated product policy, or cloud retention.

### Future personas and use cases

#### Alex, the developer who works with local configuration and data files

Alex repeatedly opens JSON, YAML, TOML, CSV, log, and token files from repositories and temporary directories.

Alex needs to:

1. Open a file directly in its specialist Textytools experience.
2. Validate, inspect, convert, or compare it without first copying it into a browser.
3. Work with several related files while preserving their names and locations.
4. Save or export deliberately without accidentally replacing the source.
5. Continue working when offline or behind network restrictions.

An installed application creates value if it reduces file-handling friction while retaining the safety and clarity established by the web product.

#### Morgan, the operations professional processing local logs and exports

Morgan receives large logs, report exports, and batches of similarly structured files. Browser paste-and-copy workflows become cumbersome even though the processing itself should remain local.

Morgan needs to:

1. Open large files without loading them into an unrelated remote service.
2. Apply a validated log pattern or extraction preset.
3. Review failed records and compare multiple files.
4. Repeat the workflow across an explicitly selected group of files.
5. Export results to a chosen local destination.

The installed product creates value when it makes this bounded local workflow easier without turning Textytools into a general-purpose file manager.

#### Noor, the developer installing local tools for an AI coding workflow

If TextyToolsMCP is validated, Noor may want a trustworthy way to install, update, configure, and understand the local MCP capability alongside the human-facing Textytools workspace.

An installed Textytools product could unify discovery and lifecycle expectations for both surfaces while keeping MCP access explicit and optional.

### Channel strategy to validate

Desktop should be evaluated before mobile because the priority workflows involve substantial text, comparison, files, and keyboard use.

- macOS: compare Mac App Store distribution with a signed and notarized direct download.
- Windows: compare Microsoft Store distribution with a signed installer.
- Linux: evaluate direct package formats based on demonstrated user demand rather than attempting every channel initially.
- iOS and Android: defer until mobile research identifies jobs that are more valuable than the responsive web experience.

Store presence and direct distribution are not mutually exclusive. The appropriate mix should be determined by user trust, discovery, update expectations, organizational policy, review constraints, and operating cost.

### Product requirements before validation

The installed application is worth validating only when:

- Phase 6 has produced a coherent workspace users already return to.
- Research identifies recurring friction that installation or operating-system integration can remove.
- The proposed app offers material value beyond bookmarking or installing the progressive web experience.
- Local-file permissions and save behavior can be explained without surprising users.
- The product can maintain consistent transformation behavior across web and installed experiences.
- Store policies do not require weakening core workflows or privacy promises.
- The support burden of multiple platforms is proportionate to demonstrated demand.

### Validation sequence

1. Measure demand for an installed application among returning professional users.
2. Identify the specific jobs blocked or made cumbersome by the browser experience.
3. Prototype the smallest desktop experience that addresses local-file, offline, or operating-system workflow friction.
4. Compare task completion and user confidence with the Phase 6 web experience.
5. Validate one desktop platform and distribution channel before expanding the matrix.
6. Evaluate store discovery, direct-download demand, update behavior, review overhead, and support cost.
7. Decide whether installed distribution deserves a committed phase and which channels have earned support.

### Boundaries

- The installed application should not be a store wrapper that offers no meaningful advantage over the web product.
- It should not require cloud storage, an account, or continuous connectivity.
- It should not receive unrestricted filesystem access when the user selected only a file or folder.
- It should not silently watch, modify, upload, or index local files.
- It should not become a general-purpose editor, file manager, or integrated development environment.
- Desktop availability should not make the web product a second-class or abandoned experience.
- Mobile applications should not be pursued solely to complete a platform checklist.
- Platform-specific features should not fragment the meaning or results of core Textytools operations.

### Risks to resolve

- App stores may reject or constrain an application perceived as a repackaged website.
- Signing, review, sandboxing, entitlement, and update requirements add ongoing operational work.
- Platform differences may create inconsistent features or support expectations.
- Direct filesystem access raises the consequence of transformation and overwrite mistakes.
- A desktop application may split a small user base without improving retention.
- Store reviews and release lead times may slow urgent fixes.
- Mobile layouts may compromise professional workflows that require dense comparison and editing.
- Installed distribution could distract from validating the browser product and TextyToolsMCP.

### Evidence required to promote installed applications into a committed phase

- Returning professionals demonstrate recurring browser constraints that installation can solve.
- The installed experience measurably improves at least one priority workflow.
- Users value offline certainty, local-file integration, store trust, or managed distribution enough to install and return.
- The application remains useful without accounts or cloud storage.
- One platform can be supported reliably before additional channels are added.
- Store and direct-download requirements are sustainable for the product.
- Installed distribution reinforces the same product identity and capability quality as the web workspace.

## Strategic horizon beyond Phase 6: TextyToolsMCP

TextyToolsMCP is a future product hypothesis: expose Textytools’ proven deterministic text and data capabilities as tools that LLM applications and agent workflows can discover and invoke through the Model Context Protocol.

This is intentionally not Phase 7. Work should begin only after the browser product has validated which transformations are valuable, dependable, understandable, and composable. The web product remains the proving ground and human-facing reference experience; TextyToolsMCP becomes another way to access the capabilities that have earned trust.

### Why this extension fits

LLMs are good at interpreting intent but often use generation for mechanical work that should have a deterministic result. TextyToolsMCP could let an LLM delegate exact operations—validation, formatting, extraction, conversion, counting, encoding, decoding, sanitization, and comparison—to tools with explicit behavior.

The value proposition is:

- Deterministic output for deterministic jobs.
- Fewer hallucinated transformations and malformed results.
- Clear validation failures, warnings, counts, and conversion-loss reporting.
- Repeatable behavior across prompts, models, and agent hosts.
- Smaller prompts because models do not need to be taught common text-processing procedures repeatedly.
- Composable operations that can participate in larger coding, data, content, and operations workflows.

MCP defines model-discoverable tools as callable functions with described inputs and outputs. That makes tools the relevant initial product surface for TextyToolsMCP; stored documents and contextual resources are not required to prove the concept. See the [MCP server overview](https://modelcontextprotocol.io/specification/2025-03-26/server) and [MCP tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools).

### Future personas and use cases

#### Noor, the developer using an AI coding agent

Noor asks an agent to migrate configuration, inspect an API response, extract fields from logs, or compare generated output with an existing file.

Noor needs the agent to:

1. Validate content before modifying it.
2. Use the correct rules for JSON, YAML, TOML, CSV, encodings, and tokens.
3. Report warnings and rejected records instead of silently producing plausible output.
4. Preserve the original when a conversion may lose meaning.
5. Return structured results the agent can reason about and present clearly.

TextyToolsMCP creates value when the agent can delegate these operations instead of generating an ad hoc script or guessing at the transformed output.

#### Imani, the automation engineer building an LLM workflow

Imani is building a workflow that receives inconsistent reports or messages, extracts structured records, validates them, and prepares downstream data.

Imani needs:

1. Small, well-defined text-processing operations that can be combined safely.
2. Stable inputs, outputs, errors, and warnings.
3. A clear distinction between no match, invalid input, partial success, and lossy conversion.
4. Repeatable results suitable for automated evaluation.
5. Freedom to choose an LLM without rebuilding the deterministic parts of the workflow.

TextyToolsMCP creates value as a dependable transformation layer inside a larger probabilistic workflow.

#### Rafael, extending incident investigation into an agent workflow

Rafael asks an operations agent to identify a log format, extract request and trace identifiers, summarize error groups, and compare incidents across two time periods.

TextyToolsMCP should perform the log recognition, pattern matching, field extraction, counting, and comparison. The LLM can then interpret the deterministic evidence rather than inventing the evidence itself.

### Candidate MCP capability families

The MCP catalog should reflect meaningful operations, not mirror every button in the web interface.

- Validate and format JSON, YAML, and TOML.
- Convert among structured-data formats with fidelity warnings.
- Parse and convert CSV with explicit tabular decisions.
- Match, extract, replace, and split text using regular expressions.
- Extract named fields from common log formats and return unmatched records.
- Apply ordered text-sanitization operations.
- Convert identifier and prose casing with explicit word-boundary behavior.
- Encode, decode, and hash text or bytes with clearly separated semantics.
- Decode and inspect JWTs while distinguishing inspection from verification.
- Compare text or structured data and return machine-readable changes.
- Count text properties and model tokens, distinguishing exact results from estimates.
- Inspect Unicode, bytes, timestamps, and invisible characters when those browser capabilities have been validated.

The initial MCP product should expose a small curated set of high-confidence operations. New tools should be added based on agent workflow demand, evaluation performance, and the clarity with which a model can choose and use them.

### Product requirements before validation

TextyToolsMCP is worth validating only when:

- The corresponding web capabilities are mature and have documented behavior.
- Operations produce consistent results for the same input and choices.
- Errors, partial results, assumptions, and lossy conversions are represented explicitly.
- Representative evaluations cover ordinary, invalid, ambiguous, adversarial, and large inputs.
- Tool descriptions make overlapping capabilities distinguishable to an LLM.
- Results are useful both to the calling model and to the person reviewing the workflow.
- Sensitive input handling can be explained honestly for each way the MCP product is used.

### Validation sequence

1. Interview developers already using LLM coding and automation tools to identify repeated deterministic text-processing failures.
2. Test whether a small TextyToolsMCP catalog improves task correctness compared with prompting alone or generated scripts.
3. Measure correct tool selection, valid invocation, deterministic result quality, warning comprehension, and recovery from invalid input.
4. Validate multi-step workflows such as logs to structured records, YAML to JSON with warnings, and extracted data to validated CSV.
5. Determine whether users prefer a locally operated MCP product, a managed remote service, or both.
6. Decide whether the product deserves a committed delivery phase based on demonstrated correctness and recurring use.

### Boundaries

- TextyToolsMCP should not invoke an LLM of its own to perform deterministic transformations.
- It should not require Textytools accounts or cloud storage to prove the core value.
- It should not expose browser-local documents or history to an LLM by default.
- It should not silently modify files, external systems, or stored documents.
- It should not turn every narrow formatting option into a separate discoverable tool.
- It should not claim exactness where the underlying operation is heuristic or model-specific.
- It should not become a general automation platform or agent framework.

### Cloud storage remains out of scope

MCP distribution and cloud storage are separate decisions. A managed MCP service might eventually execute stateless transformations remotely, but that does not create a requirement to retain documents, histories, or user content.

Cloud storage should be reconsidered only after the browser workspace, local documents, history, UX redesign, and MCP hypothesis have each demonstrated durable user value. Any future evaluation must begin with a specific cross-device or collaboration problem that local ownership cannot solve—not with storage as a presumed marker of product maturity.

### Risks to resolve

- Tool sprawl may make correct model selection worse as the catalog expands.
- Large or adversarial inputs may create unpredictable cost or latency for users and hosts.
- Models may ignore warnings or present lossy results as exact.
- Remote operation could weaken the privacy position that differentiates the browser product.
- Different agent hosts may present permissions, errors, and structured results inconsistently.
- Maintaining behavioral parity across web and MCP products could slow improvement if the capability contract is unclear.
- A protocol-led launch could attract curiosity without creating repeat workflow value.

### Evidence required to promote TextyToolsMCP into a committed phase

- Multiple validated workflows perform materially better with the tools than without them.
- Users repeat those workflows in real development, data, content, or operations work.
- Tool-selection and invocation success remain acceptable with a curated catalog.
- Users understand the privacy boundary and can review consequential results.
- The product can be supported without introducing cloud document storage.
- TextyToolsMCP reinforces the Textytools promise of dependable text work instead of becoming a disconnected developer product.

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

### Redesigning the shell instead of the work

The Phase 6 redesign must not substitute navigation polish for tool quality. New workspace patterns should be adopted only when they improve demonstrated persona workflows, preserve direct tool use, and reduce measurable friction.

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
