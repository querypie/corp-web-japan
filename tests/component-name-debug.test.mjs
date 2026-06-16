import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import * as ts from "typescript";
import { readSource, sourcePath } from "./helpers/source-readers.mjs";

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
const repoRoot = sourcePath("");

const renderlessPageComponentMarkerExceptions = new Set([
  "src/app/[...missing]/page.tsx#MissingRoutePage",
  "src/app/blog/[id]/page.tsx#BlogDetailCanonicalRedirectPage",
  "src/app/demo/acp/[id]/page.tsx#AcpDemoDetailIdPage",
  "src/app/demo/aip/[id]/page.tsx#AipDemoDetailIdPage",
  "src/app/events/[id]/page.tsx#EventIdPage",
  "src/app/glossary/[id]/page.tsx#GlossaryDetailIdPage",
  "src/app/introduction-deck/[id]/page.tsx#IntroductionDeckDetailIdPage",
  "src/app/manuals/[id]/page.tsx#ManualsDetailIdPage",
  "src/app/news/[id]/page.tsx#NewsIdPage",
  "src/app/pricing/calculator/page.tsx#PricingCalculatorPage",
  "src/app/privacy-policy/[slug]/page.tsx#PrivacyPolicyVersionPage",
  "src/app/privacy-policy/page.tsx#PrivacyPolicyPage",
  "src/app/use-cases/[id]/page.tsx#UseCaseDetailIdPage",
  "src/app/whitepapers/[id]/page.tsx#WhitepaperDetailIdPage",
  "src/app/whitepapers/[id]/pdf/page.tsx#WhitepaperDownloadIdPage",
  "src/components/sections/acp/feature-browser.tsx#AcpFeatureCategory",
  "src/components/sections/acp/feature-browser.tsx#AcpFeatureCategoryLabel",
  "src/components/sections/acp/feature-browser.tsx#AcpFeatureItem",
  "src/components/sections/acp/feature-browser.tsx#AcpFeatureItemBody",
  "src/components/sections/acp/feature-browser.tsx#AcpFeatureItemTitle",
  "src/components/sections/acp/static-page.tsx#AcpHeroEyebrow",
  "src/components/sections/ai-crew/use-cases-section.tsx#AICrewUseCaseCardBody",
  "src/components/sections/ai-crew/use-cases-section.tsx#AICrewUseCaseCardCategory",
  "src/components/sections/ai-crew/use-cases-section.tsx#AICrewUseCaseCardTitle",
  "src/components/sections/ai-crew/use-cases-section.tsx#AICrewUseCaseTab",
  "src/components/sections/home/roadmap-section.tsx#RoadmapStep",
  "src/components/sections/home/roadmap-section.tsx#RoadmapTab",
  "src/components/sections/internal-demo/ai-dashi-faq.tsx#AIDashiFaqQuestion",
  "src/components/sections/internal-demo/role-slides.tsx#RoleCatchCopy",
  "src/components/sections/internal-demo/role-slides.tsx#RolePainPoint",
  "src/components/sections/internal-demo/role-slides.tsx#RoleSlide",
  "src/components/sections/internal-demo/role-slides.tsx#RoleSummary",
  "src/components/sections/internal-demo/use-case-showcase.tsx#UseCaseBody",
  "src/components/sections/internal-demo/use-case-showcase.tsx#UseCaseCard",
  "src/components/sections/internal-demo/use-case-showcase.tsx#UseCaseTab",
]);

const pageComponentMarkerAliases = new Map([
  ["src/app/blog/[id]/[slug]/page.tsx#BlogDetailPage", "BlogPostPage"],
  ["src/app/demo/acp/[id]/[slug]/page.tsx#AcpDemoDetailPage", "AcpDemoPostPage"],
  ["src/app/demo/aip/[id]/[slug]/page.tsx#AipDemoDetailPage", "AipDemoPostPage"],
  ["src/app/events/[id]/[slug]/page.tsx#EventDetailPage", "EventPostPage"],
  ["src/app/glossary/[id]/[slug]/page.tsx#GlossaryDetailPage", "GlossaryPostPage"],
  ["src/app/introduction-deck/[id]/[slug]/page.tsx#IntroductionDeckDetailPage", "IntroductionDeckPostPage"],
  ["src/app/manuals/[id]/[slug]/page.tsx#ManualsDetailPage", "ManualPostPage"],
  ["src/app/news/[id]/[slug]/page.tsx#NewsDetailPage", "NewsPostPage"],
  ["src/app/use-cases/[id]/[slug]/page.tsx#UseCaseDetailPage", "UseCasePostPage"],
  ["src/app/whitepapers/[id]/[slug]/page.tsx#WhitepaperDetailPage", "WhitepaperPostPage"],
  ["src/app/whitepapers/page.tsx#WhitepaperPage", "WhitepapersPage"],
]);

function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function readTsx(filePath) {
  return ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function walkPageFiles(dirPath, files = []) {
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".next") {
      continue;
    }

    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkPageFiles(entryPath, files);
      continue;
    }

    if (entry.name === "page.tsx") {
      files.push(entryPath);
    }
  }

  return files;
}

function isLocalImportSpecifier(specifier) {
  return specifier.startsWith("@/") || specifier.startsWith("./") || specifier.startsWith("../");
}

function resolveImportPath(fromFile, specifier) {
  const basePath = specifier.startsWith("@/")
    ? path.join(repoRoot, "src", specifier.slice(2))
    : path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    `${basePath}.tsx`,
    `${basePath}.ts`,
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.ts"),
  ];

  return candidates.find((candidate) => {
    try {
      readFileSync(candidate);
      return true;
    } catch {
      return false;
    }
  });
}

function jsxTagName(tagName) {
  if (ts.isIdentifier(tagName)) {
    return tagName.text;
  }

  if (ts.isPropertyAccessExpression(tagName)) {
    return `${jsxTagName(tagName.expression)}.${tagName.name.text}`;
  }

  return undefined;
}

function collectLocalImports(filePath, sourceFile) {
  const imports = new Map();

  sourceFile.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !node.importClause || !ts.isStringLiteral(node.moduleSpecifier)) {
      return;
    }

    const specifier = node.moduleSpecifier.text;

    if (!isLocalImportSpecifier(specifier)) {
      return;
    }

    const resolved = resolveImportPath(filePath, specifier);
    const addImport = (localName, importedName = localName) => {
      imports.set(localName, { importedName, resolved });
    };
    const { importClause } = node;

    if (importClause.name) {
      addImport(importClause.name.text, "default");
    }

    if (importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
      for (const element of importClause.namedBindings.elements) {
        addImport(element.name.text, element.propertyName ? element.propertyName.text : element.name.text);
      }
    }
  });

  return imports;
}

function collectLocalDefinitions(sourceFile) {
  const definitions = new Set();

  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text)) {
      definitions.add(node.name.text);
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && /^[A-Z]/.test(declaration.name.text)) {
          definitions.add(declaration.name.text);
        }
      }
    }
  });

  return definitions;
}

function collectPageJsxNames(sourceFile) {
  const names = new Set();

  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = jsxTagName(node.tagName);

      if (name && /^[A-Z]/.test(name) && !name.includes(".")) {
        names.add(name);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return names;
}

function findLocalDefinition(sourceFile, componentName) {
  let found;

  function visit(node) {
    if (found) {
      return;
    }

    if (componentName === "default" && ts.isFunctionDeclaration(node) && node.name && (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Default)) {
      found = { node, componentName: node.name.text };
      return;
    }

    if (ts.isFunctionDeclaration(node) && node.name?.text === componentName) {
      found = { node, componentName };
      return;
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === componentName) {
          found = { node: declaration, componentName };
          return;
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return found;
}

function resolveExport(filePath, componentName, seen = new Set()) {
  const key = `${filePath}#${componentName}`;

  if (seen.has(key)) {
    return { filePath, componentName };
  }

  seen.add(key);
  const sourceFile = readTsx(filePath);
  const localDefinition = findLocalDefinition(sourceFile, componentName);

  if (localDefinition) {
    if (ts.isVariableDeclaration(localDefinition.node) && localDefinition.node.initializer && ts.isIdentifier(localDefinition.node.initializer)) {
      const aliasTarget = findLocalDefinition(sourceFile, localDefinition.node.initializer.text);

      if (aliasTarget) {
        return { filePath, componentName: aliasTarget.componentName };
      }
    }

    return { filePath, componentName: localDefinition.componentName };
  }

  const localImports = collectLocalImports(filePath, sourceFile);

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
      continue;
    }

    for (const element of statement.exportClause.elements) {
      const exportedName = element.name.text;
      const originalName = element.propertyName ? element.propertyName.text : element.name.text;

      if (exportedName !== componentName) {
        continue;
      }

      if (statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        const resolved = resolveImportPath(filePath, statement.moduleSpecifier.text);
        return resolved ? resolveExport(resolved, originalName, seen) : { filePath, componentName };
      }

      const imported = localImports.get(originalName);
      return imported?.resolved ? resolveExport(imported.resolved, imported.importedName, seen) : { filePath, componentName: originalName };
    }
  }

  return { filePath, componentName };
}

function defaultExportFunctionName(sourceFile) {
  let name;

  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Default)) {
      name = node.name.text;
    }
  });

  return name;
}

function collectPageReferencedComponentTargets() {
  const targets = new Map();

  function addTarget(filePath, componentName) {
    if (!filePath || !filePath.startsWith(path.join(repoRoot, "src"))) {
      return;
    }

    const resolved = resolveExport(filePath, componentName);
    const key = `${toRepoRelative(resolved.filePath)}#${resolved.componentName}`;
    targets.set(key, resolved);
  }

  for (const pageFile of walkPageFiles(sourcePath("src/app"))) {
    const sourceFile = readTsx(pageFile);
    const localImports = collectLocalImports(pageFile, sourceFile);
    const localDefinitions = collectLocalDefinitions(sourceFile);

    for (const componentName of collectPageJsxNames(sourceFile)) {
      const imported = localImports.get(componentName);

      if (imported?.resolved?.startsWith(path.join(repoRoot, "src"))) {
        addTarget(imported.resolved, imported.importedName);
        continue;
      }

      if (!imported && localDefinitions.has(componentName)) {
        addTarget(pageFile, componentName);
      }
    }

    const pageComponentName = defaultExportFunctionName(sourceFile);

    if (pageComponentName) {
      addTarget(pageFile, pageComponentName);
    }
  }

  return targets;
}

test("Component Name Debug uses a production-capable build-time code constant", () => {
  assert.match(contractSource, /export const COMPONENT_NAME_DEBUG_ENABLED = true;/);
  assert.doesNotMatch(contractSource, /process\.env/);
  assert.match(contractSource, /export function isComponentNameDebugEnabled\(\)/);
  assert.doesNotMatch(siteHeaderSource, /isComponentNameDebugEnabled/);
  assert.doesNotMatch(siteHeaderSource, /showPreviewModeToggle \|\| componentNameDebugEnabled/);
  assert.doesNotMatch(siteHeaderSource, /showReviewerToolsToggle/);
  assert.match(siteHeaderSource, /showPreviewModeToggle \? \(\s*<PreviewModeToggle\s+enabled=\{previewModeEnabled\}\s*\/>\s*\) : null/s);
});

test("Component Name Debug exposes the required mode order and shortcut cycle", () => {
  assert.match(contractSource, /value: "off",[\s\S]*?label: "Off"/);
  assert.match(contractSource, /value: "pointer",[\s\S]*?label: "Pointer"/);
  assert.match(contractSource, /value: "ancestors",[\s\S]*?label: "Pointer \+ Ancestors"/);
  assert.match(contractSource, /value: "always",[\s\S]*?label: "Always"/);
  assert.match(contractSource, /nextComponentNameDebugMode/);
  assert.match(overlaySource, /event\.altKey/);
  assert.match(overlaySource, /event\.shiftKey/);
  assert.match(overlaySource, /event\.code === "KeyN"/);
  assert.match(overlaySource, /event\.code === "Digit0"/);
  assert.match(overlaySource, /event\.code === "Numpad0"/);
  assert.match(overlaySource, /writeComponentNameDebugMode\(isOffShortcut \? "off" : nextComponentNameDebugMode/);
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

test("Preview toggle menu keeps Component Name Debug inside non-production preview controls", () => {
  assert.doesNotMatch(previewToggleSource, /showPreviewModeControls/);
  assert.doesNotMatch(previewToggleSource, /Reviewer tools menu/);
  assert.doesNotMatch(previewToggleSource, /\? "P" : "D"/);
  assert.match(previewToggleSource, /Preview mode menu:/);
  assert.match(previewToggleSource, /<ComponentNameDebugMenuSection \/>/);
  assert.match(menuSectionSource, /Show Component Name/);
  assert.match(menuSectionSource, /Shortcut: Alt\+Shift\+N \/ Alt\+Shift\+0 Off/);
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

test("Component Name Debug marks renderable local components referenced by route pages", () => {
  const missingMarkers = [];

  for (const [key, target] of collectPageReferencedComponentTargets()) {
    if (renderlessPageComponentMarkerExceptions.has(key)) {
      continue;
    }

    const source = readFileSync(target.filePath, "utf8");
    const markerName = pageComponentMarkerAliases.get(key) ?? target.componentName;
    const expectedMarker = `componentNameDebugProps("${markerName}")`;

    if (!source.includes(expectedMarker)) {
      missingMarkers.push(`${key} missing ${expectedMarker}`);
    }
  }

  assert.deepEqual(missingMarkers, []);
});
