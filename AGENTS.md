# AGENTS.md

Guidance for coding agents working in this repository. These instructions apply to the entire repository.

## Project overview

Textytools is a collection of fast, browser-first text and data utilities built with Next.js 16, React 19, strict TypeScript, and Tailwind CSS 4. The site uses the App Router and is deployed to Vercel from the `main` branch.

Most tool processing belongs in the browser. Keep server-side behavior limited to cases that require secrets or external services, such as `app/api/send-feedback/route.ts`.

Read `README.md` for the tool catalog, architecture examples, design conventions, and analytics events.

## Setup and commands

Use npm and keep `package-lock.json` in sync with `package.json`.

```bash
npm ci                         # reproducible dependency install
npm run dev                    # local development server
npm run typecheck              # strict TypeScript check
npm run lint                   # ESLint; warnings fail the command
npm test -- --runInBand        # complete Jest suite
npm run build                  # production Next.js build
npm run format                 # format the whole repository; use deliberately
```

Configure the tracked pre-commit hook after cloning:

```bash
git config core.hooksPath .githooks
```

The hook type-checks the repository and lints/formats staged JavaScript and TypeScript files. Review anything it modifies before committing.

## Architecture and imports

Follow the repository's Feature-Sliced Design layers:

- `app/`: Next.js routes, layouts, metadata, API handlers, and thin feature composition.
- `src/features/`: user-facing tool implementations. Prefer `ui/`, `model/`, and `lib/` segments with a root `index.ts` public API.
- `src/entities/`: reusable domain logic such as parsing, formatting, transforms, counters, and editors.
- `src/shared/`: generic UI, hooks, constants, analytics, and other infrastructure.

Dependency flow is `app -> features -> entities -> shared`. A layer may import from itself and lower layers, never higher layers. Features must not import from other feature slices. ESLint enforces these boundaries.

Use the `@/features/*`, `@/entities/*`, `@/shared/*`, and `@/app/*` aliases. Import a slice through its public `index.ts` when it exposes one. Keep `app/**/page.tsx` focused on composition rather than business logic.

When adding a public tool, normally update all relevant surfaces:

- its feature/entity implementation and public API;
- an App Router page and, where appropriate, route metadata/layout;
- `src/shared/lib/toolCatalog.ts`, `toolMetadata.ts`, or `constants.ts` as applicable;
- homepage/navigation discovery;
- focused tests and documentation.

Use existing tools with similar behavior as the primary implementation template.

## TypeScript and React

- Preserve strict typing. Never introduce `any`; use concrete types, constrained generics, `unknown` with narrowing, or a documented specific assertion.
- Prefer pure functions for transforms and parsers. Keep browser-independent domain logic out of components.
- Add `"use client"` only where hooks, events, storage, clipboard, or other browser APIs require it.
- Use lazy `useState` initialization for synchronous initial data such as local storage.
- Do not call `setState` synchronously inside an effect. Effects should synchronize with external systems or update state from asynchronous callbacks/subscriptions.
- Keep effect dependency lists accurate and minimal; do not suppress hook lint rules to mask a design problem.
- Derive values during render or with `useMemo` rather than duplicating derived state.
- Server and client output must be deterministic. Do not call `Date.now()`, `Math.random()`, browser-only APIs, or locale/timezone-dependent formatting during server rendering without a hydration-safe design.
- Avoid mutating input collections during render; copy before sorting or transforming.

## UI and product conventions

- Reuse shared primitives from `src/shared/ui` and domain components such as `TextEditor` instead of creating parallel components.
- Tool pages should use `ToolFrame` for consistent layout and feedback access.
- Match the zinc-based light/dark palette and responsive patterns already in use.
- Preserve accessibility: semantic elements, explicit labels, keyboard operation, visible focus states, and appropriate ARIA only where native semantics are insufficient.
- Handle empty, invalid, and large inputs intentionally. Display actionable errors without discarding user input.
- Keep text/data transformations local and real-time unless there is a clear reason not to. Do not send tool input to a server or analytics service.
- Use the existing analytics helpers and event vocabulary; do not add raw analytics calls in feature components.

## Testing and verification

Tests use Jest, ts-jest, and Testing Library. Place tests in `__tests__` directories as `*.test.ts` or `*.test.tsx`. Add focused unit tests near complex domain or feature logic and regression tests for bugs.

Before declaring work complete, run checks proportional to the change:

- Documentation-only: `git diff --check` and review rendered structure/content.
- Focused logic or UI change: relevant tests, `npm run typecheck`, and `npm run lint`.
- Cross-cutting, routing, dependency, configuration, API, or production-facing change: `npm run typecheck`, `npm run lint`, `npm test -- --runInBand`, and `npm run build`.

If a build cannot fetch Google-hosted Geist fonts because the environment blocks network access, rerun it with approved network access. Do not treat that network failure as an application failure.

Report any check that was not run and why. Do not claim verification based only on code inspection when runnable checks exist.

## Environment variables and external services

- Never commit `.env*`, API keys, access tokens, or values copied from Vercel. The repository ignores environment files.
- Feedback email uses Resend. Production requires `RESEND_API_KEY`; `RESEND_FROM_EMAIL` defaults to `textytools.dev <contact@textytools.dev>` and `FEEDBACK_RECIPIENT_EMAIL` defaults to `contact@textytools.dev`.
- Keep the Resend API key send-only. The sending domain must be verified in Resend DNS before testing delivery.
- Public analytics configuration uses `NEXT_PUBLIC_GOOGLE_TAG_ID`. Follow the migration notes in `README.md` before changing legacy analytics variables.
- Validate external-service failures from server logs and return safe errors to clients; never expose provider responses containing sensitive information.

## Git, commits, and deployment

- Preserve unrelated user changes in a dirty worktree. Stage only files belonging to the requested task.
- Never commit unverified implementation changes. Once requested work is complete and its relevant checks pass, make a scoped commit; do not leave completed, verified work only in the working tree.
- Use concise imperative commit messages that describe the outcome.
- Do not amend, rewrite, reset, or discard existing history or user changes unless explicitly requested.
- Push commits to `origin` when deployment or remote delivery is requested. The preferred production deployment path is `origin/main` through the Vercel Git integration.
- Do not use `vercel deploy` as the normal deployment path. Use a direct CLI deployment only when the user explicitly requests it, or when Git-based deployment is unavailable and the user approves the alternative.
- Keep secrets in Vercel environment variables. Environment-variable updates do not require committing generated local Vercel files.

## Keep documentation accurate

Update documentation when commands, architecture, environment variables, public tools, or deployment behavior change. Prefer current source code and configuration over stale examples; fix stale references encountered within the scope of the task.
