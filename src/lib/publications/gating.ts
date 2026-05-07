import isProduction from "@/lib/is-production";

export const GATING_CUT_MARKER = "<GatingCut />";
const NON_PRODUCTION_GATING_MAX_AGE_SECONDS = 60 * 15;
const PRODUCTION_GATING_MAX_AGE_SECONDS = 60 * 60 * 48;

function normalizeCookieSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function buildGatingContentKey(scope: string, id: string) {
  return `${scope}:${id}`;
}

export function buildGatingCookieName(contentKey: string) {
  return `qp-gated-${normalizeCookieSegment(contentKey)}`;
}

export function getGatingCookieMaxAgeSeconds() {
  return isProduction()
    ? PRODUCTION_GATING_MAX_AGE_SECONDS
    : NON_PRODUCTION_GATING_MAX_AGE_SECONDS;
}

export function splitMdxSourceAtGatingCut(source: string) {
  const cutIndex = source.indexOf(GATING_CUT_MARKER);

  if (cutIndex === -1) {
    return {
      previewSource: source,
      gatedSource: null,
    };
  }

  return {
    previewSource: source.slice(0, cutIndex),
    gatedSource: source.slice(cutIndex + GATING_CUT_MARKER.length),
  };
}

export function stripFrontmatterBlock(source: string) {
  return source.replace(/^---\n[\s\S]*?\n---\n?/, "");
}
