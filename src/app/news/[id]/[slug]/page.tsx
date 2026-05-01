import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getNewsPublicationHref,
  getNewsPublicationPost,
  getNewsPublicationRecord,
  listNewsPublicationParams,
} from "@/lib/publications/get-news-publication-post";
import { absoluteUrl } from "@/lib/site-url";

type NewsDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listNewsPublicationParams();
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getNewsPublicationRecord(id);

  if (!record) {
    return {};
  }

  if (record.redirectUrl) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${record.title} | QueryPie AI`,
    description: record.description,
    alternates: {
      canonical: absoluteUrl(getNewsPublicationHref(id, record.slug)),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id, slug } = await params;
  const record = getNewsPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl) {
    redirect(record.redirectUrl);
  }

  if (record.slug !== slug) {
    redirect(getNewsPublicationHref(id, record.slug));
  }

  const post = await getNewsPublicationPost(id);

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
