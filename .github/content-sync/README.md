# Global content diff manifests

This directory stores the authoritative Global-to-Japan mapping and disposition manifests for the read-only Global-only report.

| File | Purpose |
| --- | --- |
| `baseline.json` | Trusted mapping from a Global Composite identity to an exact Japan MDX record. |
| `ignore.json` | Active, owner-approved intentional exclusions from Japan publication. |

## Statuses

- `Untracked`: no valid baseline mapping and no active Ignore record.
- `Ignored`: no valid baseline mapping and an active Ignore record.

A baseline mapping counts only when its exact target MDX exists. `Possible Japan match` is diagnostic evidence, never authority. It does not change a status or count. A zero-candidate result is not proof that no Japan content exists.

## Use the repo-local skills

- Publish or reconcile one identity: `.agents/skills/global-to-japan-publication/SKILL.md`
- Create one intentional-exclusion PR, including date-based batches with exceptions: `.agents/skills/global-content-ignore/SKILL.md`

Both skills require full Composite identities such as `news:cnt_000173`; bare `cnt_*` is invalid. Both use fresh read-only report data, create normal human-reviewed PRs, and never auto-merge.

The publication skill creates or reconciles Japan MDX/assets and adds the exact `baseline.json` mapping in the same PR. The Ignore skill adds only intentional exclusions to `ignore.json`; it stops for `Possible Japan match` or mapping drift and requires baseline/content reconciliation instead.

## Remove an Ignore

Open a normal PR that removes the exact `ignore.json` row. The next report returns that still-missing item to `Untracked`.

## Related docs

- [Read-only report implementation](../../scripts/global-content-diff-report/README.md)
- [Durable contract](../../openspec/specs/contract-global-content-diff-report/spec.md)
