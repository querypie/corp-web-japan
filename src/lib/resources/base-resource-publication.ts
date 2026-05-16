import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import { formatJapaneseDateFromIsoDate } from "@/lib/publications/format-japanese-date";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import type {
  ResourcePublicationCategory,
  ResourcePublicationFrontmatter,
  ResourcePublicationListItem,
  ResourcePublicationRecord,
} from "@/lib/resources/types";

export abstract class BaseResourcePublicationRepository {
  private cache:
    | Readonly<{
        records: readonly ResourcePublicationRecord[];
        recordsById: ReadonlyMap<string, ResourcePublicationRecord>;
      }>
    | null = null;

  protected abstract readonly category: ResourcePublicationCategory;
  protected abstract readonly badge: string;
  protected abstract readonly contentRoot: string;

  protected listSourceFiles(): readonly string[] {
    return fs.readdirSync(this.contentRoot).filter((file) => file.endsWith(".mdx")).sort();
  }

  protected normalizeFrontmatter(value: unknown, sourcePath: string): ResourcePublicationFrontmatter {
    if (!value || typeof value !== "object") {
      throw new Error(`Missing resource publication frontmatter in ${sourcePath}`);
    }

    const frontmatter = value as Record<string, unknown>;
    const relatedItemsValue = Array.isArray(frontmatter.relatedItems) ? frontmatter.relatedItems : [];
    const downloadCtaValue = frontmatter.downloadCta;
    const downloadCta =
      downloadCtaValue && typeof downloadCtaValue === "object"
        ? (() => {
            const candidate = downloadCtaValue as Record<string, unknown>;
            const href = typeof candidate.href === "string" ? candidate.href : "";
            const label = typeof candidate.label === "string" ? candidate.label : "";

            if (!href || !label) {
              return undefined;
            }

            return {
              href,
              label,
              external: candidate.external === true,
            };
          })()
        : undefined;

    return {
      id: String(frontmatter.id ?? ""),
      slug: String(frontmatter.slug ?? ""),
      title: String(frontmatter.title ?? ""),
      description: String(frontmatter.description ?? ""),
      heroImageSrc: String(frontmatter.heroImageSrc ?? ""),
      date: typeof frontmatter.date === "string" ? frontmatter.date : undefined,
      gated: frontmatter.gated === true,
      downloadCta,
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

  protected parseFrontmatter(source: string, sourcePath: string) {
    const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) {
      throw new Error(`Missing frontmatter block in ${sourcePath}`);
    }

    return this.normalizeFrontmatter(parseYaml(match[1]), sourcePath);
  }

  protected loadRecordsFromDisk(): ResourcePublicationRecord[] {
    return this.listSourceFiles().map((file) => {
      const sourcePath = path.join(this.contentRoot, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = this.parseFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        category: this.category,
        sourcePath,
      };
    });
  }

  private getCache() {
    if (this.cache) {
      return this.cache;
    }

    const records = Object.freeze(this.loadRecordsFromDisk().map((record) => Object.freeze({ ...record })));

    this.cache = Object.freeze({
      records,
      recordsById: new Map(records.map((record) => [record.id, record])),
    });

    return this.cache;
  }

  getCategory() {
    return this.category;
  }

  getBadge() {
    return this.badge;
  }

  listRecords(): readonly ResourcePublicationRecord[] {
    return this.getCache().records;
  }

  listItems(): readonly ResourcePublicationListItem[] {
    return this.listRecords().map((record) => ({
      id: record.id,
      href: getPublicationHref(this.category, record.id, record.slug),
      imageSrc: record.heroImageSrc,
      badge: this.badge,
      title: record.title,
      description: record.description,
      date: formatJapaneseDateFromIsoDate(record.date),
    }));
  }

  getRecord(id: string) {
    return this.getCache().recordsById.get(id) ?? null;
  }

  listParams() {
    return this.listRecords().map(({ id, slug }) => ({ id, slug }));
  }

  listIds() {
    return this.listRecords().map(({ id }) => ({ id }));
  }
}
