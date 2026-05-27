import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

test("publication post sidebar keeps the first sidebar section offset on desktop", () => {
  const source = readSource("src/components/sections/publication-post-page.tsx");

  assert.match(source, /<aside className="w-full lg:w-\[280px\] lg:flex-shrink-0">\s*<div className="space-y-\[60px\] lg:pt-\[20px\]">/);
  assert.match(source, /post\.toc\.length > 0 \? \(/);
  assert.match(source, /post\.relatedItems\.length > 0 \? \(/);
});

test("publication post sidebar contact CTA chevron inherits the button text color", () => {
  const source = readSource("src/components/sections/publication-post-page.tsx");

  assert.doesNotMatch(source, /src="\/header-assets\/stage-arrow-right\.svg"/);
  assert.match(source, /import \{ ChevronRight \} from "lucide-react";/);
  assert.match(
    source,
    /<ChevronRight\s+aria-hidden="true"\s+className="h-\[14px\] w-\[14px\] shrink-0 text-inherit"/,
  );
});
