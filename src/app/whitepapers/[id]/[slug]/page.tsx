import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getWhitepaperPublicationHref,
  getWhitepaperPublicationPost,
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationParams,
} from "@/lib/publications/whitepapers/get-post";
import { buildGatingCookieName } from "@/lib/publications/gating";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";
import {
  getPreviewNavigationState,
  PREVIEW_NAVIGATION_COOKIE,
} from "@/lib/preview-navigation";
import { absoluteUrl } from "@/lib/site-url";

type WhitepaperDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listWhitepaperPublicationParams();
}

export async function generateMetadata({ params }: WhitepaperDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record) {
    return {};
  }

  if (record.redirectUrl) {
    return {
      title: `${record.title} | QueryPie AI`,
      description: record.description,
      alternates: {
        canonical: absoluteUrl(getWhitepaperPublicationHref(id, record.slug)),
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: absoluteUrl(getWhitepaperPublicationHref(id, record.slug)),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function WhitepaperDetailPage({ params }: WhitepaperDetailPageProps) {
  const { id, slug } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  if (record.slug !== slug) {
    redirect(getWhitepaperPublicationHref(id, record.slug));
  }

  const post = await getWhitepaperPublicationPost(id);

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
    <main {...componentNameDebugProps("WhitepaperPostPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
