---
name: browser-render-parity-comparison
description: Use when comparing two website pages by actual browser rendering; load this skill, then follow docs/browser-render-parity-comparison.md as the single source of truth.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [browser, visual-parity, corp-web-japan, screenshots, playwright]
    related_skills: [querypie-ja-preview-route-parity, querypie-preview-root-rem-parity]
---

# Browser render parity comparison

Use this skill only as the trigger/index for browser-rendered parity work.

Canonical guide:

- `docs/browser-render-parity-comparison.md`

Do not duplicate the guide's workflow, checklist, scripts, measurement taxonomy, reporting format, examples, or done criteria in this skill. If the process changes, update the guide first.

## When to load

Load this skill when the user asks to compare rendered pages, for example:

- stage/preview vs live QueryPie page
- PR Preview Deployment vs stage or live
- local `/t/**` preview route vs live source page
- browser-only layout, typography, media, or responsive discrepancies

## What to do after loading

1. Read `docs/browser-render-parity-comparison.md`.
2. Follow that document exactly for collection, comparison, classification, and reporting.
3. Treat section background layers as first-class parity evidence. In particular, check hero `backgroundImage`, gradient backgrounds, pseudo-elements, and decorative absolute-positioned images before concluding that a route only differs in typography, spacing, cards, FAQ, or CTA rhythm.
4. If the task is a QueryPie Japan preview migration, load any narrower route-specific skill only for repo-specific implementation context.
