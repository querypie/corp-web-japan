import { eventItems } from "@/content/resources/events";

const localContentPaths = new Set([
  "/",
  "/blog",
  "/whitepapers",
  "/solutions/ai-crew",
  "/solutions/ai-dashi",
]);

const localEventPaths = new Set(eventItems.map((item) => item.href));
const blogDetailPathPattern = /^\/blog\/\d+\/[^/]+$/;
const eventDetailPathPattern = /^\/events\/\d+\/[^/]+$/;
const legacyBlogDetailPathPattern = /^\/features\/documentation\/blog\/\d+\/[^/]+$/;

function normalizePathname(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`;
  }

  return pathname;
}

export function isCorpWebJapanInternalContentPath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (localContentPaths.has(normalizedPathname)) {
    return true;
  }

  if (localEventPaths.has(normalizedPathname)) {
    return true;
  }

  if (blogDetailPathPattern.test(normalizedPathname)) {
    return true;
  }

  if (eventDetailPathPattern.test(normalizedPathname)) {
    return true;
  }

  if (legacyBlogDetailPathPattern.test(normalizedPathname)) {
    return true;
  }

  return false;
}
