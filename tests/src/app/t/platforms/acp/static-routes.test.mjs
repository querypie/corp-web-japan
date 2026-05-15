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
  "integrations"
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

describe("ACP static preview route migration", () => {
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
    it(`adds a noindex /t/platforms/acp/${route} preview route`, () => {
      const page = read(`src/app/t/platforms/acp/${route}/page.tsx`);
      assert.match(page, new RegExp(`canonical: "/t/platforms/acp/${route}"`));
      assert.match(page, /index: false/);
      assert.match(page, /follow: false/);
      assert.match(page, /<SiteHeader \/>/);
      assert.match(page, /<SiteFooter \/>/);
    });
  }

  it("preserves the existing public ACP redirect endpoints for a later rollout", () => {
    const redirect = read("src/app/platform/security/database-access-controller/route.ts");
    assert.match(redirect, /https:\/\/www\.querypie\.com\/ja\/solutions\/acp\/database-access-controller/);
    assert.match(redirect, /NextResponse\.redirect\(destination, 307\)/);
  });

  it("keeps ACP copy and assets route-aligned", () => {
    const dacPage = read("src/app/t/platforms/acp/database-access-controller/page.tsx");
    assert.match(dacPage, /Database Access Controller/);
    assert.match(dacPage, /RBAC \/ ABAC ベースのアクセス制御/);
    assert.match(dacPage, /\/platforms\/acp\/database-access-controller\/works\.png/);

    const integrationsPage = read("src/app/t/platforms/acp/integrations/page.tsx");
    assert.match(integrationsPage, /ACP統合機能/);
    assert.match(integrationsPage, /データソース/);
    assert.match(integrationsPage, /legacyCategoryMap/);
    assert.match(integrationsPage, /\/platforms\/acp\/integrations\/icons/);
  });

  it("keeps controller preview pages as route-authored JSX instead of section data blobs", () => {
    for (const route of staticRoutes.filter((route) => route !== "integrations")) {
      const page = read(`src/app/t/platforms/acp/${route}/page.tsx`);
      assert.doesNotMatch(page, /const heroDescription =/);
      assert.doesNotMatch(page, /const featureIntro =/);
      assert.doesNotMatch(page, /const keyFeatures =/);
      assert.doesNotMatch(page, /const worksBody =/);
      assert.doesNotMatch(page, /const capabilityImages =/);
      assert.match(page, /<AcpHeroTitle>/);
      assert.match(page, /<AcpFeatureCardTitle>/);
      assert.match(page, /<AcpCapabilityImage src=/);
      assert.match(page, /<AcpPageCtaTitle>QueryPie ACPを無料でお試しください<\/AcpPageCtaTitle>/);
    }
  });

  it("keeps ACP static section primitives UI-only", () => {
    const staticPageSection = read("src/components/sections/acp/static-page.tsx");
    assert.doesNotMatch(staticPageSection, /QueryPie ACPを無料でお試しください/);
    assert.doesNotMatch(staticPageSection, /デモを依頼/);
    assert.doesNotMatch(staticPageSection, /features\.map/);
    assert.doesNotMatch(staticPageSection, /description\.map/);
    assert.match(staticPageSection, /export function AcpFeatureCard/);
    assert.match(staticPageSection, /export function AcpCapabilityImage/);
    assert.match(staticPageSection, /export function AcpPageCtaTitle/);
  });
});
