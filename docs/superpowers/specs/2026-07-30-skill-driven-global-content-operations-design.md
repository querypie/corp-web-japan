# Skill-driven Global Content Operations Design

## Status

Approved by the content owner on 2026-07-30.

## Decision

Remove the GitHub Actions Direct Ignore workflow and all Ignore-manifest-specific CI validation. Keep the read-only scheduled Global-only Slack report, baseline authority, Ignore status semantics, and deterministic Japan candidate diagnostics.

Add two repo-local skills under `.agents/skills/` and register both in `.agents/skills/README.md`:

- `global-to-japan-publication`: Use a Composite identity selected from the report to create Japan MDX/assets and the matching baseline mapping in one normal, human-reviewed PR.
- `global-content-ignore`: Use a current report selection, including natural-language exclusions such as "ignore every item published today except X", to create one normal, human-reviewed `ignore.json` PR.

## Boundaries

- Skills create normal PRs only; they never auto-merge.
- Publication work remains human-reviewed and uses `mdx-publication-operations` plus the relevant family skill.
- Ignore work must use a fresh read-only diff, exact Composite identities, and a clearly confirmed exclusion set.
- Candidate evidence and mapping drift remain fail-closed for agent-created Ignore PRs; candidate items require reviewed baseline/content reconciliation instead.
- No scheduled publication or Ignore mutation automation returns.

## Deleted surfaces

- `.github/workflows/ignore-global-content-diff.yml`
- Ignore-manifest validator CI job and its `CI result` dependency
- Direct Ignore workflow helper modules and tests
- Direct-Ignore-specific operator and OpenSpec requirements

## Verification

- Global diff tests continue to cover report semantics and candidate diagnostics.
- CI continues to run normal repository checks for PRs that change manifests.
- Skill documentation is checked by the repository skill metadata test.
