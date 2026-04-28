import "server-only";

import * as fs from "node:fs";
import * as path from "node:path";
import { parse } from "yaml";

export type ArticleAuthorLinkType = "linkedin" | string;

export type ArticleAuthorLink = {
  type: ArticleAuthorLinkType;
  url: string;
};

type AuthorRecord = {
  id: string;
  name: string;
  position?: string;
  description?: string;
  urls?: ArticleAuthorLink[];
  profileImage?: string;
};

export type ResolvedArticleAuthor = {
  id: string;
  isRegistered: boolean;
  name: string;
  position?: string;
  description?: string;
  profileImageSrc?: string;
  links: ArticleAuthorLink[];
};

const AUTHOR_DATA_DIR = path.join(process.cwd(), "src", "content", "authors");
const AUTHOR_RECORDS = loadAuthorRecords();

function loadAuthorRecords(): AuthorRecord[] {
  const filePath = path.join(AUTHOR_DATA_DIR, "ja.yaml");
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = parse(source);

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected author data array in ${filePath}`);
  }

  return parsed as AuthorRecord[];
}

function toAuthorIds(author: string | string[] | undefined): string[] {
  if (!author) return [];

  const ids = Array.isArray(author) ? author : [author];
  return ids.map((value) => value.trim()).filter(Boolean);
}

function normalizeProfileImageSrc(profileImage?: string): string | undefined {
  if (!profileImage) return undefined;

  const normalized = profileImage.replace(/^public\//, "").replace(/^\/+/, "");
  if (!normalized) return undefined;
  if (normalized.startsWith("crew/authors/")) {
    return `/crew/${normalized.slice("crew/authors/".length)}`;
  }
  if (normalized.startsWith("crew/")) {
    return `/${normalized}`;
  }

  return `/${normalized}`;
}

export function resolveArticleAuthors(author: string | string[] | undefined): ResolvedArticleAuthor[] {
  const authorsById = new Map(AUTHOR_RECORDS.map((entry) => [entry.id, entry]));

  return toAuthorIds(author).map((id) => {
    const registeredAuthor = authorsById.get(id);

    if (!registeredAuthor) {
      return {
        id,
        isRegistered: false,
        name: id,
        position: undefined,
        description: undefined,
        profileImageSrc: undefined,
        links: [],
      } satisfies ResolvedArticleAuthor;
    }

    return {
      id: registeredAuthor.id,
      isRegistered: true,
      name: registeredAuthor.name,
      position: registeredAuthor.position,
      description: registeredAuthor.description,
      profileImageSrc: normalizeProfileImageSrc(registeredAuthor.profileImage),
      links: registeredAuthor.urls ?? [],
    } satisfies ResolvedArticleAuthor;
  });
}

export function getDisplayableArticleAuthors(authors: ResolvedArticleAuthor[]): ResolvedArticleAuthor[] {
  return authors.filter((author) => Boolean(author.name.trim()));
}
