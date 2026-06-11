---
name: openspec-doc-maintenance
description: Use when corp-web-japan work requires improving or maintaining OpenSpec docs, or reveals drift, contradiction, stale requirements, missing scenarios, or an implementation contract that should be captured in openspec/.
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, openspec, documentation, spec-maintenance, implementation-contracts]
    related_skills: [openspec-authoring]
---

# OpenSpec doc maintenance in corp-web-japan

Use this skill when maintaining the repository's OpenSpec documents during
implementation, review, debugging, publication, or planning work.

OpenSpec is not a scratch plan. It is the shared implementation contract for
future agents and reviewers. If work reveals a missing requirement, stale
Scenario, contradiction, or undocumented cross-cutting contract, capture it in
`openspec/` instead of leaving it only in chat.

## When to use

Use this skill when:

- Adding, updating, correcting, or reorganizing files under `openspec/`.
- Improving OpenSpec document clarity, structure, deduplication, evidence links,
  task quality, or verification coverage without changing product behavior.
- A user request changes requirements or asks for an OpenSpec update.
- Implementation or review reveals a mismatch between OpenSpec, docs, and code.
- A reusable route, metadata, content, platform, UI, or verification contract is
  missing from OpenSpec.
- A spec change creates follow-up implementation work that needs concrete tasks
  and verification scope.

Do not use this skill when:

- The task is ordinary code work and no OpenSpec drift or contract change is
  involved.
- The task is public MDX content maintenance with no OpenSpec change.
- The user asks only for an explanation and explicitly does not want file edits.

## Canonical files

Check the smallest relevant set:

- `openspec/README.md`
- `openspec/project.md`
- `openspec/specs/README.md`
- related `openspec/specs/**/spec.md`
- related `openspec/changes/<change-id>/**` if a change exists
- sibling repo skill references when the task explicitly asks to port or align
  OpenSpec operating practice:
  - `../corp-web-app/.agents/skills/openspec-authoring/SKILL.md`
  - `../corp-web-app/.agents/skills/openspec-doc-maintenance/SKILL.md`
  - `../outbound-agent/.agents/skills/openspec-authoring/SKILL.md`
  - `../outbound-agent/.agents/skills/openspec-doc-maintenance/SKILL.md`
  - `../outbound-agent/.agents/skills/openspec-task-execution/SKILL.md`
- relevant repository docs such as:
  - `docs/code-location-conventions.md`
  - `docs/static-page-route-local-authoring.md`
  - `docs/route-aligned-mdx-authoring-for-developers.md`
  - `docs/local-e2e.md`
  - topic-specific docs under `docs/**`

## Maintenance workflow

1. Classify the drift or contract need.
   - Contradiction: OpenSpec, docs, or code make incompatible claims.
   - Error: a requirement or scenario is wrong for the accepted project shape.
   - Missing contract: implementation or verification needs a durable rule.
   - Stale scope: an old non-goal, preview route, URL, or behavior no longer
     matches the current site.
2. Decide whether the current task itself is an OpenSpec task.
   - If the user requested OpenSpec changes, update OpenSpec in the current work.
   - If OpenSpec drift is discovered during unrelated implementation work,
     prefer a separate docs branch/PR unless the user asks to include it.
   - If a requirement change is needed before code should change, update
     OpenSpec first, then implement from that contract.
3. Choose the minimum canonical surface.
   - Use `openspec/project.md` for broad project boundaries.
   - Use `openspec/specs/<spec-id>/spec.md` for accepted durable behavior.
   - Use `openspec/changes/<change-id>/design.md` for decision logs,
     alternatives, risks, and open questions.
   - Use `openspec/changes/<change-id>/tasks.md` for implementation sequencing.
   - Use `openspec/changes/<change-id>/specs/<spec-id>/spec.md` for a
     change-local delta before the accepted spec is updated.
   - Use `openspec/archive/<date>-<change-id>/` only when preserving a completed
     change history is useful and the active spec now owns the current contract.
4. Keep OpenSpec and docs aligned.
   - Do not leave old docs with a competing full statement of the same contract.
   - Replace duplicated prose with a short bridge to the canonical OpenSpec path.
   - Preserve background and rationale where it still helps reviewers.
5. Write concrete Requirements and Scenarios.
   - Repository OpenSpec documents are written in English.
   - Use `SHALL`, `SHALL NOT`, `MUST`, `MAY`, and `SHOULD` precisely.
   - Make Scenarios testable with `GIVEN`, `WHEN`, `THEN`, and `AND`.
6. Add follow-up implementation tasks when a spec correction is not implemented
   in the same change.
   - Name likely implementation files or families.
   - Name expected tests and hosted/browser smoke checks.
   - Include a Spec / Implementation Drift Check item.
   - Avoid vague notes such as "verify later."
7. Keep verification scope broad enough for the contract.
   - Implementation tasks may be split narrowly.
   - Verification tasks must cover affected route/page families, shared helpers,
     shared components, route-local content surfaces, metadata, sitemap, robots,
     API/schema/test surfaces, and hosted smoke routes where relevant.
   - If only representative pages are checked, record the representative set and
     why it is sufficient.

## Follow-up task quality bar

Good follow-up tasks include:

- The implementation surface: file paths, helpers, route families, or component
  families likely to change.
- The behavior to preserve: canonical paths, redirects, metadata fields, visible
  UI, API contract, data contract, or side-effect boundary.
- The regression tests to add or update.
- The hosted or browser verification to run.
- The explicit drift check result location, usually `tasks.md` or PR body.
- The cleanup or archive condition if the change creates temporary
  `openspec/changes/<change-id>/**` documents.

Poor follow-up tasks:

- "Update implementation."
- "Run tests."
- "Verify in staging."
- "Fix metadata everywhere."

## Verification checklist

- [ ] Branch/worktree state is known.
- [ ] Relevant OpenSpec files and topic docs were inspected.
- [ ] The updated contract is in the narrowest durable OpenSpec location.
- [ ] Requirement and Scenario wording is testable.
- [ ] Related docs do not keep a competing full canonical statement.
- [ ] New follow-up tasks include implementation surface, regression tests,
      hosted/browser checks, and drift-check result location.
- [ ] Verification scope covers the full affected surface, not only the future
      implementation diff.
- [ ] `git diff --check` passes.
- [ ] `openspec validate --all` was run when available, or the reason it was not
      run is reported.

## Common pitfalls

1. Reporting OpenSpec drift in chat but not updating `openspec/`.
2. Hiding a contract change inside an unrelated implementation diff.
3. Creating a new spec without registering it in `openspec/specs/README.md`.
4. Leaving stale docs that contradict the new OpenSpec source of truth.
5. Treating a current bug as desired behavior because code currently does it.
6. Writing follow-up tasks without concrete test or smoke coverage.
7. Narrowing verification to the expected implementation files and missing
   related route families, shared helpers, metadata, sitemap, or robots output.
