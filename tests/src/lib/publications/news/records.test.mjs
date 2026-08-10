import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import * as yaml from "yaml";
import { readSource } from "../../../../helpers/source-readers.mjs";
import { createTsModuleLoader, toPlainJson } from "../../../../helpers/ts-module-loader.mjs";

function loadNewsRecords(fsModule = fs) {
  const loader = createTsModuleLoader({
    "node:fs": fsModule,
    "node:path": path,
    yaml,
  });

  return loader.importModule("src/lib/publications/news/records.ts");
}

test("news list items expose stable ids for load-more URL restoration", () => {
  const source = readSource("src/lib/publications/news/records.ts");

  assert.match(source, /export type NewsPublicationListItem = \{\s*id: string;/s);
  assert.match(source, /createListItem: \(record, href\) => \(\{\s*id: record\.id,/s);
});

test("news list items are sorted by publication date, newest first", () => {
  const { listNewsPublicationItems, newsPublicationRecords } = loadNewsRecords();
  const records = toPlainJson(newsPublicationRecords);
  const listItemIds = toPlainJson(listNewsPublicationItems()).map(({ id }) => id);

  assert.deepEqual(
    listItemIds,
    records.filter(({ hidden }) => !hidden).map(({ id }) => id),
  );

  for (let index = 1; index < records.length; index += 1) {
    const newer = records[index - 1];
    const older = records[index];
    const dateOrder = newer.date.localeCompare(older.date);

    assert.ok(
      dateOrder > 0 || (dateOrder === 0 && Number(newer.id) > Number(older.id)),
      `Expected ${newer.id} (${newer.date}) before ${older.id} (${older.date})`,
    );
  }
});

test("news records reject invalid calendar dates before sorting", () => {
  const invalidSource = `---
id: "1"
slug: invalid-date
title: Invalid date
description: Invalid date fixture
date: "2026-02-30"
heroImageSrc: /news/1/thumbnail.png
relatedIds: []
---
`;
  const fakeFs = {
    readdirSync: () => ["1-invalid-date.mdx"],
    readFileSync: () => invalidSource,
  };

  assert.throws(
    () => loadNewsRecords(fakeFs),
    /Invalid date in .*1-invalid-date\.mdx: 2026-02-30/,
  );
});
