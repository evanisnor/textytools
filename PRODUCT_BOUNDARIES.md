# Product boundaries

This document records which implemented surfaces are approved Textytools product
capabilities and which are historical experiments. It defines authority for later
delivery work; it does not itself change production behavior.

## Approved public surface

The approved public product surface is the nine-tool catalog recorded in
[`CAPABILITIES.md`](CAPABILITIES.md), together with the home page, privacy page,
feedback endpoint, and supporting application infrastructure required by those
tools.

Implementation outside that surface is not automatically a product commitment or
an architectural precedent.

## Decision: remove Apogee and Blastoff

- Decision date: 2026-08-30
- Authority: Linear issue `TEXT-7`
- Disposition: remove in later, separately authorized delivery work

Apogee and Blastoff were user-experience experiments. They are not approved public
products, have no known users, and should be fully removed. Neither experiment
authorizes a pipeline product, universal workflow builder, document model, storage
model, transform registry, or future application architecture.

The decision covers these current route families:

- `/apogee`
- `/apogee/[id]`
- `/blastoff`
- `/blastoff/[id]`

At the time of the decision, all four route forms are directly reachable in
production. They are absent from the home-page catalog and generated sitemap, but
the site-wide robots policy allows crawling them. This is current-state evidence,
not approval to keep them.

## Local browser data

No recovery period, data migration, or compatibility layer is required because
there are no known users. Later cleanup may remove every product reader and writer
for:

- `localStorage["apogee-documents"]`
- `localStorage` keys beginning with `blastoff-doc-`

Values already present in a browser may remain as inert origin data until the
browser or site-data owner clears them. Textytools will not retain production code
solely to discover or delete those unknown local values.

## Boundary for later cleanup

Actual removal is represented by Linear issue `TEXT-17` and still requires explicit
implementation authorization. That delivery issue must re-verify and address the
complete dependency surface, including:

- the four routes under `app/apogee` and `app/blastoff`;
- the feature slices under `src/features/apogee` and `src/features/blastoff`;
- experiment-specific documents, plans, and automated tests in those slices;
- experiment-specific document and navigation entities;
- pipeline state, registry, transform-definition wrappers, and format or compression
  code that has no independent approved consumer;
- package dependencies that have no remaining approved consumer;
- robots behavior, sitemap and navigation absence, route-not-found behavior, build
  output, and regression results; and
- references in repository documentation.

The dependency candidates observed when this decision was recorded include
`@iarna/toml`, `@paralleldrive/cuid2`, `brotli`, `date-fns`, `js-yaml`,
`jsonpath-plus`, `pako`, and `simple-zstd`, plus their type packages. This is an
inventory to re-verify, not permission to delete a package without confirming its
consumers at delivery time.

Shared code may survive only when an approved capability independently uses it.
Historical implementation effort, tests, documentation, or Git history are not
evidence that an experimental abstraction belongs in the product.

## Change control

Reintroducing either route family or adopting either experiment's product model
requires a new product decision supported by a named customer outcome and validation
plan. A code-level reuse decision alone is insufficient.
