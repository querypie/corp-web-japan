import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { getResourceItems, type ResourceItem } from "@/content/resources";

export type DocumentationPublicationCategory = "introduction-deck" | "glossary" | "manuals";

export type DocumentationPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImageSrc: string;
  date?: string;
  gated?: boolean;
  relatedItems?: readonly {
    href: string;
    imageSrc: string;
    title: string;
    date?: string;
  }[];
};

export type DocumentationPublicationRecord = DocumentationPublicationFrontmatter & {
  sourcePath: string;
  category: DocumentationPublicationCategory;
};

type DocumentationPublicationCache = {
  records: readonly DocumentationPublicationRecord[];
  recordsByKey: ReadonlyMap<string, DocumentationPublicationRecord>;
};

const DOCUMENTATION_ROOT = path.join(process.cwd(), "src/content/documentation");
const CATEGORY_LABELS: Record<DocumentationPublicationCategory, string> = {
  "introduction-deck": "紹介資料",
  glossary: "用語集",
  manuals: "マニュアル",
};

let documentationPublicationCache: Readonly<DocumentationPublicationCache> | null = null;

function buildRecordKey(category: DocumentationPublicationCategory, id: string) {
  return `${category}:${id}`;
}

function normalizeFrontmatter(
  value: unknown,
  sourcePath: string,
): DocumentationPublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing documentation frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedItemsValue = Array.isArray(frontmatter.relatedItems) ? frontmatter.relatedItems : [];

  return {
    id: String(frontmatter.id ?? ""),
    slug: String(frontmatter.slug ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    heroImageSrc: String(frontmatter.heroImageSrc ?? ""),
    date: typeof frontmatter.date === "string" ? frontmatter.date : undefined,
    gated: frontmatter.gated === true,
    relatedItems: relatedItemsValue.map((item) => {
      const related = item as Record<string, unknown>;
      return {
        href: String(related.href ?? ""),
        imageSrc: String(related.imageSrc ?? ""),
        title: String(related.title ?? ""),
        date: typeof related.date === "string" ? related.date : undefined,
      };
    }),
  };
}

function parseFrontmatter(source: string, sourcePath: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadCategoryRecords(category: DocumentationPublicationCategory): DocumentationPublicationRecord[] {
  const categoryRoot = path.join(DOCUMENTATION_ROOT, category);

  return fs
    .readdirSync(categoryRoot)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(categoryRoot, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        category,
        sourcePath,
      };
    })
    .sort((left, right) => Number(left.id) - Number(right.id));
}

function createCache(): Readonly<DocumentationPublicationCache> {
  const records = Object.freeze(
    (["introduction-deck", "glossary", "manuals"] as const)
      .flatMap((category) => loadCategoryRecords(category))
      .map((record) => Object.freeze({ ...record })),
  );

  return Object.freeze({
    records,
    recordsByKey: new Map(records.map((record) => [buildRecordKey(record.category, record.id), record])),
  });
}

function getCache(): Readonly<DocumentationPublicationCache> {
  if (documentationPublicationCache) {
    return documentationPublicationCache;
  }

  documentationPublicationCache = createCache();
  return documentationPublicationCache;
}

export function listDocumentationPublicationRecords(category?: DocumentationPublicationCategory) {
  const records = getCache().records;
  return category ? records.filter((record) => record.category === category) : records;
}

export function listDocumentationPublicationItems(
  category?: DocumentationPublicationCategory,
): readonly ResourceItem[] {
  return listDocumentationPublicationRecords(category).map((record) => ({
    href: getPublicationHref(record.category, record.id, record.slug),
    imageSrc: record.heroImageSrc,
    badge: CATEGORY_LABELS[record.category],
    title: record.title,
    description: record.description,
    date: record.date,
  }));
}

export function getDocumentationPublicationRecord(category: DocumentationPublicationCategory, id: string) {
  return getCache().recordsByKey.get(buildRecordKey(category, id)) ?? null;
}

export function listDocumentationPublicationParams(category: DocumentationPublicationCategory) {
  return listDocumentationPublicationRecords(category).map(({ id, slug }) => ({ id, slug }));
}

export function listDocumentationPublicationIds(category: DocumentationPublicationCategory) {
  return listDocumentationPublicationRecords(category).map(({ id }) => ({ id }));
}

export function listDocumentationResourceItems() {
  const manualExternalItems: ResourceItem[] = [
    {
      href: "https://aip-docs.app.querypie.com/ja/user-guide",
      imageSrc: "/documentation/docu-thumb-aip-manual.png",
      badge: "マニュアル",
      title: "QueryPie AIP マニュアル",
      description: "AIP のユーザーガイドを外部ドキュメントサイトで確認できます。",
    },
    {
      href: "https://docs.querypie.com/ja",
      imageSrc: "/documentation/docu-thumb-acp-manual.png",
      badge: "マニュアル",
      title: "QueryPie ACP マニュアル",
      description: "ACP の管理者・利用者向けドキュメントを外部ドキュメントサイトで確認できます。",
    },
    {
      href: "/api-docs.html",
      imageSrc: "/documentation/docu-thumb-api.png",
      badge: "マニュアル",
      title: "API Docs",
      description: "API リファレンスと関連開発資料への入口です。",
    },
  ];

  return [
    ...listDocumentationPublicationItems(),
    ...manualExternalItems,
    ...getResourceItems("whitepaper"),
    ...getResourceItems("blog"),
  ] as const;
}
