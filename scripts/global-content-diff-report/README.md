# Global-only content diff report

Standalone package that generates a read-only Slack report for every production-published QueryPie Global item that is not yet verifiably present in `corp-web-japan`.

The durable contract is [`openspec/specs/contract-global-content-diff-report/spec.md`](../../openspec/specs/contract-global-content-diff-report/spec.md).

## Purpose

- Complete Global-only report.
- Read-only Slack report workflow.
- Separate manual owner-triggered Ignore PR workflow.
- Diagnostic `Possible Japan match` evidence without changing baseline authority, status, or counts.
- No Slack buttons, n8n, server endpoint, or automatic merge.


## Operator actions

### Publish an `Untracked` item

The report is an inventory signal only. `Possible Japan match` means exact diagnostic evidence found an existing Japan MDX candidate; it is not a mapping and does not change counts or status. To publish or reconcile, an operator uses AI/Codex directly in `corp-web-japan`, loads `.agents/skills/mdx-publication-operations/SKILL.md` plus the narrowest publication family skill, translates/authors/reviews the MDX and assets as needed, opens a normal human-reviewed content/baseline PR, and adds or fixes the exact `.github/content-sync/baseline.json` mapping in that same PR. After merge, the next report treats the mapped item as Japan-present.

### Exclude an `Untracked` item

Use Direct Ignore only when the content owner approves intentional exclusion. Run `.github/workflows/ignore-global-content-diff.yml` with the full `Composite identity`, review the generated PR, and merge it only when the source URL and exclusion are correct. Do not use `ignore.json` for publishable items.

The package does not translate, author MDX, generate assets, stage content changes, open Draft/content PRs, expose Slack action buttons, or auto-merge. A zero-candidate result is not proof that Japan content is absent; owner review remains required before intentional exclusion.

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

Missing mapped MDX files remain internal `mappingDrift` evidence, not Japan-present, and are denied for Direct Ignore until a normal reviewed baseline/content PR restores or corrects the mapping.

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
- `Possible Japan match` evidence, when present, lists up to three target paths and exact signal names. It is Slack evidence only; baseline remains authoritative.
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

The workflow derives the source URL from the current live dry-run report and requires exactly one matching item with status `Untracked`. Shared `assessIgnoreEligibility` denies candidates, mapping drift, active base Ignore rows, malformed candidate evidence, duplicate/missing live items, and non-`Untracked` status before mutation. There is no force, candidate-skip, batch, or bypass input. It appends a sorted `.github/content-sync/ignore.json` row with reason code `other`, actor, and UTC timestamp, then opens or reuses a normal PR. New branches use `global-content-diff-ignore/${sourceSection}-${sourceId}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}` so closed branches or failed prior pushes cannot block creation.

Reuse requires complete paginated open-PR enumeration plus a case-normalized same-repository head, an identity-specific legacy or run-suffixed branch, and the exact trusted marker in the PR body. PR titles are not identity. The workflow fails closed for multiple reusable PRs or malformed pagination and never merges the PR. Hand-edited Ignore PRs that add or reactivate rows are validated by the same shared eligibility function in CI. Bot-created PRs explicitly dispatch `ci.yml` because `GITHUB_TOKEN` PR creation does not trigger the normal `pull_request` workflow.

Residual repository ruleset risk: branches are not currently required to be up to date and approving review is not required by ruleset. Until that changes, update the branch and perform human review immediately before merging any Ignore PR.

## No Slack actions

- No Ignore button.
- No n8n.
- No server endpoint.
