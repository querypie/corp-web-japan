# Global-only content diff report

Standalone read-only package. It reports every production-published QueryPie Global item not verifiably present in `corp-web-japan`.

Canonical contract: [`openspec/specs/contract-global-content-diff-report/spec.md`](../../openspec/specs/contract-global-content-diff-report/spec.md).

## Scope

- Full current Global-only Slack report.
- Local-only execution through `.agents/skills/global-content-operations/SKILL.md`.
- Deterministic `Possible Japan match` diagnostics plus AI-reviewed operations summaries.
- No scheduled workflow, server, Slack button, or auto-merge.

## Family coverage preflight

Every operation compares latest Global public menu categories and actual `src/content` roots with Japan menu/target roots and `SOURCE_FAMILIES` before building a report. A new directory under managed Global `demo` or `documentation` roots fails closed until its mapping is added. Current demo mappings are:

- `demo/use-cases` → `src/content/use-cases`
- optional `demo/aip-features` → `src/content/demo/aip` (source root not present yet)
- `demo/acp-features` → `src/content/demo/acp`

A supported source record still enters inventory only with current production list evidence and required sitemap evidence. Therefore unpublished ACP/AIP source records do not inflate report counts.

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

Run `npm run global-content:init` once. It reads the bot token and test/production channel IDs from the `corp-web-japan-global-content-slack` 1Password item and writes them to the main checkout’s gitignored `.env.local`, shared by all worktrees. Later sends source that file without another 1Password request.

Messages use `chat.postMessage`. Delivery is test-first: send the exact final payload to the test channel, show the result, and wait for separate explicit user approval before sending the unchanged payload to production. Revalidate both latest-main SHAs immediately before production; any report or payload change requires a new test draft. Returned `channel`/`ts` references are stored in `.tmp/global-content-slack-history.json`. Delete the latest recorded message with:

```bash
npm run global-content:delete-last -- test
npm run global-content:delete-last -- prod
```

Credentials are never printed or committed.

## Entry points

| File | Purpose |
| --- | --- |
| `cli.mjs` | Loads production evidence, computes the report, and optionally sends Slack payloads. |
| `report.mjs` | Builds Global inventory, verified Japan-present inventory, and the diff. |
| `candidate-matches.mjs` | Builds exact deterministic Japan MDX diagnostic evidence. |
| `slack.mjs` | Builds Block Kit payloads and calls `chat.postMessage` / `chat.delete`. |
| `slack-history.mjs` | Records deletable Slack message references locally. |
| `delete-last.mjs` | Deletes the latest recorded test or production send. |

## Dry run

```bash
node scripts/global-content-diff-report/cli.mjs \
  --global-repo /path/to/corp-web-v2 \
  --target-repo /path/to/corp-web-japan \
  --dry-run
```

The JSON output includes Global/Japan SHAs, counts, items, candidate evidence, and Slack payloads.

## Slack output

- Operations mode uses `Global Content Review` and one default-collapsed card builder for `Match pending`, `Matched today`, `Needs review`, and `Ignored`.
- Every card has the same fields: title, family/date/identity, result, status, and site links. Slack link/media unfurls are disabled.
- `pending` is local-preview only. Final payload construction rejects it; Slack receives only latest-main-validated matches.
- Plain report mode still groups `Untracked` before `Ignored`.
- Deterministic family/date/identity order.
- Plain title, Composite identity, production-evidenced original link, and SHA-pinned Global source link.
- Up to three escaped candidate paths per item.
- No Ignore instructions or interactive mutation controls.
