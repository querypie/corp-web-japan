import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import { readSource } from "./helpers/source-readers.mjs";

const whitepapersDir = path.join(process.cwd(), "src/content/whitepapers");

function listWhitepaperMdxFiles() {
  return readdirSync(whitepapersDir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

test("whitepaper hero thumbnails use route-aligned /whitepapers/{id}/thumbnail.png paths", () => {
  for (const file of listWhitepaperMdxFiles()) {
    const source = readSource(`src/content/whitepapers/${file}`);
    const id = path.basename(file, ".mdx");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/whitepapers/${id}/thumbnail\\.png"\\n`));
    assert.doesNotMatch(source, /\/assets\/image\/whitepapers\//);
  }
});

test("whitepaper supporting surfaces do not reference the legacy /assets/image/whitepapers path", () => {
  const topPage = readSource("src/content/top-page.ts");
  const gatingDemo = readSource("src/content/internal/whitepaper-gating-demo.mdx");

  assert.match(topPage, /src: "\/whitepapers\/24\/thumbnail\.png"/);
  assert.match(gatingDemo, /\nheroImageSrc: "\/whitepapers\/24\/thumbnail\.png"\n/);
  assert.doesNotMatch(topPage, /\/assets\/image\/whitepapers\//);
  assert.doesNotMatch(gatingDemo, /\/assets\/image\/whitepapers\//);
});
