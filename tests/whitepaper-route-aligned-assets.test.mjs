import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { readSource } from "./helpers/source-readers.mjs";
import { getTopPageDataSource } from "./helpers/static-marketing-page-sources.mjs";

const whitepapersDir = path.join(process.cwd(), "src/content/whitepapers");

function listWhitepaperMdxFiles() {
  return readdirSync(whitepapersDir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

test("whitepaper hero thumbnails use route-aligned /whitepapers/{id}/thumbnail.png paths", () => {
  for (const file of listWhitepaperMdxFiles()) {
    const source = readSource(`src/content/whitepapers/${file}`);
    const id = file.split("-", 1)[0];

    assert.match(source, new RegExp(`\nheroImageSrc: ?(?:\"|')?/whitepapers/${id}/thumbnail\.png(?:\"|')?\n`));
    assert.doesNotMatch(source, /\/assets\/image\/whitepapers\//);
  }
});

test("whitepaper supporting surfaces do not reference the legacy /assets/image/whitepapers path", () => {
  const topPage = getTopPageDataSource();
  const topPagePage = readSource("src/app/page.tsx");
  const topPageWhitepapersSection = readSource("src/components/sections/home/whitepapers-section.tsx");
  const gatingDemo = readSource("src/content/internal/whitepaper-gating-demo.mdx");

  assert.match(`${topPage}\n${topPagePage}\n${topPageWhitepapersSection}`, /src: "\/whitepapers\/24\/thumbnail\.png"|<WhitepaperCardImage src="\/whitepapers\/24\/thumbnail\.png"/);
  assert.match(gatingDemo, /\nheroImageSrc: "\/whitepapers\/24\/thumbnail\.png"\n/);
  assert.doesNotMatch(`${topPage}\n${topPagePage}\n${topPageWhitepapersSection}`, /\/assets\/image\/whitepapers\//);
  assert.doesNotMatch(gatingDemo, /\/assets\/image\/whitepapers\//);
});

test("download CTA PDF assets live under route-aligned whitepaper public directories", () => {
  assert.equal(existsSync(path.join(process.cwd(), "public/whitepapers/24/QP_Whitepaper_AI_Transformation_JP.pdf")), true);
  assert.equal(existsSync(path.join(process.cwd(), "public/whitepapers/30/QP_Whitepaper_SaaS_End_Or_Evolution_JP.pdf")), true);
  assert.equal(existsSync(path.join(process.cwd(), "public/whitepapers/24/download-cover.png")), true);
  assert.equal(existsSync(path.join(process.cwd(), "public/whitepapers/30/download-cover.png")), true);
});
