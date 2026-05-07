import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("InternalEventsDemoHeroToggle renders two rectangular selectable buttons and syncs hero mode through the URL query", () => {
  const file = "src/components/sections/internal-events-demo-hero-toggle.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/internal-events-demo-hero-toggle.tsx", import.meta.url)), true);
  assert.match(source, /usePathname/);
  assert.match(source, /useRouter/);
  assert.match(source, /useSearchParams/);
  assert.match(source, /const heroModeOptions/);
  assert.match(source, /Show Upcoming Event/);
  assert.match(source, /No Upcoming Event/);
  assert.match(source, /nextSearchParams\.set\("upcoming", nextMode\)/);
  assert.match(source, /router\.replace\(`\$\{pathname\}\?\$\{nextQueryString\}`, \{ scroll: false \}\)/);
  assert.match(source, /role="group"/);
  assert.match(source, /aria-label="Internal events demo hero state"/);
  assert.match(source, /rounded-\[14px\]/);
  assert.match(source, /aria-pressed=\{selected\}/);
});
