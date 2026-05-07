import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhitepaperDownloadGatePage } from "@/components/sections/whitepaper-download-gate-page";
import {
  getWhitepaperPublicationDownloadHref,
  getWhitepaperPublicationHref,
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationDownloadParams,
} from "@/lib/publications/whitepapers/get-post";
import { buildGatingContentKey } from "@/lib/publications/gating";
import { absoluteUrl } from "@/lib/site-url";

type WhitepaperDownloadPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listWhitepaperPublicationDownloadParams();
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
      canonical: absoluteUrl(getWhitepaperPublicationDownloadHref(id, record.slug)),
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
    redirect(`${record.redirectUrl}/download`);
  }

  if (record.slug !== slug) {
    redirect(getWhitepaperPublicationDownloadHref(id, record.slug));
  }

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <WhitepaperDownloadGatePage
        categoryLabel="ホワイトペーパー"
        title={record.title}
        coverImageSrc={record.heroImageSrc}
        contentKey={buildGatingContentKey("whitepaper", id)}
        downloadHref={record.downloadCta.href}
      />
      <SiteFooter />
    </main>
  );
}
