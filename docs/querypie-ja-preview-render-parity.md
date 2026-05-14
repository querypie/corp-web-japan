# QueryPie Japan preview render parity guide

Use this guide when comparing a local/stage preview route such as `https://stage.querypie.ai/t/...` against the live QueryPie Japan source page such as `https://www.querypie.com/ja/...`.

The goal is browser-rendered parity, not only matching text content or component names.

## Exact URL rule

Always compare the exact URLs named in the task.
Do not substitute another route, redirect target, local route, or older Preview Deployment URL unless the user explicitly asks for that.

Record both URLs in the report.

## Browser evidence to collect

For every compared page, collect evidence from the real browser:

1. page title and final URL
2. viewport size
3. section order
4. heading positions and computed typography
5. major section top, height, padding, background, and width
6. key image/media rendered dimensions after lazy loading
7. card/list/grid wrapper dimensions
8. CTA text, button geometry, and link targets
9. desktop and mobile measurements when the layout is responsive

Use DOM geometry and computed styles as the primary evidence.
Screenshots and visual summaries are helpful, but do not treat them as sufficient by themselves.

## Recommended DOM measurement snippets

### Section geometry

```js
Array.from(document.querySelectorAll("main section")).map((section, i) => {
  const r = section.getBoundingClientRect();
  const cs = getComputedStyle(section);
  return {
    i,
    top: Math.round(r.top + scrollY),
    width: Math.round(r.width),
    height: Math.round(r.height),
    paddingTop: cs.paddingTop,
    paddingBottom: cs.paddingBottom,
    backgroundColor: cs.backgroundColor,
    text: (section.innerText || "").replace(/\s+/g, " ").trim().slice(0, 120),
  };
});
```

### Heading geometry

```js
Array.from(document.querySelectorAll("main h1, main h2, main h3")).map((heading) => {
  const r = heading.getBoundingClientRect();
  const cs = getComputedStyle(heading);
  return {
    text: (heading.textContent || "").replace(/\s+/g, " ").trim(),
    tag: heading.tagName.toLowerCase(),
    top: Math.round(r.top + scrollY),
    width: Math.round(r.width),
    height: Math.round(r.height),
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    fontWeight: cs.fontWeight,
  };
});
```

### Image/media geometry

For long pages, scroll near lazy-loaded images before measuring.

```js
Array.from(document.querySelectorAll("main img")).map((img) => {
  const r = img.getBoundingClientRect();
  return {
    alt: img.alt,
    top: Math.round(r.top + scrollY),
    width: Math.round(r.width),
    height: Math.round(r.height),
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    src: img.currentSrc || img.src,
  };
});
```

## Card and grid parity checks

Do not only check that card text and images exist.
For every card/list/grid section, compare the wrapper that owns the visual chrome.

Check:

- grid/list wrapper display mode, column count, width, height, and gap
- each card wrapper width and height
- whether all cards in one row share the same height
- image wrapper width/height
- title position: overlaid on image vs below image
- body padding and line wrapping
- action/link row position
- border radius, background, overflow, and shadow

### Fixed-height card rows

Some live QueryPie sections intentionally use equal-height cards in a row.
When the live row is equal-height, the preview must not allow each card's wrapper height to shrink to its own content length.

Use a measurement like this:

```js
(() => {
  const valueImages = Array.from(document.querySelectorAll("main img")).filter((img) =>
    /従量課金型|統合型|AI専門家伴走/.test((img.alt || "").replace(/\s+/g, ""))
  );

  return valueImages.map((img) => {
    let el = img;
    const chain = [];
    for (let depth = 0; el && depth < 8; depth += 1, el = el.parentElement) {
      const r = el.getBoundingClientRect();
      chain.push({
        depth,
        tag: el.tagName.toLowerCase(),
        className: String(el.className || ""),
        width: Math.round(r.width),
        height: Math.round(r.height),
        text: (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
        display: getComputedStyle(el).display,
        alignSelf: getComputedStyle(el).alignSelf,
      });
    }
    return { alt: img.alt, chain };
  });
})()
```

Interpretation:

- If the live cards all report the same wrapper height, treat that height as the row contract.
- If the preview card wrappers report different heights, classify it as a parity defect even if the grid row itself has the live height.
- A common cause is that a child wrapper or reveal wrapper stretches to the grid row height while the actual card element does not. In that case, fix the actual card element (`article`, `li`, or equivalent), not only the outer animation wrapper.
- In CSS Grid, this often means setting the card wrapper to stretch or `height: 100%` so the visual card fills the equal-height grid track.

Concrete `/t/platforms/aip` example:

- stage URL: `https://stage.querypie.ai/t/platforms/aip`
- live URL: `https://www.querypie.com/ja/solutions/aip`
- value cards: `従量課金型の AIモデル`, `統合型 AIゲートウェイ`, `AI専門家伴走 サービス`
- live card wrapper heights on desktop were equal at about `549.63px`
- stage card wrapper heights were content-dependent: about `485.63px`, `459.63px`, and `433.64px`
- stage grid/reveal wrappers still had the row height, but the visible `<article>` cards did not fill it

This is a visible parity issue because the card bottoms and link rows no longer align.

## Root font-size and rem normalization

Live `querypie.com/ja` pages may use a `15px` root font size, while this repo keeps a standard `16px` root.
When comparing rem-based typography and spacing:

1. inspect the live token or CSS rule
2. inspect the live root font size
3. inspect the preview root font size
4. decide whether the target is final visible px parity or token-intent parity

Do not blindly copy live computed pixel values into this repo when the difference is only caused by root font-size policy.

## Lazy media rule

If an image reports `0x0`, empty `currentSrc`, or `complete: false` on first measurement:

1. verify the asset URL directly
2. scroll the image near the viewport
3. wait a few seconds
4. measure again

Only classify it as missing if it still fails after entering or approaching the viewport.

## Reporting format

For each difference, report:

1. the exact page area
2. the live measurement
3. the stage/preview measurement
4. the root cause if visible from DOM/source code
5. severity: blocker, major, minor, or non-issue
6. whether it should be fixed now or only recorded for later

Separate these categories:

- actual preview defect
- acceptable local-site adaptation
- live-side quirk that should not drive migration
- follow-up decision requiring user confirmation
