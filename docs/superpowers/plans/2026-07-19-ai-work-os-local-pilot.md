# AI Work OS Local Publication Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and independently validate one local Japan Blog migration for Global source `cnt_000211` without pushing or opening a pull request.

**Architecture:** Work only in the existing isolated pilot worktree. Treat the Global `meta.json` and `ja.html` as source material, adapt them through the existing `mdx-publication-operations` and `blog-posting` contracts, keep all assets route-aligned under Blog ID `32`, and use fresh read-only reviewers as the final quality gate. This plan deliberately excludes discovery automation, scheduling, server deployment, and pull-request creation.

**Tech Stack:** MDX, Node.js 20 test runner, npm publication test group, YAML frontmatter, existing `Box` and `ArticleFileImage` MDX components, macOS `sips` for the local thumbnail conversion

## Global Constraints

- Worktree: `/Users/kelly/w/corp-web-japan-worktrees/260719-global-doc-sync-pilot`
- Source root: `/Users/kelly/w/corp-web-v2/src/content/documentation/blogs/cnt_000211`
- Source asset root: `/Users/kelly/w/corp-web-v2/public/documentation/blogs`
- Do not run `npm install` or `npm ci` in the worktree.
- Reuse the root checkout dependency tree through a `node_modules` symlink when tests require dependencies.
- Do not push, open a pull request, merge, deploy, or modify `corp-web-v2`.
- Load `.agents/skills/mdx-publication-operations/SKILL.md` and `.agents/skills/blog-posting/SKILL.md` before editing publication content.
- Keep effective Open Graph media as `/blog/32/thumbnail.png`.
- Preserve source facts and structure; document every intentional formatting or language adaptation.
- A Critical or Major reviewer finding blocks pilot completion.

---

## File Map

- Modify: `.agents/skills/blog-posting/SKILL.md` — align stale verification paths with the current `tests/blog/**` layout.
- Create: `src/content/blog/32-ai-work-os-enterprise-intelligence.mdx` — Japan Blog frontmatter and adapted MDX body.
- Create: `public/blog/32/thumbnail.png` — route-aligned card, hero, and Open Graph image converted from Global `thumbnail-2.webp`.
- Create: `public/blog/32/thumbnail-3.webp` — source article-opening figure.
- Create: `public/blog/32/slide-02-enterprise-new-intelligence.webp` through `public/blog/32/slide-18-enterprise-trust-foundation.webp` — article figures.
- Create: `public/blog/32/20260615-openai-founder-day-ai-work-os-sam-kim-querypie-ko.pdf` — source-owned Blog PDF referenced by the article.
- Modify: `tests/blog/migrated-ja-content-count.test.mjs` — raise the expected local Blog count from 31 to 32.
- Modify: `tests/fixtures/blog-migrated-ja-source-parity.json` — add the source-backed Blog ID, slug, metadata, author ID, and locale.
- Runtime artifact only: `/tmp/global-doc-sync-pilot/candidate.json` — source and target inventory.
- Runtime artifact only: `/tmp/global-doc-sync-pilot/generation-report.json` — source-to-target mappings and intentional changes.
- Runtime artifact only: `/tmp/global-doc-sync-pilot/content-review.json` — independent content review.
- Runtime artifact only: `/tmp/global-doc-sync-pilot/contract-review.json` — independent repository-contract review.
- Runtime artifact only: `/tmp/global-doc-sync-pilot/run-summary.json` — timings, commands, results, and final pilot status.

---

### Task 1: Establish the Red Test and Current Blog Contract

**Files:**
- Modify: `.agents/skills/blog-posting/SKILL.md`
- Modify: `tests/blog/migrated-ja-content-count.test.mjs`
- Modify: `tests/fixtures/blog-migrated-ja-source-parity.json`
- Test: `tests/blog/migrated-ja-content-count.test.mjs`
- Test: `tests/blog/migrated-ja-source-parity.test.mjs`

**Interfaces:**
- Consumes: Global `meta.json` values for source ID, slug, title, summary, date, and author name.
- Produces: A failing target-content expectation for Blog ID `32` and corrected executable verification documentation.

- [ ] **Step 1: Link the existing root dependency tree**

```bash
cd /Users/kelly/w/corp-web-japan-worktrees/260719-global-doc-sync-pilot
mkdir -p /tmp/global-doc-sync-pilot
[ -e node_modules ] || ln -s /Users/kelly/w/corp-web-japan/node_modules node_modules
```

Expected: `node_modules` resolves to the root checkout dependency tree; no package installation occurs.

- [ ] **Step 2: Correct the Blog skill verification paths**

Replace the four stale `npm run test -- tests/blog-*.test.mjs` commands with:

```bash
node --test \
  tests/blog/list-server-source.test.mjs \
  tests/blog/publication-cache.test.mjs \
  tests/blog/canonical-slug-routing.test.mjs \
  tests/blog/mdx-rendering-architecture.test.mjs
npm run test:publications
```

- [ ] **Step 3: Add the expected source-backed fixture entry**

Append this object to `tests/fixtures/blog-migrated-ja-source-parity.json`, preserving numeric ID order and valid JSON:

```json
{
  "id": "32",
  "slug": "ai-work-os-enterprise-intelligence",
  "title": "AI Work OS: 新たな知能が企業内で働く方式",
  "description": "AIが企業内で共に働く新たな知能となった今、企業はAIが理解できるコンテキスト、実際の業務を遂行する実行構造、そしてその実行を安全に統制する運営体系を必要としています。",
  "author": "sam",
  "sourceLocale": "ja"
}
```

- [ ] **Step 4: Raise the expected Blog content count**

Change:

```js
assert.equal(files.length, 31);
```

to:

```js
assert.equal(files.length, 32);
```

- [ ] **Step 5: Run the focused tests and confirm RED**

```bash
node --test \
  tests/blog/migrated-ja-content-count.test.mjs \
  tests/blog/migrated-ja-source-parity.test.mjs
```

Expected: FAIL because `src/content/blog/32-ai-work-os-enterprise-intelligence.mdx` does not exist yet. The failure must identify count `31 !== 32` and/or missing local Blog ID `32`.

---

### Task 2: Build the Route-aligned Assets and MDX Post

**Files:**
- Create: `public/blog/32/**`
- Create: `src/content/blog/32-ai-work-os-enterprise-intelligence.mdx`
- Test: `tests/blog/migrated-ja-content-count.test.mjs`
- Test: `tests/blog/migrated-ja-source-parity.test.mjs`

**Interfaces:**
- Consumes: Task 1 target expectations; source `meta.json`; source `ja.html`; exact source asset inventory.
- Produces: A complete Japan Blog record with route-aligned assets and no unresolved Global `/documentation/**` paths.

- [ ] **Step 1: Create and verify the source inventory**

Compute the source hash from `meta.json`, `ja.html`, and the ordered asset
manifest, then create `/tmp/global-doc-sync-pilot/candidate.json` with these
required fields populated with actual values:

```json
{
  "sourceId": "cnt_000211",
  "sourceSlug": "ai-work-os-enterprise-intelligence",
  "sourceCategory": "blogs",
  "sourceLanguage": "ja",
  "canonicalUrl": "https://www.querypie.com/en/blog/ai-work-os-enterprise-intelligence",
  "sourceHash": "sha256:a243ebb105fbfe4123c72061c11387f0b65aa9c2f15678f84aaf3c62b0979c2a",
  "targetFamily": "blog",
  "targetId": "32",
  "targetSlug": "ai-work-os-enterprise-intelligence",
  "sourceAuthor": "Sam Kim",
  "targetAuthor": "sam",
  "sourceBody": "/Users/kelly/w/corp-web-v2/src/content/documentation/blogs/cnt_000211/ja.html",
  "sourceAssets": [],
  "sourceHrefs": [],
  "expectedBodyFigures": 18,
  "expectedCaptions": 17,
  "expectedKoreanAltsToLocalize": 17,
  "expectedPdfLinks": 1
}
```

The command below must reproduce source hash
`a243ebb105fbfe4123c72061c11387f0b65aa9c2f15678f84aaf3c62b0979c2a` before conversion starts.
`sourceAssets` must be an ordered array containing `thumbnail-2.webp`,
`thumbnail-3.webp`, slides `02` through `18`, and the PDF. `sourceHrefs` must be
the ordered unique href list extracted from `ja.html`.

Compute the hash reproducibly:

```bash
META=/Users/kelly/w/corp-web-v2/src/content/documentation/blogs/cnt_000211/meta.json
BODY=/Users/kelly/w/corp-web-v2/src/content/documentation/blogs/cnt_000211/ja.html
SOURCE=/Users/kelly/w/corp-web-v2/public/documentation/blogs
{
  shasum -a 256 "$META" "$BODY"
  for file in \
    thumbnail-2.webp thumbnail-3.webp \
    slide-02-enterprise-new-intelligence.webp \
    slide-03-querypie-ai-work-os.webp \
    slide-04-ai-agent-beyond-answer-generation.webp \
    slide-05-aip-acp-fde-enterprise-ai-work-os.webp \
    slide-06-querypie-evolution-to-ai-work-os.webp \
    slide-07-aip-ai-agent-platform.webp \
    slide-08-mcp-gateway-llm-tool-control.webp \
    slide-09-aip-apps-work-automation.webp \
    slide-10-aip-apps-use-cases.webp \
    slide-11-lingo-salesforce-japan.webp \
    slide-12-fde-domain-process-implementation.webp \
    slide-13-fde-ai-agent-use-cases.webp \
    slide-14-ontology-work-meaning-map.webp \
    slide-15-emergency-care-reasoning.webp \
    slide-16-querypie-acp-ai-control-platform.webp \
    slide-17-enterprise-access-control-expansion.webp \
    slide-18-enterprise-trust-foundation.webp \
    20260615-openai-founder-day-ai-work-os-sam-kim-querypie-ko.pdf
  do
    shasum -a 256 "$SOURCE/$file"
  done
} | shasum -a 256
```

Verify the source inventory:

```bash
SOURCE=/Users/kelly/w/corp-web-v2/public/documentation/blogs
for file in \
  thumbnail-2.webp thumbnail-3.webp \
  slide-02-enterprise-new-intelligence.webp \
  slide-03-querypie-ai-work-os.webp \
  slide-04-ai-agent-beyond-answer-generation.webp \
  slide-05-aip-acp-fde-enterprise-ai-work-os.webp \
  slide-06-querypie-evolution-to-ai-work-os.webp \
  slide-07-aip-ai-agent-platform.webp \
  slide-08-mcp-gateway-llm-tool-control.webp \
  slide-09-aip-apps-work-automation.webp \
  slide-10-aip-apps-use-cases.webp \
  slide-11-lingo-salesforce-japan.webp \
  slide-12-fde-domain-process-implementation.webp \
  slide-13-fde-ai-agent-use-cases.webp \
  slide-14-ontology-work-meaning-map.webp \
  slide-15-emergency-care-reasoning.webp \
  slide-16-querypie-acp-ai-control-platform.webp \
  slide-17-enterprise-access-control-expansion.webp \
  slide-18-enterprise-trust-foundation.webp \
  20260615-openai-founder-day-ai-work-os-sam-kim-querypie-ko.pdf
do
  test -f "$SOURCE/$file" || exit 1
done
```

Expected: exit 0.

- [ ] **Step 2: Copy source-owned body assets and PDF**

```bash
cd /Users/kelly/w/corp-web-japan-worktrees/260719-global-doc-sync-pilot
mkdir -p public/blog/32
SOURCE=/Users/kelly/w/corp-web-v2/public/documentation/blogs
cp "$SOURCE/thumbnail-3.webp" public/blog/32/
cp "$SOURCE"/slide-{02-enterprise-new-intelligence,03-querypie-ai-work-os,04-ai-agent-beyond-answer-generation,05-aip-acp-fde-enterprise-ai-work-os,06-querypie-evolution-to-ai-work-os,07-aip-ai-agent-platform,08-mcp-gateway-llm-tool-control,09-aip-apps-work-automation,10-aip-apps-use-cases,11-lingo-salesforce-japan,12-fde-domain-process-implementation,13-fde-ai-agent-use-cases,14-ontology-work-meaning-map,15-emergency-care-reasoning,16-querypie-acp-ai-control-platform,17-enterprise-access-control-expansion,18-enterprise-trust-foundation}.webp public/blog/32/
cp "$SOURCE/20260615-openai-founder-day-ai-work-os-sam-kim-querypie-ko.pdf" public/blog/32/
```

Expected: 19 copied files: one opening figure, 17 slide figures, and one PDF.

- [ ] **Step 3: Convert the Global thumbnail to the required PNG**

```bash
sips -s format png \
  /Users/kelly/w/corp-web-v2/public/documentation/blogs/thumbnail-2.webp \
  --out public/blog/32/thumbnail.png
file public/blog/32/thumbnail.png
```

Expected: `public/blog/32/thumbnail.png` is reported as PNG image data.

- [ ] **Step 4: Create the Blog frontmatter**

Start `src/content/blog/32-ai-work-os-enterprise-intelligence.mdx` with:

```mdx
---
id: "32"
slug: "ai-work-os-enterprise-intelligence"
title: "AI Work OS: 新たな知能が企業内で働く方式"
description: "AIが企業内で共に働く新たな知能となった今、企業はAIが理解できるコンテキスト、実際の業務を遂行する実行構造、そしてその実行を安全に統制する運営体系を必要としています。"
date: "2026-06-16"
heroImageSrc: "/blog/32/thumbnail.png"
author: "sam"
relatedIds: []
---
```

- [ ] **Step 5: Convert every source body node in order**

Use `/Users/kelly/w/corp-web-v2/src/content/documentation/blogs/cnt_000211/ja.html` as the only body source and apply these exact rules:

1. Preserve headings, paragraphs, emphasis, ordered/unordered lists, and source order.
2. Remove source `style` and `data-*` attributes.
3. Flatten `<li><p>text</p></li>` to normal Markdown list items.
4. Convert each source figure to:

```mdx
<Box center>
<ArticleFileImage
filepath="public/blog/32/<source-file-name>"
alt="<natural Japanese alt text>"
caption="<source Japanese caption>"
/>
</Box>
```

5. Translate every Korean image `alt` into natural Japanese. No Korean characters may remain.
6. Keep each `figcaption` once through the `caption` prop. Remove only an immediately following paragraph whose normalized text exactly equals that caption.
7. Rewrite the source PDF link to:

```md
[OpenAI Founder Day - AI Work OS (PDF)](/blog/32/20260615-openai-founder-day-ai-work-os-sam-kim-querypie-ko.pdf)
```

8. Replace every remaining `/documentation/blogs/<file>` asset reference with its `public/blog/32/<file>` component path or `/blog/32/<file>` public link.
9. Do not infer related posts because source `relatedIds` is empty.
10. Improve clearly awkward Japanese only when meaning is unchanged; list every such edit in `generation-report.json`.

- [ ] **Step 6: Write the generation report**

Create `/tmp/global-doc-sync-pilot/generation-report.json` with these arrays populated from the complete conversion:

```json
{
  "sourceId": "cnt_000211",
  "targetPath": "src/content/blog/32-ai-work-os-enterprise-intelligence.mdx",
  "headings": [],
  "figures": [],
  "captions": [],
  "links": [],
  "files": [],
  "frontmatter": [],
  "intentionalTransformations": []
}
```

Each figure entry must contain `sourcePath`, `targetPath`, `sourceCaption`, and
`targetAlt`. Each caption entry must contain `sourceCaption`, `targetCaption`,
and whether an identical adjacent paragraph was removed. Each link entry must
contain `sourceHref`, `targetHref`, and `action`. Each file entry must contain
`sourcePath`, `targetPath`, byte sizes, and SHA-256 hashes. Arrays must not
contain placeholder values.

- [ ] **Step 7: Run the focused RED tests again and confirm GREEN**

```bash
node --test \
  tests/blog/migrated-ja-content-count.test.mjs \
  tests/blog/migrated-ja-source-parity.test.mjs
```

Expected: PASS, 2 tests, 0 failures.

- [ ] **Step 8: Inspect the uncommitted generation checkpoint**

```bash
git diff --check
git status --short
```

Expected: only the planned skill, MDX, asset, fixture, and Blog-count changes are
present. Do not commit before both fresh reviews and all Task 4 validation pass.

---

### Task 3: Run Independent Content and Contract Reviews

**Files:**
- Review: `src/content/blog/32-ai-work-os-enterprise-intelligence.mdx`
- Review: `public/blog/32/**`
- Review: `/tmp/global-doc-sync-pilot/candidate.json`
- Review: `/tmp/global-doc-sync-pilot/generation-report.json`
- Runtime artifact: `/tmp/global-doc-sync-pilot/content-review.json`
- Runtime artifact: `/tmp/global-doc-sync-pilot/contract-review.json`

**Interfaces:**
- Consumes: Task 2 uncommitted generation checkpoint and complete conversion artifacts.
- Produces: Two independent machine-readable review reports with no unresolved Critical or Major findings.

- [ ] **Step 1: Dispatch a fresh content-parity reviewer**

The reviewer must compare source `ja.html`, source `meta.json`, target MDX, candidate inventory, and generation report. Require JSON output:

```json
{
  "review": "content-parity",
  "findings": [
    {
      "severity": "minor",
      "location": "target line or source element",
      "message": "specific finding"
    }
  ],
  "verified": {
    "headings": true,
    "figures": true,
    "links": true,
    "facts": true,
    "japaneseNaturalness": true,
    "noKoreanResidue": true
  }
}
```

Save it as `/tmp/global-doc-sync-pilot/content-review.json`.

- [ ] **Step 2: Dispatch a separate fresh repository-contract reviewer**

The reviewer must inspect Blog frontmatter, author resolution, canonical slug, route-aligned assets, PNG hero, local PDF, MDX component usage, fixture alignment, and executable test commands. Save the same finding shape with `"review": "repository-contract"` as `/tmp/global-doc-sync-pilot/contract-review.json`.

- [ ] **Step 3: Fix every valid Critical or Major finding as the sole writer**

After each correction, rerun both reviewers. Do not accept the pilot while
either JSON report contains `critical` or `major`. Keep the reviewed changes
uncommitted until all Task 4 validation passes.

---

### Task 4: Verify the Pilot and Produce the Local Report

**Files:**
- Verify: all files changed since design commit `021ffb656c6b3163de08db4866700e445ee52ee6`
- Runtime artifact: `/tmp/global-doc-sync-pilot/run-summary.json`

**Interfaces:**
- Consumes: Approved review reports and the uncommitted final pilot diff.
- Produces: Reproducible quality evidence for deciding whether to build daily automation.

- [ ] **Step 1: Run deterministic content checks**

```bash
rg -n '[가-힣]' src/content/blog/32-ai-work-os-enterprise-intelligence.mdx && exit 1 || true
rg -n '/documentation/' src/content/blog/32-ai-work-os-enterprise-intelligence.mdx && exit 1 || true
test "$(find public/blog/32 -maxdepth 1 -type f | wc -l | tr -d ' ')" = "20"
file public/blog/32/thumbnail.png | rg 'PNG image data'
```

Expected: no Korean characters, no unresolved `/documentation/` paths, exactly 20 target assets, and a valid PNG thumbnail.

- [ ] **Step 2: Run Blog contract tests**

```bash
node --test \
  tests/blog/list-server-source.test.mjs \
  tests/blog/publication-cache.test.mjs \
  tests/blog/canonical-slug-routing.test.mjs \
  tests/blog/mdx-rendering-architecture.test.mjs
```

Expected: all selected tests pass with 0 failures.

- [ ] **Step 3: Run the complete publication test group**

```bash
npm run test:publications
```

Expected: exit 0 with every publication test passing.

- [ ] **Step 4: Run the production build**

```bash
npm run build
```

Expected: exit 0 and successful static generation for the Blog routes.

- [ ] **Step 5: Inspect and commit the fully reviewed, validated pilot**

```bash
git diff --check
git status --short
git add \
  .agents/skills/blog-posting/SKILL.md \
  src/content/blog/32-ai-work-os-enterprise-intelligence.mdx \
  public/blog/32 \
  tests/blog/migrated-ja-content-count.test.mjs \
  tests/fixtures/blog-migrated-ja-source-parity.json
git commit -m "content: add AI Work OS Japan blog pilot"
if [ -L node_modules ]; then rm node_modules; fi
git diff --check 021ffb656c6b3163de08db4866700e445ee52ee6..HEAD
git diff --stat 021ffb656c6b3163de08db4866700e445ee52ee6..HEAD
git status --short
```

Expected: commit succeeds only after both reviews and all validation pass; no
whitespace errors or unexpected tracked/untracked files remain. The local
`node_modules` symlink is removed before the final status check.

- [ ] **Step 6: Write the run summary**

Write `/tmp/global-doc-sync-pilot/run-summary.json` containing:

```json
{
  "sourceId": "cnt_000211",
  "targetId": "32",
  "status": "passed",
  "pushed": false,
  "pullRequestCreated": false,
  "contentReview": "passed",
  "contractReview": "passed",
  "commands": [],
  "changedFiles": [],
  "intentionalTransformations": [],
  "residualRisks": []
}
```

Set `status` to `failed` unless all previous checks and both reviews passed. Populate every array with actual evidence; do not leave example placeholders.

- [ ] **Step 7: Stop for the quality decision**

Report the local commit, changed files, test/build evidence, reviewer verdicts, runtime, and residual risks. Do not push or create a pull request. Daily automation receives a separate implementation plan only after this pilot is accepted.
