import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "../../../helpers/source-readers.mjs";

test("contact-us page owns the section intro copy", () => {
  const pageSource = readSource("src/app/contact-us/page.tsx");

  assert.match(pageSource, /お問い合わせ/);
  assert.match(pageSource, /製品導入のご相談、デモのご依頼、資料ダウンロード、技術的なご質問などを受け付けています。/);
  assert.match(pageSource, /担当チームより1〜2営業日以内にご連絡いたします。/);
  assert.match(pageSource, /製品や導入フェーズに応じて適切な担当が対応します。/);
});

test("contact-us form component no longer hardcodes the page intro copy", () => {
  const formSource = readSource("src/components/sections/contact-us/form.tsx");

  assert.doesNotMatch(formSource, /製品導入のご相談、デモのご依頼、資料ダウンロード、技術的なご質問などを受け付けています。/);
  assert.doesNotMatch(formSource, /担当チームより1〜2営業日以内にご連絡いたします。/);
  assert.doesNotMatch(formSource, /製品や導入フェーズに応じて適切な担当が対応します。/);
});
