import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readSource, sourceExists } from "./helpers/source-readers.mjs";

test("global not-found page reuses the site chrome and presents 404 guidance", () => {
  const file = "src/app/not-found.tsx";

  assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), true, `${file} should exist`);

  const source = readSource(file);

  assert.match(source, /<SiteHeader \/>/);
  if (sourceExists("src/content/top-page.ts")) {
    assert.match(source, /<FloatingConversionCta href=\{topPageFloatingCtaUrl\} \/>/);
  } else {
    assert.match(source, /<FloatingConversionCta href="\/contact-us" \/>/);
  }
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /404 Error/);
  assert.match(source, /お探しのページが見つかりません。/);
  assert.match(source, /トップページへ戻る/);
  assert.match(source, /お問い合わせ/);
});
