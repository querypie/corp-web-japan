# Global-only content Slack report design

## Goal

Run a standalone, read-only comparison of production-published QueryPie Global content against content verifiably present in `corp-web-japan`, then send every Global-only item to Slack. Keep intentional exclusions in a separate Direct Ignore PR flow.

The durable behavior contract lives at [`openspec/specs/contract-global-content-diff-report/spec.md`](../../../openspec/specs/contract-global-content-diff-report/spec.md).

## Architecture

A GitHub-hosted workflow checks out `querypie/corp-web-v2` and `querypie/corp-web-japan`, then runs `scripts/global-content-diff-report/cli.mjs`. The package is self-contained: source-family mapping, source discovery, production evidence validation, composite identity, decision-manifest validation, diff calculation, retry behavior, Slack rendering, and delivery all live under one directory.

The report uses no database or prior report snapshot. Every run recomputes the full state from the two checked-out commits and current production evidence.

## Triggers and permissions

- Schedule: `0 1 * * 1-5` → 10:00 KST weekdays.
- Manual trigger: `workflow_dispatch`.
- Runner: GitHub-hosted Ubuntu.
- Report permission: `contents: read` only.
- Report mutation: none.
- Delivery secret: `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL`.

## Inventory and identity

Canonical identity → `${sourceSection}:${sourceId}`. Equal numeric IDs in different sections remain distinct.

### Global inventory

Supported families come from `scripts/global-content-diff-report/source-family-map.mjs`. Each source must satisfy its local metadata contract and current production evidence:

- Documentation families: production documentation list plus sitemap.
- News: production news list; content records also require sitemap evidence, while valid HTTPS outlinks use list evidence.

Unlisted stale sources are excluded. A production-listed source that violates its contract fails closed.

### Japan-present inventory

An identity counts as present only when:

1. `.github/content-sync/baseline.json` contains a valid composite-identity mapping; and
2. the exact `src/content/<family>/<id>-<slug>.mdx` target exists.

A missing target remains mapping-drift evidence and does not count as present. Baseline is the sole mapping source.

### Difference and disposition

```text
Global-only = production-published Global identities - verified Japan-present identities
```

Every Global-only item remains visible. An active `.github/content-sync/ignore.json` record changes status to `Ignored`; otherwise the status is `Untracked`.

## Slack presentation

The first payload includes timestamp, counts, family totals, and both repository SHAs. Each item contains:

- plain title;
- explicitly labeled production-evidenced original link;
- Global-SHA-pinned GitHub source-folder link;
- target family, composite identity, date, and status.

Grouping is status-first: `Untracked` expanded, then `Ignored` collapsed. Ordering within each status is deterministic by family, newest date, then identity. Pagination is deterministic and uses `Part N of M`. Zero diff produces a compact success payload.

No inline Ignore action exists.

## Direct Ignore flow

`.github/workflows/ignore-global-content-diff.yml` accepts one exact composite identity. It builds a fresh dry-run report, requires exactly one matching `Untracked` item, derives URLs from that evidence, and appends a deterministic ignore row. New PR branches use the identity-specific `global-content-diff-ignore/${sourceSection}-${sourceId}` prefix plus the GitHub run ID and attempt.

Reuse is based on complete paginated enumeration and requires a case-normalized same-repository head, a supported identity-specific branch, and the exact trusted composite-identity marker. The title is not identity. A human reviews and merges the normal PR; the workflow never auto-merges.

## Failure behavior

Fail closed when a checkout, supported source root, live production evidence, source contract, identity, baseline mapping, SHA, source link, Slack payload, or delivery is unsafe. Multipart messages already sent remain visibly incomplete through their part labels; the workflow attempts a compact failure notification.

## Verification

```bash
node --test tests/global-content-diff-report/*.test.mjs
node scripts/ci/assert-test-groups.mjs
git diff --check
```
