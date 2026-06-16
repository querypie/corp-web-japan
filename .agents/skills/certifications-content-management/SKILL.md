---
name: certifications-content-management
description: Thin wrapper for updating acquired-certification content in corp-web-japan. Use when updating `/certifications`, certification badge/card data, certification status copy, or supporting certification mentions on static marketing pages; read `openspec/specs/contract-certifications-content-management/spec.md` first and follow it as the canonical contract.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, certifications, static-marketing, openspec]
    related_skills: [static-page-route-local-authoring, openspec-doc-maintenance]
---

# Certifications content-management wrapper

This is a thin repo-local wrapper for certification-acquisition content work.

Always read
`openspec/specs/contract-certifications-content-management/spec.md` completely
first. Treat that OpenSpec file as the canonical source for scope, current page
inventory, supporting static marketing surfaces, out-of-scope news behavior,
authoring rules, requirements, scenarios, and verification expectations.

## Use this for

- Updating the `/certifications` page.
- Adding, removing, renaming, renewing, reclassifying, or replacing a
  certification card or badge asset.
- Updating certification status copy on static marketing pages.
- Checking supporting static marketing pages for certification-content drift.
- Deciding whether a certification-related request belongs to static marketing
  content or news publication management.

## Workflow

1. Load the OpenSpec contract:
   `openspec/specs/contract-certifications-content-management/spec.md`.
2. Follow the implementation references and requirements from that spec.
3. Keep `/certifications` as the primary local certification-status surface.
4. Keep supporting static marketing mentions consistent with `/certifications`
   and Trust Center.
5. Keep news publication management out of scope unless the user explicitly asks
   for separate news work.
6. Run the verification required by the OpenSpec contract for the files changed.

## Related skills

- Use `.agents/skills/static-page-route-local-authoring/SKILL.md` when the work
  changes static marketing page composition or route-local copy ownership.
- Use `.agents/skills/openspec-doc-maintenance/SKILL.md` when the
  certification-content contract itself needs to change.
