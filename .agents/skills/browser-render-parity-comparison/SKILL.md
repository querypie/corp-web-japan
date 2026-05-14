---
name: browser-render-parity-comparison
description: Compare two website pages by actual browser rendering, with screenshots, DOM geometry, computed styles, lazy-media checks, and explicit chrome-vs-body classification before proposing fixes.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [browser, visual-parity, corp-web-japan, screenshots, playwright]
    related_skills: [querypie-ja-preview-route-parity, querypie-preview-root-rem-parity]
---

# Browser render parity comparison

Use this skill when the user says two pages render differently and wants a detailed comparison before implementation.

This is the repo-local workflow for browser-rendered parity investigation. It intentionally references the maintained guide at `docs/browser-render-parity-comparison.md`; use that document as the source of truth for the detailed checklist and Playwright collection script.

## When to use

Use this skill for tasks like:

- comparing a stage page against a live QueryPie page
- comparing a PR Preview Deployment against stage
- checking whether a migrated `/t/**` preview route visually matches the live source
- investigating desktop/mobile layout differences that are visible only in a browser
- preparing evidence before the user gives follow-up visual discrepancies

Common URL pairs include:

- `https://stage.querypie.ai/t/platforms/aip`
- `https://www.querypie.com/ja/solutions/aip`

## Load together with

When the page is a QueryPie Japan preview migration, also load the narrow migration skill that matches the task:

- `.agents/skills/querypie-ja-preview-route-parity/SKILL.md`
- `.agents/skills/querypie-preview-root-rem-parity/SKILL.md`

Use this skill first for the comparison mechanics, then use those migration skills to interpret the result in repo-specific terms.

## Required guide

Before collecting measurements, read:

- `docs/browser-render-parity-comparison.md`

Follow its checklist for:

- exact URL handling
- viewport set
- screenshots
- DOM geometry
- computed styles
- lazy media loading
- mobile overflow checks
- reporting format

## Core workflow

1. Open the exact URLs named by the user.
2. Compare at least desktop `1440 x 900` and mobile `390 x 844`.
3. Capture full-page screenshots to a temporary path outside the repo, such as `/tmp/<task-name>`.
4. Collect browser-rendered data with Playwright or browser console:
   - final URL
   - title
   - root font size
   - scroll height
   - header/main rects
   - heading rects and computed typography
   - section rects, backgrounds, and padding
   - paragraph widths and line-height
   - image/video/iframe rects, natural sizes, and sources
   - link/CTA rects and hrefs
5. Scroll through the page before measuring lazy media.
6. Separate global chrome differences from body-area differences.
7. Report only differences that are backed by screenshots or rendered measurements.

## What to inspect carefully

### Browser chrome and overlays

Classify these separately:

- language banner
- cookie consent banner
- header/GNB height
- footer differences
- floating widgets

Do not call these migrated body defects unless the user explicitly includes global chrome in the parity target.

### Hero rhythm

Measure separately:

- header bottom to `h1` top
- `h1` bottom to first paragraph top
- first paragraph bottom to media top
- media bottom to next section top

This prevents collapsing page-start offset, title spacing, and body/media spacing into one vague finding.

### Mobile typography and overflow

On mobile, always check:

- root font size on both pages
- `h1` and `h2` computed sizes
- awkward Japanese word breaks
- paragraph rect widths
- image/media widths compared with viewport width
- total scroll height

A page can look close on desktop while having severe mobile defects.

### Media wrappers

For each image/video/iframe, compare both:

- the media element rect
- its immediate parent rect

If an image has the right natural dimensions but renders at the wrong size, the wrapper often owns the real bug.

## AIP comparison reminder

The AIP stage-vs-live comparison produced a useful diagnostic pattern:

Desktop body was broadly aligned after separating external chrome:

- desktop root font size matched at `16px`
- `h1` matched at `60px / 72px`
- hero iframe matched at `1024 x 576`
- feature GIF desktop widths matched live values such as `540`, `580`, `520`, and `600` px

Mobile revealed the real discrepancy:

- stage root stayed `16px`; live root measured `14px`
- stage `h1` stayed `60px / 72px`; live used `48px / 56px`
- stage `h2` stayed `52px / 62px`; live used `32px / 40px`
- stage feature GIFs kept desktop widths such as `540`, `580`, and `600` px in a `390px` viewport
- live feature GIFs scaled to about `342px`
- stage feature paragraphs collapsed into extremely narrow columns around `30px` wide
- stage mobile scroll height was almost double the live page

Use this as a warning: always run mobile measurements even when desktop parity looks good.

## Reporting format

Report in this order:

1. URLs and viewports compared
2. screenshot/data artifact paths, if useful
3. chrome/overlay differences
4. desktop body findings
5. mobile body findings
6. measured evidence for each important difference
7. likely source-code area to inspect next
8. classification: defect, intentional local adaptation, or external live-site artifact

## Common pitfalls

- comparing source files before measuring browser output
- using only a screenshot without DOM geometry
- treating cookie/language banners as body differences
- ignoring root font-size differences
- measuring only desktop
- failing to scroll before checking lazy media
- ignoring media parent wrappers
- reporting every pixel delta as a defect without classifying policy/chrome/adaptation

## Verification checklist

- [ ] Exact user-provided URLs opened directly
- [ ] Desktop and mobile measured
- [ ] Full-page screenshots captured
- [ ] Lazy media loaded by scrolling
- [ ] Header/main/section/heading/media geometry collected
- [ ] Mobile overflow and text wrapping checked
- [ ] Chrome/banner differences separated from migrated body differences
- [ ] Findings tied to concrete measurements
- [ ] Next source-code inspection target identified
