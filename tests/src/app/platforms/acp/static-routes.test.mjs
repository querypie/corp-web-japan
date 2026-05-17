import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const repoRoot = process.cwd();

const staticRoutes = [
  "database-access-controller",
  "system-access-controller",
  "kubernetes-access-controller",
  "web-access-controller",
];

const sourceStaticPages = [
  "solutions/acp/database-access-controller",
  "solutions/acp/system-access-controller",
  "solutions/acp/kubernetes-access-controller",
  "solutions/acp/web-access-controller",
  "solutions/acp/integrations",
];

const excludedSourcePages = [
  ["querypie/license/community/apply", "form-backed license application, not a static page"],
  ["company/contact-us", "form-backed contact page already implemented separately"],
  ["features/documentation/blog", "publication family"],
  ["features/documentation/white-paper", "publication family"],
  ["features/demo", "demo/publication family"],
];

const read = (path) => readFileSync(join(repoRoot, path), "utf8");

describe("ACP static public route rollout", () => {
  it("documents the static source inventory separately from non-static/publication pages", () => {
    assert.deepEqual(sourceStaticPages, [
      "solutions/acp/database-access-controller",
      "solutions/acp/system-access-controller",
      "solutions/acp/kubernetes-access-controller",
      "solutions/acp/web-access-controller",
      "solutions/acp/integrations",
    ]);
    assert.match(excludedSourcePages.map(([path, reason]) => `${path}: ${reason}`).join("\n"), /license application, not a static page/);
  });

  for (const route of staticRoutes) {
    it(`publishes /platforms/acp/${route} as an indexable public route`, () => {
      const page = read(`src/app/platforms/acp/${route}/page.tsx`);
      assert.match(page, new RegExp(`canonical: "/platforms/acp/${route}"`));
      assert.match(page, /index: true/);
      assert.match(page, /follow: true/);
      assert.match(page, /<SiteHeader \/>/);
      assert.match(page, /<SiteFooter \/>/);
    });
  }

  it("retargets legacy ACP child public redirect endpoints to local canonical pages", () => {
    const redirect = read("src/app/platform/security/database-access-controller/route.ts");
    assert.match(redirect, /new URL\("\/platforms\/acp\/database-access-controller", request\.url\)/);
    assert.match(redirect, /NextResponse\.redirect\(/);
    assert.throws(() => read("src/app/platforms/acp/route.ts"));
  });

  it("keeps ACP copy and assets route-aligned", () => {
    const dacPage = read("src/app/platforms/acp/database-access-controller/page.tsx");
    assert.match(dacPage, /Database Access Controller/);
    assert.match(dacPage, /RBAC \/ ABAC ベースのアクセス制御/);
    assert.match(dacPage, /\/platforms\/acp\/database-access-controller\/works\.png/);

    const integrationsPage = read("src/app/platforms/acp/integrations/page.tsx");
    assert.match(integrationsPage, /ACP統合機能/);
    assert.match(integrationsPage, /データソース/);
    assert.match(integrationsPage, /key: "data-sources"/);
    assert.match(integrationsPage, /key: "identity-providers"/);
    assert.doesNotMatch(integrationsPage, /legacyCategoryMap/);
    assert.doesNotMatch(integrationsPage, /category-\d/);
    assert.doesNotMatch(integrationsPage, /variant="acp"/);
    assert.match(integrationsPage, /\/platforms\/acp\/integrations\/icons/);
    assert.match(integrationsPage, /canonical: "\/platforms\/acp\/integrations"/);
    assert.match(integrationsPage, /index: true/);
    assert.match(integrationsPage, /follow: true/);
  });

  it("keeps controller public pages as route-authored JSX instead of section data blobs", () => {
    for (const route of staticRoutes.filter((route) => route !== "integrations")) {
      const page = read(`src/app/platforms/acp/${route}/page.tsx`);
      assert.doesNotMatch(page, /const heroDescription =/);
      assert.doesNotMatch(page, /const featureIntro =/);
      assert.doesNotMatch(page, /const keyFeatures =/);
      assert.doesNotMatch(page, /const worksBody =/);
      assert.doesNotMatch(page, /const capabilityImages =/);
      assert.match(page, /<AcpHeroTitle>/);
      assert.match(page, /<AcpFeatureCardTitle>/);
      assert.match(page, /<AcpSplitFeatureSection/);
      assert.match(page, /<AcpFaqSection>/);
      assert.match(page, /QueryPie はSaaS サービスですか？/);
      assert.match(page, /QueryPie はユーザー認証をどのように処理しますか？/);
      assert.match(page, /QueryPie はどのようなセキュリティ標準を遵守していますか？/);
      assert.match(page, /QueryPie は既存のセキュリティソリューションと互換性がありますか？/);
      assert.match(page, /<AcpPageCtaTitle>まずは小さく、失敗しないAXを始めよう<\/AcpPageCtaTitle>/);
    }
  });

  it("keeps controller pages structured like the shipped ACP static pages instead of a compressed image gallery", () => {
    const expectedRouteSections = {
      "database-access-controller": [
        "QueryPie ユニバーサルアナライザー",
        "ユーザーフレンドリーな",
        "元帳テーブルのアクセス制御",
      ],
      "system-access-controller": [
        "Webターミナル",
        "コマンド権限のアクセス制御と管理",
        "様々なプロトコルをサポート",
      ],
      "kubernetes-access-controller": [
        "簡単で高速なクラウド同期",
        "Multi-K8S 環境統合管理",
        "クバネティスアクセス権の自動設定",
      ],
      "web-access-controller": [
        "集中管理",
        "ロールと属性ベース",
        "Coming Soon",
        "URLパスの管理",
      ],
    };

    for (const [route, sectionTexts] of Object.entries(expectedRouteSections)) {
      const page = read(`src/app/platforms/acp/${route}/page.tsx`);

      assert.match(page, /<AcpSplitFeatureSection/);
      assert.doesNotMatch(page, /<AcpCapabilityGallery>/);
      assert.match(page, /<AcpPageCtaTitle>まずは小さく、失敗しないAXを始めよう<\/AcpPageCtaTitle>/);
      assert.match(page, /<AcpPageCtaLink>無料で試してみる<\/AcpPageCtaLink>/);

      for (const sectionText of sectionTexts) {
        assert.match(page, new RegExp(sectionText));
      }
    }
  });

  it("keeps each ACP child hero background aligned with the corp-web-contents source variant", () => {
    const expectedHeroBackgrounds = {
      "database-access-controller": "dac",
      "system-access-controller": "sac",
      "kubernetes-access-controller": "kac",
      "web-access-controller": "wac",
    };

    for (const [route, background] of Object.entries(expectedHeroBackgrounds)) {
      const page = read(`src/app/platforms/acp/${route}/page.tsx`);
      assert.match(page, new RegExp(`<AcpHeroSection background="${background}"`));
    }
  });

  it("uses the upstream ACP static visual contract for hero, feature cards, split sections, and CTA", () => {
    const staticPageSection = read("src/components/sections/acp/static-page.tsx");

    assert.match(staticPageSection, /max-w-\[1024px\]/);
    assert.match(staticPageSection, /linear-gradient\(180deg, #fff 30%, #dfe8f2 84%, #fff 84%, #fff 100%\)/);
    assert.match(staticPageSection, /linear-gradient\(180deg, #fff 30%, #e2e9e1 84%, #fff 84%, #fff 100%\)/);
    assert.match(staticPageSection, /linear-gradient\(180deg, #fff 30%, #e8eaf4 84%, #fff 84%, #fff 100%\)/);
    assert.match(staticPageSection, /linear-gradient\(180deg, #fff 30%, #dfeff2 84%, #fff 84%, #fff 100%\)/);
    assert.doesNotMatch(staticPageSection, /bg-linear-to-b/);
    assert.doesNotMatch(staticPageSection, /via-\[#/);
    assert.match(staticPageSection, /flex w-full max-w-\[1200px\] flex-col items-center gap-5/);
    assert.doesNotMatch(staticPageSection, /flex max-w-\[920px\] flex-col items-center gap-5/);
    assert.match(staticPageSection, /text-\[60px\] font-normal leading-\[72px\]/);
    assert.match(staticPageSection, /text-\[52px\] font-normal leading-\[62px\]/);
    assert.match(staticPageSection, /max-w-\[1200px\] flex-col gap-5/);
    assert.match(staticPageSection, /max-\[480px\]:text-\[48px\] max-\[480px\]:leading-\[56px\]/);
    assert.match(staticPageSection, /rounded-\[20px\] bg-\[#f6f8fa\] px-10 py-\[60px\]/);
    assert.match(staticPageSection, /width=\{40\} height=\{40\}/);
    assert.match(staticPageSection, /font-medium leading-\[42px\]/);
    assert.match(staticPageSection, /max-\[480px\]:text-\[20px\] max-\[480px\]:leading-7/);
    assert.match(staticPageSection, /export function AcpSplitFeatureSection/);
    assert.match(staticPageSection, /export function AcpFaqSection/);
    assert.match(staticPageSection, /export function AcpFaqItem/);
    assert.match(staticPageSection, /linear-gradient\(100deg, #0762d4 34\.93%, #875ac5 76\.81%, #c55a8c 99\.98%\)/);
    assert.match(staticPageSection, /bg-\[#f6f8fa\]/);
    assert.match(staticPageSection, /https:\/\/app\.querypie\.com/);
    assert.doesNotMatch(staticPageSection, /rounded-\[24px\] border border-slate-200 bg-white p-8 shadow-sm/);
    assert.doesNotMatch(staticPageSection, /rounded-\[32px\] bg-slate-950/);
    assert.doesNotMatch(staticPageSection, /\/contact-us\?inquiry=demo-request&product=acp/);
  });

  it("keeps ACP static section primitives UI-only", () => {
    const staticPageSection = read("src/components/sections/acp/static-page.tsx");
    assert.doesNotMatch(staticPageSection, /デモを依頼/);
    assert.doesNotMatch(staticPageSection, /features\.map/);
    assert.doesNotMatch(staticPageSection, /description\.map/);
    assert.match(staticPageSection, /export function AcpFeatureCard/);
    assert.match(staticPageSection, /export function AcpCapabilityImage/);
    assert.match(staticPageSection, /export function AcpFaqSection/);
    assert.match(staticPageSection, /export function AcpPageCtaTitle/);
  });
});
