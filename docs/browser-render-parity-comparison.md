# Browser render parity comparison guide

Use this guide when comparing a corp-web-japan preview, stage, or PR Preview page with a live QueryPie reference page by actual browser rendering.

This guide is intentionally render-first. Do not rely only on source code, page text snapshots, screenshots without measurements, or visual intuition when the user reports that two pages render differently.

## Purpose

A render parity investigation should answer four questions clearly:

1. What exactly did the browser render on each page?
2. Which differences are page-body differences, and which are external chrome, banner, or environment differences?
3. Which differences are real defects, intentional local adaptations, or live-site artifacts?
4. Which source file or styling contract should be inspected or changed next?

The goal is not to list every pixel delta. The goal is to identify meaningful differences with evidence that another reviewer can reproduce.

## When to use this guide

Use it when a task asks to compare pages such as:

- a stage or preview URL under `https://stage.querypie.ai/...`
- a live reference URL under `https://www.querypie.com/ja/...`
- a Vercel Preview Deployment URL for a PR
- a local preview URL only when the user explicitly asked for local preview verification

Typical examples:

- `https://stage.querypie.ai/t/platforms/aip`
- `https://www.querypie.com/ja/solutions/aip`

Do not use this guide as a replacement for implementation review. Use it first to identify the rendered difference, then inspect source code after the browser evidence is clear.

## Core principles

### Compare the exact requested URLs

Open the exact URLs the user gave.

Do not silently replace a requested live URL with a redirected target, canonical route, local route, or PR Preview URL unless the user explicitly asks for that substitution.

If a page redirects, record both:

- requested URL
- final rendered URL

### Use the same browser conditions

For each pair of pages, keep these conditions consistent:

- viewport size
- device scale factor when possible
- color scheme
- browser profile state, or at least banner/cookie state notes
- measurement timing after navigation
- scroll/lazy-loading procedure

If one site displays a language banner, cookie banner, WAF page, consent UI, or floating widget, record it separately from the migrated body content.

### Separate chrome from page body

Live QueryPie pages and corp-web-japan pages may intentionally have different site chrome.

Before calling a body-area difference a bug, classify whether it comes from:

- top language banner
- cookie consent banner
- global header/GNB height
- footer implementation
- floating widgets
- preview toggle UI
- the migrated body content itself

For body parity work, measure body sections relative to `main` and nearby anchors, not only absolute document `top` values.

### Measure before proposing fixes

A useful comparison combines:

1. exact URLs requested by the user
2. same viewport sizes on both pages
3. full-page screenshots
4. screenshot pixel-diff summaries for quick hotspot detection
5. DOM geometry from `getBoundingClientRect()`
6. computed styles from `getComputedStyle()`
7. lazy media checks after scrolling
8. source-code inspection only after the rendered difference is identified

Do not jump directly from "it looks different" to a CSS change. First identify whether the rendered difference is caused by typography, root font size, wrapper width, flex/grid direction, media scaling, spacing tokens, header offset, or external chrome.

### Treat screenshots as detection, not proof by themselves

Screenshots and pixel diffs are effective at finding visible drift quickly. They are especially good at revealing section rhythm, card/table sizing, button chrome, icon placement, text wrapping, background-band, mobile overflow, and total page-height differences.

However, screenshots alone are not enough to approve or reject a migration. They cannot reliably explain whether a delta comes from root font-size policy, a header/banner offset, lazy media timing, font loading, animation state, or a broken component contract. Use screenshots to locate the suspicious region, then use DOM geometry and computed styles to prove the specific element-level difference.

Preferred evidence chain:

1. screenshot or pixel diff identifies the visual hotspot
2. DOM geometry quantifies the element or section delta
3. computed style identifies the property-level difference
4. source/component inspection names the contract or file that should change

If a report only says "the screenshots look different" without element measurements and a source target, the investigation is incomplete.

### Add source-contract checks for source-backed widget pages

Some QueryPie pages are not ordinary static marketing pages. If the reference implementation exists in `../corp-web-app` and is built from widget/application components, treat the upstream component and CSS contract as part of the parity target.

For these source-backed widget pages, do not rebuild the body from generic local Tailwind primitives until you have explicitly decided why a direct port is not feasible. First inspect:

- the upstream route file
- the full upstream component chain
- adjacent CSS modules
- upstream design tokens and root/rem assumptions
- button, icon, tab, card, table, and overflow primitives
- interaction state and responsive behavior

Then choose one strategy and document it in the issue or PR body:

1. **Direct-port strategy**: port the upstream component structure and CSS-module visual contract as closely as possible, adding a small compatibility layer for local tokens, buttons, icons, or layout wrappers when needed.
2. **Measured-rebuild strategy**: keep local primitives, but require screenshot, DOM geometry, computed-style, and source-contract evidence that the rebuilt UI is visually equivalent enough.

For example, `/t/plans` should be treated as a source-backed pricing widget migration because the upstream page is built from pricing and compare-table widget components in `../corp-web-app`. In that case, text presence and route-local authorship are not sufficient. The audit must check plan cards, product tabs, buttons/icons, and comparison-table structure against the upstream widget/CSS contract.

## Required viewport set

At minimum, compare:

- desktop: `1440 x 900`
- mobile: `390 x 844`

Add a narrow mobile viewport such as `320 x 844` or `360 x 844` when typography wrapping, horizontal overflow, or card gutters are part of the complaint.

For page families that are known to have tablet-specific behavior, add a tablet viewport such as `768 x 1024`.

## Investigation workflow

### 1. Record scope

Before collecting data, write down:

- stage/preview URL
- live/reference URL
- whether the user asked for exact visual parity or only discrepancy investigation
- whether global chrome is in scope
- whether local preview is allowed
- expected output: report only, docs update, implementation fix, PR update, or all of these

### 2. Open both pages directly

For each URL:

- open the page directly in the browser
- record final URL after redirects
- wait for initial load
- note visible cookie/language banners or overlays
- do not dismiss overlays unless the task requires matching the post-dismissed state

If a banner blocks page-body measurement, capture its presence first, then dismiss or hide it only for a second body-focused measurement pass. State which pass each measurement came from.

### 3. Capture full-page screenshots and pixel diffs

Capture full-page screenshots for every viewport and page label.

Save screenshots outside the repository, for example:

- `/tmp/render-parity/<task>/stage-1440x900.png`
- `/tmp/render-parity/<task>/live-1440x900.png`
- `/tmp/render-parity/<task>/stage-390x844.png`
- `/tmp/render-parity/<task>/live-390x844.png`

When practical, also save diff artifacts:

- `/tmp/render-parity/<task>/diff-1440x900.png`
- `/tmp/render-parity/<task>/diff-390x844.png`
- `/tmp/render-parity/<task>/diff-summary.json`

A useful diff summary includes changed-pixel count, changed-pixel ratio, and the bounding box of changed pixels. Full-page diff ratio can be exaggerated by a top offset that shifts the entire lower page, so also inspect section-level screenshots or section-level geometry before calling the whole page defective.

Screenshots are useful for human review and fast hotspot detection, but they are not sufficient by themselves. Pair them with DOM geometry and computed styles.

Do not treat screenshot review as only a layout/spacing pass. While reviewing screenshots, explicitly zoom into interactive controls, buttons, card CTAs, tab labels, badges, and icon-bearing links. Small glyph-level differences such as an external-link arrow (`↗`) versus a chevron (`>`) are real visual parity findings when the reference uses a specific icon contract.

### 4. Force lazy media to load

Before final media measurements:

1. record initial above-the-fold state
2. scroll through the page in several increments
3. wait briefly after each scroll
4. return to the top if needed
5. collect final image/video/iframe data

Lazy-loaded images can initially measure as `0 x 0` or have an empty `currentSrc` before they approach the viewport.

### 5. Collect DOM geometry and computed styles

Collect data for:

- document and root metadata
- header and main offsets
- headings
- paragraphs and links
- major sections
- media elements and their parent wrappers
- CTA buttons/cards
- horizontal overflow

Use `getBoundingClientRect()` for rendered geometry and `getComputedStyle()` for actual computed styles. Source CSS or class names are secondary evidence.

### 6. Compare by section, not only whole page

For each major section, compare:

- existence and order
- top offset relative to nearby sections
- section height
- background color/band
- background image / gradient / decorative visual layer
- pseudo-element background layers (`::before`, `::after`)
- absolutely positioned decorative images inside the section
- content width
- heading typography
- paragraph width and line-height
- media size and alignment
- CTA size and position

This prevents one large scroll-height difference from hiding multiple independent causes.

Important pitfall: do not treat a section as visually equivalent just because its text, foreground screenshots, and `backgroundColor` match. Hero sections and product intro sections can rely on gradient background images or decorative layers that live on wrapper CSS, pseudo-elements, or absolutely positioned children. A stage page with a plain white hero can look materially different from a live page even when DOM geometry and typography are close.

ACP child-page example:

- `../corp-web-contents/pages/solutions/acp/{database-access-controller,system-access-controller,kubernetes-access-controller,web-access-controller}/ja/content.mdx` stores only the source hero background variant on the first page-body wrapper as `background="dac"`, `background="sac"`, `background="kac"`, or `background="wac"`.
- The concrete live rendering contract is in `../corp-web-app/src/components/foundation/layout/layout.module.css`, not in the MDX content file. For WAC it is exactly `background: linear-gradient(180deg, #fff 30%, #dfeff2 84%, #fff 84%, #fff 100%);`.
- Do not replace that live CSS contract with an approximate utility-gradient rebuild. `from-white from-[30%] via-[#...] via-[84%] to-white` is not equivalent: it fades from the variant color at 84% to white at 100%, leaving a visible teal/blue/green wash behind the lower hero/media area instead of the clear horizontal white boundary shown by live.
- For these pages, compare the exact requested URL first. If an old `/t/platforms/acp/...` URL now renders the local 404 page after route promotion, record that as a route-state finding and then compare the current public route such as `/platforms/acp/web-access-controller` separately.
- The source-code check is two-step: first confirm the content route passes the matching variant to `AcpHeroSection background="..."`; then confirm the shared ACP static-page primitive copies the concrete `corp-web-app` gradient strings, including the duplicated white stop at `84%`.
- The browser check is: inspect the H1 ancestor chain and compare the full `backgroundImage` stop list, not just `backgroundImage !== "none"`; crop/sample the left or right side of the hero media band where the live page shows a clear horizontal color-to-white boundary.

### 7. Classify each difference

For each meaningful difference, classify it as one of:

- `defect`: preview/stage should be fixed to match the reference or approved contract
- `intentional adaptation`: local route intentionally differs, for example preview links or launch-gated paths
- `external live artifact`: cookie banner, language banner, A/B test, injected widget, live-only tracking UI
- `environment artifact`: viewport, browser profile, font loading, network, or root font-size condition differs
- `needs decision`: route/canonical/content policy must be confirmed before fixing

### 8. Inspect source code only after the rendered cause is narrowed

Once the browser evidence points to a likely cause, inspect source code for the relevant area only.

Examples:

- typography mismatch -> page route classes, shared section primitives, Tailwind tokens, root/rem assumptions
- image width mismatch -> media element props, wrapper max width, responsive classes, intrinsic asset size
- row alignment mismatch -> parent flex/grid width, child max widths, gap, justify/align settings
- mobile overflow -> breakpoint classes, fixed widths, nowrap, min-width, media parent width
- top offset mismatch -> header/banner accounting, section padding, hero wrapper spacing

For source-backed widget pages, this step must include the upstream implementation as well as the local implementation. Inspect `../corp-web-app` route files, widget components, and CSS modules before deciding whether a local Tailwind rebuild is acceptable. If the local code replaces a concrete upstream widget contract with generic cards, tables, tabs, buttons, or icons, classify that as a likely root cause rather than continuing to tune individual pixels blindly.

Avoid broad opportunistic refactors during a parity investigation.

## Required measurements

### 1. Page metadata and roots

Collect:

- page title
- requested URL
- final URL
- `document.body.scrollHeight`
- `document.documentElement.scrollWidth`
- `document.documentElement.clientWidth`
- `getComputedStyle(document.documentElement).fontSize`
- body font family / font size / line height
- whether a cookie, language, preview, or floating banner is visible

Root font size matters because live QueryPie pages may render under a different root size than corp-web-japan pages. When root sizes differ, recover the intended rem/token relationship instead of blindly copying computed px values.

### 2. Header and main offset

Measure:

- header rect
- main rect
- first visible body section rect
- `header.bottom -> h1.top`
- `main.top -> h1.top`
- `h1.bottom -> first paragraph.top`
- `first paragraph.bottom -> first major media.top`
- `hero media.bottom -> next major section.top`

This separates page-start offset differences from internal hero rhythm differences.

### 3. Headings and body text

For `main h1, main h2, main h3, main h4, main h5, main h6`, record:

- tag name
- text
- rect: top, left, width, height
- font size
- line height
- font weight
- letter spacing
- text alignment
- color

For key paragraphs and links, record:

- text snippet
- rect width and height
- font size and line height
- color
- text alignment
- wrapping behavior

On Japanese pages, explicitly inspect awkward word breaks. For example, mobile headings should not split words like `プラットフォーム` or `エンタープライズAI` in obviously worse places than the live reference.

### 4. Section rhythm

For each major body section, record:

- section order
- top and height
- background color
- padding top and bottom
- content container width
- first text snippet

Then classify differences as:

- missing section
- reordered section
- wrong background band
- vertical rhythm mismatch
- content container width mismatch
- acceptable chrome/footer offset

### 5. Media and lazy loading

For each important image, iframe, or video, record:

- alt text
- current source URL
- natural width and height
- rendered width and height
- top position
- immediate parent rect
- containing section rect
- whether the media is complete after scrolling

Always compare the media element and its wrapper. If an image has the right natural dimensions but renders at the wrong size or alignment, the wrapper often owns the real bug.

### 6. Feature rows, cards, and multi-column layouts

For rows or cards with text plus media, measure the whole layout group, not only the individual image.

Record:

- outer row/container rect
- media rect
- copy column rect
- gap between media and copy
- left and right remaining space inside the row
- flex direction or grid template
- justify/align computed values
- child max widths

Important diagnostic pattern:

- A media element can have the correct rendered width but still appear in the wrong horizontal position if the media + copy group does not fill the row and the parent centers it.
- In that case, inspect copy-column width, group occupied width, and `justify-content`, not just media width.

### 7. Horizontal overflow on mobile

For mobile comparisons, explicitly check whether body text or media exceeds the viewport.

Warning signs:

- `document.documentElement.scrollWidth > document.documentElement.clientWidth`
- paragraph width collapses to a very narrow value such as `30px`
- images render wider than the viewport, such as `540px` or `600px` inside a `390px` viewport
- long links wrap into a narrow vertical column
- screenshots appear clipped left/right instead of scaled to the content column
- page scroll height is much larger than the live page because media/text is laid out in a broken column

### 8. CTA and link behavior

Compare:

- header CTA label and style, if chrome parity is in scope
- mid-page card links
- deep links for migrated sibling pages
- final CTA section title, body, button label, button size, and href
- every visible CTA icon or glyph, including whether the reference uses an SVG icon, text glyph, external-link marker, chevron, arrow direction, or no icon
- icon position, size, color, and gap from the label

For preview routes, local sibling preview links may intentionally replace live public links. Record that as an implementation choice rather than a visual defect. Do not classify icon substitutions as intentional unless the local policy explicitly requires that different icon. For example, `↗` versus a right chevron (`>`) is a defect if the source-backed widget uses a chevron SVG.

### 9. Font loading and root/rem parity

When typography differs, check:

- computed root font size
- body font family
- heading font family
- whether web fonts loaded successfully
- whether one page uses a different live root size
- whether the local site intentionally keeps a 16px root

If the live page uses a different root size, do not blindly copy computed px values. Recover the apparent rem/token intent first and convert it for the local root.

Before fixing typography or spacing, explicitly decide which contract applies:

- **final visible pixel parity**: match the actual browser-rendered sizes the user sees on the reference page
- **token intent parity**: preserve the source site's authored rem/token relationship and normalize it for corp-web-japan's 16px root

Record this decision in the report or PR body. Without that decision, pages with a 15px live root and a 16px local root can look "close" in source review while still rendering visibly different.

### 10. Source-backed widget contract

When the reference page is backed by a concrete upstream widget implementation, collect a source-contract inventory in addition to screenshots and DOM measurements.

Record:

- upstream route path
- upstream widget/component files
- upstream CSS module files
- local route path
- local section/component files
- whether the local implementation directly ports the upstream contract or rebuilds it
- which local compatibility layers exist for upstream buttons, icons, tabs, cards, tables, and tokens
- which upstream icon components or SVG paths are used inside CTAs, feature cards, tabs, badges, table cells, and status markers
- which upstream selectors create behavior through cascade rather than through the JSX node itself, such as `td:first-of-type`, `tbody > tr`, `asChild` typography wrappers, pseudo-elements, inherited CSS variables, and table border-collapse rules
- which remaining visual differences are caused by intentional local policy versus missing contract porting

For pricing, plan, table, tab, or application-like widgets, route-local copy ownership does not prove visual parity. The rendered browser result and the upstream component/CSS contract both need to agree.

Widget parity is not only about layout geometry. If the upstream source renders an icon component such as a button chevron SVG, the local page should not replace it with a text glyph, an external-link marker, a different arrow direction, or a visually similar character unless that substitution is explicitly approved. After a screenshot reveals a small control-level difference, inspect the upstream component source to verify whether the difference is a text node, pseudo-element, SVG path, icon component, or CSS background.

When rebuilding a CSS-module widget into Tailwind or local primitives, do not copy only the obvious class attached to the JSX element. CSS-module widgets often rely on surrounding selectors and cascade. For example, a comparison-table section row may look like a simple `<td colSpan>一般</td>`, but its left padding can come from a broad `.table td:first-of-type` rule and its typography can come from an `asChild` text primitive such as `StaticBadge`. If the local rebuild only ports the `.heading` row class, it can silently drop the inherited/cascade-derived padding and text rhythm.

Safe rule for source-backed widget migrations:

1. inspect the JSX/component chain
2. inspect every CSS selector that can match the rendered element, not only the class named in JSX
3. inspect typography wrappers using `asChild` or slot composition
4. measure the rendered reference element's computed style in the browser
5. encode the resulting local contract in tests when the rebuild is not a direct source port

## Recommended Playwright collection script

Run this from the repo root when Playwright is already available.
Save artifacts outside the repository, for example under `/tmp/render-parity`.

Update the `urls` object for the current task before running.

```js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const urls = {
  stage: "https://stage.querypie.ai/t/platforms/aip",
  live: "https://www.querypie.com/ja/solutions/aip",
};

const outDir = "/tmp/render-parity";
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

function round(n) {
  return Math.round(n * 100) / 100;
}

async function collect(page, label, viewport) {
  await page.setViewportSize(viewport);
  const requestedUrl = urls[label];

  await page.goto(requestedUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForLoadState("load", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const initial = await page.evaluate(() => ({
    finalUrl: location.href,
    title: document.title,
    scrollHeight: document.body.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  for (const y of [0, 0.2, 0.4, 0.6, 0.8, 1].map((p) => Math.floor(initial.scrollHeight * p))) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(700);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);

  await page.screenshot({
    path: path.join(outDir, `${label}-${viewport.width}x${viewport.height}.png`),
    fullPage: true,
  });

  const data = await page.evaluate(({ requestedUrl }) => {
    const round = (n) => Math.round(n * 100) / 100;
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: round(r.left),
        top: round(r.top + window.scrollY),
        width: round(r.width),
        height: round(r.height),
        right: round(r.right),
        bottom: round(r.bottom + window.scrollY),
      };
    };
    const style = (el, props) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, cs[p]]));
    };
    const backgroundLayerStyle = (el, pseudo) => {
      if (!el) return null;
      const cs = getComputedStyle(el, pseudo);
      return {
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
        backgroundSize: cs.backgroundSize,
        backgroundPosition: cs.backgroundPosition,
        backgroundRepeat: cs.backgroundRepeat,
        content: pseudo ? cs.content : undefined,
      };
    };
    const text = (el) => (el?.innerText || el?.textContent || "").replace(/\s+/g, " ").trim();

    const main = document.querySelector("main");
    const h1 = document.querySelector("main h1");
    const header = document.querySelector("header");

    return {
      requestedUrl,
      finalUrl: location.href,
      title: document.title,
      rootFontSize: getComputedStyle(document.documentElement).fontSize,
      bodyStyle: style(document.body, ["fontFamily", "fontSize", "lineHeight", "color", "backgroundColor"]),
      scrollHeight: document.body.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      header: rect(header),
      main: rect(main),
      firstH1: rect(h1),
      headerToH1: header && h1 ? round(h1.getBoundingClientRect().top - header.getBoundingClientRect().bottom) : null,
      headings: Array.from(document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6")).map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: text(el),
        rect: rect(el),
        style: style(el, ["fontSize", "lineHeight", "fontWeight", "letterSpacing", "textAlign", "color"]),
      })),
      sections: Array.from(document.querySelectorAll("main section, main article")).map((el, i) => ({
        i,
        text: text(el).slice(0, 160),
        rect: rect(el),
        style: style(el, ["backgroundColor", "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat", "paddingTop", "paddingBottom", "overflow", "overflowX", "overflowY"]),
        before: backgroundLayerStyle(el, "::before"),
        after: backgroundLayerStyle(el, "::after"),
      })),
      paragraphs: Array.from(document.querySelectorAll("main p")).slice(0, 60).map((el, i) => ({
        i,
        text: text(el).slice(0, 180),
        rect: rect(el),
        style: style(el, ["fontSize", "lineHeight", "color", "textAlign"]),
      })),
      images: Array.from(document.querySelectorAll("main img")).map((img, i) => ({
        i,
        alt: img.alt || "",
        src: img.currentSrc || img.src || "",
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        rect: rect(img),
        parentRect: rect(img.parentElement),
        sectionRect: rect(img.closest("section, article")),
      })),
      media: Array.from(document.querySelectorAll("main iframe, main video")).map((el, i) => ({
        i,
        tag: el.tagName.toLowerCase(),
        src: el.currentSrc || el.src || "",
        rect: rect(el),
        parentRect: rect(el.parentElement),
        sectionRect: rect(el.closest("section, article")),
      })),
      links: Array.from(document.querySelectorAll("main a")).map((a, i) => ({
        i,
        text: text(a),
        href: a.href,
        rect: rect(a),
        style: style(a, ["fontSize", "lineHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]),
      })),
      controlIcons: Array.from(document.querySelectorAll("main a, main button")).map((control, i) => ({
        i,
        text: text(control),
        tag: control.tagName.toLowerCase(),
        href: control instanceof HTMLAnchorElement ? control.href : null,
        rect: rect(control),
        style: style(control, ["display", "gap", "color", "fontSize", "lineHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]),
        textGlyphs: (control.textContent || "").match(/[↗→›>←‹↓↑]/g) || [],
        svgIcons: Array.from(control.querySelectorAll("svg")).map((svg, svgIndex) => ({
          svgIndex,
          viewBox: svg.getAttribute("viewBox"),
          rect: rect(svg),
          paths: Array.from(svg.querySelectorAll("path")).map((path) => path.getAttribute("d")).filter(Boolean),
          ariaHidden: svg.getAttribute("aria-hidden"),
        })),
      })).filter((item) => item.text || item.svgIcons.length || item.textGlyphs.length),
      tableCells: Array.from(document.querySelectorAll("main table th, main table td")).map((cell, i) => ({
        i,
        tag: cell.tagName.toLowerCase(),
        text: text(cell),
        colSpan: cell instanceof HTMLTableCellElement ? cell.colSpan : null,
        rowSpan: cell instanceof HTMLTableCellElement ? cell.rowSpan : null,
        rect: rect(cell),
        rowRect: rect(cell.closest("tr")),
        style: style(cell, ["fontSize", "lineHeight", "fontWeight", "letterSpacing", "textAlign", "color", "backgroundColor", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderBottomWidth", "borderBottomColor"]),
      })),
    };
  }, { requestedUrl });

  return data;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const results = {};

  for (const viewport of viewports) {
    const key = `${viewport.width}x${viewport.height}`;
    results[key] = {};
    for (const label of Object.keys(urls)) {
      const page = await context.newPage();
      results[key][label] = await collect(page, label, viewport);
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, "render-data.json"), JSON.stringify(results, null, 2));
})();
```

## Manual browser-console helpers

When Playwright is not convenient, run targeted snippets in the browser console.

### Measure a section by visible text

```js
(() => {
  const text = "シンプルな統合";
  const el = [...document.querySelectorAll("main *")].find((node) =>
    (node.innerText || node.textContent || "").trim() === text
  );
  const section = el?.closest("section, article, div");
  const r = section?.getBoundingClientRect();
  return {
    text,
    found: Boolean(el),
    sectionRect: r && {
      left: r.left,
      top: r.top + scrollY,
      width: r.width,
      height: r.height,
      right: r.right,
      bottom: r.bottom + scrollY,
    },
    headingRect: el && (() => {
      const h = el.getBoundingClientRect();
      return { left: h.left, top: h.top + scrollY, width: h.width, height: h.height };
    })(),
  };
})();
```

### Inspect table cells and cascade-derived spacing

Use this when a comparison table, pricing matrix, or feature matrix has subtle spacing differences around row headers, section headers, or first-column labels.

```js
(() =>
  [...document.querySelectorAll("main table th, main table td")].map((cell, i) => {
    const r = cell.getBoundingClientRect();
    const row = cell.closest("tr");
    const rr = row?.getBoundingClientRect();
    const cs = getComputedStyle(cell);
    return {
      i,
      tag: cell.tagName.toLowerCase(),
      text: (cell.innerText || cell.textContent || "").replace(/\s+/g, " ").trim(),
      colSpan: cell instanceof HTMLTableCellElement ? cell.colSpan : null,
      rect: { left: r.left, top: r.top + scrollY, width: r.width, height: r.height },
      rowRect: rr && { left: rr.left, top: rr.top + scrollY, width: rr.width, height: rr.height },
      style: {
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing,
        textAlign: cs.textAlign,
        paddingLeft: cs.paddingLeft,
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
      },
    };
  }).filter((item) => item.text)
)();
```

If a first-column or section-header cell differs, inspect whether the upstream style comes from a broad table selector such as `td:first-of-type` or from a typography wrapper rather than from the row class itself.

### Inspect CTA icons and glyphs

Use this when a screenshot suggests a button or card CTA differs even though the label and href match.

```js
(() =>
  [...document.querySelectorAll("main a, main button")].map((control, i) => {
    const r = control.getBoundingClientRect();
    const cs = getComputedStyle(control);
    return {
      i,
      text: (control.innerText || control.textContent || "").replace(/\s+/g, " ").trim(),
      tag: control.tagName.toLowerCase(),
      href: control instanceof HTMLAnchorElement ? control.href : null,
      rect: { left: r.left, top: r.top + scrollY, width: r.width, height: r.height },
      style: { display: cs.display, gap: cs.gap, color: cs.color, fontSize: cs.fontSize },
      textGlyphs: (control.textContent || "").match(/[↗→›>←‹↓↑]/g) || [],
      svgIcons: [...control.querySelectorAll("svg")].map((svg, svgIndex) => ({
        svgIndex,
        viewBox: svg.getAttribute("viewBox"),
        rect: (() => {
          const sr = svg.getBoundingClientRect();
          return { left: sr.left, top: sr.top + scrollY, width: sr.width, height: sr.height };
        })(),
        paths: [...svg.querySelectorAll("path")].map((path) => path.getAttribute("d")),
      })),
    };
  }).filter((item) => item.text || item.textGlyphs.length || item.svgIcons.length)
)();
```

Compare this output between the reference and target pages before declaring CTA parity. If the reference has an SVG chevron and the target has a text `↗`, the source-contract difference should be recorded even if the button size and label match.

### Measure row occupied width

Use this when an image has the right width but appears too far left or right.

```js
(() => {
  const heading = [...document.querySelectorAll("main h1, main h2, main h3, main h4")]
    .find((el) => (el.innerText || "").includes("シンプルな統合"));
  const row = heading?.closest("section")?.querySelector("div");
  const media = row?.querySelector("img, video, iframe");
  const copy = heading?.parentElement;
  const rr = row?.getBoundingClientRect();
  const mr = media?.getBoundingClientRect();
  const cr = copy?.getBoundingClientRect();
  return {
    row: rr && { left: rr.left, width: rr.width, right: rr.right },
    media: mr && { left: mr.left, width: mr.width, right: mr.right },
    copy: cr && { left: cr.left, width: cr.width, right: cr.right },
    leftRemainder: rr && mr ? mr.left - rr.left : null,
    rightRemainder: rr && cr ? rr.right - cr.right : null,
    gap: mr && cr ? Math.abs(cr.left - mr.right) : null,
    rowStyle: row && {
      display: getComputedStyle(row).display,
      flexDirection: getComputedStyle(row).flexDirection,
      justifyContent: getComputedStyle(row).justifyContent,
      alignItems: getComputedStyle(row).alignItems,
      gap: getComputedStyle(row).gap,
    },
  };
})();
```

## Reporting format

Report in this order:

1. exact URLs and viewport sizes compared
2. artifacts captured, including screenshot paths if useful
3. chrome/banner differences separated from body differences
4. desktop body parity findings
5. mobile body parity findings
6. measured evidence for each important difference
7. suspected root causes, backed by rendered measurements
8. source-contract findings, when the reference page has upstream widget/component source
9. CTA/control icon findings, including glyph versus SVG differences
10. what to inspect next in source code
11. classification: defect, intentional local adaptation, external live-site artifact, environment artifact, or needs decision

For each finding, use a compact structure:

```text
Finding: <short name>
Classification: defect | intentional adaptation | external live artifact | environment artifact | needs decision
Viewport: <size>
Evidence:
- stage: <measurement>
- live: <measurement>
Interpretation: <why the difference matters>
Likely source area: <file/component/style to inspect next>
Source contract: <direct port | measured rebuild | not source-backed | unknown>
```

## Example: AIP stage vs live comparison anchors

For the AIP comparison on 2026-05-14:

Desktop `1440 x 900`:

- Stage URL: `https://stage.querypie.ai/t/platforms/aip`
- Live URL: `https://www.querypie.com/ja/solutions/aip`
- Stage root font size: `16px`
- Live root font size: `16px`
- Stage header height: `64px`
- Live header plus language banner height: `162px`
- `header.bottom -> h1.top`: `80px` on both pages
- `h1` typography: `60px / 72px` on both pages
- Hero iframe/video: `1024 x 576` on both pages
- Feature GIF desktop widths match live: `540`, `580`, `520`, `600`, `520`, `600` px

Desktop body content was broadly aligned once chrome/banner offsets were separated.
The live page showed external cookie/language UI in a fresh browser profile; that should be classified separately from migrated body parity.

Mobile `390 x 844`:

- Stage root font size: `16px`
- Live root font size: `14px`
- Stage `h1`: `60px / 72px`, height `216px`
- Live `h1`: `48px / 56px`, height `168px`
- Stage section `h2`: `52px / 62px`
- Live section `h2`: `32px / 40px`
- Stage feature GIFs rendered at desktop widths such as `540px`, `580px`, and `600px` inside a `390px` viewport
- Live feature GIFs rendered at the mobile content width, about `342px`
- Stage feature paragraphs collapsed to around `30px` or `73px` wide in several rows
- Live feature paragraphs stayed at about `342px` wide
- Stage mobile scroll height was about `14043px`; live mobile scroll height was about `7258px`

The mobile stage page therefore had clear responsive layout defects in the feature section:

- typography stayed at desktop scale
- feature media kept desktop widths
- text columns collapsed into extremely narrow vertical columns
- long links became narrow vertical strips
- page height nearly doubled compared with live

### Feature row edge anchoring example

A later desktop comparison of the `シンプルな統合` row showed why row-level measurement matters.

The media width itself matched, but the row did not occupy the same horizontal space:

- Live row left: about `120px`
- Live row width: `1200px`
- Live media left: about `121px`
- Live media width: `580px`
- Live copy width: about `538px`
- Stage row left: about `120px`
- Stage row width: `1200px`
- Stage media left: about `200px`
- Stage media width: `580px`
- Stage copy width: about `380px`

Interpretation:

- Live occupied width was nearly the full `1200px` row.
- Stage occupied width was only `580 + 80 + 380 = 1040px`.
- Because the group was centered in the row, stage left and right remainders were about `80px` each.
- The defect was therefore the copy-column width / occupied group width, not the image width.

This is the preferred diagnostic pattern for media+copy rows: measure row, media, copy, gap, and remainders before changing image dimensions.

## Common pitfalls

- Treating screenshot diff as final proof without DOM geometry and computed styles
- Trusting screenshots without measuring DOM geometry
- Treating live cookie or language banners as migrated body defects
- Comparing absolute document top positions without accounting for different header heights
- Ignoring mobile root font-size differences
- Missing horizontal overflow because desktop looks correct
- Classifying lazy images as broken before scrolling to them
- Forgetting to check parent rects when media itself appears to have the correct intrinsic width
- Fixing source code before identifying whether the problem is typography, wrapper width, flex/grid direction, or external chrome
- Rebuilding a source-backed widget page from generic local Tailwind primitives without first checking the upstream component and CSS contract
- Copying computed px values from a live page that uses a different root size without recovering rem/token intent or deciding final-pixel parity
- Reporting every small delta as a defect without classifying whether it is intentional, external, or material

## Done criteria

A render comparison is complete when:

- exact URLs were opened directly
- requested and final URLs were recorded
- desktop and mobile were both measured
- screenshots and JSON-style geometry were captured
- screenshot diff artifacts or an explicit reason for skipping pixel diff were recorded
- lazy media was forced to load by scrolling
- chrome/banner differences were separated from body differences
- horizontal overflow was checked on mobile
- every reported defect has a rendered measurement or screenshot observation behind it
- each finding has a classification
- the next source-code inspection target is named precisely
- source-backed widget pages include an upstream component/CSS contract check and an explicit direct-port versus measured-rebuild strategy
