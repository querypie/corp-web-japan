# Global-only content diff report

Standalone read-only package. It reports every production-published QueryPie Global item not verifiably present in `corp-web-japan`.

Canonical contract: [`openspec/specs/contract-global-content-diff-report/spec.md`](../../openspec/specs/contract-global-content-diff-report/spec.md).

## Scope

- Full current Global-only Slack report.
- Read-only GitHub Actions report on weekdays at 10:00 JST.
- Deterministic `Possible Japan match` diagnostics.
- No translation, MDX/assets generation, mutation workflow, server, Slack button, or auto-merge.

## Status semantics

- `Untracked`: Global-only without an active Ignore record.
- `Ignored`: Global-only with an active `ignore.json` record.
- Japan-present authority: validated `baseline.json` mapping plus exact target MDX.

Candidate evidence never changes authority, status, or counts. A zero-candidate result is not proof that Japan content is absent.

## Operator actions

Use repo-local skills, not GitHub Actions mutation workflows:

- `.agents/skills/global-to-japan-publication/SKILL.md` — selected Composite identity → Japan MDX/assets + exact baseline mapping → normal reviewed PR.
- `.agents/skills/global-content-ignore/SKILL.md` — selected exact or JST date-based Global-only items with exceptions → normal reviewed `ignore.json` PR.

Both skills use a fresh dry-run and never auto-merge. Ignore creation stops for candidate evidence or mapping drift.

## Schedule and secret

- Cron: `0 1 * * 1-5` (weekdays 10:00 JST).
- Manual report execution: `workflow_dispatch`.
- Production report secret: `GLOBAL_CONTENT_DIFF_PROD_SLACK_WEBHOOK_URL`.
- Failure notification secret: `GLOBAL_CONTENT_DIFF_TEST_SLACK_WEBHOOK_URL`.
- The CLI still receives its selected destination through the internal `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL` environment variable.

## Entry points

| File | Purpose |
| --- | --- |
| `cli.mjs` | Loads production evidence, computes the report, and optionally sends Slack payloads. |
| `report.mjs` | Builds Global inventory, verified Japan-present inventory, and the diff. |
| `candidate-matches.mjs` | Builds exact deterministic Japan MDX diagnostic evidence. |
| `slack.mjs` | Builds deterministic Slack Block Kit payloads and delivers them. |

## Dry run

```bash
node scripts/global-content-diff-report/cli.mjs \
  --global-repo /path/to/corp-web-v2 \
  --target-repo /path/to/corp-web-japan \
  --dry-run
```

The JSON output includes Global/Japan SHAs, counts, items, candidate evidence, and Slack payloads.

## Slack output

- Compact aggregate and SHA context.
- `Untracked` before `Ignored`.
- Deterministic family/date/identity order.
- Plain title, Composite identity, production-evidenced original link, and SHA-pinned Global source link.
- Up to three escaped candidate paths per item.
- No Ignore instructions or interactive mutation controls.
