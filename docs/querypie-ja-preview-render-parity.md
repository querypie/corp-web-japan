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

## Feature row and copy-column parity checks

For alternating feature rows, compare the copy column as its own layout object.
Do not only check that the media width, row direction, and row gap match.

Check:

- row wrapper width, height, display mode, direction, alignment, and gap
- copy wrapper left/top/width/height
- media wrapper left/top/width/height
- relation: copy-left/media-right vs media-left/copy-right
- heading width, font size, line height, and line count
- paragraph width, line height, and rendered line count
- row-relative vertical centering of the copy wrapper against the media wrapper
- whether a reveal/animation wrapper is the measured copy wrapper instead of the semantic copy component

Use a measurement like this:

```js
(() => {
  const titles = [
    "プロンプト自動生成",
    "シンプルな統合",
    "社内文書の学習機能",
    "カスタムエージェント作成",
    "ビジュアルレポート作成",
    "エージェントスケジューリング",
  ];
  const norm = (value) => (value || "").replace(/\s+/g, " ").trim();
  const rect = (el) => {
    const r = el.getBoundingClientRect();
    return {
      left: Math.round(r.left),
      top: Math.round(r.top + scrollY),
      width: Math.round(r.width),
      height: Math.round(r.height),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom + scrollY),
    };
  };

  return titles.map((title) => {
    const heading = Array.from(document.querySelectorAll("main h2, main h3, main h4")).find(
      (node) => norm(node.textContent) === title
    );
    if (!heading) return { title, missing: true };

    let node = heading;
    const chain = [];
    for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
      const box = node.getBoundingClientRect();
      if (box.width > 100 && box.height > 20) {
        chain.push({ depth, node, hasImage: Boolean(node.querySelector("img")), rect: rect(node) });
      }
    }

    const row = chain.find(
      (item) => item.hasImage && item.rect.width >= 900 && item.rect.width <= 1220 && item.rect.height >= 250
    )?.node;
    const image = row?.querySelector("img");
    const copy = row ? Array.from(row.children).find((child) => child.contains(heading)) : null;
    const media = row && image ? Array.from(row.children).find((child) => child.contains(image)) : null;

    return {
      title,
      row: row ? rect(row) : null,
      copy: copy ? rect(copy) : null,
      media: media ? rect(media) : null,
      heading: rect(heading),
      paragraph: copy?.querySelector("p") ? rect(copy.querySelector("p")) : null,
    };
  });
})()
```

Concrete `/t/platforms/aip` example:

- stage URL: `https://stage.querypie.ai/t/platforms/aip`
- live URL: `https://www.querypie.com/ja/solutions/aip`
- the media widths and row gap can match while the copy wrapper still differs materially
- live copy widths on desktop included about `475.97px`, `537.61px`, and `552.77px` for the first three feature rows
- stage copy widths for those same rows were about `417px`, `380px`, and `407px`
- this made the stage copy columns narrower by about `59px`, `158px`, and `146px`
- the narrower copy wrappers shifted the columns inward and changed paragraph wrapping/height
- this is a parity defect in the copy wrapper sizing/placement, not a media-width issue

For rows where the live media starts at the content area's left edge, also compare occupied row width:

- live `シンプルな統合` row:
  - row left: about `120px`
  - media left: about `121.19px`
  - media width: `580px`
  - copy left: about `781.19px`
  - copy width: about `537.61px`
  - right edge of copy: about `1318.8px`
  - the media/copy group nearly fills the `1200px` content row, leaving only about `1px` side slack
- stage `シンプルな統合` row:
  - row left: `120px`
  - media left: `200px`
  - media width: `580px`
  - copy left: `860px`
  - copy width: `380px`
  - right edge of copy: `1240px`
  - the media/copy group occupies only `1040px`, so `justify-center` leaves `80px` side slack on both sides

This explains the visible issue where the stage image starts too far from the content area's left edge even though the row direction, media width, and `80px` media-to-copy gap match live.

Implementation warning:

- avoid guessing route-local `max-w-*` values for `AipFeatureCopy`
- derive or verify the copy wrapper width from the live/source component's actual layout
- if a reveal wrapper is the direct flex child, make sure the semantic copy component still owns the intended width or that the reveal wrapper inherits it correctly

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
