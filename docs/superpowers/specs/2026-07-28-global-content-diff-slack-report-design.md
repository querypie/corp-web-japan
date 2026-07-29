# Global-only content Slack report design

## Goal

Add an independent, read-only GitHub Actions report that compares production-published Global content with content actually present in `corp-web-japan`, then sends every Global-only item to Slack with navigation kept on `www.querypie.com`.

The existing Global publication sync, translation, review, Draft PR, ignore, host timer, and Slack workflows remain behaviorally unchanged.

## Selected approach

Use a stateless GitHub-hosted Actions job. Both repositories are public, so the job can check out `querypie/corp-web-v2` and `querypie/corp-web-japan` without a cross-repository secret. It re-computes the complete snapshot on every run and uses the dedicated `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL` secret only for delivery.

Alternatives rejected:

- Reusing the Tencent host would preserve exact timer timing but retain unnecessary infrastructure and operational risk.
- Persisting a previous snapshot would support delta-only alerts, but the requirement is to report every current difference.

## Trigger and permissions

Create a new workflow, separate from all existing sync workflows.

- Schedule: `0 1 * * 1-5`, which is 10:00 KST Monday through Friday.
- Manual trigger: `workflow_dispatch`.
- Runner: GitHub-hosted Ubuntu.
- Permissions: repository contents read-only.
- Mutation: none. The workflow must not create branches, commits, issues, or pull requests.

GitHub scheduled jobs can start several minutes late. Exact wall-clock execution is not required for this informational report.

## Inventory and identity

Use `${sourceSection}:${sourceId}` as the canonical identity. A repeated numeric source ID in another section is a different item.

### Global inventory

Build the Global inventory from the supported source families in `scripts/global-documentation-sync/source-family-map.mjs` and their `meta.json` files in a checked-out `corp-web-v2` repository.

Only include records proven to be production-published by the existing section-specific evidence:

- Documentation: production sitemap plus `https://www.querypie.com/en/documentation`.
- News: `https://www.querypie.com/en/news`, including its existing `content` and `outlink` rules.

Unlisted stale source records are excluded. A listed record that violates the source contract fails the report instead of silently disappearing.

Each Global record contains at least:

- composite identity;
- source section and category;
- source title;
- publication/listing date;
- normalized original Global URL.

### Japan-present inventory

An identity counts as present in Japan only when it has a trusted mapping and the mapped target MDX file exists on the checked-out Japan `main` tree.

Trusted mappings are:

1. `.github/content-sync/baseline.json` entries; and
2. merged Global publication sync PR markers, including the legacy read-compatible PR #687 marker.

An open or closed-unmerged Draft PR does not mean the content is present. An ignore entry does not mean the content is present. Missing mapped files are reported as mapping drift and do not produce a false match.

### Difference

Compute:

```text
Global-only = production-published Global identities - verified Japan-present identities
```

Every Global-only item is included. User-visible status is `Ignored` only when the active composite identity exists in `.github/content-sync/ignore.json`; every other Global-only item is `Untracked`. Unmerged PR state never affects status.

Sort raw diff items deterministically by newest date first, then composite identity.

## Slack presentation

Send an informational English Block Kit report without a reviewer mention.

The first payload contains:

- header: `🌐 Global-only content report`;
- run timestamp;
- total Global-published, Japan-present, and Global-only counts;
- per-family counts;
- repository commit SHAs.

Slack regrouping is status-first. `Untracked · N items` containers come first and default expanded; `Ignored · N items` containers come second and default collapsed. Within each status, items use deterministic target-family order, then newest-date-first order within each family, then composite identity. Container titles use text only. Each item shows:

- plain-text title plus an explicitly labeled original-domain link and a Global-SHA-pinned GitHub source-folder link;
- target family, composite identity, and publication date when available;
- status, using only `Untracked` or `Ignored`.

The report has no interactive Ignore buttons. Direct report ignore decisions continue through the separate manual `Ignore Global-only content` workflow: copy the displayed composite identity, run the workflow, paste the exact identity, review and merge the generated Ignore PR, then the next report shows `Ignored`. A future interactive action may be designed independently if needed; this report does not introduce n8n, an action endpoint, or Slack-side mutation authority.

Use Slack-safe escaping and deterministic chunking. When all items cannot fit in one payload, send numbered continuation payloads so no result is truncated. A zero-difference run sends a compact success message.

Do not use attachments, uploaded files, or a database as the primary report. The Slack messages themselves contain all difference results.

## Failure behavior

Fail closed when:

- either checkout is unavailable;
- live production evidence cannot be fetched after bounded retries;
- a production-listed source violates its contract;
- identity/mapping data is ambiguous;
- Slack rejects any payload.

Send a compact failure notification to the same webhook when payload generation or delivery fails, without changing the existing publication-sync failure route.

No partial report is presented as complete. Payloads include `part N of M` when pagination is required.

## Implementation boundaries

Add a new report module, report workflow, and independent manual Ignore PR workflow. Reuse existing pure source-family, canonical URL, sync-marker, ignore validation, and production-evidence contracts where possible. Exporting an existing pure helper is allowed, but the current candidate selection, translation, validation, Draft PR creation, ignore reconciliation, server timer, and existing Slack workflow execution paths must not change.

No LLM, browser, Next build, content generation, or dependency installation is required.

## Verification

Add focused Node tests covering:

- composite identity and cross-section collision;
- production-only filtering and stale-source exclusion;
- baseline and merged-marker Japan mappings;
- missing target-file mapping drift;
- ignored and unmerged Draft items remaining in the diff;
- deterministic sorting;
- Slack escaping, grouping, pagination, and zero state;
- workflow schedule, read-only report permissions, manual trigger, secret use, direct manual Ignore PR workflow validation, Slack footer instructions, and independence from existing workflows.

Run the focused tests, `npm run test:ci`, and a no-send report generation against current repository snapshots. After merge, run the workflow manually once and verify the delivered Slack layout.
