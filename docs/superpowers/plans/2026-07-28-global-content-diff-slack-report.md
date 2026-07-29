# Global Content Diff Slack Report Implementation Plan

**Goal:** Deliver a complete weekday Slack report of production-published Global content not verifiably present in Japan, plus a separate human-reviewed Direct Ignore PR flow.

**Architecture:** The standalone package under `scripts/global-content-diff-report/` owns source discovery, production evidence validation, composite identity, baseline verification, diff construction, Slack rendering, and delivery. GitHub Actions checks out both public repositories. The report workflow is read-only; the manual Ignore workflow is the only mutation path.

**Durable contract:** [`openspec/specs/contract-global-content-diff-report/spec.md`](../../../openspec/specs/contract-global-content-diff-report/spec.md)

## Implemented surfaces

- `scripts/global-content-diff-report/**`
  - deterministic source-family inventory and production evidence checks
  - baseline-only Japan-present mapping validation
  - active ignore disposition handling
  - deterministic Slack payload generation and bounded delivery
  - dry-run/send CLI
- `tests/global-content-diff-report/**`
  - inventory, identity, baseline, diff, Slack, retry, CLI, workflow, and Ignore coverage
- `.github/workflows/global-content-diff-report.yml`
  - weekdays at 10:00 JST (`0 1 * * 1-5`)
  - manual dispatch
  - GitHub-hosted, `contents: read`, no repository mutation
- `.github/workflows/ignore-global-content-diff.yml`
  - exact composite-identity input
  - current dry-run validation
  - deterministic ignore-manifest append
  - identity-specific `global-content-diff-ignore/${sourceSection}-${sourceId}` branch prefix with a unique run/attempt suffix
  - exact marker and same-repository matching across all paginated open PRs; title excluded from identity
  - normal human-reviewed PR with no automatic merge
- `.github/content-sync/{baseline,ignore}.json`
  - retained durable mapping and disposition manifests

## Data rules

1. Identity → `${sourceSection}:${sourceId}`.
2. Global inventory → supported source family plus required current production list/sitemap evidence.
3. Japan-present → valid baseline row plus exact existing mapped MDX file.
4. Global-only → Global inventory minus Japan-present inventory.
5. Status → active ignore record means `Ignored`; otherwise `Untracked`.
6. Ignore never suppresses a report item.
7. Report CLI requires only repository paths; Slack webhook is required only for send mode.

## Slack rules

- Header: `🌐 Global-only content report`.
- Every item includes plain title, labeled production URL, pinned GitHub source folder, family, composite identity, date, and status.
- `Untracked` precedes `Ignored`.
- Family/date/identity ordering and pagination are deterministic.
- Multipart output uses `Part N of M`; zero diff uses a compact success payload.
- No Slack button, n8n, mutation endpoint, mention, or automatic decision.

## Failure rules

Fail closed for missing source roots, invalid live evidence, ambiguous identities or mappings, unsafe links, invalid SHAs, payload construction failures, or Slack rejection. Previously delivered multipart messages remain visibly incomplete; the workflow attempts a compact failure notification.

## Verification

```bash
node --test tests/global-content-diff-report/*.test.mjs
node scripts/ci/assert-test-groups.mjs
git diff --check
```

Post-merge operational check: manually run both workflows with a known current identity, verify Slack layout, and merge an Ignore PR only when the exclusion is intentional.
