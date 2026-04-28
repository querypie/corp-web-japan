import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";

test("blog content directory contains all migrated Japanese blog MDX posts", () => {
  const blogDir = join(process.cwd(), "src/content/blog");
  const files = readdirSync(blogDir).filter((file) => file.endsWith(".mdx")).sort();

  assert.equal(files.length, 23);
  assert.deepEqual(files, [
    "1.mdx",
    "10.mdx",
    "11.mdx",
    "12.mdx",
    "18.mdx",
    "19.mdx",
    "2.mdx",
    "20.mdx",
    "21.mdx",
    "22.mdx",
    "23.mdx",
    "25.mdx",
    "26.mdx",
    "27.mdx",
    "28.mdx",
    "29.mdx",
    "3.mdx",
    "4.mdx",
    "5.mdx",
    "6.mdx",
    "7.mdx",
    "8.mdx",
    "9.mdx",
  ]);
});
