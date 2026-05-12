import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../helpers/source-readers.mjs";

test("InternalEventsDemoHeroToggle renders two rectangular selectable buttons and syncs hero mode through the URL query", () => {
  const file = "src/components/sections/internal-events-demo-hero-toggle.tsx";
  const source = readSource(file);

  assert.equal(sourceExists("src/components/sections/internal-events-demo-hero-toggle.tsx"), true);
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
  assert.doesNotMatch(source, /Hero state/);
  assert.match(source, /rounded-\[14px\]/);
  assert.match(source, /aria-pressed=\{selected\}/);
});
