# Development and deployment

This document defines the required development and deployment path for Textytools. Linear
tracks intent and status; Git preserves implementation history; Vercel deploys `staging`
and `main` through its Git integration.

## Environments and branches

| Purpose            | Git ref   | Deployment                       |
| ------------------ | --------- | -------------------------------- |
| Integrated staging | `staging` | `https://staging.textytools.dev` |
| Production         | `main`    | `https://textytools.dev`         |

`main` is production and `staging` is its only permitted upstream integration branch.
Never commit or push directly to `main`. Every production change, including urgent fixes,
must first exist on `staging` and be validated there.

## Linear and branch names

Create or identify the `TEXT` Linear issue before starting meaningful work. Feature branch
names must also be valid DNS labels:

- use lowercase ASCII letters, digits, and hyphens;
- begin with the Linear identifier, such as `text-42`;
- do not use `/`, `_`, spaces, uppercase letters, or trailing hyphens; and
- keep the name concise enough for DNS and Vercel hostname limits.

Example: `text-42-improve-json-errors`.

## Feature development in a worktree

Before beginning implementation, assign the Linear issue to the person doing the work and
move it to **In Progress**. Then create an isolated Git worktree from the latest remote
`staging`:

```bash
git fetch origin
git worktree add -b text-42-improve-json-errors \
  ../textytools--text-42-improve-json-errors origin/staging
```

Create active worktrees as durable sibling directories within the Tidalsoft workspace,
as shown above. Name each directory `<repository>--<branch>`, using the literal `--`
sequence to distinguish the repository name from the complete branch name. Do not put an
active feature, project, or staging worktree in `/tmp`, `/private/tmp`, or another
operating-system temporary directory. A worktree is another checkout of this repository:
its committed files belong to its branch even though they do not appear in the primary
checkout until that branch is integrated.

Work, test, and commit inside that worktree. Commits should be coherent, verified review or
recovery points. Push the feature branch when remote collaboration, review, or backup
requires it:

```bash
git -C ../textytools--text-42-improve-json-errors push --set-upstream origin \
  text-42-improve-json-errors
```

A tightly scoped Linear project may share one cumulative worktree and feature branch when
the user explicitly chooses to review its deliverables together. Name the branch for the
first delivery issue, keep one coherent commit per issue, and reference the applicable
issue in every commit and Linear update. Do not use this exception to combine unrelated
work or to replace Linear with a branch-local task ledger.

Record the worktree's Linear owner when it is created. A feature worktree is owned by its
issue. An explicitly approved cumulative worktree is owned by the Linear project, so
closing one child issue does not remove it while the project remains active.

Pushing a feature branch does not create a deployment. Complete local validation before
integration; production-like validation begins after the ready commits are merged and
pushed to `staging`. Record material validation results and blockers on the Linear issue;
keep source code and code-level review in GitHub.

All branches are commit-forward. Never force-push. Once a commit is published, correct it
with a new commit or an explicit revert commit; do not amend, reset, rebase, or otherwise
replace published history.

The worktree remains open only for the active lifecycle of its Linear owner. It may produce
several staging deployments as successive coherent groups of commits become ready for
integrated validation, but it must not become an unowned persistent checkout.

## Commit messages

Commit messages must identify the issue and describe the delivered change in a structure
that remains useful without the surrounding development session:

```text
Prevent Preview deployments from loading production analytics (TEXT-42)

Changes:
- Gate analytics using the Vercel deployment environment.
- Cover Production, Preview, and explicit opt-in behavior.

Validation:
- npm run typecheck
- npm run lint
- npm test -- --runInBand
```

Use a concise imperative subject. Include `Changes` and `Validation` sections in the body;
add a `Risks` or `Follow-up` section when relevant. Do not list checks that were not run.
Merge commit subjects remain `Merge TEXT-42 into staging`, with the promoted outcome and
staging validation recorded in Linear as described below.

## Deploy to staging

“Deploy to staging” means merging the currently ready commits from the feature branch into
`staging` without rewriting them, then pushing `staging`. It does not mean that the feature
is finished or that its worktree should be removed.

Only deploy to staging when the user explicitly requests it. When production-like
validation is needed and no such request has been made, the agent must stop after local
validation and ask the user whether to deploy. Approval to implement, commit, push a
feature branch, or run local checks does not authorize a staging deployment.

Perform approved staging integration from a dedicated staging worktree, never by switching
the primary checkout or the feature worktree to `staging`. Create or reuse the staging
worktree, then integrate the feature branch there:

```bash
git -C ../textytools--text-42-improve-json-errors push origin text-42-improve-json-errors
git fetch origin
git worktree add ../textytools--staging staging # omit when it already exists
git -C ../textytools--staging pull --ff-only origin staging
git -C ../textytools--staging merge --no-ff origin/text-42-improve-json-errors \
  -m "Merge TEXT-42 into staging"
git -C ../textytools--staging push origin staging
```

Each staging deployment may promote one or more new feature commits. Continue working in
the same feature worktree afterward. When another coherent group is ready, push the feature
branch and repeat the merge into `staging`; Git will merge only the commits not already
reachable from staging.

Use merge commits for feature integration. Do not squash, rebase, cherry-pick, or recreate
feature changes. If the feature needs changes that landed on staging after its branch point,
merge `origin/staging` into the feature branch; do not rebase published commits.

Run the required checks for each promoted group and validate the integrated result at
`https://staging.textytools.dev` after Vercel reports the deployment ready. Publish the
Linear staging update with the deployed outcome, deployment or pull-request link,
validation state, feature-flag state, risks, and production or rollback criteria.

Closing an owning issue or project as completed, canceled, or otherwise terminal includes
cleaning up its worktree. Before closure, verify that the checkout is clean, push every
required commit, and record the branch, final commit, validation, and upstream state in
Linear. Then remove the worktree from the primary checkout:

```bash
git worktree remove ../textytools--text-42-improve-json-errors
```

The branch has the same Linear owner and lifecycle as its worktree. Do not close the Linear
owner while its worktree remains registered or its owned branch remains active. Once the
owner's required history is reachable from `origin/staging` and no branch-specific
validation or planned change remains, remove the worktree and delete both the remote and
local branch as part of closure. Do not retain closed-ticket branches on `origin` merely as
archives; the reachable Git history and Linear delivery record provide that history.

An approved cumulative branch is project-owned, like its worktree. Closing one child issue
does not retire that branch while the project remains active. Retire it only when the project
becomes terminal and the same integration and validation conditions are satisfied.

## Small single-commit fixes

A small fix that can be completed, reviewed, and validated as one commit may be made directly
on `staging` only when the user explicitly requests a staging deployment. Perform the work in
the dedicated staging worktree. It still requires a `TEXT` issue, proportional checks, and
staging validation. Assign the issue and move it to **In Progress** before beginning
implementation:

```bash
git fetch origin
git worktree add ../textytools--staging staging # omit when it already exists
git -C ../textytools--staging pull --ff-only origin staging
# make and validate the small fix, then use the structured message above
git -C ../textytools--staging commit
git -C ../textytools--staging push origin staging
```

This is the only direct-branch exception. It never permits a direct commit or push to
`main`.

## Promote staging to production

“Promote staging to production” and “deploy to production” both mean advancing `main` to the
exact commit already validated on `staging`, then pushing `main`:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git merge --ff-only origin/staging
git push origin main
```

Promotion must fast-forward. This preserves the exact staged commit graph and tree without
inventing a production-only merge, squash, rebase, or cherry-pick. If `main` and `staging`
have diverged, stop: merge `main` into `staging`, redeploy and revalidate staging, then retry
the fast-forward promotion.

After Vercel reports production ready, verify `https://textytools.dev` and publish the
Linear production update with what shipped, exposure or feature-flag state, verification
evidence, expected outcome, remaining risks, and rollback posture.

Promoting staging does not automatically close every feature worktree whose commits are in
the release. Close a worktree only when its feature has no remaining planned changes.

## Rollback and emergency work

Prefer forward fixes or explicit revert commits. A production rollback follows the same
path: create the revert on a feature branch or, when it qualifies as a small single-commit
fix, directly on `staging`; validate staging; then fast-forward `main`. Never force-push
`staging` or `main`.

Vercel dashboard rollback may be used when immediately necessary to reduce active harm, but
Git and Linear must then be reconciled promptly so they again describe production reality.

## Required invariants

- Feature work is isolated in worktrees.
- An explicitly approved, tightly scoped Linear project may use one cumulative feature
  worktree and branch, with issue-specific commits and Linear updates.
- Linear issues are assigned and moved to **In Progress** before implementation begins.
- Staging deployments occur from a dedicated staging worktree only after an explicit user
  request; agents ask before deploying when staging validation is needed.
- Feature branch names are DNS-safe and associated with a `TEXT` issue.
- A feature worktree may remain active across multiple staging deployments.
- Each staging deployment preserves and promotes a coherent series of feature commits.
- Only `staging` advances `main`.
- Production promotion is fast-forward-only.
- Direct commits and pushes to `main` are forbidden.
- Force pushes are forbidden on every branch; published history is commit-forward.
- The small-fix exception applies only to direct commits on `staging`.
- Staging and production deployments receive corresponding Linear updates.
