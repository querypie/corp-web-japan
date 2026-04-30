import test from "node:test";
import assert from "node:assert/strict";
import { sourceExists, readSource } from "./helpers/source-readers.mjs";

test("/t/whitepapers is a non-indexed blog-style whitepaper list page backed by the server loader", () => {
  const source = readSource("src/app/t/whitepapers/page.tsx");

  assert.equal(sourceExists("src/app/t/whitepapers/page.tsx"), true);
  assert.match(source, /import \{ listWhitepaperPublicationItems \} from "@\/content\/publications\/whitepaper-publication-records"/);
  assert.match(source, /const whitepaperItems = await listWhitepaperPublicationItems\(\);/);
  assert.match(source, /canonical:\s*"\/t\/whitepapers"/);
  assert.match(source, /robots:\s*\{[\s\S]*index:\s*false,[\s\S]*follow:\s*false,[\s\S]*\}/);
  assert.match(source, /items=\{whitepaperItems\}/);
});
