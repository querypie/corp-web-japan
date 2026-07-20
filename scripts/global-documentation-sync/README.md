# Global Documentation Sync

Automates one eligible QueryPie Global Documentation record into one Japan Draft PR.

## Safety model

- Selects at most one candidate per run.
- Requires exact canonical URL evidence in the Global sitemap and Documentation list.
- Uses `sourceId` (`cnt_*`) for baseline, ignore, and PR deduplication.
- Pi writer and reviewers run fresh with `--no-tools`; only Node scripts write files or mutate Git.
- Runs generated-contract validation, `npm run test:ci`, `next build`, and desktop/mobile browser QA before a Draft PR.
- Never merges or deploys generated content.
- A failed gate stops before commit, push, or PR creation.

## Entry points

| File | Purpose |
| --- | --- |
| `production-run.mjs` | Production orchestration: discovery, isolated worktree, validation, Draft PR. |
| `local-dry-run.mjs` | Candidate generation, Pi review/correction loop, validation, build, browser QA. |
| `cli.mjs` | Candidate preparation, artifact finalization, branch-only recovery commands. |
| `live-discovery.mjs` | Production candidate discovery and deduplication. |
| `git-pr.mjs` | Allocated-diff staging, deterministic branches, Draft PR publishing and recovery. |
| `runtime-status.mjs` | Atomic `run-status.json` heartbeat and journal lifecycle events. |

## Runtime artifacts

Each run writes to `REPORTS_ROOT/<run-id>/`:

- `run-status.json`: current stage, Pi role/attempt/PID, terminal result.
- `candidate.json`: immutable source and target allocation.
- `generation-report.json`, review artifacts, validation and browser results.
- `run-summary.json` on success or `failure-summary.json` on failure.

The systemd service is the supported production entry point. See
[`ops/global-documentation-sync/README.md`](../../ops/global-documentation-sync/README.md)
for installation, credentials, recovery, and scheduler operations.

## Operator actions

- Review or merge a generated Draft PR normally.
- Use the `Ignore Global Documentation sync PR` GitHub Actions dispatch workflow with a
  sync PR number to create an ignore decision.
- Never edit generated worktrees, runtime reports, or `content-sync/*` branches manually
  while a run is active.
