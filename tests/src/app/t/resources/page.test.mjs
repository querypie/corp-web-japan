import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/t/resources page exists with noindex metadata and canonical preview path", () => {
  const file = "src/app/t/resources/page.tsx";
  assert.equal(existsSync(new URL(`../../../../../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);
  assert.match(source, /canonical: "\/t\/resources"/);
  assert.match(source, /title: "ドキュメント \| QueryPie AI"/);
  assert.match(source, /robots:\s*\{\s*index: false,\s*follow: false,\s*\}/s);
  assert.match(source, /const sidebarLinks: readonly ResourceCategoryLink\[] = \[/);
  assert.match(source, /\{ label: "全て", href: "\/t\/resources" \}/);
  assert.match(source, /listResourcePreviewItems/);
});
