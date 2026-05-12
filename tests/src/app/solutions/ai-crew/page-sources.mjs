import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

function readCombinedExistingSources(paths) {
  return paths
    .filter((path) => sourceExists(path))
    .map((path) => readSource(path))
    .join("\n\n");
}

export function getAiCrewDataSource() {
  return readCombinedExistingSources(["src/app/solutions/ai-crew/page.tsx"]);
}

export function getAiCrewStructureSource() {
  return readCombinedExistingSources([
    "src/app/solutions/ai-crew/page.tsx",
    "src/components/sections/ai-crew/hero-section.tsx",
    "src/components/sections/ai-crew/about-section.tsx",
    "src/components/sections/ai-crew/design-elements-section.tsx",
    "src/components/sections/ai-crew/lost-section.tsx",
    "src/components/sections/ai-crew/platform-section.tsx",
    "src/components/sections/ai-crew/process-section.tsx",
    "src/components/sections/ai-crew/results-section.tsx",
    "src/components/sections/ai-crew/why-section.tsx",
    "src/components/sections/ai-crew/contact-section.tsx",
    "src/components/sections/ai-crew/use-cases-section.tsx",
  ]);
}

export function isAiCrewSectionExternalized() {
  return sourceExists("src/components/sections/ai-crew/hero-section.tsx");
}
