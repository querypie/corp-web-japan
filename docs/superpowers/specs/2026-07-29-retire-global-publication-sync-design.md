# Retire Global Publication Sync Design

## Status

Approved for implementation on 2026-07-29.

## Objective

Retire and delete the Tencent-hosted automatic Global-to-Japan publication system that translated content, generated MDX and assets, ran editorial and browser validation, and opened Draft pull requests. Keep only the GitHub-hosted Global-only diff alert, its manual Direct Ignore PR workflow, and the durable mapping and Ignore decisions those workflows require.

## Final operating model

Two GitHub Actions workflows remain:

1. `Report Global-only content to Slack`
   - Runs on GitHub-hosted infrastructure on weekdays at 10:00 KST and by manual dispatch.
   - Computes every production-published `corp-web-v2` identity that is not verifiably present in `corp-web-japan`.
   - Reports `Untracked` and `Ignored` items to Slack.
2. `Ignore Global-only content`
   - Accepts a full `${sourceSection}:${sourceId}` composite identity.
   - Revalidates one live `Untracked` item.
   - Opens a normal human-reviewed Ignore PR without auto-merge.

The system no longer translates content, creates publication MDX or assets, performs AI editorial review, opens publication Draft PRs, or depends on a persistent server.

## Standalone code boundary

The retained implementation lives under `scripts/global-content-diff-report/**`. It must not import `scripts/global-documentation-sync/**`.

The source inventory, production evidence parsing, family mapping, URL normalization, fetch retry, composite identity validation, manifest validation, and Direct Ignore append checks currently shared from the old namespace move into focused modules under the retained report directory. The new package owns these functions after migration.

The following durable data remains in place:

- `.github/content-sync/baseline.json`
- `.github/content-sync/ignore.json`
- `.github/content-sync/README.md`

The baseline remains the single durable mapping authority for Japan-present classification. The Ignore manifest remains the single authority for `Ignored` classification.

## Remove pull-request-history coupling

The retired publication sync stored one trusted Japan mapping only in merged PR #687 rather than in `baseline.json`:

```json
{
  "sourceSection": "news",
  "sourceId": "cnt_000212",
  "sourceCategory": "news",
  "sourceSlug": "querypie-expands-access-control-platform-ai-capabilities",
  "targetFamily": "news",
  "targetId": 19,
  "targetSlug": "querypie-expands-access-control-platform-ai-capabilities"
}
```

Implementation adds this exact sorted mapping to `baseline.json` after verifying `src/content/news/19-querypie-expands-access-control-platform-ai-capabilities.mdx` exists and its ID and slug match.

After that migration, the report stops scanning GitHub pull-request history for old `global-documentation-sync:v1` markers and branches. `GH_TOKEN` is no longer required by the report CLI. Japan-present means:

1. a valid baseline mapping exists; and
2. its exact target MDX file exists.

Missing mapped files remain fail-closed mapping-drift evidence and do not count as Japan-present.

## Repository deletion boundary

Delete all code that exists only for automatic publication generation:

- `scripts/global-documentation-sync/**`
- `ops/global-documentation-sync/**`
- `.agents/skills/global-documentation-sync/**`
- `.github/workflows/content-sync-slack.yml`
- `.github/workflows/ignore-global-documentation-sync.yml`
- `.github/workflows/close-ignored-sync-pr.yml`
- tests dedicated only to translation, generation, AI review, browser QA, Draft PR creation, retry, durable evidence, failure alerts, or old Ignore reconciliation
- retired production-sync design, plan, report, skill-test, operations, and OpenSpec documents

Keep and update:

- `.github/workflows/global-content-diff-report.yml`
- `.github/workflows/ignore-global-content-diff.yml`
- `scripts/global-content-diff-report/**`
- report and Direct Ignore tests
- `openspec/specs/contract-global-content-diff-report/spec.md`
- CI test-group and path-filter rules needed by the retained workflows

Git history, merged pull requests, and the historical evidence issue remain immutable records. Current runtime code and active documentation must not instruct operators to use the retired server or Draft-PR workflows.

## Tencent shutdown and deletion

Before repository cleanup is merged, stop new server executions:

1. stop and disable `global-documentation-sync.timer`;
2. stop and reset the failed `global-documentation-sync.service` state;
3. verify no sync process is running.

Then delete automation artifacts from the VM:

- `/etc/global-documentation-sync.env`
- `global-documentation-sync` systemd service, timer, and failure-unit files
- `/etc/tmpfiles.d/global-documentation-sync.conf`
- `/var/lib/global-documentation-sync/**`
- `/srv/repos/corp-web-japan-worktrees/global-documentation-sync/**`
- the dedicated `/srv/repos/corp-web-japan` and `/srv/repos/corp-web-v2` automation clones when they are not shared by another service

Run `systemctl daemon-reload` and verify the timer and service are no longer installed, no matching process exists, and no future timer is scheduled. The operator terminates the Tencent VM from Tencent Console after these checks. Broad journal deletion is excluded; VM termination removes remaining host-local logs.

## Data flow after retirement

```text
corp-web-v2 main
  + production list/sitemap evidence
  + corp-web-japan baseline.json
  + corp-web-japan ignore.json
       ↓
GitHub-hosted Global diff report
       ↓
Slack: Untracked expanded, Ignored collapsed
       ↓
optional manual Direct Ignore workflow
       ↓
human-reviewed ignore.json PR
```

No translation, content mutation, branch creation, or publication PR exists in the report workflow.

## Error handling and safety

- Every configured Global source-family root must exist and be a directory.
- Production evidence remains fail-closed per family.
- Composite identities remain `${sourceSection}:${sourceId}`.
- Bare `cnt_*` Direct Ignore input remains invalid.
- Direct Ignore always revalidates live `Untracked` status before PR reuse or mutation.
- The report and Direct Ignore Global checkouts keep `persist-credentials: false`.
- No workflow auto-merges content or Ignore decisions.
- `baseline.json` and `ignore.json` remain sorted and duplicate-free.
- Server deletion never targets paths outside the exact automation directories listed above.

## Verification

Capture a production-style no-send snapshot before migration. Current expected snapshot is:

```text
Global-only: 12
Untracked: 6
Ignored: 6
News: 11
Events: 1
```

After moving retained modules, migrating `news:cnt_000212`, and deleting old code, run the same snapshot against the same Global commit and production evidence. Counts, identities, statuses, titles, dates, Original URLs, GitHub source paths, ordering, and Slack payload partitioning must be identical.

Additional gates:

- Direct Ignore workflow contract tests pass.
- Missing-family and malformed-manifest fail-closed tests pass.
- No retained file imports or references deleted runtime entrypoints.
- CI test grouping remains exhaustive.
- Full CI and production build pass.
- Independent final review returns no merge blocker.
- Server verification shows no installed unit, scheduled timer, process, credential file, report directory, or sync worktree.

## Rollback

Repository cleanup is reversible by reverting the cleanup PR. The retired server is intentionally not preserved. If automatic publication generation is ever required again, it must be redesigned and redeployed as a new system rather than re-enabling the deleted host runtime.

The new Global diff report and Direct Ignore workflow remain the production operating path throughout cleanup.
