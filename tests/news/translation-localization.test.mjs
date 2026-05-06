import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const newsDir = path.join(process.cwd(), "src/content/news");
const translatedEnglishIds = ["1", "2", "3", "4", "6", "8", "9", "10", "11"];
const translatedKoreanIds = ["5", "7"];

function readNews(id) {
  return readFileSync(path.join(newsDir, `${id}.mdx`), "utf8");
}

test("news 1-11 use Japanese titles and descriptions when the original article was not Japanese", () => {
  for (const id of [...translatedEnglishIds, ...translatedKoreanIds]) {
    const source = readNews(id);

    assert.match(source, /\ntitle: ".*[ぁ-んァ-ヶ一-龯].*"\n/);
    assert.match(source, /\ndescription: ".*[ぁ-んァ-ヶ一-龯].*"\n/);
    assert.match(source, /^# .*[ぁ-んァ-ヶ一-龯].*$/m);
  }
});

test("translated external news posts place a Japanese translation before preserving the original body", () => {
  for (const id of translatedEnglishIds) {
    const source = readNews(id);
    assert.match(source, /## 日本語訳/);
    assert.match(source, /## 原文（英語）/);
    assert.match(source, /\*\*Original title:\*\* .+/);
    assert.ok(source.indexOf("## 日本語訳") < source.indexOf("## 原文（英語）"));
    assert.ok(source.indexOf("## 原文（英語）") < source.indexOf("**Original title:**"));
  }

  for (const id of translatedKoreanIds) {
    const source = readNews(id);
    assert.match(source, /## 日本語訳/);
    assert.match(source, /## 原文（韓国語）/);
    assert.ok(source.indexOf("## 日本語訳") < source.indexOf("## 原文（韓国語）"));
  }
});

test("already-Japanese local-body news posts do not gain redundant original-language sections", () => {
  for (const id of ["12", "13", "14"]) {
    const source = readNews(id);
    assert.doesNotMatch(source, /## 原文（英語）/);
    assert.doesNotMatch(source, /## 原文（韓国語）/);
  }
});
