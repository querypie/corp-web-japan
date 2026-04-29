import isProduction from "@/lib/is-production";

export function normalizeEnvironmentValue(value?: string | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  let normalized = value.trim();

  while (
    normalized.length >= 2 &&
    ((normalized.startsWith('"') && normalized.endsWith('"')) ||
      (normalized.startsWith("'") && normalized.endsWith("'")))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  return normalized || undefined;
}

export function shouldTreatSlackAsRequired() {
  return isProduction();
}
