# Measurement and evidence contract

This document defines how Textytools establishes reproducible product baselines and
sets promotion gates without collecting tool content. It complements
[`ANALYTICS.md`](ANALYTICS.md); that event contract controls what may be emitted,
while this contract controls how permitted events may be aggregated and interpreted.

Project priorities, observed values, and project-specific numerical gates are
company planning records and belong in Linear or the authorized analytics system,
not this publicly visible repository.

## Contract status

- Contract version: 1
- Decision authority: Linear issue `TEXT-11`
- Approved: 2026-08-30
- Current outcome baseline: unavailable
- Implementation status: decision only; no analytics query or instrumentation
  change is part of `TEXT-11`

The current production events do not implement the outcome contract. Historical
page views, clicks, clear actions, copy actions, and source-side navigation events
must not be relabeled as valid results, completions, recoveries, or completed
continuations.

## Evidence sufficiency

A baseline for one selected tool is sufficient only after all of these conditions
are met:

1. Contract-conforming instrumentation has run in production for 28 consecutive
   complete reporting days.
2. The tool has at least 100 qualified activations in that window.
3. Any reported recovery or continuation rate has at least 30 observations in its
   own denominator.

If a condition is not met, the value is reported as `insufficient evidence`. The
window may be extended until the sample requirement is met; tools, outcome types,
or incompatible schema versions must not be pooled to manufacture sufficiency.

A material instrumentation or outcome-definition change starts a new comparable
window. A recorded baseline must identify the event schema version it uses.

## Unit of analysis

Rates use the analytics provider's anonymous visit or session aggregate. Textytools
does not add an application session, user, document, transfer, or device identifier.
The query must group only contract-approved events that share the selected static
tool route within the provider's documented session boundary.

If the configured provider cannot reproduce a session-scoped aggregate without
exporting prohibited identifiers or content, the affected metric is unavailable.
Event-count ratios must not be substituted when repeated evaluations or actions can
inflate the numerator.

## Metric definitions

All metrics are computed separately for each selected tool and event schema version.

### Qualified visits

A qualified visit is a production-provider session containing at least one
contract-conforming `tool_view` for the selected approved tool and route template,
after configured internal-traffic, test-property, and known-bot filters are applied.

Reloads, multiple tabs, consent rejection, blocked scripts, and provider filtering
limit interpretation. “Qualified” means eligible for this aggregate; it does not
mean the visitor belongs to a demographic or commercial segment.

### Activation

An activated visit is a qualified visit containing `tool_activation` for the tool's
primary input. The activation rate is:

```text
activated visits / qualified visits
```

Focus, page scroll, feedback-form input, or an unrelated control interaction is not
activation.

### Time to first useful result

A useful result is the first `tool_result` classified `valid` or `partial`. Time to
first useful result is reported as the distribution of the event's approved
`duration_bucket`, measured from activation. Exact durations, averages, and medians
must not be reconstructed or sent.

Report the percentage of useful-result visits in each duration bucket. Do not assign
a numeric midpoint to a bucket.

### Completion

A completed visit is an activated visit containing at least one `tool_result`
classified `valid` under that tool's published capability contract. The completion
rate is:

```text
completed visits / activated visits
```

Report `partial`, `ambiguous`, and `failure` visit rates separately. A copy,
download, non-empty output, HTTP success, or component render does not prove
completion.

### Recovery

A recovery-eligible visit contains a `tool_result` classified `partial`,
`ambiguous`, or `failure`. A recovered visit subsequently contains `tool_recovery`
showing a strictly more useful outcome under the same tool contract.

```text
recovered visits / recovery-eligible visits
```

The aggregate must also show visit counts for each prior and recovered outcome
class. These are provider-side aggregate counts, not content-derived values added
to an event. Do not report the rate when the denominator is below 30.

### Continuation

A continuation-offered visit contains `continuation_offered` for one approved
source-to-destination action. A continuation-completed visit contains
`continuation_completed`, emitted only after the destination receives and evaluates
the transferred work.

```text
continuation completion rate = completed visits / offered visits
```

Report each allow-listed source, destination, and continuation kind separately. The
aggregate cannot prove that an individual offer caused an individual completion
because the application emits no transfer identifier. Do not report the rate when
the offered denominator is below 30.

### Early abandonment

An early-abandonment visit contains `tool_activation` but no `tool_result` before
the provider session ends. The early-abandonment rate is:

```text
activated visits without a classified result / activated visits
```

This measure cannot distinguish dissatisfaction from interruption, privacy tooling,
tab closure, connectivity failure, or a visitor who obtained value before an event
could be classified. It is a guardrail signal, not a diagnosis.

## Reproducible query record

Every dated baseline stored in the authorized private system must include:

- tool slug and static route template;
- event schema version and measurement-contract version;
- production analytics property or dataset identifier;
- reporting window, reporting timezone, and query execution date;
- provider session definition and all bot, internal, test, consent, and environment
  filters;
- exact allow-listed event predicates and outcome classes;
- numerator, denominator, result, and evidence-sufficiency status for every rate;
- complete bucket distributions rather than reconstructed exact values;
- missing or delayed data treatment;
- known instrumentation gaps, outages, product releases, or schema changes in the
  window;
- a saved-query or report link accessible to the reviewer; and
- owner and independent reviewer.

A screenshot, dashboard title, rounded percentage, or prose summary alone is not a
reproducible baseline.

## Current baseline status

As of 2026-08-30, no approved outcome baseline exists:

| Measure | Status | Reason |
|---|---|---|
| Qualified visits | `unavailable` | Current events have no enforced versioned payload contract or saved baseline query in scope. |
| Activation | `unavailable` | Current activation can be triggered by non-primary inputs, including feedback. |
| Time to first useful result | `unavailable` | No approved result or duration-bucket event is emitted. |
| Completion | `unavailable` | No event classifies a result under a published capability contract. |
| Recovery | `unavailable` | No approved prior-outcome and recovery sequence is emitted. |
| Continuation | `unavailable` | Current conversion events record source clicks before destination completion. |
| Early abandonment | `unavailable` | The absence of current result events makes the predicate meaningless. |

Legacy acquisition reporting can still answer bounded traffic questions, but it is
not an outcome baseline and cannot satisfy this contract retroactively.

## Promotion-gate policy

No default improvement percentage is approved in this baseline project. After a
sufficient baseline exists, each authorized delivery project must record privately:

- one primary customer-outcome metric;
- its dated baseline and uncertainty or sampling limitations;
- the minimum improvement required to promote;
- explicit non-regression limits for failure and early abandonment;
- relevant correctness, accessibility, performance, and privacy guardrails;
- the observation window and exposure conditions; and
- a continue, revise, roll back, or stop rule.

“Any improvement,” event volume, statistical noise, implementation completion, or
a passing build is not an outcome threshold. Conversely, favorable outcome metrics
do not override failed correctness, privacy, security, accessibility, or regression
checks.

When evidence remains insufficient, the project may continue bounded validation or
use an explicitly approved task-based research method, but it must not claim a
quantitative production improvement.

## Sampling and interpretation limits

Every review must consider at least these limitations:

- analytics blocking and consent choices create unobserved visits;
- provider bot and internal filters are imperfect;
- a provider session is not a person, customer, or durable identity;
- repeat visits, reloads, multiple tabs, and cross-device use can change rates;
- coarse buckets trade precision for privacy and cannot support exact statistics;
- low-frequency failure, recovery, and continuation paths need larger or longer
  samples;
- releases, acquisition mix, seasonality, outages, and documentation changes can
  make adjacent windows incomparable; and
- aggregate continuation events cannot establish individual causal journeys without
  a prohibited transfer identifier.

## Change control

Changing a metric definition, sufficiency rule, filter, bucket, or provider-session
interpretation creates a new measurement-contract version. Historical results must
remain labeled with their original version; they must not be silently recomputed or
combined under the new definition.
