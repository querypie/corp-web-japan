# One-time Header/Footer Link Alignment

Goal: align the header and footer links in `corp-web-contents` to match the current querypie.ai site once, without building any ongoing synchronization between repositories.

Architecture: use `corp-web-japan` as the reference, then manually copy the desired link destinations into `corp-web-contents/layout/ja/header.json` and `corp-web-contents/layout/ja/footer.json`. Do not change `corp-web-japan` runtime loading. Do not add adapters, fetchers, or shared live data plumbing.

Tech Stack: JSON layout files already used by `corp-web-app`, existing schema validation in `corp-web-contents`.

---

## Conclusion

Given the updated requirement, the simplest approach is:

1. leave `corp-web-japan` unchanged
2. treat `corp-web-japan` header/footer links as the source reference
3. update only `corp-web-contents` JSON once so its links match the querypie.ai information architecture as closely as needed

This is the best fit because:

- `corp-web-japan` header/footer are currently hardcoded in:
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/site-footer.tsx`
- `corp-web-japan` does not read `corp-web-contents` today
- therefore, editing only `corp-web-contents` JSON cannot make querypie.ai change at runtime
- but it can make the old `corp-web-app` / `corp-web-contents` site links match querypie.ai in a one-time cleanup
- this avoids adding synchronization for repositories that are expected to be deprecated soon

---

## What the repo inspection showed

### querypie.ai (`corp-web-japan`) current link set

Header/footer currently point to querypie.ai-local paths such as:

- `/services/aip`
- `/services/acp`
- `/services/fde`
- `/solutions/ai-crew`
- `/solutions/ai-dashi`
- `/demo/use-cases`
- `/demo/aip`
- `/demo/acp`
- `/resources`
- `/introduction-deck`
- `/glossary`
- `/manuals`
- `/whitepapers`
- `/blog`
- `/about-us`
- `/certifications`
- `/news`
- `/contact-us`

Footer also includes legal/social links such as:

- `/cookie-preference`
- `/terms-of-service`
- `/privacy-policy`
- `/eula`
- LinkedIn / YouTube / X / Facebook / Instagram

### `corp-web-contents` current Japan JSON link set

Current `layout/ja/header.json` and `layout/ja/footer.json` still point to the old corporate-site structure, for example:

- `/solutions/aip`
- `/solutions/acp`
- `/features/demo`
- `/features/documentation`
- `/company/about-us`
- `/company/certifications`
- `/company/news`
- `/company/contact-us`
- `/plans`
- `/plans?aip`
- `/plans?acp`
- `https://app.querypie.com`
- `https://docs.querypie.com/ja`
- `https://aip-docs.app.querypie.com/ja`

So there is a clear mismatch.

---

## Important constraint

If the goal is strictly “make both sites use one shared source at runtime”, JSON-only changes are not enough.

Reason:
- `corp-web-japan` does not consume `corp-web-contents`
- its header/footer links are compiled from local arrays in React components

Therefore:
- JSON-only change can align the old site to the new site
- JSON-only change cannot create live commonization

Under the new requirement, that is acceptable and preferred.

---

## Recommended action

Make a one-time content update in `corp-web-contents` only.

Files to edit:
- `layout/ja/header.json`
- `layout/ja/footer.json`

Reference source:
- `corp-web-japan/src/components/layout/site-header.tsx`
- `corp-web-japan/src/components/layout/site-footer.tsx`

Implementation rule:
- copy only the link destinations and labels needed for one-time alignment
- do not introduce new runtime integration between repos
- do not add new JSON namespaces
- do not add fetch logic to `corp-web-japan`
- do not refactor `corp-web-app` schema unless a required link cannot be represented in the existing JSON shape

---

## Practical caveat

This should be treated as “link parity”, not “full visual/IA parity”.

Why:
- `corp-web-contents` header/footer schema is shaped for the old site navigation model
- `corp-web-japan` has a different IA and different menu grouping
- some querypie.ai concepts, such as the exact service/solution grouping, may need approximation when mapped into the old JSON structure

So the recommended goal is:
- align the actual destinations as much as possible
- accept small grouping differences if the old schema/UI requires them

---

## Smallest next implementation PR

If proceeding with implementation, the smallest PR should do only this:

### Task 1: edit header JSON
- update `corp-web-contents/layout/ja/header.json`
- replace old corporate-site destinations with the querypie.ai-aligned destinations where appropriate

### Task 2: edit footer JSON
- update `corp-web-contents/layout/ja/footer.json`
- replace old footer destinations with the querypie.ai-aligned destinations where appropriate
- keep legal links/socials aligned with the current querypie.ai footer when the same destination exists

### Task 3: validate
Run in `corp-web-contents`:

```bash
npm run validateJson
```

Optionally also verify the affected old-site header/footer rendering in preview.

---

## Decision

Recommended decision now:

- abandon the live shared-source plan
- use a one-time JSON-only update in `corp-web-contents`
- treat `corp-web-japan` as the reference implementation
- keep the change as small as possible because `corp-web-app` / `corp-web-contents` are temporary ahead of `corp-web-v2`
