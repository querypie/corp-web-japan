import path from "node:path";

const DOCUMENTATION_LIST_URL = "https://www.querypie.com/en/documentation";
const NEWS_LIST_URL = "https://www.querypie.com/en/news";

function defineSourceFamily(descriptor) {
  return Object.freeze(descriptor);
}

export const SOURCE_FAMILIES = Object.freeze([
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "blogs",
    relativeRoot: "src/content/documentation/blogs",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "blog",
    targetFamily: "blog",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "white-papers",
    relativeRoot: "src/content/documentation/white-papers",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "white-paper",
    targetFamily: "whitepapers",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "voc",
    relativeRoot: "src/content/documentation/voc",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "customer-story",
    targetFamily: "use-cases",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "manuals",
    relativeRoot: "src/content/documentation/manuals",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "manual",
    targetFamily: "manuals",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "events",
    relativeRoot: "src/content/documentation/events",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "events",
    targetFamily: "events",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "glossary",
    relativeRoot: "src/content/documentation/glossary",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "glossary",
    targetFamily: "glossary",
  }),
  defineSourceFamily({
    sourceSection: "documentation",
    sourceCategory: "introduction",
    relativeRoot: "src/content/documentation/introduction",
    productionListUrl: DOCUMENTATION_LIST_URL,
    canonicalSegment: "introduction",
    targetFamily: "introduction-deck",
  }),
  defineSourceFamily({
    sourceSection: "news",
    sourceCategory: "news",
    relativeRoot: "src/content/news",
    productionListUrl: NEWS_LIST_URL,
    canonicalSegment: "news",
    targetFamily: "news",
  }),
]);

const SOURCE_FAMILY_BY_CATEGORY = new Map(SOURCE_FAMILIES.map((descriptor) => [descriptor.sourceCategory, descriptor]));
const SOURCE_FAMILY_BY_TARGET = new Map(SOURCE_FAMILIES.map((descriptor) => [descriptor.targetFamily, descriptor]));
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

export function targetFamilyDescriptor(target) {
  const descriptor = SOURCE_FAMILY_BY_TARGET.get(target);
  if (!descriptor) throw new Error(`unsupported target family: ${target}`);
  return descriptor;
}

export function canonicalContentUrl(category, slug) {
  return `https://www.querypie.com/en/${sourceFamily(category).canonicalSegment}/${slug}`;
}
