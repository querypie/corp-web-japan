import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

const sharedRepositoryPath = "src/lib/publications/create-standard-records-repository.ts";

const standardRecordFiles = [
  {
    filePath: "src/lib/publications/use-cases/records.ts",
  },
  {
    filePath: "src/lib/publications/demo/aip/records.ts",
  },
  {
    filePath: "src/lib/publications/demo/acp/records.ts",
  },
  {
    filePath: "src/lib/publications/events/records.ts",
    expectedMatches: [
      /getListItemBadge: \(record\) => record\.eventLabel \?\? "イベント"/,
      /createListItem: \(record, href\) => \(\{/,
      /date: formatJapaneseDateFromIsoDate\(getEffectiveEventDate\(record\)\)/,
    ],
  },
  {
    filePath: "src/lib/publications/blog/records.ts",
  },
  {
    filePath: "src/lib/publications/whitepapers/records.ts",
    expectedMatches: [/getListItemDescription: \(record\) => record\.listDescription \?\? record\.description/],
  },
  {
    filePath: "src/lib/publications/news/records.ts",
    expectedMatches: [
      /createListItem: \(record, href\) => \(\{/,
      /function getNewsPublicationSourceLabel/,
      /sourceLabel: getNewsPublicationSourceLabel\(record\)/,
      /opensExternal: false/,
    ],
  },
];

test("all current records-helper adopters on main share the common standard publication records repository helper", () => {
  assert.equal(sourceExists("src/lib/publications/create-standard-records-repository.ts"), true);

  const sharedRepository = readSource(sharedRepositoryPath);
  assert.match(sharedRepository, /export function createStandardPublicationRecordsRepository/);
  assert.match(sharedRepository, /createListItem\?: \(record: TRecord, href: string\) => TListItem/);
  assert.match(sharedRepository, /getListItemBadge\?: \(record: TRecord\) => string/);
  assert.match(sharedRepository, /getListItemDescription\?: \(record: TRecord\) => string/);
  assert.match(sharedRepository, /getPublicationHref/);
  assert.match(sharedRepository, /resolveRedirectablePublicationHref/);

  for (const { filePath, expectedMatches = [] } of standardRecordFiles) {
    const source = readSource(filePath);

    assert.match(source, /createStandardPublicationRecordsRepository/);
    assert.match(source, /from "@\/lib\/publications\/create-standard-records-repository"/);
    assert.doesNotMatch(source, /function load[A-Za-z]+PublicationRecords/);
    assert.doesNotMatch(source, /function create[A-Za-z]+PublicationCache/);
    assert.doesNotMatch(source, /function get[A-Za-z]+PublicationCache/);

    for (const expectedMatch of expectedMatches) {
      assert.match(source, expectedMatch);
    }
  }
});
