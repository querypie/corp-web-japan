import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const assetsRoot = path.join(process.cwd(), "public/whitepapers");
const whitepapersRoot = path.join(process.cwd(), "src/content/whitepapers");

function listWhitepaperIds() {
  return readdirSync(whitepapersRoot)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.basename(file, ".mdx"))
    .sort((left, right) => Number(left) - Number(right));
}

test("whitepaper asset filenames do not keep redundant wp{id}- prefixes inside per-id directories", () => {
  for (const id of listWhitepaperIds()) {
    const assetDir = path.join(assetsRoot, id);
    const filenames = readdirSync(assetDir);

    for (const filename of filenames) {
      assert.doesNotMatch(filename, new RegExp(`^wp${id}-`));
    }
  }
});

test("whitepaper MDX sources do not reference redundant wp{id}-prefixed asset names", () => {
  for (const id of listWhitepaperIds()) {
    const source = readFileSync(path.join(whitepapersRoot, `${id}.mdx`), "utf8");
    assert.doesNotMatch(source, new RegExp(`/whitepapers/${id}/wp${id}-`));
    assert.doesNotMatch(source, new RegExp(`public/whitepapers/${id}/wp${id}-`));
  }
});
