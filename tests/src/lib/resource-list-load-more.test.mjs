import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

const source = readSource("src/lib/resource-list-load-more.ts");

test("resource list load-more helper uses 12 items for both default and incremental chunk sizing", () => {
  assert.match(source, /export const DEFAULT_RESOURCE_LIST_CHUNK_SIZE = 12;/);
  assert.doesNotMatch(source, /export const DEFAULT_RESOURCE_LIST_CHUNK_SIZE = 8;/);
});
