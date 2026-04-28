import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { readSource } from "./helpers/source-readers.mjs";

const repoRoot = new URL("..", import.meta.url);
const authorsYamlPath = new URL("../src/content/authors/ja.yaml", import.meta.url);

function readCrewProfileImages() {
  const source = readFileSync(authorsYamlPath, "utf8");
  return [...source.matchAll(/profileImage:\s*(crew\/[^\s]+)/g)].map((match) => match[1]);
}

test("registered author crew profile images are normalized to the public crew/authors directory", () => {
  const source = readSource("src/lib/authors/resolve-authors.ts");

  assert.match(source, /normalized\.startsWith\("crew\/"\)/);
  assert.match(source, /return `\/crew\/authors\/\$\{normalized\.slice\("crew\/"\.length\)\}`;/);
});

test("registered author crew profile images have matching files in public/crew/authors", () => {
  const crewRelativePaths = readCrewProfileImages();

  assert.ok(crewRelativePaths.length > 0);

  for (const relativePath of crewRelativePaths) {
    const filename = relativePath.slice("crew/".length);
    const publicPath = path.join(repoRoot.pathname, "public", "crew", "authors", filename);
    assert.equal(existsSync(publicPath), true, `Expected ${publicPath} to exist for ${relativePath}`);
  }
});
