import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { createTsModuleLoader } from "./helpers/ts-module-loader.mjs";
import { readSource, sourcePath } from "./helpers/source-readers.mjs";

const { importModule } = createTsModuleLoader();
const {
  buildPublicationOpenGraphMetadata,
} = importModule("src/lib/publications/metadata.ts");

const mdxDetailRoutes = [
  "src/app/blog/[id]/[slug]/page.tsx",
  "src/app/whitepapers/[id]/[slug]/page.tsx",
  "src/app/news/[id]/[slug]/page.tsx",
  "src/app/events/[id]/[slug]/page.tsx",
  "src/app/use-cases/[id]/[slug]/page.tsx",
  "src/app/demo/aip/[id]/[slug]/page.tsx",
  "src/app/demo/acp/[id]/[slug]/page.tsx",
  "src/app/introduction-deck/[id]/[slug]/page.tsx",
  "src/app/glossary/[id]/[slug]/page.tsx",
  "src/app/manuals/[id]/[slug]/page.tsx",
];

test("layout, sitemap, and robots use the request deployed origin resolver", () => {
  const layout = readSource("src/app/layout.tsx");
  const sitemap = readSource("src/app/sitemap.ts");
  const robots = readSource("src/app/robots.ts");

  assert.match(layout, /generateMetadata\(\): Promise<Metadata>/);
  assert.match(layout, /metadataBase: await getRequestDeployedSiteUrl\(\)/);

  assert.match(sitemap, /const deployedSiteUrl = await getRequestDeployedSiteUrl\(\)/);
  assert.match(sitemap, /export const dynamic = "force-dynamic"/);
  assert.match(sitemap, /absoluteUrl\("\/", deployedSiteUrl\)/);
  assert.match(sitemap, /absoluteUrl\(getNewsPublicationHref\(id, slug\), deployedSiteUrl\)/);

  assert.match(robots, /const deployedSiteUrl = await getRequestDeployedSiteUrl\(\)/);
  assert.match(robots, /export const dynamic = "force-dynamic"/);
  assert.match(robots, /new URL\("\/sitemap\.xml", deployedSiteUrl\)\.toString\(\)/);
  assert.match(robots, /host: deployedSiteUrl\.toString\(\)/);
});

test("publication detail metadata resolves canonical URLs against the current request origin", () => {
  for (const routePath of mdxDetailRoutes) {
    const source = readSource(routePath);

    assert.match(
      source,
      /getRequestDeployedSiteUrl/,
      `${routePath} should import the request deployed origin resolver`,
    );
    assert.match(
      source,
      /canonicalUrl = absoluteUrl\([\s\S]*await getRequestDeployedSiteUrl\(\)\)/,
      `${routePath} should resolve canonical metadata against the current request origin`,
    );
  }
});

test("publication Open Graph and Twitter images use the canonical URL origin", () => {
  const metadata = buildPublicationOpenGraphMetadata({
    title: "News 15 | QueryPie AI",
    description: "Staged asset fixture",
    canonicalUrl: "https://stage.querypie.ai/news/15/iso-42001-certification-press-release",
    imageAlt: "News 15",
    imageSrc: "/news/15/thumbnail.png",
  });

  assert.equal(
    metadata.openGraph.url,
    "https://stage.querypie.ai/news/15/iso-42001-certification-press-release",
  );
  assert.equal(metadata.openGraph.images[0].url, "https://stage.querypie.ai/news/15/thumbnail.png");
  assert.deepEqual(
    Array.from(metadata.twitter.images),
    ["https://stage.querypie.ai/news/15/thumbnail.png"],
  );
});

test("news 15 keeps a staged-only publication asset fixture for deployed-origin metadata", () => {
  const news15 = readSource("src/content/news/15-iso-42001-certification-press-release.mdx");

  assert.match(news15, /heroImageSrc: "\/news\/15\/thumbnail\.png"/);
  assert.equal(existsSync(join(sourcePath("public"), "news/15/thumbnail.png")), true);
});
