import test from "node:test";
import assert from "node:assert/strict";
import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

test("/platforms/acp reflects the current access-control scope while keeping copy in the route", () => {
  assert.equal(sourceExists("src/app/platforms/acp/page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/acp/service-page.tsx"), true);
  assert.equal(sourceExists("src/components/sections/acp/feature-browser.tsx"), true);

  const routeSource = readSource("src/app/platforms/acp/page.tsx");
  const sectionSource = readSource("src/components/sections/acp/service-page.tsx");
  const browserSource = readSource("src/components/sections/acp/feature-browser.tsx");
  const browserClientSource = readSource("src/components/sections/acp/feature-browser-client.tsx");

  assert.match(routeSource, /canonical: "\/platforms\/acp"/);
  assert.match(routeSource, /robots:\s*\{\s*index: true,\s*follow: true,\s*\}/s);
  assert.match(routeSource, /<SiteHeader \/>/);
  assert.match(routeSource, /<SiteFooter \/>/);
  assert.match(routeSource, /アクセスを一元化し、/);
  assert.match(routeSource, /AI活用まで統制する。/);
  assert.match(routeSource, /Web\/SaaS、MCPへのアクセスを一元制御するプラットフォームです。/);
  assert.match(routeSource, /最小権限、申請・承認、監査ログ、セッション記録、DLP/);

  assert.match(routeSource, /DAC｜データアクセス制御/);
  assert.match(routeSource, /SAC｜システムアクセス制御/);
  assert.match(routeSource, /KAC｜Kubernetesアクセス制御/);
  assert.match(routeSource, /WAC｜Web\/SaaSアクセス制御/);
  assert.match(routeSource, /MAC｜MCPアクセス制御/);
  assert.match(routeSource, /acp-dac\.mp4/);
  assert.match(routeSource, /acp-mac\.mp4/);
  assert.match(routeSource, /ACP AI Pack/);
  assert.match(routeSource, /<AcpAiPackCardTitle>AI Chat<\/AcpAiPackCardTitle>/);
  assert.match(routeSource, /<AcpAiPackCardTitle>ACP MCP<\/AcpAiPackCardTitle>/);
  assert.match(routeSource, /<AcpAiPackCardTitle>AI Skills<\/AcpAiPackCardTitle>/);
  assert.match(routeSource, /href="\/contact-us\?inquiry=ai-consulting&product=acp"/);
  assert.doesNotMatch(routeSource, /learnMoreHref=/);
  assert.doesNotMatch(routeSource, /AipFreeTrialCtaSection/);
  assert.doesNotMatch(routeSource, /簡単インストール、簡単使用/);

  assert.match(sectionSource, /export function AcpHeroDiagram/);
  assert.match(sectionSource, /role-ai-agents\.png/);
  assert.match(sectionSource, /connections\.svg/);
  assert.match(sectionSource, /target-mcp\.svg/);
  assert.match(sectionSource, /stroke-dashoffset/);
  assert.match(sectionSource, /アクセス統制を、AI時代の共通基盤へ。/);
  assert.match(sectionSource, /AI活用を守り切れません。\s*<br \/>/);
  assert.match(sectionSource, /Home-ACP\.mp4#t=0\.001/);
  assert.doesNotMatch(sectionSource, /youtube\.com\/embed\/AWnknC76Jpo/);
  assert.doesNotMatch(routeSource, /AcpGovernanceSection/);
  assert.doesNotMatch(sectionSource, /export function AcpGovernanceSection/);
  assert.match(sectionSource, /export function AcpAiPackSection/);
  assert.match(sectionSource, /export function AcpAiPackVideo/);

  assert.match(browserSource, /mediaSrc: string/);
  assert.match(browserSource, /mediaAlt: string/);
  assert.match(browserClientSource, /activeMediaIsVideo/);
  assert.match(browserClientSource, /<video/);
  assert.doesNotMatch(browserClientSource, /詳細を見る/);
  assert.doesNotMatch(browserClientSource, /next\/link/);
  assert.match(browserClientSource, /ACCESS CONTROL/);
  assert.match(browserClientSource, /製品を選択/);
  assert.match(browserClientSource, /aria-live="polite"/);
  assert.match(browserClientSource, /categories\.map\(\(category, index\)/);
  assert.match(browserClientSource, /前のアクセス制御を表示/);
  assert.match(browserClientSource, /次のアクセス制御を表示/);

  const heroPrimitiveSource = readSource("src/components/sections/acp/hero-primitives.tsx");
  assert.match(heroPrimitiveSource, /max-w-\[1080px\].*text-left.*text-\[16px\]/);
});
