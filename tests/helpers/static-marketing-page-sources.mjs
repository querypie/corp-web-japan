import { readFirstExistingSource, sourceExists } from "./source-readers.mjs";

export function getTopPageDataSource() {
  return readFirstExistingSource([
    "src/content/top-page.ts",
    "src/app/page.tsx",
  ]);
}

export function getTopPageStructureSource() {
  return readFirstExistingSource([
    "src/components/sections/top-page-sections.tsx",
    "src/app/page.tsx",
  ]);
}

export function getAiCrewDataSource() {
  return readFirstExistingSource([
    "src/content/home.ts",
    "src/app/solutions/ai-crew/page.tsx",
  ]);
}

export function getAiCrewStructureSource() {
  return readFirstExistingSource([
    "src/components/sections/home-page-sections.tsx",
    "src/app/solutions/ai-crew/page.tsx",
  ]);
}

export function isTopPageContentExternalized() {
  return sourceExists("src/content/top-page.ts");
}

export function isAiCrewContentExternalized() {
  return sourceExists("src/content/home.ts");
}

export function isTopPageSectionExternalized() {
  return sourceExists("src/components/sections/top-page-sections.tsx");
}

export function isAiCrewSectionExternalized() {
  return sourceExists("src/components/sections/home-page-sections.tsx");
}
