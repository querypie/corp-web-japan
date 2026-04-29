import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const TARGET_ROOT = path.join(process.cwd(), "src", "content", "blog");
const SOURCE_PARITY_FIXTURE_PATH = path.join(process.cwd(), "tests", "fixtures", "blog-migrated-ja-source-parity.json");

function parseFrontmatterBlock(source, filePath) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);

  assert.ok(match, `Missing frontmatter block in ${filePath}`);
  return match[1];
}

function parseSimpleFrontmatter(source, filePath) {
  const block = parseFrontmatterBlock(source, filePath);
  const parsed = parseYaml(block);

  assert.ok(parsed && typeof parsed === "object", `Failed to parse frontmatter in ${filePath}`);
  return parsed;
}

function listExpectedSourceParity() {
  return JSON.parse(readFileSync(SOURCE_PARITY_FIXTURE_PATH, "utf8"));
}

function listTargetPosts() {
  return readdirSync(TARGET_ROOT)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const id = name.replace(/\.mdx$/, "");
      const filePath = path.join(TARGET_ROOT, name);
      const frontmatter = parseSimpleFrontmatter(readFileSync(filePath, "utf8"), filePath);

      return {
        id,
        slug: frontmatter.slug,
        title: frontmatter.title,
        description: frontmatter.description,
        author: frontmatter.author || null,
      };
    })
    .sort((left, right) => Number(left.id) - Number(right.id));
}

test("all Japanese corp-web-contents blog posts are migrated locally with matching id/slug/title/description/author parity", () => {
  const sourcePosts = listExpectedSourceParity();
  const targetPosts = listTargetPosts();

  assert.equal(targetPosts.length, sourcePosts.length);
  assert.deepEqual(
    targetPosts.map(({ id, slug, title, description, author }) => ({ id, slug, title, description, author })),
    sourcePosts.map(({ id, slug, title, description, author }) => ({ id, slug, title, description, author })),
  );
});
