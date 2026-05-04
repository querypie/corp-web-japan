import test from "node:test";
import assert from "node:assert/strict";
import { sourceExists, readSource } from "./helpers/source-readers.mjs";

test("/t/whitepapers redirects to the canonical /whitepapers list route", () => {
  const source = readSource("src/app/t/whitepapers/page.tsx");

  assert.equal(sourceExists("src/app/t/whitepapers/page.tsx"), true);
  assert.match(source, /import \{ redirect \} from "next\/navigation"/);
  assert.match(source, /redirect\("\/whitepapers"\)/);
  assert.doesNotMatch(source, /canonical:\s*"\/t\/whitepapers"/);
  assert.doesNotMatch(source, /items=\{whitepaperItems\}/);
});
