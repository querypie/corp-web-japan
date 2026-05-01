import { readSource, sourceExists } from "./source-readers.mjs";

export function getTopPageDataSource() {
  return ["src/content/top-page.ts", "src/app/page.tsx"]
    .filter((path) => sourceExists(path))
    .map((path) => readSource(path))
    .join("\n\n");
}

export function getTopPageStructureSource() {
  return [
    "src/app/page.tsx",
    "src/components/sections/top-page-hero-section.tsx",
    "src/components/sections/top-page-core-value-section.tsx",
    "src/components/sections/top-page-roadmap-section.tsx",
    "src/components/sections/top-page-platform-requirements-section.tsx",
    "src/components/sections/top-page-security-section.tsx",
    "src/components/sections/top-page-whitepapers-section.tsx",
    "src/components/sections/top-page-final-cta-section.tsx",
    "src/components/sections/top-page-solution-overview-section.tsx",
    "src/components/sections/top-page-solution-choice-card.tsx"
  ]
    .filter((path) => sourceExists(path))
    .map((path) => readSource(path))
    .join("\n\n");
}

export function getAiCrewDataSource() {
  return readSource(sourceExists("src/content/home.ts") ? "src/content/home.ts" : "src/app/solutions/ai-crew/page.tsx");
}

export function getAiCrewStructureSource() {
  return readSource(sourceExists("src/components/sections/home-page-sections.tsx") ? "src/components/sections/home-page-sections.tsx" : "src/app/solutions/ai-crew/page.tsx");
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