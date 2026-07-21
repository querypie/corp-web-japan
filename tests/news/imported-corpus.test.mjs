import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const newsDir = path.join(process.cwd(), "src/content/news");
const blogDir = path.join(process.cwd(), "src/content/blog");
const importedIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
const migratedExternalIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const newsFilesById = new Map(
  readdirSync(newsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => [file.split("-", 1)[0], file]),
);

function listNewsIds() {
  return [...newsFilesById.keys()]
    .sort((left, right) => Number(left) - Number(right));
}

function assertMarkdownEmailLinksUseMailto(source, label) {
  for (const match of source.matchAll(markdownLinkPattern)) {
    const [, linkText, href] = match;
    const hasEmailText = emailPattern.test(linkText);
    const hasEmailHref = emailPattern.test(href);

    if (hasEmailText || hasEmailHref) {
      assert.match(href, /^mailto:/, `${label} has email Markdown link without mailto: ${match[0]}`);
    }
  }
}

test("news corpus preserves every imported news record while allowing later publications", () => {
  const newsIds = listNewsIds();

  for (const id of importedIds) assert.ok(newsIds.includes(id), `Missing imported news ${id}`);
});

test("migrated news MDX files use local news routes, route-aligned assets, and no duplicated leading H1", () => {
  for (const id of importedIds) {
    const source = readFileSync(path.join(newsDir, newsFilesById.get(id)), "utf8");
    const thumbnailPath = path.join(process.cwd(), "public", "news", id, "thumbnail.png");

    assert.match(source, new RegExp(`\\nheroImageSrc: "/news/${id}/thumbnail\\.png"\\n`));
    assert.ok(existsSync(thumbnailPath), `Missing thumbnail for news ${id}`);
    assert.doesNotMatch(source, new RegExp(`filepath="public/news/${id}/thumbnail\\.png"`));
    assert.doesNotMatch(source, /public\/assets\//);
    assert.doesNotMatch(source, /^---\n[\s\S]*?\n---\n+# /);
  }
});

test("formerly redirect-backed external news posts now render local article bodies", () => {
  for (const id of migratedExternalIds) {
    const source = readFileSync(path.join(newsDir, newsFilesById.get(id)), "utf8");

    assert.match(source, /\nsourceLabel: "メディア掲載"\n/);
    assert.doesNotMatch(source, /\nredirectUrl: "https?:\/\//);
    assert.doesNotMatch(source, /## 掲載情報/);
    assert.doesNotMatch(source, /区分: ニュース/);
    assert.match(source, /> (Source article|Original source): /);
  }
});

test("email links in news and related blog shadow records do not use relative Markdown hrefs", () => {
  const files = [
    ...readdirSync(newsDir).map((file) => path.join(newsDir, file)),
    path.join(blogDir, "25-terrasky-mitoco-buddy.mdx"),
    path.join(blogDir, "26-mitoco-buddy-release.mdx"),
  ];

  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");

    assertMarkdownEmailLinksUseMailto(source, path.relative(process.cwd(), filePath));
  }
});

test("former blog-backed news contact emails use the shared EmailLink component", () => {
  const files = [
    path.join(newsDir, "13-terrasky-mitoco-buddy-announcement.mdx"),
    path.join(newsDir, "14-mitoco-buddy-official-launch.mdx"),
    path.join(blogDir, "25-terrasky-mitoco-buddy.mdx"),
    path.join(blogDir, "26-mitoco-buddy-release.mdx"),
  ];

  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");

    assert.match(source, /<EmailLink email="pr@querypie\.com" \/>/);
    assert.doesNotMatch(source, /\[pr@querypie\.com\]\((mailto:)?pr@querypie\.com\)/);
  }
});
