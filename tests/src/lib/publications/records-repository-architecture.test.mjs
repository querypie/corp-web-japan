import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

const sharedRepositoryPath = "src/lib/publications/create-standard-publication-records-repository.ts";
const firstPassRecordFiles = [
  "src/lib/publications/use-case-publication-records.ts",
  "src/lib/publications/aip-demo-publication-records.ts",
  "src/lib/publications/acp-demo-publication-records.ts",
];

test("use-case, AIP demo, and ACP demo records share a common standard publication records repository helper", () => {
  assert.equal(existsSync(new URL("../../../../src/lib/publications/create-standard-publication-records-repository.ts", import.meta.url)), true);

  const sharedRepository = readSource(sharedRepositoryPath);
  assert.match(sharedRepository, /export function createStandardPublicationRecordsRepository/);
  assert.match(sharedRepository, /parse as parseYaml/);
  assert.match(sharedRepository, /getPublicationHref/);
  assert.match(sharedRepository, /resolveRedirectablePublicationHref/);

  for (const filePath of firstPassRecordFiles) {
    const source = readSource(filePath);

    assert.match(source, /createStandardPublicationRecordsRepository/);
    assert.match(source, /from "@\/lib\/publications\/create-standard-publication-records-repository"/);
    assert.doesNotMatch(source, /function load[A-Za-z]+PublicationRecords/);
    assert.doesNotMatch(source, /function create[A-Za-z]+PublicationCache/);
    assert.doesNotMatch(source, /function get[A-Za-z]+PublicationCache/);
  }
});
