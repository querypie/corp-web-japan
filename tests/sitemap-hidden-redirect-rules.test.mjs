import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const repoRoot = new URL("../", import.meta.url);

const read = (relativePath) => readFileSync(new URL(relativePath, repoRoot), "utf8");

function parseFrontmatterValue(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*[\"']?([^\"'\\n]+)`, "m"));
  return match?.[1] ?? null;
}

function listMdxRecords(relativeDir) {
  const contentRoot = new URL(relativeDir, repoRoot);

  return readdirSync(contentRoot)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = read(path.posix.join(relativeDir, file));

      return {
        file,
        hidden: /^hidden:\s*true\s*$/m.test(source),
        redirectUrl: parseFrontmatterValue(source, "redirectUrl"),
      };
    });
}

test("sitemap keeps redirect-backed hidden MDX detail routes while excluding hidden-only records", () => {
  const sitemap = read("src/app/sitemap.ts");
  const blogRecords = listMdxRecords("src/content/blog/");
  const whitepaperRecords = listMdxRecords("src/content/whitepapers/");
  const eventRecords = listMdxRecords("src/content/events/");

  const hiddenRedirectRecords = [
    ...blogRecords,
    ...whitepaperRecords,
    ...eventRecords,
  ].filter((record) => record.hidden && record.redirectUrl);

  assert.ok(hiddenRedirectRecords.length > 0, "expected redirect-backed hidden MDX fixtures in the current corpus");
  assert.match(
    sitemap,
    /function shouldIncludeRedirectableRecordInSitemap\(record: \{ hidden\?: boolean; redirectUrl\?: string \}\) \{\s*return record\.hidden !== true \|\| typeof record\.redirectUrl === "string";\s*\}/s,
  );
  assert.match(sitemap, /blogPostRecords\s*\.filter\(shouldIncludeRedirectableRecordInSitemap\)/s);
  assert.match(sitemap, /whitepaperPublicationRecords\s*\.filter\(shouldIncludeRedirectableRecordInSitemap\)/s);
  assert.match(sitemap, /eventPostRecords\s*\.filter\(shouldIncludeRedirectableRecordInSitemap\)/s);
  assert.match(sitemap, /newsPublicationRecords\s*\.filter\(shouldIncludeRedirectableRecordInSitemap\)/s);
});
