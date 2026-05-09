---
name: querypie-preview-root-rem-parity
description: Preserve visual parity when importing QueryPie pages into corp-web-japan preview routes even though the source site uses a 15px html root and corp-web-japan keeps the standard 16px root.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, preview, typography, rem, parity, static-page, migration]
---

# Preserve visual parity across different root rem environments

Use this when copying or recreating UI design from pages under `querypie.com/ja/**` or `querypie.com/en/**` into `corp-web-japan` preview routes under `/t/**`.

## Why this skill exists

A recurring pitfall in this repository:
- the source `querypie.com` pages can render under `html { font-size: 15px; }`
- `corp-web-japan` should keep the more standard `html { font-size: 16px; }`
- if you copy only the source page's **computed pixel values** into preview code, the preview can look visibly too small or otherwise off

This happened in CTA parity work:
- source design token looked like `52px`
- source computed size came out as `48.75px`
- copying `48.75px` into a 16px-root preview made the preview feel too small

## Core rule

Do not blindly copy computed pixel values from the source page when the two sites use different root font sizes.

Instead:
1. identify the source page's root font size
2. identify whether the source size comes from rem-based tokens
3. preserve the **author/token intent** when the preview keeps a different root font size
4. use computed-value copying only when the preview intentionally mirrors the same root environment

## The root-rem difference in this repo

Treat this as the default assumption unless evidence shows otherwise:
- source QueryPie public pages under `querypie.com/ja/**` or `querypie.com/en/**` may use `html font-size: 15px`
- `corp-web-japan` preview/public implementation should keep the standard `html font-size: 16px`

That means the same rem token renders to different final pixel values:
- `3.25rem` at 15px root => `48.75px`
- `3.25rem` at 16px root => `52px`

## What can differ in DevTools

The source page can show two different but both-valid numbers:
- author/token value in CSS rules, e.g. `--rem-52px` or `3.25rem`
- final computed/used value, e.g. `48.75px`

Do not confuse them.

When a designer or reviewer says "DevTools shows 52px" but browser computed style says `48.75px`, first check whether:
- the rule uses a rem token
- the page root font size is 15px

## Calculation rules

### A. Converting a source rem token to final pixels

Formula:
- `final_px = rem_value * source_root_px`

Example:
- source token: `3.25rem`
- source root: `15px`
- final rendered size: `48.75px`

### B. Rebuilding the same visual intent on a 16px-root preview

If the goal is to preserve the **source token/design intent** in a preview that keeps `16px` root:
- use the same rem token or its 16px equivalent pixel token

Example:
- source token: `3.25rem`
- preview root: `16px`
- preview target should be `52px`, not `48.75px`

### C. Recovering the source rem token from a computed size

Formula:
- `rem_value = computed_px / source_root_px`

Example:
- measured source computed size: `48.75px`
- measured source root: `15px`
- inferred token: `48.75 / 15 = 3.25rem`

Then rebuild on 16px root:
- `3.25 * 16 = 52px`

## Practical migration workflow

### 1. Measure the source page
In the browser, collect:
- exact element text / selector
- source page `html` root font size
- matching CSS token/rule when possible
- final computed style

Minimum checks:
```js
getComputedStyle(document.documentElement).fontSize
getComputedStyle(target).fontSize
getComputedStyle(target).lineHeight
getComputedStyle(target).fontWeight
```

For token-backed headings/text, also inspect rule/variable data if possible.

### 2. Decide whether to preserve token intent or computed output
Use this decision rule:
- if preview should keep standard `16px` root and visually match the design language of the source page, preserve **token intent**
- if preview intentionally mirrors the exact same root environment as the source page, then copying computed values can be acceptable

For this repo's normal preview migration work, prefer preserving token intent.

### 3. Convert typography and spacing consistently
Do this not only for titles but also for:
- body text sizes
- line heights
- button paddings
- border radius
- gaps
- icon sizes

Common example:
- source button spacing seen as computed values under 15px root:
  - padding `13.125px 26.25px`
  - radius `5.625px`
- if those came from 16px-design tokens, restore them in preview to:
  - padding `14px 28px`
  - radius `6px`

### 4. Re-check in the preview deployment URL
Do not stop at local reasoning.

Open:
- the exact live source URL
- the exact preview deployment URL

Then compare:
- title wrapping
- body text density
- button size
- spacing rhythm

## Heuristics

### Preserve design tokens when these are true
- source CSS is clearly rem-token driven
- source `html` root differs from preview root
- preview site should keep its own standard root size
- the user cares about visual parity, not about reproducing the source computed numbers literally

### Copy computed values only when these are true
- preview intentionally mirrors the same root environment
- there is no reliable token/rule information available
- the element is a one-off visual artifact and not part of a reusable design system

## Verification checklist

Before finalizing a migration/import PR:
1. inspect source root font size
2. inspect preview root font size
3. identify whether the source size comes from rem-based tokens
4. explain the conversion logic in the PR or skill if it was non-obvious
5. compare the exact preview deployment URL against the source page in a browser

## Reporting template

When this issue matters, summarize like this:
- source page root font size: `15px`
- preview page root font size: `16px`
- source token/rule: e.g. `3.25rem` / `--rem-52px`
- source computed value: e.g. `48.75px`
- preview implementation choice: preserve token intent or copy computed value
- resulting preview size: e.g. `52px`

## Pitfalls

- copying computed px values from a 15px-root site into a 16px-root site
- trusting only the Styles pane or only the Computed pane in DevTools
- adjusting one text element but forgetting button padding/radius/icon size that came from the same token scale
- assuming visual mismatch means the component is wrong when the real issue is differing root font-size environments

## Done criteria

You are done when:
- the source and preview root font-size difference is explicitly identified
- token-vs-computed distinction is resolved for the target element(s)
- preview values are intentionally chosen for a 16px-root environment
- browser comparison confirms the preview looks materially aligned with the source page
