import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const categoryPages = [
  ["src/app/resources/page.tsx", "リソース", "製品・サービスを理解し、導入・活用を進めるための情報"],
  ["src/app/introduction-deck/page.tsx", "紹介資料", "製品・サービスの概要、主な機能、導入イメージ"],
  ["src/app/glossary/page.tsx", "用語集", "AI、AIエージェント、MCP、アクセス制御"],
  ["src/app/manuals/page.tsx", "マニュアル", "導入、設定、日常的な利用、運用"],
  ["src/app/whitepapers/page.tsx", "ホワイトペーパー", "AI導入・活用、ガバナンス、業務変革"],
  ["src/app/blog/page.tsx", "ブログ", "AI、セキュリティ、エンタープライズ導入"],
];

test("resource category pages use category-specific hero copy", () => {
  for (const [path, title, lead] of categoryPages) {
    const source = readSource(path);
    assert.match(source, new RegExp(`ResourceListHeroTitle(?: className="[^"]+")?>${title}<\\/ResourceListHeroTitle>`));
    assert.match(source, new RegExp(lead));
    assert.doesNotMatch(source, /包括的なガイド、技術マニュアル、業界ホワイトペーパー/);
  }
});

test("resource category heroes keep titles and lead copy in a balanced reading width", () => {
  const source = readSource("src/components/sections/resource-list-section.tsx");

  assert.match(source, /mx-auto max-w-\[900px\] text-\[40px\][\s\S]*sm:text-\[52px\][\s\S]*lg:text-\[56px\]/);
  assert.match(source, /mx-auto mt-5 max-w-\[760px\] text-\[16px\] font-light leading-\[26px\][\s\S]*lg:text-\[16px\] lg:leading-\[26px\]/);
  assert.match(source, /pb-14 pt-\[120px\][\s\S]*lg:pb-16 lg:pt-\[152px\]/);
});

test("the resource and event hubs align their Hero copy with the thumbnail column", () => {
  const source = readSource("src/app/resources/page.tsx");
  const eventsSource = readSource("src/app/events/page.tsx");

  assert.match(source, /<ResourceListHeroSection className="text-left lg:pl-\[300px\]">/);
  assert.match(source, /<ResourceListHeroTitle className="!mx-0 max-w-\[760px\]">リソース<\/ResourceListHeroTitle>/);
  assert.match(
    source,
    /<ResourceListHeroDescription className="!mx-0 max-w-\[760px\] text-left text-\[16px\] leading-\[26px\] lg:text-\[16px\] lg:leading-\[26px\]">/,
  );
  assert.match(eventsSource, /<ResourceListHeroSection className="text-left lg:pl-\[300px\]">/);
  assert.match(eventsSource, /<ResourceListHeroTitle className="!mx-0 max-w-\[760px\]">イベント<\/ResourceListHeroTitle>/);
  assert.match(
    eventsSource,
    /<ResourceListHeroDescription className="!mx-0 max-w-\[760px\] text-left text-\[16px\] leading-\[26px\] lg:text-\[16px\] lg:leading-\[26px\]">/,
  );
});

test("resource category heroes align with the thumbnail column on desktop", () => {
  for (const path of [
    "src/app/introduction-deck/page.tsx",
    "src/app/glossary/page.tsx",
    "src/app/manuals/page.tsx",
    "src/app/whitepapers/page.tsx",
    "src/app/blog/page.tsx",
  ]) {
    const source = readSource(path);

    assert.match(source, /<ResourceListHeroSection className="text-left lg:pl-\[300px\]">/);
    assert.match(source, /<ResourceListHeroTitle className="!mx-0 max-w-\[760px\]">/);
    assert.match(
      source,
      /<ResourceListHeroDescription className="!mx-0 max-w-\[728px\] text-left text-\[16px\] leading-\[26px\] lg:text-\[16px\] lg:leading-\[26px\]">/,
    );
  }
});

test("use-case and platform demo heroes align with the thumbnail column and use focused copy", () => {
  const pages = [
    ["src/app/use-cases/page.tsx", "活用事例", "課題から導入・定着までの取り組み"],
    ["src/app/demo/aip/page.tsx", "QueryPie AIPの機能", "AIエージェントの構築・実行から、データ連携、管理・統制まで。"],
    ["src/app/demo/acp/page.tsx", "QueryPie ACPの機能", "Kubernetes、Web\/SaaS、MCPへのアクセスを一元統制。"],
  ];

  for (const [path, title, lead] of pages) {
    const source = readSource(path);

    assert.match(source, /<ResourceListHeroSection className="text-left lg:pl-\[300px\]">/);
    assert.match(source, new RegExp(`<ResourceListHeroTitle className="!mx-0 max-w-\\[760px\\]">${title}<\\/ResourceListHeroTitle>`));
    assert.match(source, /<ResourceListHeroDescription className="!mx-0 max-w-\[760px\] text-left text-\[16px\] leading-\[26px\] lg:text-\[16px\] lg:leading-\[26px\]">/);
    assert.match(source, new RegExp(lead));
    assert.doesNotMatch(source, /ライブデモを視聴し、実際のユースケースをご覧になってください。/);
  }
});
