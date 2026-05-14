# Browser render parity comparison guide

Use this guide when comparing a corp-web-japan preview/stage page with a live QueryPie reference page by actual browser rendering.

This guide is intentionally render-first. Do not rely only on source code, page text snapshots, or visual intuition when the user reports that two pages render differently.

## When to use this guide

Use it when a task asks to compare pages such as:

- a stage or preview URL under `https://stage.querypie.ai/...`
- a live reference URL under `https://www.querypie.com/ja/...`
- a Vercel Preview Deployment URL for a PR
- a local preview URL only when the user explicitly asked for local preview verification

Typical examples:

- `https://stage.querypie.ai/t/platforms/aip`
- `https://www.querypie.com/ja/solutions/aip`

## Core principle

Compare what the browser actually rendered.

A useful comparison must combine:

1. exact URLs requested by the user
2. same viewport sizes on both pages
3. full-page screenshots
4. DOM geometry from `getBoundingClientRect()`
5. computed styles from `getComputedStyle()`
6. lazy media checks after scrolling
7. source-code inspection only after the rendered difference is identified

## Do not substitute URLs

Open the exact URLs the user gave.

Do not silently replace a requested live URL with a redirected target, canonical route, local route, or PR URL unless the user explicitly asks for that substitution.

If a page redirects, record both:

- requested URL
- final rendered URL

## Compare browser chrome separately from page body

Live QueryPie pages and corp-web-japan stage pages may intentionally have different site chrome.

Before calling a body-area difference a bug, classify whether it comes from:

- top language banner
- cookie consent banner
- global header/GNB height
- footer implementation
- the migrated body content itself

For body parity work, measure body sections relative to `main` and relative to nearby anchors, not only absolute document `top` values.

## Required viewport set

At minimum, compare:

- desktop: `1440 x 900`
- mobile: `390 x 844`

Add a narrow mobile viewport such as `320 x 844` or `360 x 844` when typography wrapping, horizontal overflow, or card gutters are part of the complaint.

## Required measurements

### 1. Page metadata and roots

Collect:

- page title
- requested URL
- final URL
- `document.body.scrollHeight`
- `getComputedStyle(document.documentElement).fontSize`
- body font family / font size / line height
- whether a cookie or language banner is visible

Root font size matters because live QueryPie pages may render under a different root size on mobile than corp-web-japan stage pages.

### 2. Header and main offset

Measure:

- header rect
- main rect
- `header.bottom -> h1.top`
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
- text alignment

For key paragraphs and links, record:

- rect width and height
- font size and line height
- color
- wrapping behavior

On Japanese pages, explicitly inspect awkward word breaks. For example, mobile headings should not split words like `プラットフォーム` or `エンタープライズAI` in obviously worse places than the live reference.

### 4. Section rhythm

For each major body section, record:

- section order
- top and height
- background color
- padding top and bottom
- first text snippet

Then classify differences as:

- missing section
- reordered section
- wrong background band
- vertical rhythm mismatch
- acceptable chrome/footer offset

### 5. Media and lazy loading

For each important image, iframe, or video, record:

- alt text
- current source URL
- natural width and height
- rendered width and height
- top position
- immediate parent rect
- whether the media is complete after scrolling

Always scroll through long pages before classifying media as missing or broken. Lazy-loaded images can initially measure as `0 x 0` or have an empty `currentSrc` before they approach the viewport.

### 6. Horizontal overflow on mobile

For mobile comparisons, explicitly check whether body text or media exceeds the viewport.

Warning signs:

- paragraph width collapses to a very narrow value such as `30px`
- images render wider than the viewport, such as `540px` or `600px` inside a `390px` viewport
- long links wrap into a narrow vertical column
- screenshots appear clipped left/right instead of scaled to the content column
- page scroll height is much larger than the live page because media/text is laid out in a broken column

### 7. CTA and link behavior

Compare:

- header CTA label and style, if chrome parity is in scope
- mid-page card links
- deep links for migrated sibling pages
- final CTA section title, body, button label, button size, and href

For preview routes, local sibling preview links may intentionally replace live public links. Record that as an implementation choice rather than a visual defect.

## Recommended Playwright collection script

Run this from the repo root when Playwright is already available.
Save artifacts outside the repository, for example under `/tmp/<task-name>`.

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

async function collect(page, label, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(urls[label], { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForLoadState("load", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (const y of [0, 0.2, 0.4, 0.6, 0.8, 1].map((p) => Math.floor(scrollHeight * p))) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(700);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);

  await page.screenshot({
    path: path.join(outDir, `${label}-${viewport.width}x${viewport.height}.png`),
    fullPage: true,
  });

  return page.evaluate(() => {
    const round = (n) => Math.round(n * 100) / 100;
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: round(r.left),
        top: round(r.top + window.scrollY),
        width: round(r.width),
        height: round(r.height),
        bottom: round(r.bottom + window.scrollY),
      };
    };
    const style = (el, props) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, cs[p]]));
    };
    const text = (el) => (el?.innerText || el?.textContent || "").replace(/\s+/g, " ").trim();

    return {
      finalUrl: location.href,
      rootFontSize: getComputedStyle(document.documentElement).fontSize,
      scrollHeight: document.body.scrollHeight,
      header: rect(document.querySelector("header")),
      main: rect(document.querySelector("main")),
      headings: Array.from(document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6")).map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: text(el),
        rect: rect(el),
        style: style(el, ["fontSize", "lineHeight", "fontWeight", "textAlign", "color"]),
      })),
      sections: Array.from(document.querySelectorAll("main section, main article")).map((el, i) => ({
        i,
        text: text(el).slice(0, 120),
        rect: rect(el),
        style: style(el, ["backgroundColor", "paddingTop", "paddingBottom", "overflow", "overflowX", "overflowY"]),
      })),
      paragraphs: Array.from(document.querySelectorAll("main p")).slice(0, 30).map((el, i) => ({
        i,
        text: text(el).slice(0, 160),
        rect: rect(el),
        style: style(el, ["fontSize", "lineHeight", "color", "textAlign"]),
      })),
      images: Array.from(document.querySelectorAll("main img")).map((img) => ({
        alt: img.alt || "",
        src: img.currentSrc || img.src || "",
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        rect: rect(img),
        parentRect: rect(img.parentElement),
      })),
      media: Array.from(document.querySelectorAll("main iframe, main video")).map((el) => ({
        tag: el.tagName.toLowerCase(),
        src: el.currentSrc || el.src || "",
        rect: rect(el),
        parentRect: rect(el.parentElement),
      })),
      links: Array.from(document.querySelectorAll("main a")).map((a) => ({
        text: text(a),
        href: a.href,
        rect: rect(a),
        style: style(a, ["fontSize", "lineHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]),
      })),
    };
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const results = {};

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
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

## Reporting format

Report in this order:

1. exact URLs and viewport sizes compared
2. artifacts captured, including screenshot paths if useful
3. chrome/banner differences separated from body differences
4. desktop body parity findings
5. mobile body parity findings
6. suspected root causes, backed by rendered measurements
7. what to inspect next in source code
8. whether the difference is a defect, an intentional local adaptation, or an external live-site artifact

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

## Common pitfalls

- Trusting screenshots without measuring DOM geometry
- Treating live cookie or language banners as migrated body defects
- Comparing absolute document top positions without accounting for different header heights
- Ignoring mobile root font-size differences
- Missing horizontal overflow because desktop looks correct
- Classifying lazy images as broken before scrolling to them
- Forgetting to check parent rects when media itself appears to have the correct intrinsic width
- Fixing source code before identifying whether the problem is typography, wrapper width, flex/grid direction, or external chrome

## Done criteria

A render comparison is complete when:

- exact URLs were opened directly
- desktop and mobile were both measured
- screenshots and JSON-style geometry were captured
- lazy media was forced to load by scrolling
- chrome/banner differences were separated from body differences
- every reported defect has a rendered measurement or screenshot observation behind it
- the next source-code inspection target is named precisely
