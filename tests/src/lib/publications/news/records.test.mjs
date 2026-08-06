import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("news list items expose stable ids for load-more URL restoration", () => {
  const source = readSource("src/lib/publications/news/records.ts");

  assert.match(source, /export type NewsPublicationListItem = \{\s*id: string;/s);
  assert.match(source, /createListItem: \(record, href\) => \(\{\s*id: record\.id,/s);
});

test("news list items are sorted by publication date, newest first", () => {
  const source = readSource("src/lib/publications/news/records.ts");

  assert.match(
    source,
    /sortRecords: \(left, right\) =>\s*right\.date\.localeCompare\(left\.date\) \|\| Number\(right\.id\) - Number\(left\.id\)/s,
  );
});
