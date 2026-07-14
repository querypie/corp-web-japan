import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";

test("blog content directory contains all migrated local blog MDX posts", () => {
  const blogDir = join(process.cwd(), "src/content/blog");
  const files = readdirSync(blogDir).filter((file) => file.endsWith(".mdx")).sort();

  assert.equal(files.length, 31);
  for (const file of files) {
    assert.match(file, /^\d+-[a-z0-9-]+\.mdx$/);
    assert.doesNotMatch(file, /^\d+\.mdx$/);
  }
});
