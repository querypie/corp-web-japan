import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const readSource = (relativePath) =>
  readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/contact-us/submit route delegates to the contact-us submit caller", () => {
  const submitRoute = readSource("src/app/contact-us/submit/route.ts");

  assert.match(submitRoute, /submitContactUsForm/);
  assert.match(submitRoute, /request\.headers\.get\("referer"\)/);
  assert.match(submitRoute, /NextResponse\.json\(\{ success: true \}\)/);
});
