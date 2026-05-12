import { readSource, sourceExists } from "../../../../helpers/source-readers.mjs";

function readCombinedExistingSources(paths) {
  return paths
    .filter((path) => sourceExists(path))
    .map((path) => readSource(path))
    .join("\n\n");
}

export function getAiDashiStructureSource() {
  return readCombinedExistingSources([
    "src/app/solutions/ai-dashi/page.tsx",
    "src/components/sections/ai-dashi/enterprise-ready-section.tsx",
    "src/components/sections/ai-dashi/support-section.tsx",
    "src/components/sections/ai-dashi/release-flow-section.tsx",
    "src/components/sections/ai-dashi/risk-section.tsx",
    "src/components/sections/ai-dashi/wall-cards-section.tsx",
  ]);
}
