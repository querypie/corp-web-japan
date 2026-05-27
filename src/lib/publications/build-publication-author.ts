import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import type { PublicationPostAuthor } from "@/lib/publications/types";

export type PublicationAuthorFrontmatter = string | string[] | undefined;

export function buildPublicationAuthor(
  author: PublicationAuthorFrontmatter,
  defaultAuthorAvatarSrc: string,
): PublicationPostAuthor | null {
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(author));
  const primaryAuthor = resolvedAuthors.find((candidate) => candidate.isRegistered) ?? null;

  if (!primaryAuthor) {
    return null;
  }

  return {
    avatarSrc: primaryAuthor.profileImageSrc ?? defaultAuthorAvatarSrc,
    avatarAlt: primaryAuthor.name,
    name: primaryAuthor.name,
    role: primaryAuthor.position ?? "",
    bio: primaryAuthor.description ?? "",
    profileUrl: primaryAuthor.links.find((link) => link.type === "linkedin")?.url,
  };
}
