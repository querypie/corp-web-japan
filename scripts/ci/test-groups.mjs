import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const testsRoot = path.join(repoRoot, "tests");

const toPosix = (value) => value.split(path.sep).join("/");

const listTestFiles = (dir = testsRoot) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...listTestFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.test.mjs')) {
      files.push(toPosix(path.relative(repoRoot, fullPath)));
    }
  }

  return files.sort();
};

const matchers = {
  publications: [
    /^tests\/blog\//,
    /^tests\/news\//,
    /^tests\/(acp|aip)-demo-.*\.test\.mjs$/,
    /^tests\/events-.*\.test\.mjs$/,
    /^tests\/use-cases-.*\.test\.mjs$/,
    /^tests\/src\/app\/events\//,
    /^tests\/src\/app\/news\/page\.test\.mjs$/,
    /^tests\/src\/app\/resources\/page\.test\.mjs$/,
    /^tests\/src\/app\/whitepapers\//,
    /^tests\/src\/app\/t\/whitepapers\/page\.test\.mjs$/,
    /^tests\/src\/lib\/publications\/whitepapers\/(frontmatter-and-redirect|gating-source)\.test\.mjs$/,
    /^tests\/whitepaper-(frontmatter-visibility-and-redirect|gating-source)\.test\.mjs$/,
    /^tests\/whitepaper-imported-ja-corpus\.test\.mjs$/,
    /^tests\/mdx-redirect-contract\.test\.mjs$/,
    /^tests\/introduction-deck-download-cta\.test\.mjs$/,
    /^tests\/button-link-external-prop\.test\.mjs$/,
    /^tests\/publication-post-button-spacing\.test\.mjs$/,
    /^tests\/publication-post-inline-link-styles\.test\.mjs$/,
    /^tests\/publication-post-sidebar-layout\.test\.mjs$/,
    /^tests\/resource-list-page-structure\.test\.mjs$/,
    /^tests\/ja-locale-content-priority\.test\.mjs$/,
    /^tests\/src\/app\/blog\/page\.test\.mjs$/,
    /^tests\/src\/app\/demo\//,
    /^tests\/src\/app\/use-cases\//,
    /^tests\/src\/app\/whitepapers\/page\.test\.mjs$/,
    /^tests\/src\/app\/t\/(glossary|introduction-deck|manuals|resources)\/page\.test\.mjs$/,
    /^tests\/src\/components\/sections\/(resource-list-section)\.test\.mjs$/,
    /^tests\/src\/components\/sections\/events\/(hero|empty-state|demo-hero-toggle)\.test\.mjs$/,
    /^tests\/src\/components\/sections\/news\/list-load-more\.test\.mjs$/,
    /^tests\/src\/components\/ui\/progressive-load-more\.test\.mjs$/,
    /^tests\/src\/lib\/publications\//,
    /^tests\/src\/lib\/resources\/architecture\.test\.mjs$/,
    /^tests\/src\/lib\/resource-list-load-more\.test\.mjs$/,
  ],
  forms: [
    /^tests\/src\/app\/contact-us\//,
    /^tests\/src\/app\/api\/gating-form\//,
    /^tests\/src\/lib\/contact-us-submit\.test\.mjs$/,
    /^tests\/src\/lib\/gating-form-submit\.test\.mjs$/,
    /^tests\/src\/lib\/request-uri-salesforce-body\.test\.mjs$/,
    /^tests\/src\/lib\/forms\/server\//,
  ],
  routingSeo: [
    /^tests\/canonical-endpoints\.test\.mjs$/,
    /^tests\/legal-redirect-endpoints\.test\.mjs$/,
    /^tests\/legacy-whitepaper-redirects\.test\.mjs$/,
    /^tests\/link-and-metadata-integrity\.test\.mjs$/,
    /^tests\/mdx-sitemap-coverage\.test\.mjs$/,
    /^tests\/news-seo-and-sitemap\.test\.mjs$/,
    /^tests\/not-found-page\.test\.mjs$/,
    /^tests\/preview-navigation-path-helper\.test\.mjs$/,
    /^tests\/publication-detail-indexability\.test\.mjs$/,
    /^tests\/querypie-content-redirect\.test\.mjs$/,
    /^tests\/redirect-endpoints\.test\.mjs$/,
    /^tests\/redirectable-publication-bot-handling\.test\.mjs$/,
    /^tests\/runtime-404-logging\.test\.mjs$/,
    /^tests\/seo-metadata\.test\.mjs$/,
    /^tests\/services-preview-routes\.test\.mjs$/,
    /^tests\/sitemap-hidden-redirect-rules\.test\.mjs$/,
    /^tests\/typecheck-tsconfig-contract\.test\.mjs$/,
  ],
  staticPages: [
    /^tests\/about-us-page-structure\.test\.mjs$/,
    /^tests\/ai-crew-page-structure\.test\.mjs$/,
    /^tests\/ai-dashi-page-structure\.test\.mjs$/,
    /^tests\/certifications-image-rendering\.test\.mjs$/,
    /^tests\/company-page-primitives\.test\.mjs$/,
    /^tests\/font-and-mobile-layout\.test\.mjs$/,
    /^tests\/internal-page\.test\.mjs$/,
    /^tests\/legal-privacy-policy-preview\.test\.mjs$/,
    /^tests\/legal-terms-of-service\.test\.mjs$/,
    /^tests\/legal-mdx-(cache|formatting)\.test\.mjs$/,
    /^tests\/static-page-mobile-container-contract\.test\.mjs$/,
    /^tests\/t-plans-preview-page\.test\.mjs$/,
    /^tests\/top-page-structure\.test\.mjs$/,
    /^tests\/t\/solutions\//,
    /^tests\/src\/app\/page\.test\.mjs$/,
    /^tests\/src\/app\/solutions\/ai-(crew|dashi)\/page\.test\.mjs$/,
    /^tests\/src\/app\/internal\//,
    /^tests\/src\/app\/solutions\/ai-(crew|dashi)\/cta-links\.test\.mjs$/,
    /^tests\/src\/app\/(about-us|certifications)\/page\.test\.mjs$/,
    /^tests\/src\/app\/(cookie-preference|eula|privacy-policy|terms-of-service)\/page\.test\.mjs$/,
    /^tests\/src\/app\/t\/events\/page\.test\.mjs$/,
    /^tests\/src\/app\/plans\/page\.test\.mjs$/,
    /^tests\/src\/app\/t\/platforms\//,
    /^tests\/src\/app\/platforms\//,
    /^tests\/src\/app\/services\//,
    /^tests\/src\/app\/t\/services\//,
    /^tests\/src\/app\/t\/solutions\//,
    /^tests\/src\/lib\/legal-mdx-source\.test\.mjs$/,
    /^tests\/src\/components\/sections\/internal-events-demo-(empty-state|hero-toggle)\.test\.mjs$/,
  ],
  assetsShell: [
    /^tests\/author-profile-image-paths\.test\.mjs$/,
    /^tests\/crew-role-assets\.test\.mjs$/,
    /^tests\/favicon-assets\.test\.mjs$/,
    /^tests\/footer-addresses\.test\.mjs$/,
    /^tests\/footer-legal-links\.test\.mjs$/,
    /^tests\/component-name-debug\.test\.mjs$/,
    /^tests\/footer-preview-navigation\.test\.mjs$/,
    /^tests\/preview-mode-toggle-dropdown\.test\.mjs$/,
    /^tests\/src\/components\/analytics\//,
    /^tests\/whitepaper-asset-filename-prefix-cleanup\.test\.mjs$/,
    /^tests\/whitepaper-route-aligned-assets\.test\.mjs$/,
  ],
  crossCutting: [
    /^tests\/launch-readiness-coverage\.test\.mjs$/,
    /^tests\/skill-frontmatter-validity\.test\.mjs$/,
  ],
};

export const testGroupOrder = [
  'publications',
  'forms',
  'routingSeo',
  'staticPages',
  'assetsShell',
  'crossCutting',
];

export const testGroupScripts = {
  publications: 'test:publications',
  forms: 'test:forms',
  routingSeo: 'test:routing-seo',
  staticPages: 'test:static-pages',
  assetsShell: 'test:assets-shell',
  crossCutting: 'test:cross-cutting',
};

export const allTestFiles = () => listTestFiles();

export const matchingGroupsForFile = (relativePath) =>
  testGroupOrder.filter((groupName) =>
    matchers[groupName].some((pattern) => pattern.test(relativePath)),
  );

export const filesForGroup = (groupName) => {
  if (!testGroupOrder.includes(groupName)) {
    throw new Error(`Unknown test group: ${groupName}`);
  }

  return allTestFiles().filter((relativePath) =>
    matchers[groupName].some((pattern) => pattern.test(relativePath)),
  );
};
