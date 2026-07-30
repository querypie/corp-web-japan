---
name: global-content-ignore
description: Use when a user asks to exclude one or more current Global-only items, including a date-based batch with explicit exceptions, through a normal Ignore manifest pull request.
---

# Global Content Ignore

Use only for owner-approved intentional exclusions from Japan publication. This skill creates one normal `ignore.json` PR; it never auto-merges.

## Input

Accept either:

- exact Composite identities; or
- a date-based selection, for example: “ignore every item published today except `news:cnt_000123`”.

Interpret “today” in Asia/Tokyo and compare against the fresh report item's `dateIso`. Resolve every selected and excluded item to a full Composite identity. Reject bare `cnt_*` identities. If wording can select more than one date/timezone or exception set, ask one clarification before editing.

## Procedure

1. Create a clean dated worktree from latest `main`.
2. Fetch `corp-web-v2` `main`; run a fresh read-only diff against both repositories.
3. Print the resolved selection: selected identities, excluded identities, titles, dates, and current statuses. Do not use an old Slack message or saved report.
4. Select only current `Untracked` items. Never re-add an active Ignore row.
5. For every selected item, fail closed if `possibleJapanMatches` is non-empty or if its identity appears in `mappingDrift`. Those require reviewed baseline/content reconciliation, not Ignore.
6. Confirm each item is intentional exclusion, not pending Japan publication. Do not use `ignore.json` for publishable content.
7. Append one record per selected identity to `.github/content-sync/ignore.json`:
   - `sourceSection`, `sourceId`
   - normalized HTTPS `sourceCanonicalUrl` from the fresh item source URL
   - `reasonCode: "other"`
   - concise owner-provided reason
   - `addedBy` from the confirmed operator identity
   - current UTC `addedAt`
   Sort by source ID, then source section. Do not change unrelated rows.
8. Run `node --test tests/global-content-diff-report/*.test.mjs`, `npm run test:ci`, `git diff --check`, and a fresh dry-run. Each selected identity must show `Ignored`; excluded identities must remain unchanged.
9. Commit, push, and open one normal human-reviewed PR. Include the resolved selection, exclusions, fresh Global/Japan SHAs, and validation. **MUST NOT auto-merge.**

## Stop conditions

Stop before mutation for empty selection, missing/duplicate/non-`Untracked` identities, stale or malformed report evidence, candidate evidence, mapping drift, unconfirmed bulk selection, or an invalid manifest record.

## Output

Report the PR URL, exact identities added, explicit exclusions, validation, and items stopped for reconciliation.
