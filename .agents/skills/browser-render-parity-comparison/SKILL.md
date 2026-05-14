---
name: browser-render-parity-comparison
description: Compare two website pages by actual browser rendering; use the canonical docs/browser-render-parity-comparison.md guide for the detailed checklist, measurement script, and reporting format.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [browser, visual-parity, corp-web-japan, screenshots, playwright]
    related_skills: [querypie-ja-preview-route-parity, querypie-preview-root-rem-parity]
---

# Browser render parity comparison

Use this skill when the user says two pages render differently and wants a detailed browser-rendered comparison before implementation.

The canonical guide is:

- `docs/browser-render-parity-comparison.md`

Read that document before collecting measurements. Do not duplicate or replace its checklist in this skill.

## When to use

Use this skill for tasks like:

- comparing a stage page against a live QueryPie page
- comparing a PR Preview Deployment against stage or live
- checking whether a migrated `/t/**` preview route visually matches the live source
- investigating desktop/mobile layout differences that are visible only in a browser
- preparing measured evidence before the user gives follow-up visual discrepancies

Common URL pairs include:

- `https://stage.querypie.ai/t/platforms/aip`
- `https://www.querypie.com/ja/solutions/aip`

## Load order

1. Load this skill to recognize the task as a browser-rendered parity investigation.
2. Read `docs/browser-render-parity-comparison.md` from the repo.
3. If the page is a QueryPie Japan preview migration, also load the narrow migration skill that matches the task, commonly:
   - `.agents/skills/querypie-ja-preview-route-parity/SKILL.md`
   - `.agents/skills/querypie-preview-root-rem-parity/SKILL.md`

Use this skill for the trigger and execution discipline. Use the docs guide as the source of truth for the detailed checklist, Playwright collection script, manual console snippets, measurements, classification taxonomy, and reporting format.

## Required execution rules

- Open the exact URLs named by the user.
- Compare at least desktop `1440 x 900` and mobile `390 x 844` unless the user narrows scope.
- Capture screenshots and browser-rendered DOM geometry.
- Scroll through the page before classifying lazy media as missing or broken.
- Separate global chrome, banners, overlays, and environment artifacts from migrated page-body differences.
- Back every reported defect with rendered measurements or screenshot observations.
- Inspect source code only after the rendered cause is narrowed.

## Output rule

Report findings using the format in `docs/browser-render-parity-comparison.md`:

- URLs and viewports compared
- artifacts captured
- chrome/body separation
- desktop findings
- mobile findings
- measured evidence
- suspected root cause
- next source-code inspection target
- classification: defect, intentional local adaptation, external live-site artifact, environment artifact, or needs decision

## Verification checklist

- [ ] `docs/browser-render-parity-comparison.md` was read for the current task
- [ ] Exact user-provided URLs were opened directly
- [ ] Desktop and mobile measurements were collected
- [ ] Lazy media was loaded by scrolling
- [ ] Chrome/banner differences were separated from body differences
- [ ] Findings were tied to concrete measurements
- [ ] Next source-code inspection target was identified
