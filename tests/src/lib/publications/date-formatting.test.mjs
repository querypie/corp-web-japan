import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { sourcePath, readSource } from "../../../helpers/source-readers.mjs";

const mdxRoots = ["src/content", "src/app"];
const frontmatterDatePattern = /^(\s*(?:date|effectiveDate|eventDate)\s*:\s*)(["']?)(\d{4})年(\d{1,2})月(\d{1,2})日(["']?)(\s*)$/m;
const isoDateFieldPattern = /^(\s*(?:date|effectiveDate|eventDate)\s*:\s*)"\d{4}-\d{2}-\d{2}"\s*$/m;

function listMdxFiles(relativeRoot) {
  const absoluteRoot = sourcePath(relativeRoot);
  const files = [];

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(absolutePath);
      }
    }
  }

  walk(absoluteRoot);
  return files;
}

test("MDX frontmatter date fields use ISO calendar dates as source data", () => {
  const offenders = [];
  const checkedFiles = [];

  for (const root of mdxRoots) {
    for (const filePath of listMdxFiles(root)) {
      const source = readFileSync(filePath, "utf8");
      const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n?/)?.[1] ?? "";

      if (!frontmatter) {
        continue;
      }

      if (/(?:^|\n)\s*(?:date|effectiveDate|eventDate)\s*:/.test(frontmatter)) {
        checkedFiles.push(filePath);
      }

      if (frontmatterDatePattern.test(frontmatter)) {
        offenders.push(path.relative(sourcePath("."), filePath));
      }
    }
  }

  assert.ok(checkedFiles.length > 0, "expected to scan MDX files with date frontmatter");
  assert.deepEqual(offenders, []);
});

test("publication and resource loaders render ISO source dates as Japanese display dates", () => {
  const formatterSource = readSource("src/lib/publications/format-japanese-date.ts");
  const standardRecordsSource = readSource("src/lib/publications/create-standard-records-repository.ts");
  const standardPostSource = readSource("src/lib/publications/create-standard-publication-post-loader.ts");
  const gatedPostSource = readSource("src/lib/publications/create-gated-publication-post-loader.ts");
  const resourceRecordsSource = readSource("src/lib/resources/base-resource-publication.ts");
  const resourcePostSource = readSource("src/lib/resources/base-resource-publication-post-loader.ts");
  const newsRecordsSource = readSource("src/lib/publications/news/records.ts");

  assert.match(formatterSource, /return `\$\{year\}年\$\{Number\(month\)\}月\$\{Number\(day\)\}日`/);
  assert.match(standardRecordsSource, /date: formatJapaneseDateFromIsoDate\(record\.date\)/);
  assert.match(standardPostSource, /const formatDate = config\.formatDate \?\? formatJapaneseDateFromIsoDate/);
  assert.match(standardPostSource, /date: formatDate\(frontmatter\.date\)/);
  assert.match(gatedPostSource, /date: formatJapaneseDateFromIsoDate\(frontmatter\.date\)/);
  assert.match(resourceRecordsSource, /date: record\.date \? formatJapaneseDateFromIsoDate\(record\.date\) : undefined/);
  assert.match(resourcePostSource, /date: formatJapaneseDateFromIsoDate\(evaluation\.frontmatter\.date \?\? ""\)/);
  assert.match(newsRecordsSource, /date: formatJapaneseDateFromIsoDate\(record\.date\)/);
});

test("legal MDX pages keep visible effective dates in ISO format", () => {
  const eulaSource = readSource("src/app/eula/content.mdx");
  const termsSource = readSource("src/app/terms-of-service/content.mdx");

  assert.match(eulaSource, isoDateFieldPattern);
  assert.match(eulaSource, /^\*\*Effective from 2025-07-17\*\*$/m);
  assert.match(termsSource, isoDateFieldPattern);
  assert.match(termsSource, /^\*\*Effective from 2025-06-05\*\*$/m);
});
