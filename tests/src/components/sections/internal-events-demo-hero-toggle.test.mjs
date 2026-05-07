import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource } from "../../../helpers/source-readers.mjs";

test("InternalEventsDemoHeroToggle syncs the upcoming-event hero mode through the URL query", () => {
  const file = "src/components/sections/internal-events-demo-hero-toggle.tsx";
  const source = readSource(file);

  assert.equal(existsSync(new URL("../../../../src/components/sections/internal-events-demo-hero-toggle.tsx", import.meta.url)), true);
  assert.match(source, /usePathname/);
  assert.match(source, /useRouter/);
  assert.match(source, /useSearchParams/);
  assert.match(source, /nextSearchParams\.set\("upcoming", "none"\)/);
  assert.match(source, /nextSearchParams\.delete\("upcoming"\)/);
  assert.match(source, /router\.replace\(nextQueryString \? `\$\{pathname\}\?\$\{nextQueryString\}` : pathname, \{ scroll: false \}\)/);
  assert.match(source, /Show Upcoming Event/);
  assert.match(source, /No Upcoming Event/);
});
