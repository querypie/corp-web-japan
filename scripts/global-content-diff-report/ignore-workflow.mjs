import { resolveLegacySourceSection } from "./sync-identity.mjs";

export function assertIgnoreAppendAllowed({ values, sourceId, sourceSection, sourceCanonicalUrl }) {
  if (!Array.isArray(values)) throw new Error("ignore manifest must be an array");
  const current = [{ sourceId, sourceSection, sourceCanonicalUrl }];
  for (const value of values) {
    if (value?.sourceId !== sourceId) continue;
    if (value?.sourceSection === sourceSection) throw new Error(`already ignored: ${sourceSection}/${sourceId}`);
    if (value?.sourceSection) continue;
    const resolved = resolveLegacySourceSection({ record: value, sources: current, allowSourceIdFallback: false });
    if (resolved.status === "resolved") {
      if (resolved.sourceSection === sourceSection) throw new Error(`already ignored: ${sourceSection}/${sourceId}`);
      continue;
    }
    throw new Error(`legacy ignore row cannot be resolved safely: ${sourceId}`);
  }
}
