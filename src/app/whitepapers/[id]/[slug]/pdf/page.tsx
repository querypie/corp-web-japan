import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhitepaperDownloadGatePage } from "@/components/sections/whitepapers/download-gate-page";
import {
  buildGatingContentKey,
  buildGatingCookieName,
} from "@/lib/publications/gating";
import {
  getWhitepaperPublicationPdfHref,
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationPdfParams,
} from "@/lib/publications/whitepapers/get-post";
import {
  getPreviewNavigationState,
  PREVIEW_NAVIGATION_COOKIE,
} from "@/lib/preview-navigation";
import { absoluteUrl } from "@/lib/site-url";
import { getRequestDeployedSiteUrl } from "@/lib/site-url.server";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type WhitepaperDownloadPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listWhitepaperPublicationPdfParams();
}

export async function generateMetadata({ params }: WhitepaperDownloadPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record || !record.downloadCta) {
    return {};
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: "限定コンテンツの入手には、フォームのご記入をお願いいたします。",
    alternates: {
      canonical: absoluteUrl(getWhitepaperPublicationPdfHref(id, record.slug), await getRequestDeployedSiteUrl()),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function WhitepaperDownloadPage({ params }: WhitepaperDownloadPageProps) {
  const { id, slug } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record || !record.downloadCta) {
    notFound();
  }

  if (record.redirectUrl) {
    redirect(`${record.redirectUrl}/pdf`);
  }

  if (record.slug !== slug) {
    redirect(getWhitepaperPublicationPdfHref(id, record.slug));
  }

  const cookieStore = await cookies();
  const previewCookieValue = cookieStore.get(PREVIEW_NAVIGATION_COOKIE)?.value;
  const { enabled: previewModeEnabled } = getPreviewNavigationState(previewCookieValue);
  const contentKey = buildGatingContentKey("whitepaper", id);
  const alreadyUnlocked = cookieStore.has(buildGatingCookieName(contentKey));

  if (alreadyUnlocked) {
    redirect(record.downloadCta.href);
  }

  return (
    <main {...componentNameDebugProps("WhitepaperDownloadPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <WhitepaperDownloadGatePage
        categoryLabel="ホワイトペーパー"
        title={record.title}
        coverImageSrc={record.downloadCoverImageSrc ?? record.heroImageSrc}
        contentKey={contentKey}
        downloadHref={record.downloadCta.href}
        autoUnlock={previewModeEnabled}
      />
      <SiteFooter />
    </main>
  );
}
