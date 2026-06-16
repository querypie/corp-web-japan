# contract-certifications-content-management

## Purpose

This spec defines how `corp-web-japan` manages certification-acquisition
information on static marketing pages.

The goal is to keep certification status accurate, easy to update, and
consistent across pages that use certifications as trust proof. The canonical
public page for acquired certifications is `/certifications`. Other static
marketing pages MAY introduce a smaller certification or compliance message, but
they must not become independent sources of truth for the acquired-certification
inventory.

News publication management is out of scope for this spec. News articles may
announce certification events, but they do not own the current certification
inventory or the static marketing-page guidance described here.

## Current implementation references

- `src/app/certifications/page.tsx`
- `src/components/sections/certifications/section.tsx`
- `public/certifications/*`
- `src/app/page.tsx`
- `src/components/sections/home/security-section.tsx`
- `public/top-assets/certifications/*`
- `src/app/solutions/ai-dashi/page.tsx`
- `src/app/platforms/acp/database-access-controller/page.tsx`
- `src/app/platforms/acp/system-access-controller/page.tsx`
- `src/app/platforms/acp/kubernetes-access-controller/page.tsx`
- `src/app/platforms/acp/web-access-controller/page.tsx`
- `src/components/layout/site-header-client.tsx`
- `src/components/layout/site-footer.tsx`
- `src/app/sitemap.ts`

## Current static marketing-page status

| Route | Current certification-related surface | Current role |
| --- | --- | --- |
| `/certifications` | Company-page certification page with metadata, lead copy, a grid of 12 certification cards, images from `public/certifications/*`, a Trust Center action, trial CTA, header/footer navigation, and sitemap entry. | Primary static marketing source of truth for acquired-certification status. |
| `/` | `SecuritySection` titled `国際基準のセキュリティ認証` with four featured cards: SOC 2 Type II, ISO/IEC 27001, ISO/IEC 27701, and CSA STAR. Assets are duplicated under `public/top-assets/certifications/*`, and the CTA links to Trust Center. | Supporting trust-proof section with a featured subset, not the full inventory. |
| `/solutions/ai-dashi` | Enterprise-readiness and comparison sections mention `SOC2 / ISO27001`, certification-level security, and the cost of certification acquisition in a self-build scenario. | Solution-specific proof point. It should stay compact and should not list the full certification inventory. |
| `/platforms/acp/database-access-controller` | FAQ item `QueryPie はどのようなセキュリティ標準を遵守していますか？` mentions ISO27001, SOC2, GDPR, and CSA-STAR. | Product FAQ compliance mention. It mixes certification names with a regulatory framework and should not be treated as an acquired-certification inventory. |
| `/platforms/acp/system-access-controller` | Same ACP FAQ certification/compliance wording as the DAC page. | Product FAQ compliance mention. |
| `/platforms/acp/kubernetes-access-controller` | Same ACP FAQ certification/compliance wording as the DAC page. | Product FAQ compliance mention. |
| `/platforms/acp/web-access-controller` | Same ACP FAQ certification/compliance wording as the DAC page. | Product FAQ compliance mention. |

No other static marketing route currently owns a dedicated certification
introduction section based on the implementation evidence inspected for this
spec. Generic security, authentication, access-control, compliance, or CISO copy
is not certification-acquisition content unless it names acquired certifications
or presents certification badges.

## Recommended content fixes

These are the current maintenance targets implied by the existing implementation
evidence. They are not a mandate to change copy in this documentation PR.

1. Keep `/certifications` as the first place to update when QueryPie AI gains,
   loses, renews, renames, or reclassifies a certification.
2. Validate the `isms-p` card description in
   `src/app/certifications/page.tsx`; it currently repeats `Business Continuity`
   / `Management`, which also describes ISO 22301 on the same page.
3. When the top page changes its featured certification set, update the copy,
   card titles, and `public/top-assets/certifications/*` assets together, or
   replace the duplicated featured-card data with a shared source if drift
   becomes recurring.
4. Normalize acquired-certification names in supporting static pages when they
   are used as proof points. Prefer canonical names such as `SOC 2 Type II`,
   `ISO/IEC 27001`, `ISO/IEC 27701`, and `CSA STAR` or the more specific CSA
   level where the page intends to make a specific claim.
5. Keep GDPR and similar regulatory frameworks out of acquired-certification
   lists. If a page needs to mention both certifications and regulations, label
   the broader concept as compliance or standards, not as acquired
   certifications.
6. Add a link to `/certifications` or Trust Center from supporting pages when a
   user would reasonably need to verify the full current status.
7. Do not use news articles as the place to update current certification status.
   Static marketing pages may link to relevant news only as historical
   announcement context.

## Basic authoring guide

### Updating the primary certifications page

For ordinary certification-inventory changes, update:

- `src/app/certifications/page.tsx` for metadata, lead copy, card order, card
  titles, descriptions, alt text, and image dimensions.
- `public/certifications/*` for first-party certification badge assets.
- `src/app/sitemap.ts` only if the `/certifications` route visibility or
  canonical path changes.

The primary page SHOULD continue to use the company-page family primitives
documented in `docs/company-page-layout-contract.md`. Content updates SHOULD NOT
replace the company-page shell with a page-specific wrapper unless the layout
contract itself changes.

### Updating supporting static marketing pages

Supporting pages MAY feature a subset of certifications when that proof point
supports the page narrative. They SHOULD:

- Keep the subset intentionally small.
- Preserve route-local authoring for page-specific copy and composition.
- Use `/certifications` or Trust Center as the verification destination for the
  full current certification inventory.
- Avoid creating another full badge inventory outside `/certifications`.
- Avoid certification claims that cannot be reconciled with the primary page or
  Trust Center.

When the same certification badge data, asset mapping, or canonical display name
must be reused by multiple static pages, maintainers SHOULD consider extracting a
small shared record source under `src/lib/**` or `src/content/**`. That
extraction SHOULD happen only when it reduces real drift; route-local copy should
remain the default for page-specific marketing narrative.

### Excluding news management

News content under the news publication system is excluded from this
certifications content-management contract. A certification announcement in news
MAY remain as historical content, but updating the current certification status
SHALL be handled through `/certifications`, supporting static marketing pages,
and Trust Center-facing links.

## Requirements

### Requirement: primary page ownership

The `/certifications` static marketing page SHALL be the primary local website
surface for current acquired-certification status. It SHALL own the local badge
inventory shown to public visitors, including certification names, descriptions,
badge assets, alt text, visible ordering, page metadata, and the Trust Center
verification action.

Supporting static marketing pages SHALL NOT present themselves as the complete
current certification inventory unless they intentionally reuse the same source
and update path as `/certifications`.

#### Scenario: a new certification is added

- GIVEN QueryPie AI has a newly approved certification to publish
- WHEN the local website is updated
- THEN `/certifications` is updated with the certification card, badge asset,
  metadata-sensitive copy if needed, and the Trust Center action remains visible
- AND any supporting page that names a featured subset is reviewed for whether
  it should include or omit the new certification
- AND news article management is not required to publish the current status

#### Scenario: a certification is removed or reclassified

- GIVEN a certification is no longer current, has changed level, or has changed
  official naming
- WHEN the local website is updated
- THEN `/certifications` is updated first
- AND supporting static pages are checked for stale names, badges, or claims
- AND unsupported claims are removed, renamed, or linked to the current
  verification destination

### Requirement: supporting page consistency

Supporting static marketing pages MAY mention certifications only as scoped proof
points for their own page narrative. They SHALL keep certification names,
selected badges, and claim strength consistent with `/certifications` and Trust
Center. They SHALL distinguish acquired certifications from broader standards,
security capabilities, and regulatory frameworks.

#### Scenario: the top page shows a featured subset

- GIVEN `/` includes the `SecuritySection` certification cards
- WHEN the featured cards are edited
- THEN the card names and assets are reconciled with the current
  `/certifications` inventory or Trust Center
- AND the section remains a featured subset rather than a complete inventory
- AND the CTA continues to send users to a verification destination

#### Scenario: an ACP FAQ mentions compliance standards

- GIVEN an ACP product FAQ mentions ISO27001, SOC2, GDPR, and CSA-STAR
- WHEN the copy is edited to describe acquired certification status
- THEN GDPR is not labeled as an acquired certification
- AND the acquired-certification names are normalized or linked to
  `/certifications` / Trust Center
- AND the page remains a product-specific FAQ rather than the authoritative
  certification inventory

### Requirement: static marketing scope

This contract SHALL apply to static marketing routes that present
certification-acquisition information, including the primary `/certifications`
page and supporting home, solution, and platform sections. It SHALL NOT require
updates to news publication management, news route behavior, or historical news
articles when certification status changes.

#### Scenario: a certification press release exists

- GIVEN a news article announces a certification event
- WHEN the current certification inventory changes later
- THEN the news article may remain historically accurate
- AND the current status is updated through `/certifications` and relevant
  static marketing support sections
- AND the news publication system is not treated as part of this content
  management scope

### Requirement: asset and metadata alignment

Certification badge assets SHALL be first-party static assets unless a product
or legal decision requires an external asset source. The primary
`/certifications` page SHALL keep page metadata, visible lead copy, badge alt
text, and card labels aligned with the current public claim.

#### Scenario: a badge asset changes

- GIVEN a certification badge image is replaced or updated
- WHEN the local website is changed
- THEN the corresponding `public/certifications/*` asset and
  `CertificationItem` dimensions/alt text are updated together
- AND any duplicated featured asset under `public/top-assets/certifications/*`
  is either updated or intentionally left out of the featured subset

### Requirement: verification for certification-content changes

Certification-content changes SHALL include the lightest verification that proves
the edited source is syntactically valid and the affected page surfaces are not
stale. If a change modifies only OpenSpec documentation, `git diff --check` and
OpenSpec validation, when available, are sufficient. If a change modifies
rendered static marketing pages, maintainers SHOULD run `npm run test:ci`; they
SHOULD run `npm run build` when page metadata, routing, sitemap, or production
rendering behavior changes.

#### Scenario: only this OpenSpec contract changes

- GIVEN a PR only adds or edits the certifications content-management spec
- WHEN verification is run
- THEN `git diff --check` passes
- AND `openspec validate --all` is run when the CLI is available
- AND application build verification is not required unless implementation files
  also changed

#### Scenario: `/certifications` copy or card data changes

- GIVEN a PR changes `src/app/certifications/page.tsx` or badge assets
- WHEN verification is run
- THEN source checks include `npm run test:ci`
- AND metadata, sitemap, or route behavior changes also include `npm run build`
- AND the PR records which supporting static pages were checked for drift
