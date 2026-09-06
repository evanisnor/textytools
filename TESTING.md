# Testing Textytools

Textytools protects active product behavior at the narrowest reliable layer and
uses Playwright for the complete browser paths that cross React, routing, and
browser storage boundaries. The synthetic-data rules and scenario inventory are
defined in [`FIXTURES.md`](FIXTURES.md).

## Test layers and commands

| Layer                       | Purpose                                                                                                   | Command                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Unit                        | Parsers, transforms, counters, validation, and exact domain results                                       | `npm run test:unit`                                  |
| Component                   | A feature result, user-visible failure, and recovery within one product slice                             | `npm run test:component`                             |
| Integration                 | Browser-storage adapters and other boundaries shared by features                                          | `npm run test:integration`                           |
| Complete Jest suite         | All active and retained legacy Jest coverage                                                              | `npm test -- --runInBand`                            |
| End to end                  | Production-build routes, primary jobs, persistence, handoffs, keyboard operation, and responsive contexts | `npm run test:e2e`                                   |
| Static and production gates | Types, lint, and the deployable build                                                                     | `npm run typecheck`, `npm run lint`, `npm run build` |

Run `npx playwright install chromium` once on a new development machine. The
end-to-end command builds the application and starts `next start` on loopback; it
does not test against a development server or a deployed environment.

## Supported test matrix

The automated browser baseline currently supports Playwright's bundled Chromium
engine only. That is the browser for which this repository has repeatable product
evidence; the presence of Playwright defaults does not imply Firefox, WebKit,
branded Chrome, Safari, or mobile-browser support.

| Project           | Engine              | Viewport   | Evidence provided                                                    |
| ----------------- | ------------------- | ---------- | -------------------------------------------------------------------- |
| `chromium-wide`   | Playwright Chromium | 1440 × 900 | Every public route and primary job, plus shared browser paths        |
| `chromium-narrow` | Playwright Chromium | 390 × 844  | The same jobs and shared paths at a representative constrained width |

The narrow project is a viewport contract, not device emulation. Browser support
may expand only after the corresponding project runs reliably in CI and any
browser-specific product differences are recorded.

## Determinism and failure artifacts

- End-to-end tests use only reviewed synthetic fixtures from
  `src/test/fixtures/activeProduct.ts`.
- External browser requests are blocked and fail the test. Loopback requests are
  allowed so the production build can serve its own assets.
- Tests wait for visible values, navigation, or stored state. They do not use
  fixed sleeps as an assertion strategy.
- Playwright has no unconditional retries. A flaky test is repaired as a defect.
- Traces and screenshots are retained only for failures; video is disabled.
  Because all entered content is synthetic, retained artifacts remain within the
  fixture data boundary. Reports and artifacts are ignored by Git.

## Regression policy

Every corrected defect receives a focused test at the narrowest reliable layer.
Add an end-to-end regression as well when the defect crossed a route, hydration,
browser-storage, navigation, or other user-visible browser boundary. Assertions
must protect semantic results or observable recovery, not private call order or
an undifferentiated snapshot.
