# Global Documentation Sync

Automates one eligible QueryPie Global Documentation or News record into one Japan Draft PR.

## Safety model

- Selects at most one candidate per run.
- Requires exact source-family evidence from the production sitemap and the family list page.
- Uses `sourceId` (`cnt_*`) for baseline, ignore, and PR deduplication.
- Pi writer and reviewers run fresh with `--no-tools`; only Node scripts write files or mutate Git.
- Runs generated-contract validation, `npm run test:ci`, `next build`, and desktop/mobile browser QA before a Draft PR.
- Never merges or deploys generated content.
- A failed gate stops before commit, push, or PR creation.
- The systemd service enforces a one-hour hard timeout.
- The production timer runs daily at 10:00 KST with up to ten minutes of randomized delay.

The canonical durable contract is
[`openspec/specs/contract-global-documentation-sync/spec.md`](../../openspec/specs/contract-global-documentation-sync/spec.md).

## Supported source families

The accepted source-family contract is the exact descriptor map exported by
[`source-family-map.mjs`](./source-family-map.mjs).

| Source section | Source category | Production list URL | Target family | Target route |
| --- | --- | --- | --- | --- |
| documentation | blogs | `https://www.querypie.com/en/documentation` | `blog` | `/blog` |
| documentation | white-papers | `https://www.querypie.com/en/documentation` | `whitepapers` | `/whitepapers` |
| documentation | voc | `https://www.querypie.com/en/documentation` | `use-cases` | `/use-cases` |
| documentation | manuals | `https://www.querypie.com/en/documentation` | `manuals` | `/manuals` |
| documentation | events | `https://www.querypie.com/en/documentation` | `events` | `/events` |
| documentation | glossary | `https://www.querypie.com/en/documentation` | `glossary` | `/glossary` |
| documentation | introduction | `https://www.querypie.com/en/documentation` | `introduction-deck` | `/introduction-deck` |
| news | news | `https://www.querypie.com/en/news` | `news` | `/news` |

News is a separate `/en/news` source section, not a Documentation category.
News content records require exact canonical URL evidence in both the production sitemap and the `/en/news` list, while News outlink records require exact `/en/news` list evidence only.
News sync is one-way: Global → Japan only; no Japan content writes back to Global.
For synced News output, omit `author`, set `sourceLabel` deterministically to
`公式発表` for content or `メディア掲載` for outlink, and set `redirectUrl`
exactly to the normalized external URL only for outlink.
Adding News support does not change the production timer, failure alerts, or
seven-day report retention.

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

Lifecycle stages include discovery, Pi generation/review, generated validation, full CI,
build, browser QA, publish, and terminal completion or failure. Failure notifications
include the owner mention, run ID, stage, host, report directory, and redacted reason.
Stale automation worktrees are eligible for cleanup after seven days. The production
host uses `systemd-tmpfiles` with an `mM:7d` policy to remove report artifacts seven days
after their last modification; the Node runner itself does not delete reports.

The systemd service is the supported production entry point. See
[`ops/global-documentation-sync/README.md`](../../ops/global-documentation-sync/README.md)
for installation, credentials, recovery, and scheduler operations.

## Operator actions

- Review or merge a generated Draft PR normally.
- Use the `Ignore Global Documentation sync PR` GitHub Actions dispatch workflow with a
  sync PR number to create a protected-branch-compliant ignore PR with auto-merge enabled.
- After the ignore PR merges, reconciliation validates the machine marker, closes the
  original sync Draft PR, and deletes its branch. Reconciliation runs after immediate CI,
  after delayed approval, or through manual dispatch for recovery.
- Never edit generated worktrees, runtime reports, or `content-sync/*` branches manually
  while a run is active.
