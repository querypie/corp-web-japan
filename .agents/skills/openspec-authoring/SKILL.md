---
name: openspec-authoring
description: Use when writing or substantially updating corp-web-japan OpenSpec specifications or change documents from existing docs, current specs, and implementation evidence.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, openspec, authoring, specs, implementation-contracts]
    related_skills: [openspec-doc-maintenance]
---

# OpenSpec authoring in corp-web-japan

Use this skill when creating a new OpenSpec spec, adding a change plan, or
substantially updating an existing OpenSpec contract in `corp-web-japan`.

The goal is to write a durable implementation contract that future agents and
reviewers can execute against. Do not copy a design memo into OpenSpec and leave
the old memo as a second canonical source.

## When to use

Use this skill for:

- Adding a new `openspec/specs/<spec-id>/spec.md`.
- Updating active OpenSpec Requirements or Scenarios.
- Creating or updating `openspec/changes/<change-id>/**` documents.
- Promoting durable requirements from `docs/**`, current implementation, or a
  user decision into OpenSpec.
- Writing follow-up implementation tasks and verification scope for a new
  contract.

Do not use it for:

- Ordinary implementation work with no spec or requirement change.
- Public MDX content maintenance. Use `mdx-publication-operations` plus the
  relevant family wrapper.
- User manual or marketing copy authoring unless the task explicitly changes
  OpenSpec.

## Preflight

1. Read repository guidance first:
   - `README.md`
   - `AGENTS.md`
   - `.agents/skills/README.md`
2. Confirm branch and worktree state with `git status --short --branch`.
3. Use a separate worktree for branch-isolated OpenSpec PR work when practical.
   If the user is already directing work on the current branch, keep edits
   scoped and do not revert unrelated changes.
4. Read the relevant OpenSpec entry points:
   - `openspec/README.md`
   - `openspec/project.md`
   - `openspec/specs/README.md`
   - related `openspec/specs/**/spec.md`
   - related `openspec/changes/**/{proposal.md,design.md,tasks.md}` if present
5. Inspect current implementation evidence when the spec documents existing or
   near-term behavior:
   - `src/app/**/{page.tsx,route.ts}`
   - `src/components/**`
   - `src/lib/**`
   - `src/content/**`
   - `public/**` for first-party assets
   - `tests/**` and `tests-local/**`
   - `package.json`

## Evidence rules

- Treat `openspec/specs/**/spec.md` as the durable implementation contract layer.
- Treat `docs/**` as design, background, handoff, or operational guidance unless
  a document explicitly says it is canonical for a topic.
- Treat code/tests as current behavior evidence, not automatically as desired
  product behavior.
- If docs, OpenSpec, and code disagree, record the conflict in working notes and
  resolve from repository context when the intended direction is clear.
- If the conflict requires a Product Owner decision, do not invent policy.

## Authoring workflow

1. Classify the target spec id.
   - `platform-*`: reusable website platform capability.
   - `contract-*`: implementation contract, route/API/metadata/content contract,
     or cross-cutting rule.
   - `uc-*`: user-facing journey or workflow.
   - `policy-*`: durable product or operational policy.
2. Decide the document shape.
   - Use active `openspec/specs/<spec-id>/spec.md` for accepted durable behavior.
   - Use `openspec/changes/<change-id>/` when a broad not-yet-implemented change
     needs proposal, design decisions, and task sequencing before active specs
     are updated.
3. Write Requirements as contracts, not implementation plans.
   - Repository OpenSpec documents are written in English.
   - Use `SHALL`, `SHALL NOT`, `MUST`, `MUST NOT`, `MAY`, `SHOULD`, and
     `SHOULD NOT` consistently.
   - Use `out of scope`, `future scope`, or `backlog` for exclusions that are not
     explicit prohibitions.
4. Write Scenarios so they can become tests or smoke checks.
   - Use `GIVEN`, `WHEN`, `THEN`, and `AND`.
   - Include route, actor, precondition, action, metadata field, persisted state,
     visible result, status code, or excluded side effect when relevant.
   - Avoid vague scenarios such as "the UX is intuitive."
5. Keep implementation tasks out of active specs unless the user explicitly asks
   for a spec file to carry a short follow-up section.
   - Prefer `openspec/changes/<change-id>/tasks.md` for task checklists.
   - When using an active spec for a small accepted correction, a concise
     `Follow-up implementation tasks` section is acceptable if it prevents the
     implementation scope from being lost.
6. Add a drift verification task when a new contract requires implementation.
   - Check both directions: spec requirements missing in code/tests, and code
     behavior not described by or contradicted by the spec.
   - Record where the drift check result should be written, usually `tasks.md`
     or the PR body.
7. Separate implementation scope from verification scope.
   - Follow-up implementation tasks may be split into small PR-sized units.
   - Verification tasks should cover the full contract impact: affected route
     families, shared helpers, shared components, metadata surfaces, sitemap,
     robots, source-level tests, and representative hosted/browser smoke checks.
   - If only representative pages are verified, state why they are representative
     and how excluded surfaces will be checked later.

## Duplicate cleanup

When OpenSpec becomes canonical for a requirement already described in `docs/**`:

- Keep roadmap, background, UI exploration, feature status, and historical
  review material in `docs/**`.
- Move implementation contract, In/Out scope, decisions, Scenarios, and task
  checklists into `openspec/**`.
- Replace duplicated `docs/**` sections with a short bridge link to the
  canonical OpenSpec path.
- Do not leave two full copies of a requirement table, decision table, Scenario
  list, or task checklist.

Before finishing, run a focused duplicate check:

```bash
rg -n "<distinct phrase|route|requirement title|decision title>" docs openspec
```

## Required shapes

Active spec:

```md
# <spec-id>

## Purpose

## Current implementation references

## Requirements

### Requirement: <name>

<contract sentence with SHALL / SHOULD / MAY language>.

#### Scenario: <observable case>

- GIVEN ...
- WHEN ...
- THEN ...
```

Change proposal:

```md
## Why
## What Changes
## Capabilities
### New Capabilities
### Modified Capabilities
## Impact
```

Change design:

```md
## Context
## Goals / Non-Goals
## Decisions
### Decision: ...
## Risks / Trade-offs
## Migration Plan
## Open Questions
```

Change tasks:

```md
## 1. Contract
## 2. Implementation
## 3. Verification
## 4. Spec / Implementation Drift Check
## 5. OpenSpec Cleanup
```

For verification tasks, include broad affected surfaces even when the
implementation task itself is intentionally narrow.

## Verification checklist

- [ ] Branch/worktree state is known.
- [ ] Relevant OpenSpec entry points were read.
- [ ] Related docs, implementation files, and tests were inspected when needed.
- [ ] Requirement and Scenario text is observable and testable.
- [ ] Implementation details are not overexposed in user-facing specs.
- [ ] Duplicate canonical requirements in `docs/**` were removed, reduced, or
      bridged to OpenSpec.
- [ ] Follow-up tasks identify implementation files, tests, smoke checks, and
      drift-check result location.
- [ ] Verification scope covers affected route/page families, shared helpers,
      shared components, metadata/sitemap/robots surfaces, and representative
      hosted checks when applicable.
- [ ] `git diff --check` passes.
- [ ] Run `openspec validate --all` when the local OpenSpec CLI is available.

## Common pitfalls

1. Copying a design doc into OpenSpec while leaving the original as a second
   full canonical contract.
2. Mixing long implementation checklists into active specs when a change
   `tasks.md` would be clearer.
3. Freezing stale current code behavior as product intent without checking docs,
   OpenSpec, and user decisions.
4. Using `SHALL NOT` for ordinary non-goals or future scope.
5. Writing abstract Scenarios that cannot become tests or smoke checks.
6. Adding a new active spec without registering it in `openspec/specs/README.md`.
7. Narrowing verification scope to only the files touched by a future
   implementation PR and missing related page families or shared metadata
   surfaces.
