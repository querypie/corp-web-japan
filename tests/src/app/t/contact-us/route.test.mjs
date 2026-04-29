import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/t/contact-us redirects to the public /contact-us form and preserves query strings", () => {
  assert.equal(sourceExists("src/app/t/contact-us/route.ts"), true);
  assert.equal(sourceExists("src/app/t/contact-us/page.tsx"), false);

  const route = readSource("src/app/t/contact-us/route.ts");

  assert.match(route, /export function GET\(request: NextRequest\)/);
  assert.match(route, /new URL\("\/contact-us", request\.url\)/);
  assert.match(route, /redirectedUrl\.search = request\.nextUrl\.search;/);
  assert.match(route, /NextResponse\.redirect\(redirectedUrl, 307\)/);
  assert.match(route, /export const HEAD = GET;/);
});
