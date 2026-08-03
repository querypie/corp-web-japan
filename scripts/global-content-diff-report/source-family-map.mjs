import path from "node:path";

const DEMO_LIST_URL = "https://www.querypie.com/en/demo";
const DOCUMENTATION_LIST_URL = "https://www.querypie.com/en/documentation";
const NEWS_LIST_URL = "https://www.querypie.com/en/news";

function defineSourceFamily(descriptor) {
  return Object.freeze(descriptor);
}

export const SOURCE_FAMILIES = Object.freeze([
  defineSourceFamily({
    sourceSection: "demo",
    sourceCategory: "use-cases",
    relativeRoot: "src/content/demo/use-cases",
    productionListUrl: DEMO_LIST_URL,
    canonicalSegment: "demo/use-cases",
    globalMenuPath: "/demo/use-cases",
    japanMenuPath: "/use-cases",
    targetFamily: "use-cases",
  }),
  defineSourceFamily({
    sourceSection: "demo",
    sourceCategory: "aip-features",
    relativeRoot: "src/content/demo/aip-features",
    optionalRoot: true,
    productionListUrl: DEMO_LIST_URL,
    canonicalSegment: "demo/aip",
    globalMenuPath: "/demo/aip",
    japanMenuPath: "/demo/aip",
    targetFamily: "demo/aip",
  }),
  defineSourceFamily({
    sourceSection: "demo",
    sourceCategory: "acp-features",
    relativeRoot: "src/content/demo/acp-features",
    productionListUrl: DEMO_LIST_URL,
    canonicalSegment: "demo/acp",
    globalMenuPath: "/demo/acp",
    japanMenuPath: "/demo/acp",
    targetFamily: "demo/acp",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "blogs",
    relativeRoot: "src/content/documentation/blogs",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "blog",
    globalMenuPath: "/blog",
    japanMenuPath: "/blog",
    targetFamily: "blog",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "white-papers",
    relativeRoot: "src/content/documentation/white-papers",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "white-paper",
    globalMenuPath: "/whitepapers",
    japanMenuPath: "/whitepapers",
    targetFamily: "whitepapers",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "voc",
    relativeRoot: "src/content/documentation/voc",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "customer-story",
    globalMenuPath: "/voc",
    japanMenuPath: "/use-cases",
    targetFamily: "use-cases",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "manuals",
    relativeRoot: "src/content/documentation/manuals",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "manual",
    globalMenuPath: "/manuals",
    japanMenuPath: "/manuals",
    targetFamily: "manuals",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "events",
    relativeRoot: "src/content/documentation/events",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "events",
    globalMenuPath: "/events",
    japanMenuPath: "/events",
    targetFamily: "events",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "glossary",
    relativeRoot: "src/content/documentation/glossary",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "glossary",
    globalMenuPath: "/glossary",
    japanMenuPath: "/glossary",
    targetFamily: "glossary",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "introduction",
    relativeRoot: "src/content/documentation/introduction",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "introduction",
    globalMenuPath: "/introduction-deck",
    japanMenuPath: "/introduction-deck",
    targetFamily: "introduction-deck",
  }),
  defineSourceFamily({
    sourceSection: "news",
    sourceCategory: "news",
    relativeRoot: "src/content/news",
    productionListUrl: NEWS_LIST_URL,
    canonicalSegment: "news",
    globalMenuPath: "/news",
    japanMenuPath: "/news",
    targetFamily: "news",
  }),
]);

export const SUPPORTED_SOURCE_SECTIONS = Object.freeze(
  [...new Set(SOURCE_FAMILIES.map(({ sourceSection }) => sourceSection))],
);

const SOURCE_FAMILY_BY_CATEGORY = new Map(SOURCE_FAMILIES.map((descriptor) => [descriptor.sourceCategory, descriptor]));
const TARGET_FAMILY_BY_CATEGORY = new Map(SOURCE_FAMILIES.map((descriptor) => [descriptor.sourceCategory, descriptor.targetFamily]));

export function sourceFamily(category) {
  const descriptor = SOURCE_FAMILY_BY_CATEGORY.get(category);
  if (!descriptor) throw new Error(`unsupported source category: ${category}`);
  return descriptor;
}

export function sourceRoots(globalRepo) {
  return SOURCE_FAMILIES.map((descriptor) => Object.freeze({
    ...descriptor,
    root: path.join(globalRepo, descriptor.relativeRoot),
  }));
}

export function targetFamily(category) {
  const family = TARGET_FAMILY_BY_CATEGORY.get(category);
  if (!family) throw new Error(`unsupported source category: ${category}`);
  return family;
}

export function canonicalContentUrl(category, slug) {
  return `https://www.querypie.com/en/${sourceFamily(category).canonicalSegment}/${slug}`;
}
