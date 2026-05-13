import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("news list items expose stable ids for load-more URL restoration", () => {
  const source = readSource("src/lib/publications/news/records.ts");

  assert.match(source, /export type NewsPublicationListItem = \{\s*id: string;/s);
  assert.match(source, /createListItem: \(record, href\) => \(\{\s*id: record\.id,/s);
});
