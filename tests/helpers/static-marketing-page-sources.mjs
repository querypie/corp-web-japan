import { readSource, sourceExists } from "./source-readers.mjs";

function readCombinedExistingSources(paths) {
  return paths
    .filter((path) => sourceExists(path))
    .map((path) => readSource(path))
    .join("\n\n");
}

export function getTopPageDataSource() {
  return readCombinedExistingSources(["src/content/top-page.ts", "src/app/page.tsx"]);
}

export function getTopPageStructureSource() {
  return readCombinedExistingSources([
    "src/app/page.tsx",
    "src/components/sections/top-page-hero-section.tsx",
    "src/components/sections/top-page-core-value-section.tsx",
    "src/components/sections/top-page-roadmap-section.tsx",
    "src/components/sections/top-page-platform-requirements-section.tsx",
    "src/components/sections/top-page-security-section.tsx",
    "src/components/sections/top-page-whitepapers-section.tsx",
    "src/components/sections/top-page-final-cta-section.tsx",
    "src/components/sections/top-page-solution-overview-section.tsx",
    "src/components/sections/top-page-solution-choice-card.tsx",
  ]);
}

export function getAiCrewDataSource() {
  return readCombinedExistingSources([
    "src/content/home.ts",
    "src/app/solutions/ai-crew/page.tsx",
  ]);
}

export function getAiCrewStructureSource() {
  return readCombinedExistingSources([
    "src/app/solutions/ai-crew/page.tsx",
    "src/components/sections/home-page-sections.tsx",
    "src/components/sections/ai-crew-about-section.tsx",
    "src/components/sections/ai-crew-design-elements-section.tsx",
    "src/components/sections/ai-crew-lost-section.tsx",
    "src/components/sections/ai-crew-platform-section.tsx",
    "src/components/sections/ai-crew-process-section.tsx",
    "src/components/sections/ai-crew-results-section.tsx",
    "src/components/sections/ai-crew-why-section.tsx",
    "src/components/sections/ai-crew-contact-section.tsx",
  ]);
}

export function getAiDashiStructureSource() {
  return readCombinedExistingSources([
    "src/app/solutions/ai-dashi/page.tsx",
    "src/components/sections/ai-dashi-enterprise-ready-section.tsx",
    "src/components/sections/ai-dashi-support-section.tsx",
    "src/components/sections/ai-dashi-release-flow-section.tsx",
    "src/components/sections/ai-dashi-risk-section.tsx",
    "src/components/sections/ai-dashi-wall-cards-section.tsx",
  ]);
}

export function isTopPageContentExternalized() {
  return sourceExists("src/content/top-page.ts");
}

export function isAiCrewContentExternalized() {
  return sourceExists("src/content/home.ts");
}

export function isTopPageSectionExternalized() {
  return [
    "src/components/sections/top-page-hero-section.tsx",
    "src/components/sections/top-page-core-value-section.tsx",
    "src/components/sections/top-page-roadmap-section.tsx",
    "src/components/sections/top-page-platform-requirements-section.tsx",
    "src/components/sections/top-page-security-section.tsx",
    "src/components/sections/top-page-whitepapers-section.tsx",
    "src/components/sections/top-page-final-cta-section.tsx",
    "src/components/sections/top-page-solution-overview-section.tsx",
    "src/components/sections/top-page-solution-choice-card.tsx",
  ].some((path) => sourceExists(path));
}

export function isAiCrewSectionExternalized() {
  return sourceExists("src/components/sections/home-page-sections.tsx");
}
