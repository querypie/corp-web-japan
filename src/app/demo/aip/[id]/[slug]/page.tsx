import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getAipDemoPublicationHref,
  getAipDemoPublicationPost,
  getAipDemoPublicationRecord,
  listAipDemoPublicationParams,
} from "@/lib/publications/demo/aip/get-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";
import { absoluteUrl } from "@/lib/site-url";

type AipDemoDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listAipDemoPublicationParams();
}

export async function generateMetadata({ params }: AipDemoDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getAipDemoPublicationRecord(id);

  if (!record) {
    return {};
  }

  if (record.redirectUrl) {
    return {
      title: `${record.title} | QueryPie AI`,
      description: record.description,
      alternates: {
        canonical: absoluteUrl(getAipDemoPublicationHref(id, record.slug)),
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
      canonical: absoluteUrl(getAipDemoPublicationHref(id, record.slug)),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AipDemoDetailPage({ params }: AipDemoDetailPageProps) {
  const { id, slug } = await params;
  const record = getAipDemoPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  if (record.slug !== slug) {
    redirect(getAipDemoPublicationHref(id, record.slug));
  }

  const post = await getAipDemoPublicationPost(id);

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
