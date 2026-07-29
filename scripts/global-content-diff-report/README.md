# Global-only content diff report

Standalone package that generates a read-only Slack report for every production-published QueryPie Global item that is not yet verifiably present in `corp-web-japan`.

The durable contract is [`openspec/specs/contract-global-content-diff-report/spec.md`](../../openspec/specs/contract-global-content-diff-report/spec.md).

## Purpose

- Complete Global-only report.
- Read-only Slack report workflow.
- Separate manual owner-triggered Ignore PR workflow.
- No Slack buttons, n8n, server endpoint, or automatic merge.

## Schedule

- Weekdays at 10:00 JST via GitHub Actions cron `0 1 * * 1-5`.
- Manual execution via `workflow_dispatch`.

## Secret

- `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL`

## Entry points

| File | Purpose |
| --- | --- |
| `cli.mjs` | Loads live production evidence, computes the Global-only diff, builds Slack payloads, and optionally sends them. |
| `report.mjs` | Builds the production-published Global inventory, verified Japan-present inventory, and complete diff result. |
| `slack.mjs` | Builds deterministic paginated Slack Block Kit payloads and sends them through the Incoming Webhook. |
| `.github/workflows/global-content-diff-report.yml` | Independent GitHub-hosted production report workflow. |
| `.github/workflows/ignore-global-content-diff.yml` | Manual workflow that validates one live `Untracked` composite identity and opens an Ignore PR. |

## Identity

- Canonical identity: `${sourceSection}:${sourceId}`.
- The same numeric `sourceId` in another `sourceSection` is a different record.

## Present / not-present rules

Japan counts as present only when both are true:

1. a validated mapping exists in `.github/content-sync/baseline.json`; and
2. the exact mapped target MDX file currently exists in `src/content/**`.

User-visible status is `Ignored` only for active ignore records. Every other Global-only item, including mapping drift, is `Untracked`.

Missing mapped MDX files remain internal `mappingDrift` evidence, not Japan-present.

## Production source scope

- Reads only the supported Global source families from `scripts/global-content-diff-report/source-family-map.mjs`.
- Includes only production-published Global records proven by current production family-list evidence plus sitemap evidence when the family requires it.
- Preserves each production-evidenced HTTPS source URL and exposes it as an explicitly labeled original-domain link alongside the Global-SHA-pinned GitHub source folder.

## Dry run

No-send snapshot:

```bash
node scripts/global-content-diff-report/cli.mjs \
  --global-repo /path/to/corp-web-v2 \
  --target-repo /path/to/corp-web-japan \
  --dry-run
```

The dry-run JSON includes:

- `metadata.globalSha`
- `metadata.japanSha`
- `report.counts`
- `report.familyCounts`
- `report.items`
- `payloads`

## Slack output rules

- Header: `🌐 Global-only content report`.
- First payload includes run counts and both repo SHAs.
- Item titles are plain text. Each item exposes an explicitly labeled production-evidenced `Original · {domain}` link and a `GitHub source` folder link pinned to the reported Global commit SHA.
- Grouping is deterministic by status first: `Untracked` then `Ignored`.
- Within each status, item order is deterministic by target family, newest date first, then composite identity.
- Pagination is deterministic and numbered as `Part N of M`.
- Status container titles use text only; `Untracked` defaults expanded and `Ignored` defaults collapsed.
- Zero-diff runs send a compact success payload.

## Manual Ignore PR workflow

Operators can ignore one current Global-only item without Slack interactivity:

1. Copy the value labeled `Composite identity`, for example `news:cnt_000177`.
2. Open GitHub Actions `Ignore Global-only content` and select `Run workflow`.
3. Paste the full composite identity into `source_identity`. Bare `cnt_*` values are rejected; accepted input is exactly `^(documentation|news):cnt_\d+$`.
4. Review and merge the generated PR.
5. The next report shows the item as `Ignored`.

The workflow derives the source URL from the current live dry-run report and requires exactly one matching item with status `Untracked`. It appends a sorted `.github/content-sync/ignore.json` row with reason code `other`, actor, and UTC timestamp, then opens or reuses a normal PR. New branches use `global-content-diff-ignore/${sourceSection}-${sourceId}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}` so closed branches or failed prior pushes cannot block creation.

Reuse requires complete paginated open-PR enumeration plus a case-normalized same-repository head, an identity-specific legacy or run-suffixed branch, and the exact trusted marker in the PR body. PR titles are not identity. The workflow fails closed for multiple reusable PRs or malformed pagination and never merges the PR.

## No Slack actions

- No Ignore button.
- No n8n.
- No server endpoint.
