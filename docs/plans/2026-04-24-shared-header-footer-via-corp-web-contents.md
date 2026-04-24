# JSON-only Header/Footer Link Alignment Plan

Goal: derive the smallest implementation that aligns the old `corp-web-app` / `corp-web-contents` Japan header and footer links with the current querypie.ai site, without building any live synchronization.

Architecture: leave `corp-web-japan` unchanged, and update only `corp-web-contents/layout/ja/header.json` and `corp-web-contents/layout/ja/footer.json`. Use querypie.ai as the reference source. Where the old site does not have equivalent local routes, use absolute `https://querypie.ai/...` URLs directly in the JSON.

Tech Stack: existing `HeaderType` / `FooterType` JSON, `corp-web-app` header/footer components, and `corp-web-contents` JSON schema validation.

---

## 1. Re-analysis result

### What `corp-web-japan` currently owns

querypie.ai still hardcodes its header/footer links in:

- `corp-web-japan/src/components/layout/site-header.tsx`
- `corp-web-japan/src/components/layout/site-footer.tsx`

So:
- changing `corp-web-contents` JSON will not change querypie.ai itself
- changing `corp-web-contents` JSON can still make the old `corp-web-app` site point to the same destinations as querypie.ai

That matches the updated requirement: one-time alignment only.

### What `corp-web-app` already supports through JSON

`corp-web-app` already reads these files:

- `corp-web-contents/layout/ja/header.json`
- `corp-web-contents/layout/ja/footer.json`

and renders them through:

- `src/app/layout.tsx`
- `src/components/layout/header/ui/header.component.tsx`
- `src/components/layout/footer/ui/footer.component.tsx`

Important capability confirmed from the code:

1. Header JSON is flexible enough for the querypie.ai IA
   - arbitrary top-level `menus`
   - per-menu `description`
   - optional `relatedArticle` and `button`
   - `rightButton`
   - `mobileBottomButtons`

2. Footer JSON is flexible enough for the querypie.ai footer
   - arbitrary menu columns
   - arbitrary social links
   - legal links through `anotherMenus`
   - address/copyright lines

3. Absolute URLs are already supported
   - `useUpdatedHref` leaves cross-origin URLs unchanged
   - `Link` only opens a new tab when `external: true`

This means JSON-only alignment is technically viable.

---

## 2. Key finding: use absolute querypie.ai URLs, not old local routes

A careful route comparison shows that many querypie.ai header/footer destinations do not exist as local `corp-web-app` routes.

Examples that do not exist locally in `corp-web-contents/pages`:

- `/services/aip`
- `/services/acp`
- `/services/fde`
- `/solutions/ai-crew`
- `/solutions/ai-dashi`
- `/demo/use-cases`
- `/demo/aip`
- `/introduction-deck`
- `/manuals`
- `/whitepapers`
- `/about-us`
- `/certifications`
- `/news`
- `/contact-us`

Some old-site routes do have local equivalents or redirects, but they do not faithfully match querypie.ai’s current IA.

Therefore the best implementation is:

- for navigation items that are querypie.ai-specific, use absolute `https://querypie.ai/...` URLs directly in the JSON
- do not try to force-fit everything into old local `corp-web-app` routes like `/features/demo` or `/company/about-us`

This gives the cleanest one-time alignment and avoids misleading users with outdated local destinations.

---

## 3. Recommended JSON behavior

### Use same-tab absolute URLs

For querypie.ai links, prefer:

- `"href": "https://querypie.ai/..."`
- omit `external`, or keep `external: false`

Reason:
- same-tab navigation matches normal site-header behavior better
- setting `external: true` would open a new tab and show external-link affordances in the old header UI
- that would not match the current querypie.ai UX

### Keep legal links local

For these links, keep the existing local paths in `corp-web-contents`:

- `/cookie-preference`
- `/terms-of-service`
- `/privacy-policy`
- `/eula`

Reason:
- these routes already exist or redirect correctly in the old site
- querypie.ai also uses the same user-facing path family
- there is no benefit in forcing these to absolute querypie.ai URLs for a temporary site

### Keep social links identical

These can simply use the same external social URLs already used by querypie.ai:

- LinkedIn
- YouTube
- X
- Facebook
- Instagram

---

## 4. Recommended implementation shape

## Header

Replace the current `layout/ja/header.json` navigation structure with the querypie.ai structure.

Recommended top-level groups:

1. `サービス`
   - `https://querypie.ai/services/aip`
   - `https://querypie.ai/services/acp`
   - `https://querypie.ai/services/fde`

2. `ソリューション`
   - `https://querypie.ai/solutions/ai-crew`
   - `https://querypie.ai/solutions/ai-dashi`

3. `デモ`
   - `https://querypie.ai/demo/use-cases`
   - `https://querypie.ai/demo/aip`
   - `https://querypie.ai/demo/acp`

4. `リソース`
   - `https://querypie.ai/resources`
   - `https://querypie.ai/introduction-deck`
   - `https://querypie.ai/glossary`
   - `https://querypie.ai/manuals`
   - `https://querypie.ai/whitepapers`
   - `https://querypie.ai/blog`

5. `会社情報`
   - `https://querypie.ai/about-us`
   - `https://querypie.ai/certifications`
   - `https://querypie.ai/news`
   - `https://querypie.ai/contact-us`

Recommended additional header changes:
- remove the current `プラン` top-level item
- change `rightButton` to `お問い合わせ -> https://querypie.ai/contact-us`
- change `mobileBottomButtons` to a single `お問い合わせ` button pointing to `https://querypie.ai/contact-us`
- remove stale `relatedArticle` cards instead of trying to maintain old corp-site article promos

Why removing `relatedArticle` is recommended:
- querypie.ai’s current header does not use those old corp-site promo cards
- leaving them in place would preserve stale destinations unrelated to the new navigation goal

## Footer

Replace the current footer columns with the querypie.ai footer grouping.

Recommended columns:

1. `サービス`
   - `https://querypie.ai/services/aip`
   - `https://querypie.ai/services/acp`
   - `https://querypie.ai/services/fde`

2. `ソリューション`
   - `https://querypie.ai/solutions/ai-crew`
   - `https://querypie.ai/solutions/ai-dashi`

3. `デモ`
   - `https://querypie.ai/demo/use-cases`
   - `https://querypie.ai/demo/aip`
   - `https://querypie.ai/demo/acp`

4. `リソース`
   - `https://querypie.ai/resources`
   - `https://querypie.ai/introduction-deck`
   - `https://querypie.ai/glossary`
   - `https://querypie.ai/manuals`
   - `https://querypie.ai/whitepapers`
   - `https://querypie.ai/blog`

5. `会社情報`
   - `https://querypie.ai/about-us`
   - `https://querypie.ai/certifications`
   - `https://querypie.ai/news`
   - `https://querypie.ai/contact-us`

Recommended footer non-column changes:
- update `socials` to the exact querypie.ai social URLs
- keep `anotherMenus` local for legal links
- update `copyright` and `addresses` only if the one-time alignment should include footer text as well

If the request is truly “links only”, then:
- change menu links
- change social links if needed
- leave copyright/address text untouched

---

## 5. Why this is better than the earlier alternatives

### Better than live synchronization

Because:
- `corp-web-app` and `corp-web-contents` are temporary ahead of `corp-web-v2`
- no loader, adapter, or cross-repo fetch logic is needed
- the change stays reviewable and reversible

### Better than mapping everything to old local corp-web-app pages

Because:
- many querypie.ai destinations have no faithful local equivalent
- forcing them into old local paths would preserve outdated IA
- absolute querypie.ai URLs are a more honest alignment of actual destinations

### Better than creating a new JSON namespace

Because:
- the request is one-time link alignment, not long-term dual-site content architecture
- editing the existing `layout/ja/header.json` and `footer.json` is the smallest implementation

---

## 6. Smallest implementation PR

If proceeding with implementation, the smallest correct PR is in `corp-web-contents` only.

Files:
- `layout/ja/header.json`
- `layout/ja/footer.json`

Verification:

```bash
npm run validateJson
```

Optional follow-up verification:
- preview the old Japan site once and click the updated header/footer links
- confirm they go to querypie.ai destinations in the same tab

---

## 7. Final recommendation

Recommended implementation:

1. do not touch `corp-web-japan`
2. edit only `corp-web-contents/layout/ja/header.json`
3. edit only `corp-web-contents/layout/ja/footer.json`
4. use absolute `https://querypie.ai/...` URLs for the querypie.ai navigation destinations
5. keep legal links local
6. remove stale `relatedArticle` references from the header JSON

This is the smallest approach that is both technically correct and aligned with the deprecation context.