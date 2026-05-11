import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { buildGatingCookieName } from "@/lib/publications/gating";
import {
  getPreviewNavigationState,
  PREVIEW_NAVIGATION_COOKIE,
} from "@/lib/preview-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import { getIntroductionDeckPublicationHref, getIntroductionDeckPublicationPost, getIntroductionDeckPublicationRecord, listIntroductionDeckPublicationParamsByCategory } from "@/lib/resources/introduction-deck-post-loader";

type IntroductionDeckDetailPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listIntroductionDeckPublicationParamsByCategory();
}

export async function generateMetadata({ params }: IntroductionDeckDetailPageProps): Promise<Metadata> {
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
      index: true,
      follow: true,
    },
  };
}

export default async function IntroductionDeckDetailPage({ params }: IntroductionDeckDetailPageProps) {
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
  const previewCookieValue = cookieStore.get(PREVIEW_NAVIGATION_COOKIE)?.value;
  const { enabled: previewModeEnabled } = getPreviewNavigationState(previewCookieValue);

  if (post.gating) {
    post.gating.initiallyUnlocked =
      previewModeEnabled || cookieStore.has(buildGatingCookieName(post.gating.contentKey));
  }

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
