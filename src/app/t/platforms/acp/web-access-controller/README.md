# Web Access Controller render comparison notes

This note records the browser-rendered differences between the current stage preview route and the live QueryPie Japan reference page. It is intentionally documentation-only; it does not change the page implementation.

## Scope

- Stage URL: `https://stage.querypie.ai/t/platforms/acp/web-access-controller`
- Live URL: `https://www.querypie.com/ja/solutions/acp/web-access-controller`
- Local route source: `src/app/t/platforms/acp/web-access-controller/page.tsx`
- Shared local section source: `src/components/sections/acp/static-page.tsx`
- Captured at: `2026-05-17 15:07:03 KST`
- Viewports measured: desktop `1440 x 900`, mobile `390 x 844`
- Requested URLs and final rendered URLs matched for both stage and live.
- Local screenshots and DOM geometry were captured under `/tmp/render-parity/acp-child-render-diffs/` during the audit.

## Measurement summary

| Viewport | Root font size, stage / live | Scroll height, stage / live | Section count, stage / live | First h2 size, stage / live | First h4 size, stage / live |
| --- | --- | ---: | ---: | --- | --- |
| desktop | `16px` / `16px` | `8313` / `9481` | `11` / `23` | `52px` / `52px` | `32px` / `32px` |
| mobile | `16px` / `14px` | `10173` / `8999` | `11` / `23` | `36px` / `32px` | `26px` / `20px` |

## Findings

### 1. Body length and section model differ

Classification: defect candidate / needs implementation decision.

Evidence:
- Desktop scroll height is `8313` on stage and `9481` on live.
- Mobile scroll height is `10173` on stage and `8999` on live.
- Stage renders `11` major `main section/article` nodes on desktop, while live exposes `23`. The live count includes more nested production section wrappers, but the visual page also contains a production FAQ block that stage does not render.

Interpretation:
- The current preview is not just a pixel-different copy of the live page. It is a measured rebuild using local `AcpStaticPageShell`, `AcpFeatureSection`, `AcpWorksSection`, and `AcpSplitFeatureSection` primitives.
- The live page has an additional FAQ accordion before the final CTA. The stage page jumps from the final feature band directly into the CTA/footer.

Likely source area to inspect next:
- `src/app/t/platforms/acp/web-access-controller/page.tsx` for route-local section composition.
- `src/components/sections/acp/static-page.tsx` for reusable ACP static-page primitives.

### 2. The final FAQ block is missing on stage

Classification: defect candidate.

Evidence:
- Live desktop includes the FAQ block around document top `7324` with questions about SaaS service behavior, authentication handling, security standards, and compatibility with existing security solutions.
- Stage desktop and mobile did not expose that FAQ section in the rendered `main` body.

Interpretation:
- If these ACP child pages are intended to match the live reference page, a route-local FAQ section or shared ACP FAQ primitive should be added before the final CTA.
- This is content/structure parity, not just spacing parity.

Likely source area to inspect next:
- Add route-local FAQ content in `src/app/t/platforms/acp/web-access-controller/page.tsx` or a narrow shared ACP FAQ section if all four child pages intentionally share the same production FAQ contract.

### 3. Mobile typography scale differs

Classification: defect candidate or root-rem policy decision.

Evidence:
- Mobile root font size: stage `16px`, live `14px`.
- Mobile first h2: stage `36px`, live `32px`.
- Mobile first h4: stage `26px`, live `20px`.
- Desktop h1/h2/h4 sizes broadly match between stage and live; the larger visible typography difference is mobile-specific.

Interpretation:
- The live site renders mobile under a `14px` root while corp-web-japan keeps a standard `16px` root.
- Do not blindly copy the live computed pixels. Decide whether the intended local fix should preserve source token intent under the local root or match final visible mobile pixels.
- The current stage mobile headings are visibly larger in lower sections than the live reference.

Likely source area to inspect next:
- Responsive typography rules in `src/components/sections/acp/static-page.tsx`.
- Apply the repo-local root-rem parity rule before changing pixel values.

### 4. Intro feature area is structurally different from the live production treatment

Classification: defect candidate / measured-rebuild gap.

Evidence:
- Stage exposes feature cards as semantic h3 headings in the first feature section.
- Live renders the comparable production feature block with production card wrappers and a different nested section structure.
- This contributes to the section-count and vertical-rhythm differences before the how-it-works section.

Interpretation:
- The stage implementation is a local approximation of the live card section, not a direct port of the production component contract.
- Before tuning individual margins, compare the card wrapper, icon size, card padding, and heading/body typography against the live card contract.

Likely source area to inspect next:
- `AcpFeatureGrid` and `AcpFeatureCard` in `src/components/sections/acp/static-page.tsx`.

### 5. Feature-band rhythm differs from production

Classification: defect candidate.

Evidence:
- Stage and live both use alternating screenshot/text feature bands after the intro sections.
- However, the measured section top/height sequence diverges after the first intro blocks. For example on desktop, stage reaches the final CTA at document top `7324` while live reaches the final CTA at document top `8201` after also rendering the FAQ block.
- The stage feature sections alternate local gray/white bands via `AcpSplitFeatureSection`; live uses the production page's own nested wrappers and spacing rhythm.

Interpretation:
- Some differences are expected from the local measured-rebuild strategy, but the combined rhythm is not production-equivalent yet.
- Fixes should be made at the ACP static-page primitive level rather than by one-off margin edits in every route file, unless a single page has unique content constraints.

Likely source area to inspect next:
- `AcpSplitFeatureSection`, `AcpWorksSection`, and final CTA spacing in `src/components/sections/acp/static-page.tsx`.

## Current conclusion

The stage page is content-complete enough to show the core WAC story, but it is not render-identical to the live production page. The most actionable differences are:

1. add or intentionally omit the live FAQ block;
2. decide the mobile root-rem/typography contract;
3. compare the intro feature-card and split-feature wrapper contracts before doing small spacing tweaks;
4. keep chrome differences separate from page-body parity, especially because live can show cookie/language UI while stage uses the corp-web-japan header/footer.
