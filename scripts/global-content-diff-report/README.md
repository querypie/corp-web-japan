# Global-only content diff report

Generates a read-only Slack report for every production-published QueryPie Global item that is not yet verifiably present in `corp-web-japan`.

The durable contract is [`openspec/specs/contract-global-content-diff-report/spec.md`](../../openspec/specs/contract-global-content-diff-report/spec.md).

## Purpose

- Complete Global-only report.
- Read-only workflow.
- No PR creation, ignore mutation, n8n, or interactive action handling.

## Schedule

- Weekdays at 10:00 KST via GitHub Actions cron `0 1 * * 1-5`.
- Manual execution via `workflow_dispatch`.

## Secret

- `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL`

## Entry points

| File | Purpose |
| --- | --- |
| `cli.mjs` | Loads live production evidence, computes the Global-only diff, builds Slack payloads, and optionally sends them. |
| `report.mjs` | Builds the production-published Global inventory, verified Japan-present inventory, and complete diff result. |
| `slack.mjs` | Builds deterministic paginated Slack Block Kit payloads and sends them through the Incoming Webhook. |
| `.github/workflows/global-content-diff-report.yml` | Independent GitHub-hosted production workflow. |

## Identity

- Canonical identity: `${sourceSection}:${sourceId}`.
- The same numeric `sourceId` in another `sourceSection` is a different record.

## Present / not-present rules

Japan counts as present only when both are true:

1. a trusted mapping exists from either:
   - `.github/content-sync/baseline.json`; or
   - a merged Global publication sync PR marker, including the legacy read-compatible marker path; and
2. the mapped target MDX file currently exists in `src/content/**`.

Not present items remain reportable when they are:

- ignored;
- represented only by an open Draft sync PR; or
- represented only by a closed-unmerged Draft sync PR.

Missing mapped MDX files are reported as `Mapping drift`, not as Japan-present.

## Production source scope

- Reads only the supported Global source families from `scripts/global-documentation-sync/source-family-map.mjs`.
- Includes only production-published Global records proven by the current production sitemap and family list evidence.
- Keeps the original Global HTTPS URL on every reported item.

## Dry run

No-send snapshot:

```bash
GH_TOKEN="$(gh auth token)" node scripts/global-content-diff-report/cli.mjs \
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

- Header: `Global-only content report`.
- First payload includes run counts and both repo SHAs.
- Items link to the original Global URL.
- Grouping is deterministic by target family.
- Item order is deterministic by newest date first, then composite identity.
- Pagination is deterministic and numbered as `Part N of M`.
- Category container titles use text only.
- Zero-diff runs send a compact success payload.

## No actions

- No Ignore button.
- No n8n.
- No mutation.
- No PR creation.
