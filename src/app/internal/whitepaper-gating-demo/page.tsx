import * as fs from "node:fs";
import * as path from "node:path";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/PublicationPostPage";
import {
  buildGatingContentKey,
  buildGatingCookieName,
  splitMdxSourceAtGatingCut,
  stripFrontmatterBlock,
} from "@/lib/publications/gating";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost } from "@/lib/publications/types";

const sourcePath = path.join(process.cwd(), "src/content/internal/whitepaper-gating-demo.mdx");
const contentKey = buildGatingContentKey("internal", "whitepaper-gating-demo");

export const metadata: Metadata = {
  title: "Internal Whitepaper Gating Demo | QueryPie AI",
  robots: {
    index: false,
    follow: false,
  },
};

async function getInternalDemoPost(): Promise<PublicationPost> {
  const source = fs.readFileSync(sourcePath, "utf8");
  const splitSource = splitMdxSourceAtGatingCut(source);
  const previewEvaluation = await renderPublicationMdx<{
    title: string;
    description: string;
    date: string;
    heroImageSrc: string;
    gated?: boolean;
  }>(splitSource.previewSource);
  const frontmatter = previewEvaluation.frontmatter;

  if (!frontmatter.gated || !splitSource.gatedSource) {
    throw new Error(`Internal gating demo must define gated: true and <GatingCut /> in ${sourcePath}`);
  }

  const gatedEvaluation = await renderPublicationMdx(stripFrontmatterBlock(splitSource.gatedSource), {
    parseFrontmatter: false,
  });

  return {
    category: "whitepaper",
    categoryLabel: "ホワイトペーパー",
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    heroImageSrc: frontmatter.heroImageSrc,
    author: null,
    bodyHtml: null,
    bodyMdx: previewEvaluation.content,
    gatedBodyMdx: gatedEvaluation.content,
    gating: {
      contentKey,
      initiallyUnlocked: false,
    },
    relatedTitle: "関連記事",
    relatedItems: [],
    toc: [],
  };
}

export default async function InternalWhitepaperGatingDemoPage() {
  const post = await getInternalDemoPost();
  const cookieStore = await cookies();

  if (post.gating) {
    post.gating.initiallyUnlocked = cookieStore.has(buildGatingCookieName(post.gating.contentKey));
  }

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
