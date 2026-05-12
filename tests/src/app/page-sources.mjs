import { readSource, sourceExists } from "../../helpers/source-readers.mjs";

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
    "src/components/sections/home/hero-section.tsx",
    "src/components/sections/home/core-value-section.tsx",
    "src/components/sections/home/roadmap-section.tsx",
    "src/components/sections/home/platform-requirements-section.tsx",
    "src/components/sections/home/security-section.tsx",
    "src/components/sections/home/whitepapers-section.tsx",
    "src/components/sections/home/final-cta-section.tsx",
    "src/components/sections/home/solution-overview-section.tsx",
    "src/components/sections/home/solution-choice-card.tsx",
  ]);
}

export function isTopPageContentExternalized() {
  return sourceExists("src/content/top-page.ts");
}

export function isTopPageSectionExternalized() {
  return [
    "src/components/sections/home/hero-section.tsx",
    "src/components/sections/home/core-value-section.tsx",
    "src/components/sections/home/roadmap-section.tsx",
    "src/components/sections/home/platform-requirements-section.tsx",
    "src/components/sections/home/security-section.tsx",
    "src/components/sections/home/whitepapers-section.tsx",
    "src/components/sections/home/final-cta-section.tsx",
    "src/components/sections/home/solution-overview-section.tsx",
    "src/components/sections/home/solution-choice-card.tsx",
  ].some((path) => sourceExists(path));
}
