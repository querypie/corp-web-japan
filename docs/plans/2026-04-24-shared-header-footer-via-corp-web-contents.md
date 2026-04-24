# Shared Header/Footer via corp-web-contents

> For Hermes: this PR documents the recommended migration path before implementation. The goal is to move querypie.ai header/GNB/footer data into `corp-web-contents` without breaking the existing `corp-web-app` Japan site.

Goal: make `corp-web-contents` the source of truth for the querypie.ai Japan header, GNB, and footer content while keeping `corp-web-japan` responsible for its own visual implementation.

Architecture: keep presentation in `corp-web-japan`, move navigational/footer data into `corp-web-contents`, and load that data from `corp-web-japan` through a typed adapter. Do not overwrite the existing `layout/ja/header.json` and `layout/ja/footer.json` used by `corp-web-app`; instead, add a site-scoped variant under `layout/querypie-ai/ja/`.

Tech Stack: Next.js App Router, TypeScript, JSON content files, existing `corp-web-contents` JSON schema validation, optional server-side `fetch` caching in `corp-web-japan`.

---

## 1. What is true today

### corp-web-japan

Current querypie.ai navigation/footer content is hardcoded inside the UI components:

- `src/components/layout/site-header.tsx`
  - owns the top-level GNB labels, descriptions, and child links in the local `navItems` array
  - also owns the contact CTA label and href inline
- `src/components/layout/site-footer.tsx`
  - owns footer columns, legal links, social URLs, and address/copyright lines inline

This means querypie.ai header/footer updates currently require component edits.

### corp-web-contents / corp-web-app

`corp-web-contents` already manages structured layout JSON for the Japan website used by `corp-web-app`:

- `layout/ja/header.json`
- `layout/ja/footer.json`

`corp-web-app` already consumes those files centrally:

- `src/app/layout.tsx`
- `src/utils/file/file-query.ts`
- `src/components/layout/header/ui/header.component.tsx`
- `src/components/layout/footer/ui/footer.component.tsx`

Important constraint: the existing `layout/ja/header.json` and `layout/ja/footer.json` are already the live source for `querypie.com/ja`. Replacing them with querypie.ai data would break the current Japan corporate site.

---

## 2. Recommended method

## Summary

Use `corp-web-contents` as the shared content repository, but introduce a querypie.ai-specific layout namespace that lives alongside the existing layout files.

Recommended new source-of-truth files:

- `corp-web-contents/layout/querypie-ai/ja/header.json`
- `corp-web-contents/layout/querypie-ai/ja/footer.json`

Then update `corp-web-japan` to:

1. fetch those JSON files on the server
2. map them into local UI props
3. keep the current `SiteHeader` / `SiteFooter` visual design intact

This is the safest migration because it centralizes the content without forcing immediate design convergence between `corp-web-app` and `corp-web-japan`.

---

## 3. Why this is the safest path

### Why not overwrite `layout/ja/header.json` and `layout/ja/footer.json`?

Because those files are already consumed by `corp-web-app` for `querypie.com/ja`. The IA and presentation requirements are different enough that replacing them would be a risky cross-site change.

### Why not import `corp-web-contents` as a git submodule/subtree/package?

That would couple the repos too tightly and add maintenance cost without solving the runtime ownership problem.

### Why keep presentation in `corp-web-japan`?

Because querypie.ai currently has a custom header/footer implementation:

- bespoke dropdown behavior in `site-header.tsx`
- bespoke footer layout in `site-footer.tsx`
- local logo/icon assets

The request is to share content ownership, not to force both sites onto the same React component tree right away.

### Why place the new files under `layout/querypie-ai/ja/`?

Because:

- they stay inside the existing `layout/` tree
- `corp-web-contents/scripts/upload-files.js` already uploads the entire `layout/` directory recursively
- `corp-web-contents/scripts/validate-json.js` already validates any `header.json` and `footer.json` file anywhere in the repo against the existing schemas
- `corp-web-app` will ignore them because it only reads `layout/{locale}/{file}`

This keeps the migration additive instead of disruptive.

---

## 4. Data contract recommendation

Use the existing `HeaderType` / `FooterType` shapes as much as possible.

Existing validated fields already cover most of querypie.ai needs:

### Header (`HeaderType`)

Already available:

- `menus`
- `rightButton`
- `mobileBottomButtons`
- `promotionBanner`

This is enough to represent:

- top-level GNB groups
- dropdown descriptions
- child navigation items
- right-side CTA
- mobile footer CTA buttons

### Footer (`FooterType`)

Already available:

- `menus`
- `socials`
- `copyright`
- `addresses`
- `anotherMenus`

This is enough to represent the current querypie.ai footer columns and legal area.

### Known gap: querypie.ai-specific presentation hints

The current querypie.ai header has one UI-specific hint that does not exist in `HeaderType` today:

- the `リソース` menu is rendered as a grid in `corp-web-japan`

Recommendation for phase 1:

- do not expand the shared schema yet
- keep this as local presentation logic in `corp-web-japan`
- derive the grid treatment from the adapted view model, for example by local mapping for the resource menu

That keeps the shared JSON focused on content first.

If more view-specific hints accumulate later, add them intentionally through a schema update in `corp-web-app` and `corp-web-contents` together.

---

## 5. Loading strategy in corp-web-japan

Recommended implementation: server-side loader + local adapter.

### Add a loader in `corp-web-japan`

Suggested new file:

- `src/lib/corp-web-contents-layout.ts`

Responsibilities:

- fetch `header.json` and `footer.json` from `corp-web-contents`
- validate the response shape at runtime as defensively as practical
- expose typed data for the app
- cache with `fetch(..., { next: { revalidate: ... } })`

### Add a local adapter layer

Suggested new file:

- `src/lib/corp-web-contents-layout-adapter.ts`

Responsibilities:

- map shared `HeaderType` data into the `NavItem[]` shape currently used by `site-header.tsx`
- map shared `FooterType` data into the column/link structures currently used by `site-footer.tsx`
- keep local asset concerns in `corp-web-japan` (logo, icon paths, any CSS-only behavior)

### Minimal component edits

Modify:

- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`

Change them from “hardcoded content + UI” to “UI + adapted content props”.

Do not redesign the components in the first migration.

---

## 6. Source URL recommendation

There are two viable transport choices.

### Option A — raw GitHub fetch (recommended first)

Read directly from the `corp-web-contents` repository at a configurable ref.

Example shape:

- `https://raw.githubusercontent.com/querypie/corp-web-contents/<ref>/layout/querypie-ai/ja/header.json`
- `https://raw.githubusercontent.com/querypie/corp-web-contents/<ref>/layout/querypie-ai/ja/footer.json`

Pros:

- no new secret required in `corp-web-japan`
- very small implementation surface
- easy to review and debug
- supports preview/staging by changing `<ref>`

Suggested env var:

- `CORP_WEB_CONTENTS_REF`
  - production default: `main`
  - preview override: matching content branch when needed

### Option B — Vercel Blob fetch (good phase-2 upgrade)

Read the same files from the existing Blob upload pipeline used by `corp-web-app`.

Pros:

- closer to the existing `corp-web-app` content runtime model
- better alignment with already-published content artifacts

Cons:

- requires either a small listing/fetch client in `corp-web-japan` or new operational setup
- more moving parts than raw GitHub for the initial migration

Recommendation:

- phase 1: raw GitHub fetch
- phase 2: switch transport to Blob only if operationally needed

The data path should stay the same either way:

- `layout/querypie-ai/ja/header.json`
- `layout/querypie-ai/ja/footer.json`

---

## 7. Concrete implementation plan

### Task 1: Add querypie.ai layout files to corp-web-contents

Objective: create the new source-of-truth JSON without touching the existing Japan site layout files.

Files:
- Create: `corp-web-contents/layout/querypie-ai/ja/header.json`
- Create: `corp-web-contents/layout/querypie-ai/ja/footer.json`

Rules:
- keep to the existing `HeaderType` / `FooterType` schema
- copy the current querypie.ai labels, hrefs, descriptions, socials, legal links, and addresses
- do not modify `layout/ja/header.json`
- do not modify `layout/ja/footer.json`

### Task 2: Add typed loader in corp-web-japan

Objective: load shared layout JSON from `corp-web-contents`.

Files:
- Create: `src/lib/corp-web-contents-layout.ts`

Responsibilities:
- build URL from `CORP_WEB_CONTENTS_REF`
- fetch both files server-side
- handle network failure cleanly
- return a fallback or fail fast in a predictable way

### Task 3: Add adapter from shared schema to local UI props

Objective: preserve current querypie.ai UI while removing hardcoded content.

Files:
- Create: `src/lib/corp-web-contents-layout-adapter.ts`

Responsibilities:
- map `HeaderType` -> local `NavItem[]`
- map `FooterType` -> local footer column/link structures
- keep any querypie.ai-only rendering hints local

### Task 4: Thread data into pages/layout

Objective: fetch once on the server and pass data into header/footer.

Likely files:
- Modify: `src/app/page.tsx`
- Modify: `src/app/solutions/ai-crew/page.tsx`
- Modify: `src/app/solutions/ai-dashi/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/whitepapers/page.tsx`
- Modify: `src/app/events/page.tsx`
- Modify: `src/app/posts/[category]/[slug]/page.tsx`
- and any other route currently rendering `<SiteHeader />` / `<SiteFooter />`

Preferred cleanup if desired:
- optionally introduce a shared page shell so routes stop repeating header/footer wiring

### Task 5: Convert components to prop-driven rendering

Files:
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/components/layout/site-footer.tsx`

Rules:
- keep markup/CSS behavior intact unless strictly needed
- remove inline arrays once shared props are wired
- keep local asset imports local

### Task 6: Verify with existing repo checks

Run in `corp-web-japan`:

```bash
npm run test:ci
npm run build
```

Relevant existing tests likely touched by this migration:
- `tests/footer-addresses.test.mjs`
- `tests/footer-legal-links.test.mjs`
- `tests/home-structure.test.mjs`
- `tests/link-and-metadata-integrity.test.mjs`

Also validate `corp-web-contents`:

```bash
npm run validateJson
```

---

## 8. Non-goals for the first PR

Do not do these in the initial migration PR unless explicitly requested:

- redesign the querypie.ai header/footer visuals
- force `corp-web-japan` to reuse `corp-web-app` React components
- merge querypie.ai navigation IA into the existing `querypie.com/ja` header/footer files
- introduce a new schema unless the current shapes prove insufficient
- move logo/icon binary assets into `corp-web-contents`

---

## 9. Expected end state

After implementation:

- content editors update querypie.ai header/footer data in `corp-web-contents`
- `corp-web-japan` stops hardcoding navigation/footer copy and links
- `corp-web-japan` keeps its own design system and interaction behavior
- `corp-web-app` keeps using its existing Japan header/footer source untouched
- future convergence remains possible because both sites now depend on structured layout JSON instead of inline arrays

---

## 10. Decision

Recommended decision: proceed with an additive, site-scoped migration.

- Shared content source: `corp-web-contents`
- New path: `layout/querypie-ai/ja/header.json` and `layout/querypie-ai/ja/footer.json`
- `corp-web-japan` role: renderer + adapter
- Initial transport: raw GitHub fetch with cache
- Future optional upgrade: switch transport to Blob without changing the file contract
