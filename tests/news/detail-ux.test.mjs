import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../helpers/source-readers.mjs";

test("news detail UX uses client-side share actions and supports direct external related links", () => {
  const postPage = readSource("src/components/sections/publication-post-page.tsx");
  const shareButtons = readSource("src/components/sections/publication/share-buttons.tsx");

  assert.match(postPage, /PublicationShareButtons/);
  assert.match(postPage, /const isExternalHref =/);
  assert.match(postPage, /target="_blank"/);

  assert.match(shareButtons, /navigator\.clipboard/);
  assert.match(shareButtons, /facebook\.com\/sharer\/sharer\.php/);
  assert.match(shareButtons, /twitter\.com\/intent\/tweet/);
  assert.match(shareButtons, /linkedin\.com\/sharing\/share-offsite/);
});
