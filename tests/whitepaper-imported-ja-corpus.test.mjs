import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const whitepapersDir = path.join(process.cwd(), "src/content/whitepapers");
const expectedIds = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
];
const whitepaperFilesById = new Map(
  readdirSync(whitepapersDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => [file.split("-", 1)[0], file]),
);

function listWhitepaperIds() {
  return [...whitepaperFilesById.keys()].sort((left, right) => Number(left) - Number(right));
}

test("whitepaper corpus includes every Japanese corp-web-contents source with a local MDX file", () => {
  assert.deepEqual(listWhitepaperIds(), expectedIds);
});

test("migrated whitepaper MDX files use local whitepaper routes and route-aligned assets", () => {
  for (const id of expectedIds) {
    const source = readFileSync(path.join(whitepapersDir, whitepaperFilesById.get(id)), "utf8");

    assert.doesNotMatch(source, /ArticleGatingForm/);
    assert.doesNotMatch(source, /href="\/features\/documentation\/white-paper\//);
    assert.doesNotMatch(source, /]\(\/features\/documentation\/white-paper\//);
    assert.doesNotMatch(source, /href="\/white-paper\//);
    assert.doesNotMatch(source, /]\(\/white-paper\//);
    assert.doesNotMatch(source, /https:\/\/(www\.)?querypie\.com\/resources\/discover\/whitepapers?\//);
    assert.doesNotMatch(source, /]\((https:\/\/(www\.)?querypie\.com)?\/resources\/discover\/whitepapers?\//);
    assert.doesNotMatch(source, /href="(https:\/\/(www\.)?querypie\.com)?\/resources\/discover\/whitepapers?\//);
    assert.doesNotMatch(source, /\/assets\/image\/whitepapers\//);
    assert.match(source, new RegExp(`\\nheroImageSrc: /whitepapers/${id}/thumbnail\\.png\\n`));

    const localAssetReference = new RegExp(`/whitepapers/${id}/|public/whitepapers/${id}/`);
    if (/ArticleFileImage|!\[[^\]]*\]\(/.test(source)) {
      assert.match(source, localAssetReference);
    }
  }
});

test("download CTA whitepapers model route-aligned PDF links in frontmatter instead of hardcoded upstream download routes", () => {
  const expected = new Map([
    ["24", "/whitepapers/24/QP_Whitepaper_AI_Transformation_JP.pdf"],
    ["25", "/whitepapers/24/QP_Whitepaper_AI_Transformation_JP.pdf"],
    ["30", "/whitepapers/30/QP_Whitepaper_SaaS_End_Or_Evolution_JP.pdf"],
  ]);

  for (const [id, href] of expected) {
    const source = readFileSync(path.join(whitepapersDir, whitepaperFilesById.get(id)), "utf8");
    const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    assert.match(source, new RegExp(`downloadCta:\\n  href: \"${escapedHref}\"`));
    assert.match(source, /label: "PDF版ホワイトペーパーを見る"/);
    assert.match(source, /external: true/);
    assert.doesNotMatch(source, /https:\/\/www\.querypie\.com\/ja\/features\/documentation\/white-paper\/\d+\/[a-z0-9-]+\/(download|pdf)/);
    assert.doesNotMatch(source, /<ButtonLink href=/);
  }
});
