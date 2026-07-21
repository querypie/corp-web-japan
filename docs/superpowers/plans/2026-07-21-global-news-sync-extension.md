# Global News Sync Extension Implementation Plan

> Historical implementation plan. The canonical accepted contract now lives in
> `openspec/specs/contract-global-documentation-sync/spec.md`. Composite
> identity follow-up maintenance, rollout hold, and legacy-compatibility
> clarifications now live in
> `openspec/changes/composite-global-publication-sync-identity/`.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the production Global-to-Japan publication sync to ingest the separate Global `/en/news` collection and generate validated Japan `/news/:id/:slug` Draft PRs.

**Architecture:** Introduce `source-family-map.mjs` as the single source of truth for every Documentation category and the separate News section. Existing discovery, preparation, baseline, validation, browser, and documentation code consumes descriptors instead of duplicating switches. News keeps the existing one-candidate, no-tools Pi, full-validation, Draft-only safety boundary.

**Tech Stack:** Node.js ESM, Node test runner, Git/GitHub CLI, Next.js 16, MDX, Playwright, systemd.

## Global Constraints

See the active OpenSpec contract plus
`openspec/changes/composite-global-publication-sync-identity/` for the current
canonical identity, suppression, and rollout constraints. The remainder of this
plan is retained as historical implementation sequencing evidence.

---

## File structure

- Create `scripts/global-documentation-sync/source-family-map.mjs`: source section/category descriptors and shared lookup functions.
- Modify `scripts/global-documentation-sync/lib.mjs`: delegate category-to-target mapping to the descriptor map.
- Modify `scripts/global-documentation-sync/discovery.mjs`: enumerate descriptor roots and apply section-specific production-list evidence.
- Modify `scripts/global-documentation-sync/live-discovery.mjs`: fetch sitemap, Documentation list, and News list once.
- Modify `scripts/global-documentation-sync/cli.mjs`: locate flat News sources, generate section-neutral evidence, and resolve News output fields.
- Modify `scripts/global-documentation-sync/generate-baseline.mjs`: enumerate all descriptor roots, including flat News.
- Modify `scripts/global-documentation-sync/pi-runner.mjs`: give the writer/reviewers resolved News fields, never inferred mappings.
- Modify `scripts/global-documentation-sync/generated-validation.mjs`: enforce News author/sourceLabel/redirect/related-ID contracts.
- Modify `scripts/global-documentation-sync/browser-qa.mjs`: render redirect-backed News locally with a bot user agent.
- Modify `.github/content-sync/baseline.json`: add reviewed existing Global-to-Japan News identities.
- Modify tests under `tests/global-documentation-sync/**`: preserve Documentation behavior and cover News end to end.
- Modify `scripts/global-documentation-sync/README.md`, `ops/global-documentation-sync/README.md`, `openspec/specs/contract-global-documentation-sync/spec.md`, and `.agents/skills/global-documentation-sync/**`: publish the final support map and operational contract.

---

### Task 1: Source-family map SSOT

**Files:**
- Create: `scripts/global-documentation-sync/source-family-map.mjs`
- Modify: `scripts/global-documentation-sync/lib.mjs`
- Modify: `tests/global-documentation-sync/core.test.mjs`

**Interfaces:**
- Produces: `SOURCE_FAMILIES`, `sourceFamily(category)`, `sourceRoots(globalRepo)`, `targetFamily(category)`, `canonicalContentUrl(category, slug)`.
- Descriptor shape: `{ sourceSection, sourceCategory, relativeRoot, productionListUrl, canonicalSegment, targetFamily, targetRouteRoot, storageLayout }`.

- [ ] **Step 1: Write the failing map test**

Add assertions that enumerate the exact accepted map and prohibit duplicate category/target ownership:

```js
import { SOURCE_FAMILIES, canonicalContentUrl, sourceFamily, targetFamily } from "../../scripts/global-documentation-sync/source-family-map.mjs";

test("source-family map owns Documentation categories and separate News section", () => {
  assert.deepEqual(SOURCE_FAMILIES.map(({ sourceCategory, sourceSection, targetFamily }) => ({ sourceCategory, sourceSection, targetFamily })), [
    { sourceCategory: "blogs", sourceSection: "documentation", targetFamily: "blog" },
    { sourceCategory: "white-papers", sourceSection: "documentation", targetFamily: "whitepapers" },
    { sourceCategory: "voc", sourceSection: "documentation", targetFamily: "use-cases" },
    { sourceCategory: "manuals", sourceSection: "documentation", targetFamily: "manuals" },
    { sourceCategory: "events", sourceSection: "documentation", targetFamily: "events" },
    { sourceCategory: "glossary", sourceSection: "documentation", targetFamily: "glossary" },
    { sourceCategory: "introduction", sourceSection: "documentation", targetFamily: "introduction-deck" },
    { sourceCategory: "news", sourceSection: "news", targetFamily: "news" },
  ]);
  assert.equal(sourceFamily("news").relativeRoot, "src/content/news");
  assert.equal(targetFamily("news"), "news");
  assert.equal(canonicalContentUrl("news", "example"), "https://www.querypie.com/en/news/example");
});
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/global-documentation-sync/core.test.mjs`

Expected: FAIL because `source-family-map.mjs` does not exist.

- [ ] **Step 3: Implement the map and delegate `mapCategory()`**

Create an immutable ordered descriptor array. Documentation roots use `src/content/documentation/<category>` and `storageLayout: "category"`; News uses `src/content/news` and `storageLayout: "flat"`. Export strict lookup functions that throw on unknown categories. Replace `lib.mjs`'s private `CATEGORY_MAP` with `targetFamily(category)`.

- [ ] **Step 4: Run GREEN**

Run: `node --test tests/global-documentation-sync/core.test.mjs`

Expected: PASS, including every pre-existing mapping assertion.

- [ ] **Step 5: Commit**

```bash
git add scripts/global-documentation-sync/source-family-map.mjs scripts/global-documentation-sync/lib.mjs tests/global-documentation-sync/core.test.mjs
git commit -m "refactor: centralize sync source family map"
```

---

### Task 2: Multi-section discovery and production evidence

**Files:**
- Modify: `scripts/global-documentation-sync/discovery.mjs`
- Modify: `scripts/global-documentation-sync/live-discovery.mjs`
- Modify: `tests/global-documentation-sync/discovery.test.mjs`

**Interfaces:**
- Consumes: `SOURCE_FAMILIES`, `sourceFamily()`, `canonicalContentUrl()`.
- Changes `discoverNextCandidate()` input from one `documentationListHtml` string to `productionListHtmlByUrl`, a map keyed by descriptor `productionListUrl`.
- Produces candidate source evidence `{ canonicalUrl, listed, listUrl, sitemap }` and `sourceSection`.

- [ ] **Step 1: Write failing News discovery tests**

Cover these cases with temporary Global/Japan fixtures:

```js
test("selects listed and sitemapped News content from the flat News root", async () => {
  const result = await discoverNextCandidate({
    globalRepo, targetRepo,
    sitemapXml: "<loc>https://www.querypie.com/en/news/news-one</loc>",
    productionListHtmlByUrl: { "https://www.querypie.com/en/news": '<a href="/en/news/news-one">News</a>', "https://www.querypie.com/en/documentation": "" },
  });
  assert.equal(result.source.sourceSection, "news");
  assert.equal(result.source.targetFamily, "news");
  assert.deepEqual(result.source.production, { canonicalUrl: "https://www.querypie.com/en/news/news-one", listed: true, listUrl: "https://www.querypie.com/en/news", sitemap: true });
});

test("selects a listed HTTPS News external destination without sitemap detail evidence", async () => {
  // meta.contentType = "outlink", externalUrl = "https://media.example/news-one"
  // /en/news contains that exact URL; sitemap is empty.
  assert.equal(result.source.production.sitemap, false);
});
```

Also retain a Documentation fixture proving `/en/documentation` plus sitemap behavior is unchanged. Add negative tests for missing News list evidence, missing News content sitemap evidence, unsafe source slug, and non-HTTPS external URL.

- [ ] **Step 2: Run RED**

Run: `node --test tests/global-documentation-sync/discovery.test.mjs`

Expected: FAIL because discovery only scans `src/content/documentation` and accepts one list HTML string.

- [ ] **Step 3: Implement descriptor-driven enumeration**

Replace the hard-coded Documentation root loop with descriptor-root enumeration. A flat descriptor iterates `<root>/cnt_*`; a category descriptor behaves exactly as today. Parse each fetched list into a URL set keyed by normalized absolute list URL. For invalid published source contracts, return a deterministic `blocked_source_contract` containing `sourceId` and reason instead of selecting a candidate that fails later.

Update `discoverLive()` to fetch exactly:

```js
const listUrls = [...new Set(SOURCE_FAMILIES.map(({ productionListUrl }) => productionListUrl))];
const [sitemapXml, ...listBodies] = await Promise.all([
  fetchText("https://www.querypie.com/sitemap.xml"),
  ...listUrls.map((url) => fetchText(url)),
]);
```

- [ ] **Step 4: Run GREEN and regression tests**

Run:

```bash
node --test tests/global-documentation-sync/discovery.test.mjs
node --test tests/global-documentation-sync/github-state.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/global-documentation-sync/discovery.mjs scripts/global-documentation-sync/live-discovery.mjs tests/global-documentation-sync/discovery.test.mjs
git commit -m "feat: discover Global News sources"
```

---

### Task 3: News preparation and section-neutral candidate evidence

**Files:**
- Modify: `scripts/global-documentation-sync/cli.mjs`
- Modify: `scripts/global-documentation-sync/lib.mjs`
- Modify: `tests/global-documentation-sync/prepare.test.mjs`
- Modify: `tests/global-documentation-sync/core.test.mjs`

**Interfaces:**
- Consumes source descriptor and discovery evidence.
- Produces candidate fields `sourceSection`, `resolvedSourceLabel`, `resolvedRedirectUrl`, and section-neutral production evidence.

- [ ] **Step 1: Write failing preparation tests**

Add one `content` and one `outlink` News fixture under `src/content/news/cnt_*`:

```js
assert.equal(contentCandidate.sourceSection, "news");
assert.equal(contentCandidate.targetFamily, "news");
assert.equal(contentCandidate.resolvedSourceLabel, "公式発表");
assert.equal(contentCandidate.resolvedRedirectUrl, null);
assert.match(contentCandidate.targetMdxPath, /src\/content\/news\/19-news-one\.mdx$/);
assert.equal(outlinkCandidate.resolvedSourceLabel, "メディア掲載");
assert.equal(outlinkCandidate.resolvedRedirectUrl, "https://media.example/news-one");
assert.equal(outlinkCandidate.resolvedAuthor, null);
```

Assert production evidence requires `listed === true`, exact `listUrl`, and `sitemap === true` only for content.

- [ ] **Step 2: Run RED**

Run: `node --test tests/global-documentation-sync/prepare.test.mjs`

Expected: FAIL with `source not found` because `findSource()` only scans Documentation.

- [ ] **Step 3: Implement descriptor-driven source location and resolved News fields**

Make `findSource()` consume `sourceRoots(globalRepo)` and return `{ descriptor, directory, meta }`. Replace `canonicalUrl()` and `verifyProduction()` switches with descriptor helpers. Set News fields deterministically before Pi runs:

```js
const resolvedSourceLabel = family === "news" ? (meta.contentType === "outlink" ? "メディア掲載" : "公式発表") : null;
const resolvedRedirectUrl = family === "news" && meta.contentType === "outlink" ? normalizeUrl(meta.externalUrl) : null;
```

Update candidate artifact validation to require `sourceSection` and the resolved fields for News.

- [ ] **Step 4: Run GREEN**

Run:

```bash
node --test tests/global-documentation-sync/prepare.test.mjs
node --test tests/global-documentation-sync/core.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/global-documentation-sync/cli.mjs scripts/global-documentation-sync/lib.mjs tests/global-documentation-sync/prepare.test.mjs tests/global-documentation-sync/core.test.mjs
git commit -m "feat: prepare Japan News candidates"
```

---

### Task 4: News-aware baseline generation

**Files:**
- Modify: `scripts/global-documentation-sync/generate-baseline.mjs`
- Modify: `tests/global-documentation-sync/baseline.test.mjs`
- Modify: `.github/content-sync/baseline.json`

**Interfaces:**
- Consumes `SOURCE_FAMILIES` and target records by descriptor target family.
- Produces sorted baseline records with `sourceCategory: "news"` and `targetFamily: "news"`.

- [ ] **Step 1: Write failing baseline tests**

Create temporary flat Global News records and Japan News MDX records. Assert matching order:

```js
assert.deepEqual(newsRecords, [
  { sourceId: "cnt_000200", sourceCategory: "news", sourceSlug: "iso-42001-certification-announcement", targetFamily: "news", targetId: 16, targetSlug: "iso-42001-certification-announcement" },
]);
```

Add separate fixtures for exact external URL match and ambiguous title match. Ambiguity must be reported, never guessed.

- [ ] **Step 2: Run RED**

Run: `node --test tests/global-documentation-sync/baseline.test.mjs`

Expected: FAIL because the generator only scans Documentation category roots.

- [ ] **Step 3: Implement descriptor enumeration**

Extract `sourceRecords(globalRepo, descriptor)` that handles category and flat roots. Keep deterministic matching order: external destination, slug, unique Japanese title, visible target preference. Preserve source-ID sort and duplicate target validation.

- [ ] **Step 4: Regenerate and review the real baseline**

Run:

```bash
node scripts/global-documentation-sync/generate-baseline.mjs \
  --global-repo /Users/kelly/w/corp-web-v2 \
  --target-repo "$PWD" \
  --output /tmp/global-documentation-sync-baseline.json
diff -u .github/content-sync/baseline.json /tmp/global-documentation-sync-baseline.json
```

Expected: existing Documentation records remain unchanged; News adds only uniquely proven mappings. Review every News mapping against source slug, normalized external destination, or exact title. Copy the reviewed file to `.github/content-sync/baseline.json`.

- [ ] **Step 5: Run GREEN**

Run: `node --test tests/global-documentation-sync/baseline.test.mjs`

Expected: PASS with sorted, unique, existing target identities.

- [ ] **Step 6: Commit**

```bash
git add scripts/global-documentation-sync/generate-baseline.mjs tests/global-documentation-sync/baseline.test.mjs .github/content-sync/baseline.json
git commit -m "feat: baseline existing Global News records"
```

---

### Task 5: News generation, contract validation, and browser QA

**Files:**
- Modify: `scripts/global-documentation-sync/pi-runner.mjs`
- Modify: `scripts/global-documentation-sync/generated-validation.mjs`
- Modify: `scripts/global-documentation-sync/browser-qa.mjs`
- Modify: `tests/global-documentation-sync/pi-runner.test.mjs`
- Modify: `tests/global-documentation-sync/generated-validation.test.mjs`
- Modify: `tests/global-documentation-sync/browser-qa.test.mjs`

**Interfaces:**
- Consumes `candidate.resolvedSourceLabel` and `candidate.resolvedRedirectUrl`.
- Produces News MDX that exactly follows `news-posting` and deterministic candidate fields.

- [ ] **Step 1: Write failing writer/validator tests**

Assert writer prompt requirements include:

```js
assert.match(writer.prompt, /News.*must not contain author/);
assert.match(writer.prompt, /resolvedSourceLabel/);
assert.match(writer.prompt, /resolvedRedirectUrl/);
```

Add generated validation fixtures that pass only with:

```yaml
sourceLabel: "公式発表"
```

for content and:

```yaml
sourceLabel: "メディア掲載"
redirectUrl: "https://media.example/news-one"
```

for outlinks. Assert News with `author`, incorrect source label, missing/wrong redirect, or unresolved related IDs fails.

- [ ] **Step 2: Write failing redirect-backed browser test**

Expose a helper that returns browser context options. Assert a redirect-backed News candidate uses the configured bot user agent, while normal publications retain the default context.

- [ ] **Step 3: Run RED**

Run:

```bash
node --test tests/global-documentation-sync/pi-runner.test.mjs
node --test tests/global-documentation-sync/generated-validation.test.mjs
node --test tests/global-documentation-sync/browser-qa.test.mjs
```

Expected: FAIL because resolved News contracts are not enforced and browser QA follows the external redirect.

- [ ] **Step 4: Implement minimal News rules**

Pass resolved values in prompt data and add explicit writer/contract scope. Parse frontmatter list/scalar fields in generated validation and compare to candidate evidence. Launch redirect-backed News QA with a stable bot user agent so the local shadow page renders; keep deterministic HTTPS/identity validation for `redirectUrl` and do not fetch arbitrary external destinations as a blocking browser gate.

- [ ] **Step 5: Run GREEN**

Run all three focused test files. Expected: PASS.

- [ ] **Step 6: Run existing News publication tests**

Run:

```bash
node --test tests/news/*.test.mjs
node --test tests/news-seo-and-sitemap.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/global-documentation-sync/pi-runner.mjs scripts/global-documentation-sync/generated-validation.mjs scripts/global-documentation-sync/browser-qa.mjs tests/global-documentation-sync/pi-runner.test.mjs tests/global-documentation-sync/generated-validation.test.mjs tests/global-documentation-sync/browser-qa.test.mjs
git commit -m "feat: validate generated News publications"
```

---

### Task 6: Accepted contract and support-map documentation

**Files:**
- Modify: `scripts/global-documentation-sync/README.md`
- Modify: `ops/global-documentation-sync/README.md`
- Modify: `openspec/specs/contract-global-documentation-sync/spec.md`
- Modify: `.agents/skills/global-documentation-sync/SKILL.md`
- Modify: `.agents/skills/global-documentation-sync/references/artifacts.md`
- Test: `tests/global-documentation-sync/skills-runtime.test.mjs`

**Interfaces:**
- Documents the exact map exported by `source-family-map.mjs`.

- [ ] **Step 1: Add a failing documentation-contract test**

Read `source-family-map.mjs`, script README, OpenSpec, and orchestration skill. Assert every descriptor's source section, category, production list, target family, and target route appears in the support matrix, including a distinct News row.

- [ ] **Step 2: Run RED**

Run: `node --test tests/global-documentation-sync/skills-runtime.test.mjs`

Expected: FAIL because current docs describe only Global Documentation.

- [ ] **Step 3: Update docs from the exact accepted map**

Add a “Supported source families” table to the script README. State that News is a separate `/en/news` source section, not a Documentation category. Document content/outlink evidence, one-way behavior, author prohibition, source labels, redirects, and unchanged scheduler/alerts/retention. Update OpenSpec Requirements and Scenarios rather than leaving behavior only in the design document.

- [ ] **Step 4: Run GREEN and doc checks**

Run:

```bash
node --test tests/global-documentation-sync/skills-runtime.test.mjs
git diff --check
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/global-documentation-sync/README.md ops/global-documentation-sync/README.md openspec/specs/contract-global-documentation-sync/spec.md .agents/skills/global-documentation-sync/SKILL.md .agents/skills/global-documentation-sync/references/artifacts.md tests/global-documentation-sync/skills-runtime.test.mjs
git commit -m "docs: document Global News sync support"
```

---

### Task 7: Full regression and staged production rollout

**Files:**
- Modify only if evidence finds a defect: files already listed above.
- Artifacts: `/var/lib/global-documentation-sync/reports/<run-id>/` on the production host.

**Interfaces:**
- Consumes the merged implementation and reviewed baseline.
- Produces production evidence: no-mutation dry run, one real Draft PR, Slack notification, terminal run status.

- [ ] **Step 1: Run the complete local suite**

```bash
node --test tests/global-documentation-sync/*.test.mjs
npm run test:ci
npm run build
```

Expected: all pass. Run LSP diagnostics on every changed `.mjs` file; production modules must be clean.

- [ ] **Step 2: Review the first News discovery result without remote mutation**

Deploy to the production host with `GLOBAL_DOC_SYNC_DRY_RUN=1`, run the service manually, and inspect:

```bash
latest=$(find /var/lib/global-documentation-sync/reports -mindepth 1 -maxdepth 1 -type d | sort | tail -1)
sudo jq . "$latest/run-status.json"
sudo jq . "$latest/candidate.json"
sudo jq . "$latest/run-summary.json"
```

Expected: candidate `sourceSection: "news"`, target family `news`, exact `/en/news` evidence, no commit, no push, no PR.

- [ ] **Step 3: Verify generated News in a browser**

Inspect desktop and mobile screenshots plus browser results. For an outlink, confirm browser QA stayed on the local bot-visible shadow page and deterministic validation recorded the exact redirect URL.

- [ ] **Step 4: Run one manual production execution**

Set `GLOBAL_DOC_SYNC_DRY_RUN=0`, start the service manually, and verify:

- service result success
- `run-status.json` is `complete/passed`
- `run-summary.json` is `draft_pr_created`
- exactly one `content-sync/<sourceSection>-<sourceId>` branch exists for the chosen composite identity
- exactly one Draft PR exists
- Slack notification contains source ID and PR URL
- no merge or deployment occurred

- [ ] **Step 5: Confirm timer and cleanup remain healthy**

```bash
systemctl is-enabled global-documentation-sync.timer
systemctl is-active global-documentation-sync.timer
systemctl list-timers global-documentation-sync.timer
systemctl is-active systemd-tmpfiles-clean.timer
```

Expected: daily 10:00 KST timer active with at most ten minutes randomized delay; report cleanup timer active.

- [ ] **Step 6: Commit any evidence-driven correction separately**

If rollout exposes a defect, add one failing regression test, apply one root-cause fix, rerun Steps 1-5, and commit only that fix. Do not patch the production host without codifying the change in the repository.

---

## Self-review result

- Spec coverage: source map, `/en/news`, flat storage, content/outlink evidence, candidate schema, baseline, News MDX, validation, browser QA, docs, and rollout are each assigned to a task.
- Placeholder scan: no unresolved placeholder markers.
- Interface consistency: all tasks use `source-family-map.mjs`, `sourceSection`, `productionListHtmlByUrl`, `resolvedSourceLabel`, and `resolvedRedirectUrl` consistently.
- Scope: Demo and reverse sync remain excluded.
