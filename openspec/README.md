# OpenSpec

This directory records durable implementation requirements for the QueryPie AI Japan website.

OpenSpec specs are not one-off plans. They describe behavior that current and future implementation changes should preserve.

## Layout

- `project.md` — repository-wide context that applies to all specs.
- `specs/` — accepted durable requirements.
- `specs/<spec-id>/spec.md` — one platform, contract, or user-facing capability.

## Writing rules

- Use `SHALL`, `SHALL NOT`, `MAY`, and `SHOULD` for normative requirements.
- Use `GIVEN` / `WHEN` / `THEN` scenarios for behavior that should be testable.
- Keep implementation references concrete enough for maintainers to locate the source, but avoid duplicating large code blocks.
- Repository-internal OpenSpec documents are written in English.
