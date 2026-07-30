---
name: global-to-japan-publication
description: Use when a user selects a Global-only Composite identity and asks to publish or reconcile it as Japan MDX content with a normal pull request.
---

# Global to Japan Publication

Use for one selected `documentation:cnt_*` or `news:cnt_*` item. Global is the source of truth; Japan content and the matching baseline record are created or reconciled in one normal PR.

## Input

Require a full Composite identity. Reject bare `cnt_*` values. If the user only supplies a title or URL, use a fresh report to find the exact identity and ask if more than one matches.

## Procedure

1. Create a clean dated worktree from latest `main`.
2. Fetch `corp-web-v2` `main`; run the read-only report dry-run against both repositories.
3. Select exactly one current `Untracked` item by identity. Record Global/Japan SHAs and inspect its original URL plus SHA-pinned Global source.
4. If `possibleJapanMatches` exists, do **not** create duplicate MDX. Inspect each candidate, choose no winner automatically, and create a baseline-only reconciliation PR only after confirming the exact Japan target with the user or source evidence.
5. Load `.agents/skills/mdx-publication-operations/SKILL.md`, then the exact family wrapper named by `targetFamily` in `.agents/skills/README.md`.
6. For a new Japan publication: allocate the next valid numeric ID, create `src/content/<family>/<id>-<slug>.mdx`, create only required route-aligned `public/<family>/<id>/...` assets, and follow the family frontmatter contract.
7. Add one `baseline.json` record with exact source fields from the selected report item and exact Japan target ID/slug. Keep source-ID then source-section ordering; never add a baseline merely to hide an item.
8. Run the relevant family tests, `npm run test:ci`, `git diff --check`, and a fresh dry-run. The selected item must become Japan-present.
9. Commit, push, and open a normal human-reviewed PR. Include identity, source URLs, both SHAs, target path, and validation. **MUST NOT auto-merge.**

## Stop conditions

Stop before mutation when the identity is missing, duplicated, non-`Untracked`, has malformed source evidence, has mapping drift that cannot be resolved, or candidate evidence is ambiguous. Do not translate or invent missing factual content; ask for source clarification.

## Output

Report the PR URL, target MDX path, baseline mapping, validation, and any residual review question.
