import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/PublicationPostPage";
import {
  getWhitepaperPublicationHref,
  getWhitepaperPublicationPost,
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationParams,
} from "@/lib/publications/get-whitepaper-publication-post";
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

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: absoluteUrl(getWhitepaperPublicationHref(id, record.slug)),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function WhitepaperDetailPage({ params }: WhitepaperDetailPageProps) {
  const { id, slug } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.slug !== slug) {
    redirect(getWhitepaperPublicationHref(id, record.slug));
  }

  const post = await getWhitepaperPublicationPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <PublicationPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
