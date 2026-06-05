import test from "node:test";
import assert from "node:assert/strict";
import { readSource } from "./helpers/source-readers.mjs";

const contractSource = readSource("src/lib/component-name-debug.ts");
const overlaySource = readSource("src/components/layout/component-name-debug-overlay.tsx");
const menuSectionSource = readSource("src/components/layout/component-name-debug-menu-section.tsx");
const previewToggleSource = readSource("src/components/layout/preview-mode-toggle.tsx");
const siteHeaderSource = readSource("src/components/layout/site-header-client.tsx");
const overlayStyles = readSource("src/components/layout/component-name-debug-overlay.module.css");
const siteFooterSource = readSource("src/components/layout/site-footer.tsx");
const homePageSource = readSource("src/app/page.tsx");
const aiCrewPageSource = readSource("src/app/solutions/ai-crew/page.tsx");
const aiDashiPageSource = readSource("src/app/solutions/ai-dashi/page.tsx");
const homeHeroSectionsSource = readSource("src/components/sections/home/hero-section.tsx");
const homeSolutionOverviewSectionsSource = readSource("src/components/sections/home/solution-overview-section.tsx");
const aiCrewHeroSectionsSource = readSource("src/components/sections/ai-crew/hero-section.tsx");
const aiCrewResultsSectionsSource = readSource("src/components/sections/ai-crew/results-section.tsx");
const aiDashiHeroSectionsSource = readSource("src/components/sections/ai-dashi/hero-section.tsx");
const aiDashiValuesSectionsSource = readSource("src/components/sections/ai-dashi/values-section.tsx");
const aipPageSectionsSource = readSource("src/components/sections/aip/page.tsx");
const fdePageSectionsSource = readSource("src/components/sections/fde/service-page.tsx");
const publicationPostPageSource = readSource("src/components/sections/publication-post-page.tsx");
const resourceListSectionsSource = readSource("src/components/sections/resource-list-section.tsx");
const resourceListLoadMoreSource = readSource("src/components/sections/resource-list-load-more.tsx");
const newsListSectionsSource = readSource("src/components/sections/news/page-section.tsx");
const newsArticleListSource = readSource("src/components/sections/news/list-page.tsx");
const newsArticleLoadMoreSource = readSource("src/components/sections/news/list-load-more.tsx");
const companyPagePrimitivesSource = readSource("src/components/sections/company/page-primitives.tsx");
const aboutUsSectionsSource = readSource("src/components/sections/about-us/section.tsx");
const blogListPageSource = readSource("src/app/blog/page.tsx");
const whitepapersListPageSource = readSource("src/app/whitepapers/page.tsx");
const resourcesListPageSource = readSource("src/app/resources/page.tsx");
const useCasesListPageSource = readSource("src/app/use-cases/page.tsx");
const aipDemoListPageSource = readSource("src/app/demo/aip/page.tsx");
const acpDemoListPageSource = readSource("src/app/demo/acp/page.tsx");
const newsListPageSource = readSource("src/app/news/page.tsx");
const eventsListPageSource = readSource("src/app/events/page.tsx");
const introductionDeckListPageSource = readSource("src/app/introduction-deck/page.tsx");
const glossaryListPageSource = readSource("src/app/glossary/page.tsx");
const manualsListPageSource = readSource("src/app/manuals/page.tsx");
const aboutUsPageSource = readSource("src/app/about-us/page.tsx");
const blogPostRouteSource = readSource("src/app/blog/[id]/[slug]/page.tsx");
const whitepaperPostRouteSource = readSource("src/app/whitepapers/[id]/[slug]/page.tsx");
const newsPostRouteSource = readSource("src/app/news/[id]/[slug]/page.tsx");
const eventPostRouteSource = readSource("src/app/events/[id]/[slug]/page.tsx");
const useCasePostRouteSource = readSource("src/app/use-cases/[id]/[slug]/page.tsx");
const aipDemoPostRouteSource = readSource("src/app/demo/aip/[id]/[slug]/page.tsx");
const acpDemoPostRouteSource = readSource("src/app/demo/acp/[id]/[slug]/page.tsx");
const introductionDeckPostRouteSource = readSource("src/app/introduction-deck/[id]/[slug]/page.tsx");
const glossaryPostRouteSource = readSource("src/app/glossary/[id]/[slug]/page.tsx");
const manualPostRouteSource = readSource("src/app/manuals/[id]/[slug]/page.tsx");

test("Component Name Debug uses a production-capable build-time code constant", () => {
  assert.match(contractSource, /export const COMPONENT_NAME_DEBUG_ENABLED = true;/);
  assert.doesNotMatch(contractSource, /process\.env/);
  assert.match(contractSource, /export function isComponentNameDebugEnabled\(\)/);
  assert.match(siteHeaderSource, /showPreviewModeToggle \|\| componentNameDebugEnabled/);
});

test("Component Name Debug exposes the required mode order and shortcut cycle", () => {
  assert.match(contractSource, /value: "off",[\s\S]*?label: "Off"/);
  assert.match(contractSource, /value: "pointer",[\s\S]*?label: "Pointer"/);
  assert.match(contractSource, /value: "ancestors",[\s\S]*?label: "Pointer \+ Ancestors"/);
  assert.match(contractSource, /value: "always",[\s\S]*?label: "Always"/);
  assert.match(contractSource, /nextComponentNameDebugMode/);
  assert.match(overlaySource, /event\.altKey/);
  assert.match(overlaySource, /event\.shiftKey/);
  assert.match(overlaySource, /event\.code !== "KeyN"/);
  assert.match(overlaySource, /shouldIgnoreComponentNameDebugShortcut/);
  assert.match(overlaySource, /tagName === "INPUT"/);
  assert.match(overlaySource, /tagName === "TEXTAREA"/);
  assert.match(overlaySource, /tagName === "SELECT"/);
});

test("Component Name Debug reads validated data-component-name markers", () => {
  assert.match(contractSource, /componentNameDebugAttribute = "data-component-name"/);
  assert.ok(contractSource.includes("const componentNamePattern = /^[A-Z][A-Za-z0-9_]*$/;"));
  assert.match(contractSource, /throw new Error\(`Invalid component name debug marker/);
  assert.ok(overlaySource.includes("querySelectorAll(`[${componentNameDebugAttribute}]`)"));
  assert.match(siteHeaderSource, /componentNameDebugProps\("SiteHeader"\)/);
  assert.match(siteHeaderSource, /componentNameDebugProps\("SiteHeaderNav"\)/);
  assert.match(siteHeaderSource, /componentNameDebugProps\("SiteHeaderActions"\)/);
});

test("Component Name Debug overlay implements pointer, ancestors, Always, and label placement", () => {
  assert.match(overlaySource, /mode === "always"/);
  assert.match(overlaySource, /collectVisibleComponentNameDebugTargets/);
  assert.match(overlaySource, /maxAlwaysComponentNameDebugLabels = 120/);
  assert.match(overlaySource, /mode === "pointer"/);
  assert.match(overlaySource, /leftBottom/);
  assert.match(overlaySource, /rightTop/);
  assert.match(overlaySource, /translateX\(-100%\)/);
  assert.doesNotMatch(overlaySource, /topLeft/);
  assert.match(overlayStyles, /pointer-events:\s*none;/);
  assert.match(overlayStyles, /pointer-events:\s*auto;/);
  assert.match(overlayStyles, /cursor:\s*copy;/);
});

test("Component Name Debug labels copy component names to Clipboard", () => {
  assert.match(overlaySource, /navigator\.clipboard/);
  assert.match(overlaySource, /writeText\(componentName\)/);
  assert.match(overlaySource, /componentNameDebugLabelCopyAttribute/);
  assert.match(overlaySource, /isComponentNameDebugCopyLabel/);
  assert.match(overlaySource, /void copyComponentNameToClipboard\(label\.name\)/);
});

test("Preview toggle menu hosts Component Name Debug independently from preview controls", () => {
  assert.match(previewToggleSource, /showPreviewModeControls\?: boolean/);
  assert.match(previewToggleSource, /Reviewer tools menu/);
  assert.match(previewToggleSource, /showPreviewModeControls \? "P" : "D"/);
  assert.match(previewToggleSource, /showPreviewModeControls \? \(/);
  assert.match(previewToggleSource, /<ComponentNameDebugMenuSection \/>/);
  assert.match(menuSectionSource, /Show Component Name/);
  assert.match(menuSectionSource, /Shortcut: Alt\+Shift\+N/);
  assert.match(menuSectionSource, /writeComponentNameDebugMode/);
});

test("Component Name Debug marks common layout, page, section, and publication boundaries", () => {
  assert.match(siteFooterSource, /componentNameDebugProps\("SiteFooter"\)/);
  assert.match(homePageSource, /componentNameDebugProps\("HomePage"\)/);
  assert.match(homeHeroSectionsSource, /componentNameDebugProps\("HeroSection"\)/);
  assert.match(homeSolutionOverviewSectionsSource, /componentNameDebugProps\("SolutionOverviewSection"\)/);
  assert.match(aiCrewPageSource, /componentNameDebugProps\("AICrewPage"\)/);
  assert.match(aiCrewHeroSectionsSource, /componentNameDebugProps\("AICrewHeroSection"\)/);
  assert.match(aiCrewResultsSectionsSource, /componentNameDebugProps\("AICrewResultsSection"\)/);
  assert.match(aiDashiPageSource, /componentNameDebugProps\("AIDashiPage"\)/);
  assert.match(aiDashiHeroSectionsSource, /componentNameDebugProps\("AIDashiHeroSection"\)/);
  assert.match(aiDashiValuesSectionsSource, /componentNameDebugProps\("AIDashiValuesSection"\)/);
  assert.match(aipPageSectionsSource, /componentNameDebugProps\("AipPageShell"\)/);
  assert.match(aipPageSectionsSource, /componentNameDebugProps\("AipHeroSection"\)/);
  assert.match(fdePageSectionsSource, /componentNameDebugProps\("ServiceFdePageShell"\)/);
  assert.match(fdePageSectionsSource, /componentNameDebugProps\("ServiceFdeHeroSection"\)/);
  assert.match(publicationPostPageSource, /componentNameDebugProps\("PublicationPostPage"\)/);
  assert.match(publicationPostPageSource, /componentNameDebugProps\("PublicationPostArticle"\)/);
});

test("Component Name Debug marks MDX collection list pages and shared list sections", () => {
  assert.match(blogListPageSource, /componentNameDebugProps\("BlogPage"\)/);
  assert.match(whitepapersListPageSource, /componentNameDebugProps\("WhitepapersPage"\)/);
  assert.match(resourcesListPageSource, /componentNameDebugProps\("ResourcesPage"\)/);
  assert.match(useCasesListPageSource, /componentNameDebugProps\("UseCasesPage"\)/);
  assert.match(aipDemoListPageSource, /componentNameDebugProps\("AipDemoPage"\)/);
  assert.match(acpDemoListPageSource, /componentNameDebugProps\("AcpDemoPage"\)/);
  assert.match(newsListPageSource, /componentNameDebugProps\("NewsPage"\)/);
  assert.match(eventsListPageSource, /componentNameDebugProps\("EventsPage"\)/);
  assert.match(introductionDeckListPageSource, /componentNameDebugProps\("IntroductionDeckPage"\)/);
  assert.match(glossaryListPageSource, /componentNameDebugProps\("GlossaryPage"\)/);
  assert.match(manualsListPageSource, /componentNameDebugProps\("ManualsPage"\)/);
  assert.match(resourceListSectionsSource, /componentNameDebugProps\("ResourceListHeroSection"\)/);
  assert.match(resourceListSectionsSource, /componentNameDebugProps\("ResourceListContentSection"\)/);
  assert.match(resourceListSectionsSource, /componentNameDebugProps\("ResourceListItems"\)/);
  assert.match(resourceListSectionsSource, /componentNameDebugProps\("ResourceListItemCard"\)/);
  assert.match(resourceListLoadMoreSource, /componentNameDebugProps\("ResourceListLoadMore"\)/);
  assert.match(newsListSectionsSource, /componentNameDebugProps\("NewsListSection"\)/);
  assert.match(newsArticleListSource, /componentNameDebugProps\("NewsArticleList"\)/);
  assert.match(newsArticleListSource, /componentNameDebugProps\("NewsArticleCard"\)/);
  assert.match(newsArticleLoadMoreSource, /componentNameDebugProps\("NewsArticleLoadMore"\)/);
});

test("Component Name Debug marks MDX detail route pages and company/about-us sections", () => {
  assert.match(blogPostRouteSource, /componentNameDebugProps\("BlogPostPage"\)/);
  assert.match(whitepaperPostRouteSource, /componentNameDebugProps\("WhitepaperPostPage"\)/);
  assert.match(newsPostRouteSource, /componentNameDebugProps\("NewsPostPage"\)/);
  assert.match(eventPostRouteSource, /componentNameDebugProps\("EventPostPage"\)/);
  assert.match(useCasePostRouteSource, /componentNameDebugProps\("UseCasePostPage"\)/);
  assert.match(aipDemoPostRouteSource, /componentNameDebugProps\("AipDemoPostPage"\)/);
  assert.match(acpDemoPostRouteSource, /componentNameDebugProps\("AcpDemoPostPage"\)/);
  assert.match(introductionDeckPostRouteSource, /componentNameDebugProps\("IntroductionDeckPostPage"\)/);
  assert.match(glossaryPostRouteSource, /componentNameDebugProps\("GlossaryPostPage"\)/);
  assert.match(manualPostRouteSource, /componentNameDebugProps\("ManualPostPage"\)/);
  assert.match(aboutUsPageSource, /componentNameDebugProps\("AboutUsPage"\)/);
  assert.match(companyPagePrimitivesSource, /componentNameDebugProps\("CompanyPageSection"\)/);
  assert.match(companyPagePrimitivesSource, /componentNameDebugProps\("CompanyPageIntro"\)/);
  assert.match(companyPagePrimitivesSource, /componentNameDebugProps\("CompanyPageLayout"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsHeroCopy"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsHeroImage"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsSection"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsInvestorLogoRow"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsTimeline"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsLeaderCard"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsLocationGrid"\)/);
  assert.match(aboutUsSectionsSource, /componentNameDebugProps\("AboutUsLocationCard"\)/);
});
