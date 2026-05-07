import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper loader rewrites article download CTAs to canonical local download pages while preserving asset hrefs in frontmatter", () => {
  const getPost = readSource("src/lib/publications/whitepapers/get-post.ts");
  const records = readSource("src/lib/publications/whitepapers/records.ts");
  const record24 = readSource("src/content/whitepapers/24-ai-transformation-japan.mdx");
  const record30 = readSource("src/content/whitepapers/30-saas-end-or-evolution.mdx");

  assert.match(getPost, /const getWhitepaperPublicationPostBase = createGatedPublicationPostLoader/);
  assert.match(getPost, /getWhitepaperPublicationDownloadHref/);
  assert.match(getPost, /post\.downloadCta = \{/);
  assert.match(getPost, /href: getWhitepaperPublicationDownloadHref\(id, record\.slug\)/);
  assert.match(getPost, /external: false/);

  assert.match(records, /downloadCoverImageSrc\?: string;/);
  assert.match(records, /typeof frontmatter\.downloadCoverImageSrc === "string"/);
  assert.match(record24, /downloadCoverImageSrc: \/whitepapers\/24\/download-cover\.png/);
  assert.match(record30, /downloadCoverImageSrc: \/whitepapers\/30\/download-cover\.png/);
  assert.match(record24, /downloadCta:\n  href: "\/whitepapers\/24\/QP_Whitepaper_AI_Transformation_JP\.pdf"/);
  assert.match(record30, /downloadCta:\n  href: "\/whitepapers\/30\/QP_Whitepaper_SaaS_End_Or_Evolution_JP\.pdf"/);
});

test("whitepaper canonical download routes exist and use a dedicated gating-form page", () => {
  const idPage = readSource("src/app/whitepapers/[id]/download/page.tsx");
  const slugPage = readSource("src/app/whitepapers/[id]/[slug]/download/page.tsx");
  const gatePage = readSource("src/components/sections/whitepaper-download-gate-page.tsx");
  const previewUnlockRoute = readSource("src/app/api/gating-form/preview-unlock/route.ts");

  assert.match(idPage, /getWhitepaperPublicationDownloadHref/);
  assert.match(idPage, /redirect\(`\$\{record\.redirectUrl\}\/download`\)/);
  assert.match(idPage, /redirect\(getWhitepaperPublicationDownloadHref\(id, record\.slug\)\)/);

  assert.match(slugPage, /listWhitepaperPublicationDownloadParams/);
  assert.match(slugPage, /PREVIEW_NAVIGATION_COOKIE/);
  assert.match(slugPage, /getPreviewNavigationState/);
  assert.match(slugPage, /buildGatingCookieName\(contentKey\)/);
  assert.match(slugPage, /const alreadyUnlocked = cookieStore\.has\(buildGatingCookieName\(contentKey\)\)/);
  assert.match(slugPage, /if \(alreadyUnlocked\) \{/);
  assert.match(slugPage, /redirect\(record\.downloadCta\.href\)/);
  assert.match(slugPage, /autoUnlock=\{previewModeEnabled\}/);
  assert.match(slugPage, /coverImageSrc=\{record\.downloadCoverImageSrc \?\? record\.heroImageSrc\}/);
  assert.match(slugPage, /downloadHref=\{record\.downloadCta\.href\}/);
  assert.match(slugPage, /robots: \{\s*index: false,\s*follow: false,\s*\}/s);

  assert.match(gatePage, /useEffect\(\(\) => \{/);
  assert.match(gatePage, /if \(!autoUnlock\) \{/);
  assert.match(gatePage, /fetch\("\/api\/gating-form\/preview-unlock"/);
  assert.match(gatePage, /window\.location\.assign\(downloadHref\)/);
  assert.match(gatePage, /submitLabel="ダウンロードする"/);

  assert.match(previewUnlockRoute, /buildGatingCookieName/);
});
