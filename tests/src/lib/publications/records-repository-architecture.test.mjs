import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

const sharedRepositoryPath = "src/lib/publications/create-standard-records-repository.ts";
const standardRecordFiles = [
  "src/lib/publications/use-case-publication-records.ts",
  "src/lib/publications/aip-demo-publication-records.ts",
  "src/lib/publications/acp-demo-publication-records.ts",
  "src/lib/publications/event-publication-records.ts",
  "src/lib/publications/blog-publication-records.ts",
  "src/lib/publications/whitepaper-publication-records.ts",
  "src/lib/publications/news-publication-records.ts",
];

test("use-case, AIP demo, ACP demo, event, blog, whitepaper, and news records share a common standard publication records repository helper", () => {
  assert.equal(existsSync(new URL("../../../../src/lib/publications/create-standard-records-repository.ts", import.meta.url)), true);

  const sharedRepository = readSource(sharedRepositoryPath);
  assert.match(sharedRepository, /export function createStandardPublicationRecordsRepository/);
  assert.match(sharedRepository, /createListItem\?: \(record: TRecord, href: string\) => TListItem/);
  assert.match(sharedRepository, /getPublicationHref/);
  assert.match(sharedRepository, /resolveRedirectablePublicationHref/);
  assert.match(sharedRepository, /const frontmatter = parseFrontmatter\(source, sourcePath\);/);
  assert.match(sharedRepository, /listParams\(\) \{\s*return records\.map\(\(\{ id, slug \}\) => \(\{ id, slug \}\)\);\s*\}/s);
  assert.doesNotMatch(sharedRepository, /basename\(/);

  for (const filePath of standardRecordFiles) {
    const source = readSource(filePath);

    assert.match(source, /createStandardPublicationRecordsRepository/);
    assert.match(source, /from "@\/lib\/publications\/create-standard-records-repository"/);
    assert.doesNotMatch(source, /function load[A-Za-z]+PublicationRecords/);
    assert.doesNotMatch(source, /function create[A-Za-z]+PublicationCache/);
    assert.doesNotMatch(source, /function get[A-Za-z]+PublicationCache/);
  }

  const newsSource = readSource("src/lib/publications/news-publication-records.ts");
  assert.match(newsSource, /createListItem: \(record, href\) => \(\{/);
  assert.match(newsSource, /sourceLabel: record\.sourceLabel \?\? \(record\.redirectUrl \? "メディア掲載" : "公式発表"\)/);
  assert.match(newsSource, /opensExternal: false/);
});
