import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { readSource, sourceExists, sourcePath } from "../../../helpers/source-readers.mjs";
import { createTsModuleLoader, toPlainJson } from "../../../helpers/ts-module-loader.mjs";

const repoRoot = process.cwd();

const { importModule } = createTsModuleLoader({
  "node:fs": fs,
  "node:path": path,
  yaml: { parse },
});

const siteNoticeContent = parse(readSource("src/content/site-notice/featured.ja.yaml"));

function collectPageFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectPageFiles(absolutePath));
      continue;
    }

    if (entry.name === "page.tsx") {
      files.push(path.relative(repoRoot, absolutePath));
    }
  }

  return files.sort();
}

test("site notice surface renders on the configured internal and public pages", () => {
  const internalPageSource = readSource("src/app/internal/page.tsx");
  const expectedPageFiles = [
    "src/app/about-us/page.tsx",
    "src/app/events/page.tsx",
    "src/app/internal/page.tsx",
    "src/app/internal/site-notice/page.tsx",
    "src/app/page.tsx",
    "src/app/resources/page.tsx",
  ];
  const siteNoticePageFiles = collectPageFiles(sourcePath("src/app")).filter((file) =>
    /site-notice\/site-notice-surface|<SiteNoticeSurface\b/.test(readSource(file)),
  );

  assert.match(internalPageSource, /site-notice\/site-notice-surface/);
  assert.match(internalPageSource, /<SiteNoticeSurface \/>/);
  assert.match(internalPageSource, /export const revalidate = 3600;/);
  assert.deepEqual(siteNoticePageFiles, expectedPageFiles);

  for (const pageFile of expectedPageFiles) {
    const source = readSource(pageFile);
    assert.match(source, /site-notice\/site-notice-surface/);
    assert.match(source, /<SiteNoticeSurface\b/);
    assert.match(source, /export const revalidate = 3600;/);
  }

  assert.match(
    readSource("src/app/page.tsx"),
    /<SiteNoticeSurface className="-mt-\[72px\] flow-root lg:mt-0" \/>/,
  );
});

test("/internal/site-notice exposes the site notice operation debug surface", () => {
  const pageSource = readSource("src/app/internal/site-notice/page.tsx");

  assert.equal(sourceExists("src/app/internal/site-notice/page.tsx"), true);
  assert.equal(
    sourceExists("src/components/sections/site-notice/site-notice-data-debug-panel.tsx"),
    true,
  );
  assert.equal(
    sourceExists("src/components/sections/site-notice/site-notice-storage-debug-panel.tsx"),
    true,
  );
  assert.match(pageSource, /title:\s*"Internal Site Notice \| QueryPie AI"/);
  assert.match(pageSource, /canonical:\s*"\/internal\/site-notice"/);
  assert.match(pageSource, /index:\s*false/);
  assert.match(pageSource, /follow:\s*false/);
  assert.match(pageSource, /export const revalidate = 3600;/);
  assert.match(pageSource, /loadSiteNoticeFeaturedContent/);
  assert.match(pageSource, /parseSpotlightPositionAsof/);
  assert.match(pageSource, /parseSpotlightYPosition/);
  assert.match(pageSource, /<SiteNoticeSurface spotlightPositionAsof=\{spotlightPositionAsof\} spotlightYPosition=\{spotlightYPosition\} \/>/);
  assert.match(pageSource, /<SiteNoticeDataDebugPanel content=\{content\} \/>/);
  assert.match(pageSource, /<SiteNoticeStorageDebugPanel spotlightYPosition=\{spotlightYPosition\} \/>/);

  const dataPanelSource = readSource("src/components/sections/site-notice/site-notice-data-debug-panel.tsx");
  assert.match(dataPanelSource, /src\/content\/site-notice\/featured\.ja\.yaml/);
  assert.match(dataPanelSource, /content\.items\.map/);
  assert.match(dataPanelSource, /visibleUntil/);
  assert.match(dataPanelSource, /componentNameDebugProps\("SiteNoticeDataDebugPanel"\)/);

  const storagePanelSource = readSource("src/components/sections/site-notice/site-notice-storage-debug-panel.tsx");
  assert.match(storagePanelSource, /listSiteNoticeLocalStorageEntries/);
  assert.match(storagePanelSource, /parseSiteNoticeSpotlightVisibilityRecords/);
  assert.match(storagePanelSource, /Spotlight Y Position/);
  assert.match(storagePanelSource, /spotlightYPositionParamName/);
  assert.match(storagePanelSource, /Current override:/);
  assert.match(storagePanelSource, /Delete all site-notice data/);
  assert.match(storagePanelSource, /componentNameDebugProps\("SiteNoticeStorageDebugPanel"\)/);
});

test("site notice YAML uses local Japanese featured content and explicit visibility windows", () => {
  assert.equal(sourceExists("src/content/site-notice/featured.ja.yaml"), true);
  assert.equal(sourceExists("src/content/site-notice/featured.en.yaml"), false);
  assert.equal(sourceExists("src/content/site-notice/featured.ko.yaml"), false);
  assert.equal(siteNoticeContent.ariaLabel, "最新のお知らせ");
  assert.equal(siteNoticeContent.viewAllHref, "/news");
  assert.equal(siteNoticeContent.items.length, 4);

  const expectedItems = [
    {
      date: "2026-06-04",
      href: "/news/16/iso-42001-certification-announcement",
      id: "iso-42001-certification",
      imageSrc: "/news/16/thumbnail.png",
      visibleUntil: "2026-07-04",
    },
    {
      date: "2026-06-05",
      href: "/news/17/lingo-launch",
      id: "lingo-release",
      imageSrc: "/news/17/thumbnail.png",
      visibleUntil: "2026-07-05",
    },
    {
      date: "2026-06-09",
      href: "/news/18/notepie-launch",
      id: "notepie-release",
      imageSrc: "/news/18/thumbnail.png",
      visibleUntil: "2026-07-09",
    },
    {
      date: "2026-06-16",
      href: "/solutions/as400-cobol",
      id: "as400-cobol-modernization",
      imageSrc: "/solutions/as400-cobol/hero-modernization-flow.png",
      visibleUntil: "2026-07-16",
    },
  ];

  assert.deepEqual(
    siteNoticeContent.items.map((item) => ({
      date: item.date,
      href: item.href,
      id: item.id,
      imageSrc: item.imageSrc,
      visibleUntil: item.visibleUntil,
    })),
    expectedItems,
  );

  for (const item of siteNoticeContent.items) {
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)+$/);
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(item.visibleUntil, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(item.href, /^(?:\/news\/\d+\/|\/solutions\/as400-cobol$)/);
    assert.equal(sourceExists(`public${item.imageSrc}`), true, `${item.imageSrc} should exist`);
  }

  assert.equal(sourceExists("src/app/solutions/as400-cobol/page.tsx"), true);
});

test("site notice loader validates and filters active featured items", () => {
  const { getActiveSiteNoticeFeaturedContent, loadSiteNoticeFeaturedContent } =
    importModule("src/lib/site-notice.ts");

  const loadedContent = loadSiteNoticeFeaturedContent();
  assert.equal(loadedContent.items.length, 4);
  assert.equal(loadedContent.items[0].visibleUntil, "2026-07-04");

  const activeContent = getActiveSiteNoticeFeaturedContent({ random: () => 0, today: "2026-07-05" });
  assert.deepEqual(
    toPlainJson(activeContent.items.map((item) => item.id)),
    ["as400-cobol-modernization", "notepie-release", "lingo-release"],
  );
  assert.equal("visibleUntil" in activeContent.items[0], false);

  assert.deepEqual(
    getActiveSiteNoticeFeaturedContent({ today: "2026-07-10" }).items.map((item) => item.id),
    ["as400-cobol-modernization"],
  );
  assert.equal(getActiveSiteNoticeFeaturedContent({ today: "2026-07-17" }), null);
  assert.throws(() => getActiveSiteNoticeFeaturedContent({ today: "2026/07/05" }), /YYYY-MM-DD/);
});

test("site notice loader keeps the newest active entry first and shuffles the rest", () => {
  const { getActiveSiteNoticeFeaturedContent } = importModule("src/lib/site-notice.ts");
  const tempRoot = fs.mkdtempSync(path.join(repoRoot, ".tmp-site-notice-"));

  try {
    fs.writeFileSync(
      path.join(tempRoot, "featured.ja.yaml"),
      `
ariaLabel: "Latest notices"
badgeLabel: "Spotlight"
nextLabel: "Next"
previousLabel: "Previous"
spotlightCtaLabel: "Read more"
spotlightDismissLabel: "Dismiss spotlight"
spotlightLabel: "Spotlight"
viewAllHref: "/news"
viewAllLabel: "View all"
items:
  - id: "older-entry"
    href: "/news/1/older-entry"
    imageAlt: "Older entry"
    imageSrc: "/news/1/thumbnail.png"
    title: "Older entry"
    meta: "News"
    indicatorLabel: "Show older entry"
    spotlightMeta: "2026年6月1日"
    date: "2026-06-01"
    visibleUntil: "2026-07-01"
  - id: "latest-entry"
    href: "/news/3/latest-entry"
    imageAlt: "Latest entry"
    imageSrc: "/news/3/thumbnail.png"
    title: "Latest entry"
    meta: "News"
    indicatorLabel: "Show latest entry"
    spotlightMeta: "2026年6月3日"
    date: "2026-06-03"
    visibleUntil: "2026-07-03"
  - id: "middle-entry"
    href: "/news/2/middle-entry"
    imageAlt: "Middle entry"
    imageSrc: "/news/2/thumbnail.png"
    title: "Middle entry"
    meta: "News"
    indicatorLabel: "Show middle entry"
    spotlightMeta: "2026年6月2日"
    date: "2026-06-02"
    visibleUntil: "2026-07-02"
`,
    );

    const activeContent = getActiveSiteNoticeFeaturedContent({
      contentRoot: tempRoot,
      random: () => 0,
      today: "2026-06-04",
    });

    assert.deepEqual(
      toPlainJson(activeContent.items.map((item) => item.id)),
      ["latest-entry", "middle-entry", "older-entry"],
    );
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("site notice tracking hrefs add UTM only for QueryPie-owned URLs", () => {
  const { createSiteNoticeTrackingHref } = importModule("src/lib/site-notice-utm.ts");

  assert.equal(
    createSiteNoticeTrackingHref("/news/17/lingo-launch?ref=internal#overview", "lingo-release", "card"),
    "/news/17/lingo-launch?ref=internal&utm_campaign=lingo-release&utm_content=card&utm_id=sn_lingo-release&utm_medium=notice&utm_source=qp#overview",
  );
  assert.equal(
    createSiteNoticeTrackingHref("https://www.querypie.ai/news/18/notepie-launch", "notepie-release", "bar"),
    "/news/18/notepie-launch?utm_campaign=notepie-release&utm_content=bar&utm_id=sn_notepie-release&utm_medium=notice&utm_source=qp",
  );
  assert.equal(
    createSiteNoticeTrackingHref("https://example.com/news", "notepie-release", "card"),
    "https://example.com/news",
  );
});

test("spotlight storage helpers use 30-day localStorage visibility records", () => {
  const {
    SITE_NOTICE_SPOTLIGHT_STORAGE_KEY,
    SITE_NOTICE_SPOTLIGHT_VISIBILITY_TTL_MS,
    isSiteNoticeLocalStorageKey,
    listSiteNoticeLocalStorageEntries,
    parseSiteNoticeSpotlightVisibilityRecords,
    readSiteNoticeSpotlightVisibilityState,
    writeSiteNoticeSpotlightVisibilityRecord,
  } = importModule("src/lib/site-notice-spotlight-storage.ts");

  const state = new Map();
  const storage = {
    get length() {
      return state.size;
    },
    getItem: (key) => state.get(key) ?? null,
    key: (index) => Array.from(state.keys())[index] ?? null,
    removeItem: (key) => state.delete(key),
    setItem: (key, value) => state.set(key, value),
  };
  const now = new Date("2026-06-16T00:00:00.000Z");

  assert.equal(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY, "querypie:site-notice:spotlight:v1");
  assert.equal(SITE_NOTICE_SPOTLIGHT_VISIBILITY_TTL_MS, 30 * 24 * 60 * 60 * 1000);
  assert.equal(isSiteNoticeLocalStorageKey("QueryPie:Site-Notice:Spotlight:v1"), true);
  assert.deepEqual(toPlainJson(listSiteNoticeLocalStorageEntries(storage)), []);

  assert.equal(writeSiteNoticeSpotlightVisibilityRecord(storage, "lingo-release", "viewed", now), true);
  state.set("querypie:cookie-preference:v1", "{}");
  state.set("querypie:floating-spotlight:legacy", "legacy");

  assert.deepEqual(toPlainJson(listSiteNoticeLocalStorageEntries(storage)), [
    {
      key: "querypie:floating-spotlight:legacy",
      value: "legacy",
    },
    {
      key: SITE_NOTICE_SPOTLIGHT_STORAGE_KEY,
      value: state.get(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY),
    },
  ]);

  const records = parseSiteNoticeSpotlightVisibilityRecords(state.get(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY), now);
  assert.deepEqual(
    toPlainJson(
      records.map((record) => ({
        disposition: record.disposition,
        expiresAt: record.expiresAt,
        id: record.id,
        isExpired: record.isExpired,
        updatedAt: record.updatedAt,
      })),
    ),
    [
      {
        disposition: "viewed",
        expiresAt: "2026-07-16T00:00:00.000Z",
        id: "lingo-release",
        isExpired: false,
        updatedAt: "2026-06-16T00:00:00.000Z",
      },
    ],
  );

  assert.deepEqual(toPlainJson(readSiteNoticeSpotlightVisibilityState(storage, now)["lingo-release"]), {
    disposition: "viewed",
    expiresAt: "2026-07-16T00:00:00.000Z",
    updatedAt: "2026-06-16T00:00:00.000Z",
  });
  assert.deepEqual(
    toPlainJson(readSiteNoticeSpotlightVisibilityState(storage, new Date("2026-07-17T00:00:00.000Z"))),
    {},
  );
  assert.equal(state.has(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY), false);
});

test("spotlight position helpers map minute buckets and visible main placement", () => {
  const {
    calculateSpotlightCardTop,
    parseSpotlightPositionAsof,
    parseSpotlightYPosition,
    resolveSpotlightPositionPercentage,
    spotlightCardPositionPercentages,
    spotlightYPositionParamName,
  } = importModule("src/components/sections/site-notice/floating-spotlight-card-position.ts");

  assert.deepEqual(toPlainJson(spotlightCardPositionPercentages), [
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
  ]);
  assert.equal(spotlightYPositionParamName, "spotlightY");
  assert.deepEqual(toPlainJson(parseSpotlightPositionAsof("00:59:59")), {
    hours: 0,
    minutes: 59,
    seconds: 59,
  });
  assert.equal(parseSpotlightPositionAsof("24:00:00"), null);
  assert.equal(parseSpotlightPositionAsof("00:60:00"), null);
  assert.equal(resolveSpotlightPositionPercentage("00:03:59"), 25);
  assert.equal(resolveSpotlightPositionPercentage("00:04:00"), 30);
  assert.equal(resolveSpotlightPositionPercentage("00:59:59"), 95);
  assert.equal(resolveSpotlightPositionPercentage(undefined, new Date("2026-06-12T00:16:00.000Z")), 45);
  assert.equal(parseSpotlightYPosition("100"), 100);
  assert.equal(parseSpotlightYPosition("101"), 100);
  assert.equal(parseSpotlightYPosition("-1"), 0);
  assert.equal(resolveSpotlightPositionPercentage("00:04:00", new Date("2026-06-12T00:00:00.000Z"), 100), 100);

  assert.equal(
    calculateSpotlightCardTop({
      cardHeight: 200,
      mainContentBottom: 800,
      mainContentTop: 100,
      positionPercentage: 25,
      viewportHeight: 900,
    }),
    225,
  );
  assert.equal(
    calculateSpotlightCardTop({
      cardHeight: 200,
      mainContentBottom: 800,
      mainContentTop: 100,
      positionPercentage: 95,
      viewportHeight: 900,
    }),
    575,
  );
  assert.equal(
    calculateSpotlightCardTop({
      cardHeight: 200,
      mainContentBottom: 800,
      mainContentTop: 100,
      positionPercentage: 0,
      viewportHeight: 900,
    }),
    100,
  );
  assert.equal(
    calculateSpotlightCardTop({
      cardHeight: 200,
      mainContentBottom: 800,
      mainContentTop: 100,
      positionPercentage: 100,
      viewportHeight: 900,
    }),
    600,
  );
});

test("site notice analytics params use GA4 promotion fields", () => {
  const { createSiteNoticeAnalyticsParams } = importModule("src/lib/site-notice-analytics.ts");

  assert.deepEqual(toPlainJson(createSiteNoticeAnalyticsParams(siteNoticeContent.items[0], "card")), {
    creative_name: "AIマネジメントシステムの国際規格 ISO/IEC 42001 認証を取得",
    creative_slot: "card",
    items: [
      {
        creative_name: "AIマネジメントシステムの国際規格 ISO/IEC 42001 認証を取得",
        creative_slot: "card",
        item_id: "iso-42001-certification",
        item_name: "AIマネジメントシステムの国際規格 ISO/IEC 42001 認証を取得",
        promotion_id: "sn_iso-42001-certification",
        promotion_name: "iso-42001-certification",
      },
    ],
    promotion_id: "sn_iso-42001-certification",
    promotion_name: "iso-42001-certification",
    site_notice_destination: "/news/16/iso-42001-certification-announcement",
    site_notice_id: "iso-42001-certification",
    site_notice_surface: "card",
    site_notice_title: "AIマネジメントシステムの国際規格 ISO/IEC 42001 認証を取得",
  });
});

test("site notice components keep component-name debug markers", () => {
  assert.match(
    readSource("src/components/sections/site-notice/site-notice-surface.tsx"),
    /componentNameDebugProps\("SiteNoticeSurface"\)/,
  );
  assert.match(
    readSource("src/components/sections/site-notice/top-announcement-bar.tsx"),
    /componentNameDebugProps\("TopAnnouncementBar"\)/,
  );
  assert.match(
    readSource("src/components/sections/site-notice/floating-spotlight-card.tsx"),
    /componentNameDebugProps\("FloatingSpotlightCard"\)/,
  );
});
