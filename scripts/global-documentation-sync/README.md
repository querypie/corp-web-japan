# Global publication sync

Automates one eligible QueryPie Global publication or News record into one Japan Draft PR.

## Safety model

- Selects at most one candidate per run.
- Requires exact source-family evidence from the production sitemap and the family list page.
- Uses composite source identity `${sourceSection}:${sourceId}` for baseline, ignore, branch, and PR deduplication.
- Pi writer and reviewers run fresh with `--no-tools`; only Node scripts write files or mutate Git.
- Runs generated-contract validation, `npm run test:ci`, `next build`, and desktop/mobile browser QA before a Draft PR.
- Never merges or deploys generated content.
- A failed gate stops before commit, push, or PR creation.
- The systemd service enforces a one-hour hard timeout.
- The steady-state production timer runs on weekdays (Monday-Friday) at 10:00 KST with up to ten minutes of randomized delay.
- Current rollout hold for composite identity maintenance is tracked in
  `openspec/changes/composite-global-publication-sync-identity/`; keep the
  scheduler disabled until that change's verification tasks complete.

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

## Identity contract

- Canonical identity: `${sourceSection}:${sourceId}`.
- New sync branch: `content-sync/{sourceSection}-{sourceId}`.
- New ignore branch: `content-sync-ignore/{sourceSection}-{sourceId}`.
- New PR marker and manifest rows include `sourceSection`.
- Legacy baseline rows infer `sourceSection` from `sourceCategory`.
- Legacy ignore rows infer `sourceSection` from the current source set only when one section is unique; ambiguous legacy identities block.
- Legacy PR markers without `sourceSection` infer it from `targetFamily` (`news` → `news`, existing others → `documentation`). Retained legacy PR `#687` is read-compatible under that rule.
- Any valid sync PR marker suppresses the same composite identity regardless of PR state; duplicate same-identity PR markers block.
- Legacy branch-only `content-sync/{sourceId}` remains read-compatible only when a retained PR marker proves the same identity. Markerless legacy branches block.
- Manual CLI remains legacy-compatible when a `sourceId` is unique. If the same `sourceId` exists in multiple sections, pass `--source-section`.

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
build, browser QA, publish, durable evidence, and terminal completion or failure. Failure notifications
include the owner mention, run ID, stage, host, report directory, and redacted reason.
Stale automation worktrees are eligible for cleanup after seven days. The production
host uses `systemd-tmpfiles` with an `mM:7d` policy to remove report artifacts seven days
after their last modification; the Node runner itself does not delete reports.

## Durable sanitized evidence ledger

When `EVIDENCE_ISSUE_NUMBER` and `DURABLE_EVIDENCE_REQUIRED=1` are set, every
terminal production result (`draft_pr_created`, `no_candidate`, `failed`) must
publish a sanitized Markdown ledger comment to the public `corp-web-japan`
issue `#688`. If a Draft PR exists, the same sanitized ledger comment is also
posted to that PR.

The durable ledger is intentionally public and sanitized. It includes the run
marker, run/source/status/PR identity, deployed target Git commit, short-timeout
Tencent host metadata, final review JSON details, validation command names/codes,
browser viewport findings, and a SHA-256 plus size manifest for every report file.
It excludes embedded `raw-*`, `generated-body*`, `candidate-body*`, credential,
and webhook contents while still listing those files in the manifest.

This ledger is the Spot-CVM recovery boundary. Local raw reports remain on the
host for up to seven days and are removed by `systemd-tmpfiles`; they are not a
durable store. If durable evidence publishing fails, the service fails closed
without deleting or merging a Draft PR, and retrying the same run stays
idempotent through the durable comment marker.

The systemd service is the supported production entry point. See
[`ops/global-documentation-sync/README.md`](../../ops/global-documentation-sync/README.md)
for installation, credentials, recovery, and scheduler operations.

## Operator actions

- Review or merge a generated Draft PR normally.
- Use the `Ignore Global publication sync PR` GitHub Actions dispatch workflow with a
  sync PR number to create a protected-branch-compliant ignore PR with auto-merge enabled.
  The workflow writes `sourceSection` into `ignore.json` and cross-checks it before any close/delete action.
- After the ignore PR merges, reconciliation validates the machine marker, closes the
  original sync Draft PR, and deletes its branch. Reconciliation runs after immediate CI,
  after delayed approval, or through manual dispatch for recovery.
- Never edit generated worktrees, runtime reports, or `content-sync/*` branches manually
  while a run is active.
