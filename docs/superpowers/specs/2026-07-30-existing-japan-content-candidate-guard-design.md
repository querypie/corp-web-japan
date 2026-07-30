# Existing Japan Content Candidate Guard Design

Status: Historical / non-canonical after implementation. The canonical durable contract is [`openspec/specs/contract-global-content-diff-report/spec.md`](../../../openspec/specs/contract-global-content-diff-report/spec.md). Operator guidance lives in [`.github/content-sync/README.md`](../../../.github/content-sync/README.md) and [`scripts/global-content-diff-report/README.md`](../../../scripts/global-content-diff-report/README.md).

This document preserves design rationale and incident context only. Do not treat it as the current implementation contract.

## Problem

The Global-only report intentionally treats `.github/content-sync/baseline.json`
plus the exact mapped MDX path as the only Japan-present authority. This avoids
heuristic mappings, but it leaves an unsafe operating path:

1. a Japan MDX item is published first;
2. the corresponding Global item is added later;
3. no baseline row links the new Global composite identity to the existing Japan
   item;
4. the report correctly classifies the item as `Untracked` under the current
   authority model;
5. Direct Ignore can create an Ignore PR without warning that the Japan content
   may already exist.

This occurred with `documentation:cnt_000215`. Japan Blog 33 existed before the
Global source was created, so no baseline row could have been written when the
Japan content PR merged. Direct Ignore subsequently opened PR #730. PR #730 was
closed without merge and its remote branch was deleted as immediate containment.

A complete corpus review found a broader reconciliation problem. Twelve of the
thirteen items in the 2026-07-30 report already have Japan content: the FDE blog
and all eleven News items. Five of those News identities are currently marked
`Ignored`. Only `documentation:cnt_000051` has no Japan candidate and is already
correctly `Ignored`.

## Goals

- Preserve baseline plus exact target MDX as the only Japan-present authority.
- Preserve exactly two report statuses: `Untracked` and `Ignored`.
- Detect strong evidence that a Global-only item may already have a Japan MDX.
- Show that evidence in Slack without changing counts or status.
- Prevent Direct Ignore from hiding candidate matches or mapping drift.
- Prevent hand-edited and bot-created Ignore PRs from bypassing the same guard.
- Reuse one deterministic candidate detector across report and validation paths.
- Keep report execution read-only and prohibit automatic baseline mappings.

## Non-goals

- Fuzzy title matching, embeddings, translation similarity, or partial slug
  matching.
- Treating a zero-candidate result as proof that no Japan content exists.
- Automatically choosing a target when candidates are ambiguous.
- Automatically modifying `baseline.json` or creating a baseline PR.
- Adding a third report status.
- Adding Slack mutation controls, automatic merge, or a server runtime.
- General-purpose duplicate-content detection outside Global diff operations.

## Considered approaches

### Exact slug only

Deterministic and sufficient for the FDE incident, but it misses Japan News
items whose local slug was shortened or localized.

### Broad fuzzy or semantic matching

Potentially finds heavily edited content, but false mappings are difficult to
audit and reproduce. Model calls or semantic thresholds would also weaken the
simple fail-closed boundary. This approach is rejected.

### Automatic baseline inference

Could remove candidates immediately, but violates baseline-only authority and
report read-only behavior. Duplicate slugs already exist in Japan content
families, so silently selecting one target is unsafe. This approach is rejected.

### Selected approach: deterministic multi-signal candidates

Produce diagnostic candidates using only exact, auditable evidence. Candidates
never become mappings and never change report membership, counts, or status.
A human still reviews the source and target before writing a baseline row.

## Candidate model

The scanner considers only Japan MDX files in the Global item's mapped
`targetFamily`. It returns every matching Japan file and never chooses one
candidate automatically.

A Japan MDX is a candidate when at least one strong signal matches:

1. `exact-slug`
   - Global source `meta.id` equals Japan frontmatter `slug` exactly.
   - Both values satisfy the repository kebab-slug contract.
2. `exact-source-url`
   - A normalized Global canonical or external source URL equals an absolute
     HTTPS link in the Japan MDX source.
   - Query parameters are preserved because they can identify the article, such
     as `article.html?no=169`.
   - Only an explicit allowlist of known tracking parameters, such as `utm_*`,
     `guccounter`, `guce_referrer`, and `guce_referrer_sig`, may be removed.
   - Arbitrary query removal is forbidden.
3. `exact-original-title-and-date`
   - The exact normalized Global English title appears in the Japan MDX source
     and the Global ISO date equals Japan frontmatter `date`.
   - Text normalization is limited to Unicode NFC, trimming, and whitespace
     collapse.

No punctuation removal, token similarity, transliteration, partial matching, or
semantic scoring is allowed.

Candidate evidence contains:

- Japan target path;
- target ID and slug from frontmatter;
- sorted matched-signal names.

Multiple candidates, including files with the same slug, are valid diagnostic
output and remain ambiguous. A scanner I/O error, malformed frontmatter, unsafe
target path, duplicate `targetFamily:targetId`, or duplicate target path fails
closed; the scanner never takes the first file.

## Report behavior

`buildGlobalOnlyReport` indexes Japan MDX once and evaluates every Global-only
item.

- A candidate item remains `Untracked` or `Ignored` according to existing Ignore
  rules.
- `globalPublished`, `japanPresent`, and `globalOnly` counts remain unchanged.
- Candidate evidence is attached as `possibleJapanMatches`.
- Slack adds a bounded `Possible Japan match` line with escaped target paths and
  signals. It shows at most three candidates and reports the omitted count.
- Baseline mapping drift remains separate evidence.
- A scanner failure stops the report before Slack delivery.

Only a reviewed baseline row plus its exact target file makes an item
Japan-present.

## Direct Ignore behavior

Before reusing or creating an Ignore PR, Direct Ignore rejects an identity when:

- it does not resolve to exactly one live `Untracked` item;
- it appears in `mappingDrift`;
- it has one or more `possibleJapanMatches`;
- candidate scanning fails or returns malformed evidence.

Failure output includes both repository SHAs, the identity, candidate paths,
matched signals, and remediation through a normal baseline/content PR. Failure
occurs before `ignore.json`, branches, commits, or PRs are mutated. There is no
`force`, candidate-skip, or batch bypass input.

A zero-candidate result means only “no deterministic candidate found.” It does
not prove absence. Owner review remains mandatory before intentional exclusion.

## Ignore PR validation

One pure candidate module is shared by report generation and Ignore validation.
One pure `assessIgnoreEligibility` function is the SSOT for both Direct Ignore
preflight and Ignore-PR validation. A narrow validation CLI calls that same
function for newly added Ignore rows using the base manifest, current Global
source metadata, current Japan MDX, baseline ownership, and mapping drift.

- Human-authored Ignore PRs run the validator through the normal
  `pull_request` CI path.
- Direct Ignore validates before mutation, validates the changed manifest again
  before push, and explicitly dispatches `.github/workflows/ci.yml` on the
  generated branch because PRs created with `GITHUB_TOKEN` do not trigger
  `pull_request` workflows.
- Direct Ignore receives the minimum `actions: write` permission needed for that
  dispatch. No other workflow gains write permission.
- The generated PR records Global and Japan SHAs and must receive the existing
  required `CI result` check before merge.
- Repository rules currently do not require an up-to-date branch or approving
  review. Changing repository-wide rules is outside this code fix; the remaining
  stale-branch race is documented, and operators must update the branch and
  review the PR immediately before merge.

`assessIgnoreEligibility` checks the supported composite identity, exactly one
production-evidenced live `Untracked` item, no baseline overlap, no mapping
drift, no candidate, and no pre-existing active Ignore row. Every entry point
must consume its structured allow/deny result instead of reimplementing these
rules.

## Current incident recovery

Direct Ignore is manually disabled until the detector and workflow guard are
merged and verified. Recovery then proceeds in order:

1. run a production-equivalent dry-run at Global
   `29a92275d3cb05be70e44aa4967b94688faa91ca` and Japan
   `814a2c65154962ec8343b05462b0ca44d1b09025`;
2. verify `documentation:cnt_000215` remains `Untracked`, exposes Blog 33 as a
   candidate, and is rejected by `assessIgnoreEligibility`;
3. audit all thirteen report items and every active Ignore row;
4. add reviewed baseline mappings for the FDE blog and all eleven existing Japan
   News items;
5. remove the five News Ignore rows that are actually existing-Japan mappings;
6. retain `documentation:cnt_000051` as the only intentional Ignore because no
   Japan publication was found;
7. merge the reconciliation PR after CI;
8. verify the final report contains only the intentionally ignored Event item;
9. re-enable Direct Ignore only after the guarded production workflow is on
   `main`.

The deterministic detector is expected to catch FDE and News items with exact
slug, source-link, or original-title-and-date evidence. `news:cnt_000180` and
`news:cnt_000181` are known same-publication mappings that do not satisfy these
exact signals because their Japan sources and editorial metadata differ. They
must be mapped through documented manual source/body review, and they are
regression fixtures proving that “no deterministic candidate” is not proof of
absence.

The expected reconciliation is therefore not “Ignore all thirteen.” Twelve are
already published in Japan and need baseline mappings. Only an item with no
deterministic candidate and completed owner review may be ignored.

## Testing strategy

Tests are written and observed failing before implementation.

### Candidate detector

- FDE exact slug produces Blog 33 candidate.
- Renamed News slug with exact source URL produces a candidate.
- Tracking parameters are removed only from the allowlist.
- Identity-bearing query parameters remain distinct.
- Exact original English title plus exact date produces a candidate.
- Same slug in another family does not match.
- Partial title/date/domain matches do not match.
- Duplicate candidates remain explicit and no target is selected.
- Malformed or unreadable MDX fails closed.

### Report and Slack

- Candidate evidence is attached while status and counts remain unchanged.
- Active Ignore plus candidate stays `Ignored`; no third status exists.
- Slack escapes evidence, displays at most three candidates, and reports omitted
  candidates.

### Ignore safety

- Candidate and mapping-drift identities fail before mutation.
- `assessIgnoreEligibility` is shared by Direct Ignore and PR validation.
- Zero-candidate live `Untracked` remains eligible after owner review.
- The known `news:cnt_000180` and `news:cnt_000181` duplicates remain
  deterministic no-candidate fixtures and require manual reconciliation.
- Newly added Ignore rows cannot bypass the detector through a hand-edited PR.
- Bot-created Ignore branches explicitly receive the required CI run.
- Workflow contract tests enforce no bypass inputs and report read-only behavior.

Focused report tests, workflow contract tests, `npm run test:ci`,
`git diff --check`, and OpenSpec validation when the CLI is available are
required before merge.

## Documentation contract

The durable contract belongs in
`openspec/specs/contract-global-content-diff-report/spec.md`. Operator guidance
in `.github/content-sync/README.md` and
`scripts/global-content-diff-report/README.md` must explain that `Possible Japan
match` is diagnostic evidence, Direct Ignore rejects candidates and mapping
drift, and a human-reviewed baseline/content PR is the remediation.
