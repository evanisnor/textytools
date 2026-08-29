# Development and deployment

This document defines the required development and deployment path for Textytools. Linear
tracks intent and status; Git preserves implementation history; Vercel publishes Git
branches through its Git integration.

## Environments and branches

| Purpose | Git ref | Deployment |
|---|---|---|
| Feature validation | DNS-safe feature branch | `https://<branch-name>.staging.textytools.dev` |
| Integrated staging | `staging` | `https://staging.textytools.dev` |
| Production | `main` | `https://textytools.dev` |

`main` is production and `staging` is its only permitted upstream integration branch.
Never commit or push directly to `main`. Every production change, including urgent fixes,
must first exist on `staging` and be validated there.

Branch-specific custom staging aliases are the required URL convention. Until the alias
automation tracked by Linear issue `TEXT-4` is complete, use the stable Vercel-generated
branch Preview URL reported on the commit or pull request. This temporary fallback does not
change the merge or promotion process.

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
  ../textytools-text-42 origin/staging
```

Work, test, and commit inside that worktree. Commits should be coherent, verified review or
recovery points. Push the feature branch to publish or update its branch Preview:

```bash
git -C ../textytools-text-42 push --set-upstream origin \
  text-42-improve-json-errors
```

Pushing a feature branch does not deploy integrated staging or production. Validate the
branch Preview before integrating it. Record material validation results and blockers on
the Linear issue; keep source code and code-level review in GitHub.

All branches are commit-forward. Never force-push. Once a commit is published, correct it
with a new commit or an explicit revert commit; do not amend, reset, rebase, or otherwise
replace published history.

The feature worktree remains open for the life of the feature. It may produce several
staging deployments as successive coherent groups of commits become ready for integrated
validation.

## Deploy to staging

“Deploy to staging” means merging the currently ready commits from the feature branch into
`staging` without rewriting them, then pushing `staging`. It does not mean that the feature
is finished or that its worktree should be removed.

For a solo workflow, use the primary checkout as the integration checkout; a separate
staging worktree is not required:

```bash
git -C ../textytools-text-42 push origin text-42-improve-json-errors
git fetch origin
git switch staging
git pull --ff-only origin staging
git merge --no-ff origin/text-42-improve-json-errors \
  -m "Merge TEXT-42 into staging"
git push origin staging
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

Remove the feature worktree only after the feature is finished and promoted to production,
or intentionally abandoned:

```bash
git worktree remove ../textytools-text-42
```

Delete its branch only after the required history is reachable from `staging` and no more
branch-specific validation is needed.

## Small single-commit fixes

A small fix that can be completed, reviewed, and validated as one commit may be made directly
on `staging` from the primary checkout. It still requires a `TEXT` issue, proportional checks,
and staging validation. Assign the issue and move it to **In Progress** before beginning
implementation:

```bash
git fetch origin
git switch staging
git pull --ff-only origin staging
# make and validate the small fix
git commit -m "Describe the fix (TEXT-42)"
git push origin staging
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
- Linear issues are assigned and moved to **In Progress** before implementation begins.
- Feature branch names are DNS-safe and associated with a `TEXT` issue.
- A feature worktree may remain active across multiple staging deployments.
- Each staging deployment preserves and promotes a coherent series of feature commits.
- Only `staging` advances `main`.
- Production promotion is fast-forward-only.
- Direct commits and pushes to `main` are forbidden.
- Force pushes are forbidden on every branch; published history is commit-forward.
- The small-fix exception applies only to direct commits on `staging`.
- Staging and production deployments receive corresponding Linear updates.
