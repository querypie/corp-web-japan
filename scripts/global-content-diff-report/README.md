# Global-only content diff report

Standalone read-only package. It reports every production-published QueryPie Global item not verifiably present in `corp-web-japan`.

Canonical contract: [`openspec/specs/contract-global-content-diff-report/spec.md`](../../openspec/specs/contract-global-content-diff-report/spec.md).

## Scope

- Full current Global-only Slack report.
- Local-only execution through `.agents/skills/global-content-operations/SKILL.md`.
- Deterministic `Possible Japan match` diagnostics plus AI-reviewed operations summaries.
- No scheduled workflow, server, Slack button, or auto-merge.

## Status semantics

- `Untracked`: Global-only without an active Ignore record.
- `Ignored`: Global-only with an active `ignore.json` record.
- Japan-present authority: validated `baseline.json` mapping plus exact target MDX.

Candidate evidence never changes authority, status, or counts. A zero-candidate result is not proof that Japan content is absent.

## Operator actions

Use repo-local skills, not GitHub Actions workflows:

- `.agents/skills/global-content-operations/SKILL.md` — latest-main reconciliation → tracking updates → final preview → explicit local delivery.
- `.agents/skills/global-to-japan-publication/SKILL.md` — selected Composite identity → Japan MDX/assets + exact baseline mapping → normal reviewed PR.
- `.agents/skills/global-content-ignore/SKILL.md` — selected exact or JST date-based Global-only items with exceptions → normal reviewed `ignore.json` PR.

Both skills use a fresh dry-run and never auto-merge. Ignore creation stops for candidate evidence or mapping drift.

## Local delivery

The skill reads webhooks only at explicit send time:

- test: `op://Shared/corp-web-japan-global-content-webhooks/test`
- production: `op://Shared/corp-web-japan-global-content-webhooks/prod`

Values are passed to the CLI through `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL` and are never printed or persisted.

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

- Operations mode shows one concise change summary and only unresolved `Untracked` item details; historical `Ignored` details are omitted.
- Plain report mode groups `Untracked` before `Ignored`.
- Deterministic family/date/identity order.
- Plain title, Composite identity, production-evidenced original link, and SHA-pinned Global source link.
- Up to three escaped candidate paths per item.
- No Ignore instructions or interactive mutation controls.
