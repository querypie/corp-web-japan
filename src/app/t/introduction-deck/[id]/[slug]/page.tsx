import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import { buildGatingCookieName } from "@/lib/publications/gating";
import { cookies } from "next/headers";
import {
  getDocumentationPublicationHref,
  getDocumentationPublicationPost,
  getDocumentationPublicationRecordById,
  listDocumentationPublicationParamsByCategory,
} from "@/lib/get-documentation-publication-post";

type DocumentationPreviewDetailPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listDocumentationPublicationParamsByCategory("introduction-deck");
}

export async function generateMetadata({ params }: DocumentationPreviewDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getDocumentationPublicationRecordById("introduction-deck", id);

  if (!record) {
    return {};
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: getDocumentationPublicationHref("introduction-deck", id, record.slug),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function IntroductionDeckDetailPage({ params }: DocumentationPreviewDetailPageProps) {
  const { id, slug } = await params;
  const record = getDocumentationPublicationRecordById("introduction-deck", id);

  if (!record) {
    notFound();
  }

  if (record.slug !== slug) {
    redirect(getDocumentationPublicationHref("introduction-deck", id, record.slug));
  }

  const post = await getDocumentationPublicationPost("introduction-deck", id);
  if (!post) {
    notFound();
  }

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
