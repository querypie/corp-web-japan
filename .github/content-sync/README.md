# Global content diff report state

This directory stores the durable mapping and disposition manifests used by the standalone Global content diff report and Direct Ignore flow.

## Files

| File | Purpose |
| --- | --- |
| `baseline.json` | Trusted mappings from Global composite identities to existing Japan MDX records. |
| `ignore.json` | Active decisions to keep specific Global-only items out of the publication queue. |
| `../workflows/global-content-diff-report.yml` | Reports every production-published Global item that is not verifiably present in Japan. |
| `../workflows/ignore-global-content-diff.yml` | Validates one live `Untracked` item and opens an Ignore PR. |

Do not add an item to `baseline.json` merely to hide it from the report. Use Direct Ignore only for intentional exclusions. Do not use `ignore.json` for publishable items.

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


## Publish an Untracked item

Publishing is separate human/AI-assisted content authoring. The report tooling does not translate, author MDX, generate assets, create Draft/content PRs, or stage content changes.

1. In Slack, copy the full `Composite identity` and inspect the original-domain and pinned Global source links.
2. Work directly in `corp-web-japan` with AI/Codex or another authoring process.
3. Load `.agents/skills/mdx-publication-operations/SKILL.md`, then load the narrowest publication family skill from `.agents/skills/README.md` for the target content root.
4. Translate/write/review the local MDX and any required assets under the normal publication content model.
5. In the same content PR, add the exact `.github/content-sync/baseline.json` mapping from the Global composite identity to the new Japan MDX target.
6. Request normal human review and merge only after the content and mapping are correct.
7. Confirm that the next report no longer lists the item as Global-only.

Do not add publishable items to `ignore.json`. Ignoring is only for owner-approved content that should intentionally stay excluded from Japan publication.

## Ignore an Untracked item

1. In Slack, copy the full `Composite identity` value.
2. Open [Actions: Ignore Global-only content](https://github.com/querypie/corp-web-japan/actions/workflows/ignore-global-content-diff.yml).
3. Select **Run workflow**.
4. Paste the value into `source_identity`.
5. Run the workflow.
6. Review the generated normal PR.
7. Merge the PR only when the exclusion is intentional and its recorded source URL is correct.
8. Confirm that the next report moves the item from `Untracked` to `Ignored`.

The workflow does not accept a URL input and does not auto-merge. It derives the URL from a fresh production dry run, requires exactly one matching live `Untracked` item, updates `ignore.json` in deterministic order, and opens a human-reviewed PR. New branches use the identity-specific prefix `global-content-diff-ignore/${sourceSection}-${sourceId}` plus the unique GitHub run ID and run attempt.

Existing `ignore.json` reason text that mentions a sync Draft PR is historical context from earlier planning. It is not an instruction to create automated Draft/content PRs. Current publishable items must use the human/AI-assisted content PR path above, with the baseline mapping in the same PR.

After complete paginated enumeration, the workflow reuses one open PR only when its head is in this repository, its branch uses the identity-specific legacy or run-suffixed format, and its body contains the exact trusted composite-identity marker. The title is not identity. Multiple reusable PRs, malformed pagination, malformed identities, stale items, non-HTTPS URLs, or items no longer marked `Untracked` fail closed.

## Remove an Ignore decision

Open a normal PR that removes the exact composite-identity row from `ignore.json`. After merge, the next report returns the still-missing item to `Untracked`.

## Related documentation

- [Report implementation and operator reference](../../scripts/global-content-diff-report/README.md)
- [Durable behavior contract](../../openspec/specs/contract-global-content-diff-report/spec.md)
