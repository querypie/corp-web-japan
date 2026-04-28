import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("whitepaper 24 keeps the gated source wrapper while current rendering remains ungated", () => {
  const whitepaper24 = readSource("src/content/whitepapers/24.mdx");
  const mdxComponents = readSource("src/lib/publications/mdx/components.tsx");

  assert.match(whitepaper24, /<ArticleGatingForm>/);
  assert.match(whitepaper24, /<\/ArticleGatingForm>/);
  assert.match(mdxComponents, /function ArticleGatingForm\(/);
  assert.match(mdxComponents, /return <>{children}<\/>;/);
});
