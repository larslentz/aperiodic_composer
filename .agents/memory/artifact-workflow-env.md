---
name: New artifact workflow env vars
description: How to correctly configure the dev workflow for a freshly-created artifact so it doesn't crash on missing PORT/BASE_PATH.
---

When you register a new artifact (via the `artifacts` skill), the `.replit-artifact/artifact.toml` declares `[services.env]` (e.g. `PORT`, `BASE_PATH`) for that service, but no workflow is auto-created from this — you still need to call `configureWorkflow` yourself.

If you configure the workflow with just the raw dev command (e.g. `pnpm --filter @workspace/<slug> run dev`), it will crash immediately with "PORT environment variable is required but was not provided" because the shell running the workflow doesn't inherit the artifact.toml env block automatically.

**How to apply:** When configuring the workflow for a new artifact, inline the env vars from that artifact's `artifact.toml` `[services.env]` block directly into the workflow command, e.g.:

```
cd artifacts/<slug> && PORT=<port> BASE_PATH=<path> pnpm run dev
```

Match `waitForPort` to the same port. This avoids the failed-workflow-start loop that otherwise requires manually running the dev command from bash to discover the missing-env-var error.
