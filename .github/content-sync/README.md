# Global content diff report state

This directory stores the durable mapping and disposition manifests used by the standalone Global content diff report and Direct Ignore flow.

## Files

| File | Purpose |
| --- | --- |
| `baseline.json` | Trusted mappings from Global composite identities to existing Japan MDX records. |
| `ignore.json` | Active decisions to keep specific Global-only items out of the publication queue. |
| `../workflows/global-content-diff-report.yml` | Reports every production-published Global item that is not verifiably present in Japan. |
| `../workflows/ignore-global-content-diff.yml` | Validates one live `Untracked` item and opens an Ignore PR. |

Do not add an item to `baseline.json` merely to hide it from the report. Use the Ignore workflow for intentional exclusions.

## Report statuses

The Slack report always covers the complete current Global-only set:

- `Untracked`: not present in Japan and not listed in `ignore.json`.
- `Ignored`: not present in Japan and actively listed in `ignore.json`.

`Untracked` is expanded by default. `Ignored` remains available in a collapsed section.

## Composite identity

Use the full value labeled `Composite identity` in Slack:

```text
news:cnt_000173
documentation:cnt_000051
```

The format is `${sourceSection}:${sourceId}`. Do not enter a bare value such as `cnt_000173`; the same source ID can exist in multiple sections.

## Ignore an Untracked item

1. In Slack, copy the full `Composite identity` value.
2. Open [Actions: Ignore Global-only content](https://github.com/querypie/corp-web-japan/actions/workflows/ignore-global-content-diff.yml).
3. Select **Run workflow**.
4. Paste the value into `source_identity`.
5. Run the workflow.
6. Review the generated normal PR.
7. Merge the PR only when the exclusion is intentional and its recorded source URL is correct.
8. Confirm that the next report moves the item from `Untracked` to `Ignored`.

The workflow does not accept a URL input and does not auto-merge. It derives the URL from a fresh production dry run, requires exactly one matching live `Untracked` item, updates `ignore.json` in deterministic order, and opens a human-reviewed PR from a `global-content-diff-ignore/` branch.

If one matching open Ignore PR already exists, the workflow reuses it. Multiple matching PRs, malformed identities, stale items, non-HTTPS URLs, or items no longer marked `Untracked` fail closed.

## Remove an Ignore decision

Open a normal PR that removes the exact composite-identity row from `ignore.json`. After merge, the next report returns the still-missing item to `Untracked`.

## Related documentation

- [Report implementation and operator reference](../../scripts/global-content-diff-report/README.md)
- [Durable behavior contract](../../openspec/specs/contract-global-content-diff-report/spec.md)
