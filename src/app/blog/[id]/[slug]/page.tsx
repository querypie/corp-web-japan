import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import {
  getBlogPublicationHref,
  getBlogPublicationPost,
  getBlogPublicationRecord,
  listBlogPublicationParams,
} from "@/lib/publications/get-publication-post";
import { absoluteUrl } from "@/lib/site-url";

type BlogDetailPageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listBlogPublicationParams();
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getBlogPublicationRecord(id);

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
      canonical: absoluteUrl(getBlogPublicationHref(id, record.slug)),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id, slug } = await params;
  const record = getBlogPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl) {
    redirect(record.redirectUrl);
  }

  if (record.slug !== slug) {
    redirect(getBlogPublicationHref(id, record.slug));
  }

  const post = await getBlogPublicationPost(id);

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