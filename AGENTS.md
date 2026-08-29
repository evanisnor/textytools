# Repository Workflow

## Verify and commit changes

- Verify completed changes with the relevant type checks, lint checks, tests, and builds before committing.
- Commit verified changes once the requested work is complete. Do not leave completed, verified work only in the working tree.
- Keep commits scoped to the requested work and do not include unrelated user changes.

## Deployment

- Prefer deploying by pushing committed changes to `origin` and allowing the Vercel Git integration to deploy them.
- Do not use a direct `vercel deploy` as the normal deployment path. Use it only when the user explicitly requests a direct CLI deployment or the Git integration is unavailable and the user approves the alternative.
