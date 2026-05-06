import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../../helpers/source-readers.mjs";

test("/internal/events-demo shows the most recent event as a hero block and labels the remaining list as past events", () => {
  const file = "src/app/internal/events-demo/page.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../../src/app/internal/events-demo/page.tsx", import.meta.url)), true);
  assert.match(source, /title:\s*"Internal Events Demo \| QueryPie AI"/);
  assert.match(source, /canonical:\s*"\/internal\/events-demo"/);
  assert.match(source, /index:\s*false/);
  assert.match(source, /follow:\s*false/);
  assert.match(source, /const \[heroEvent\] = eventItems;/);
  assert.match(source, /Most Recent Event/);
  assert.match(source, /Past Events/);
  assert.match(source, /지난 이벤트/);
  assert.match(source, /<ResourceListItems items=\{eventItems\} \/>/);
});
