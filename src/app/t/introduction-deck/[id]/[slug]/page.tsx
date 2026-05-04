import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { buildGatingCookieName } from "@/lib/publications/gating";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import { getIntroductionDeckPublicationHref, getIntroductionDeckPublicationPost, getIntroductionDeckPublicationRecord, listIntroductionDeckPublicationParamsByCategory } from "@/lib/resources/introduction-deck-post-loader";

type ResourcePreviewDetailPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listIntroductionDeckPublicationParamsByCategory();
}

export async function generateMetadata({ params }: ResourcePreviewDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getIntroductionDeckPublicationRecord(id);

  if (!record) {
    return {};
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: getIntroductionDeckPublicationHref(id, record.slug),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function IntroductionDeckDetailPage({ params }: ResourcePreviewDetailPageProps) {
  const { id, slug } = await params;
  const record = getIntroductionDeckPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.slug !== slug) {
    redirect(getIntroductionDeckPublicationHref(id, record.slug));
  }

  const post = await getIntroductionDeckPublicationPost(id);
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
