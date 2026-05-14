# Company Page Layout Contract

This document defines the final shared page-header and body-layout contract for the company-page family.
It turns the completed implementation from [issue 459](https://github.com/querypie/corp-web-japan/issues/459) into durable repository guidance.

Use this guide when creating, refactoring, or reviewing company-related pages such as:

- `/about-us`
- `/certifications`
- `/news`
- `/contact-us`
- future company, trust, corporate-information, press, or inquiry pages that should share the same company-page shell vocabulary

This guide is based on the current `main` implementation after:

- [PR 460](https://github.com/querypie/corp-web-japan/pull/460): added shared company page primitives
- [PR 461](https://github.com/querypie/corp-web-japan/pull/461): migrated the initial company pages to the shared contract
- [PR 467](https://github.com/querypie/corp-web-japan/pull/467): aligned the contact-us spacing with the shared primitives

## Source of truth

The implementation source of truth is:

- `src/components/sections/company/page-primitives.tsx`

The contract test is:

- `tests/company-page-primitives.test.mjs`

When this document and the implementation disagree, update both together.
Do not change the primitive contract only in prose, and do not change the code without updating this guide when the public convention changes.

## Purpose

The goal is not to make every company page have identical DOM nesting.
The goal is to make the page-header and body-layout layers use one shared vocabulary and one shared set of spacing, width, typography, and layout responsibilities.

The contract should make these pages easy to review:

- the outer page shell uses the same width and padding rules
- the page title uses the same typography rule
- lead text uses the same body-copy token
- one-column and two-column body flows are expressed through named presets
- route files do not scatter ad-hoc grid, width, or spacing class names for this shared page family

## Shared primitive vocabulary

Use the following primitives for the company-page family.

### `CompanyPageSection`

Owns the outer company page shell.

Responsibilities:

- page top padding
- page bottom padding
- horizontal page padding
- white background
- max 1920px outer shell
- max 1200px inner content width

Do not recreate this with page-specific wrappers such as `AboutUsHeroSection`, `NewsPageSection`, or `ContactUsSection` when the wrapper only exists to provide the shared shell.

### `CompanyPageIntro`

Owns the intro stack.

Responsibilities:

- vertical gap between title, lead, and intro/body content
- text alignment
- intro top offset

Use it for the page's top explanatory area.
It may wrap only title/lead content, or it may be placed inside a two-column layout when the page's first body unit is the intro column, as on `/contact-us`.

### `CompanyPageTitle`

Owns the page-level `h1` typography.

Responsibilities:

- font size
- weight
- line height
- tracking
- title color

Use `Title` consistently for this role.
Do not reintroduce parallel `Heading` vocabulary for the same page-level `h1` responsibility.

### `CompanyPageLead`

Owns lead/body-intro typography.

Responsibilities:

- company body text token usage
- ordinary lead-copy presentation

Use it for descriptive text directly supporting the page title.
If a page needs additional page-specific intro UI, keep that UI in a page-specific component but keep ordinary lead text on this primitive.

### `CompanyPageLayout`

Owns the body layout preset.

Responsibilities:

- single-column flow
- approved two-column flows
- layout-specific grid and gap rules

The current API is intentionally preset-based:

```tsx
<CompanyPageLayout>
  ...
</CompanyPageLayout>

<CompanyPageLayout preset="equalColumns">
  ...
</CompanyPageLayout>

<CompanyPageLayout preset="aboutUsHero">
  ...
</CompanyPageLayout>
```

Current presets:

- `single`
  - the default
  - use for one-column body flow
- `equalColumns`
  - use for balanced two-column body flow, currently represented by `/contact-us`
- `aboutUsHero`
  - use for the asymmetric about-us hero flow, currently represented by `/about-us`

Do not pass ad-hoc `className`, `contentClassName`, or raw width values into this primitive.
If a new company-page layout shape is needed, add a named preset to `CompanyPageLayout`, update the contract test, and update this guide.

## Current page application

| Page | Current shape | Status |
| --- | --- | --- |
| `/about-us` | `CompanyPageSection` -> `CompanyPageIntro` -> `CompanyPageTitle` + `CompanyPageLayout preset="aboutUsHero"` | aligned |
| `/certifications` | `CompanyPageSection` -> `CompanyPageIntro` -> `CompanyPageTitle` / `CompanyPageLead` -> `CompanyPageLayout` | aligned |
| `/news` | `CompanyPageSection` -> `CompanyPageIntro` -> `CompanyPageTitle` / `CompanyPageLead` -> `CompanyPageLayout` | aligned |
| `/contact-us` | `CompanyPageSection` -> `CompanyPageLayout preset="equalColumns"` -> `CompanyPageIntro` + form panel | aligned |

The `/contact-us` shape deliberately places `CompanyPageIntro` inside `CompanyPageLayout` because the intro is one side of the equal-column body layout.
Do not treat this as a violation of the contract.
The shared contract is primitive vocabulary plus responsibility ownership, not an identical sibling order for every page.

## Recommended one-column shape

Use this shape when the page header is followed by a one-column body.

```tsx
<CompanyPageSection>
  <CompanyPageIntro>
    <CompanyPageTitle>Page title</CompanyPageTitle>
    <CompanyPageLead>Lead copy...</CompanyPageLead>
  </CompanyPageIntro>

  <CompanyPageLayout>
    <PageSpecificBody />
  </CompanyPageLayout>
</CompanyPageSection>
```

Use this for pages like `/certifications` and `/news` unless the page has a real two-column first-body layout.

## Recommended equal two-column shape

Use this shape when the intro content and another panel share the first body row as balanced columns.

```tsx
<CompanyPageSection>
  <CompanyPageLayout preset="equalColumns">
    <CompanyPageIntro>
      <CompanyPageTitle>Page title</CompanyPageTitle>
      <CompanyPageLead>Lead copy...</CompanyPageLead>
      <PageSpecificIntroSupport />
    </CompanyPageIntro>

    <PageSpecificPanel />
  </CompanyPageLayout>
</CompanyPageSection>
```

Use this for pages like `/contact-us`, where the form panel is the second column.

## Recommended asymmetric two-column shape

Use this shape when the page has an approved asymmetric hero/body presentation.

```tsx
<CompanyPageSection>
  <CompanyPageIntro>
    <CompanyPageTitle>Page title</CompanyPageTitle>

    <CompanyPageLayout preset="aboutUsHero">
      <PageSpecificHeroCopy />
      <PageSpecificHeroMedia />
    </CompanyPageLayout>
  </CompanyPageIntro>
</CompanyPageSection>
```

Use this only when the asymmetry is part of the page's intended visual contract.
Do not copy the `aboutUsHero` preset to unrelated pages just because they need two columns.

## Naming rules

Use one vocabulary for the company-page shell:

- `Section`
- `Intro`
- `Title`
- `Lead`
- `Layout`

Avoid reintroducing parallel names for the same roles:

- `HeroSection` for the shared outer company shell
- `PageSection` for the shared outer company shell
- `IntroSection` for the shared intro stack
- `Heading` for the page-level `h1`
- page-specific wrappers that only duplicate `CompanyPageSection` or `CompanyPageIntro`

Page-specific names are still allowed when the component owns real page-specific UI.
For example, a contact form panel, certification grid, news list section, or about-us media block can keep a page-specific name because it is not merely the shared company shell.

## Responsibility split

### Route file responsibilities

`src/app/**/page.tsx` should own:

- page metadata
- real page title and lead copy
- the order of the page-specific body blocks
- calls to the company-page primitives
- calls to page-specific body components

This follows the broader route-local authoring rule: the route file should remain readable as the page's authoring surface.

### Company primitive responsibilities

`src/components/sections/company/page-primitives.tsx` should own:

- shell width
- shell padding
- intro spacing
- title typography
- lead typography
- approved company-page layout presets

### Page-specific component responsibilities

Page-specific components under `src/components/sections/<page-or-family>/**` should own:

- cards
- lists
- media blocks
- form panels
- page-specific grouped UI
- page-specific interaction and animation

They should not reimplement the shared page shell, intro stack, title typography, or body-layout presets.

## Adding a new company page

When adding a new page to this family:

1. Start with `CompanyPageSection`.
2. Use `CompanyPageTitle` for the `h1`.
3. Use `CompanyPageLead` for ordinary lead copy.
4. Choose the simplest `CompanyPageLayout` preset that matches the body shape.
5. Keep page-specific body UI in a page-specific component only when it owns real UI responsibility.
6. Do not add raw grid or width class names at the route call site for a reusable company layout shape.
7. If a new layout shape is genuinely needed, add a named `CompanyPageLayout` preset instead of adding a one-off wrapper.
8. Update `tests/company-page-primitives.test.mjs` when adding or changing the primitive contract.
9. Update this guide in the same PR when the convention changes.

## Review checklist

Use this checklist when reviewing a company-page PR.

- Does the page use `CompanyPageSection` for the shared company shell?
- Does the page use `CompanyPageTitle` for the page-level `h1`?
- Does ordinary lead text use `CompanyPageLead`?
- Is the one-column or two-column body shape represented by `CompanyPageLayout` and a named preset?
- Are page-specific components limited to page-specific UI responsibility?
- Are raw width, grid, and spacing classes avoided at the company-page shell/layout call site?
- Are old synonyms such as `HeroSection`, `PageSection`, `IntroSection`, and `Heading` avoided for shared shell roles?
- If the primitive contract changed, did the PR update `tests/company-page-primitives.test.mjs` and this document?

## Anti-patterns

Avoid these patterns for company-page shell work.

### Page-specific shell wrappers

```tsx
<ContactUsSection>
  <ContactUsIntro>
    <ContactUsTitle>お問い合わせ</ContactUsTitle>
  </ContactUsIntro>
</ContactUsSection>
```

Use the shared company vocabulary instead:

```tsx
<CompanyPageSection>
  <CompanyPageIntro>
    <CompanyPageTitle>お問い合わせ</CompanyPageTitle>
  </CompanyPageIntro>
</CompanyPageSection>
```

### Ad-hoc layout classes at the call site

```tsx
<div className="grid w-full gap-10 lg:grid-cols-[520px_1fr]">
  ...
</div>
```

If that layout is part of the company-page family contract, add or reuse a named `CompanyPageLayout` preset instead.

### Cosmetic wrapper extraction

Do not add a new wrapper layer if it only renames an existing primitive without owning a distinct responsibility.

Bad direction:

```tsx
function ContactUsHeroSection({ children }: { children: React.ReactNode }) {
  return <CompanyPageSection>{children}</CompanyPageSection>;
}
```

This adds another name but no new responsibility.
Prefer using `CompanyPageSection` directly.

## Relationship to route-local authoring

This guide does not override route-local authoring.
Company pages should still keep real copy and composition visible in `src/app/**/page.tsx` where practical.

Use these documents together:

- `docs/static-page-route-local-authoring.md`
- `docs/route-local-refactoring-for-developers.md`
- this document

The relationship is:

- route-local authoring defines where page meaning and copy should live
- this guide defines the shared company-page shell and layout vocabulary
- page-specific section components define the UI implementation details
