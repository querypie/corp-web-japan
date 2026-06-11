# OpenSpec

This directory records durable implementation requirements for the QueryPie AI Japan website.

OpenSpec specs are not one-off plans. They describe behavior that current and future implementation changes should preserve.

## Layout

- `project.md` — repository-wide context that applies to all specs.
- `specs/` — accepted durable requirements.
- `specs/<spec-id>/spec.md` — one platform, contract, or user-facing capability.
- `changes/<change-id>/proposal.md` — proposed requirement or contract change.
- `changes/<change-id>/design.md` — decision record for trade-offs, migration,
  alternatives, and risk.
- `changes/<change-id>/tasks.md` — implementation and verification checklist for
  the change.
- `changes/<change-id>/specs/<spec-id>/spec.md` — change-local spec delta when
  the accepted spec should not be updated yet.
- `archive/<date>-<change-id>/` — preserved history for completed changes when
  the active spec now owns the current contract.

## Writing rules

- Register every active spec in `openspec/specs/README.md`.
- Use `SHALL`, `SHALL NOT`, `MAY`, and `SHOULD` for normative requirements.
- Use `GIVEN` / `WHEN` / `THEN` scenarios for behavior that should be testable.
- Keep implementation references concrete enough for maintainers to locate the source, but avoid duplicating large code blocks.
- Repository-internal OpenSpec documents are written in English.
- Keep task checklists in `openspec/changes/<change-id>/tasks.md`, not in active
  specs, unless a short accepted-spec follow-up note is needed to preserve
  implementation scope.
- Do not keep a full duplicate of the same durable contract in both `docs/**`
  and `openspec/**`; reduce the non-canonical copy to background or a bridge
  link.
