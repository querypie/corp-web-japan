import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PublicationPostPage } from "@/components/sections/publication-post-page";
import { ResourcePostDownloadPage } from "@/components/sections/resource-post-download-page";
import { absoluteUrl } from "@/lib/site-url";
import {
  getResourceDownloadPost,
  getResourcePost,
  listEventPostParams,
} from "@/lib/resource-posts";

type ResourcePostRouteProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

function isLegacyEventCategory(value: string): value is "event" {
  return value === "event";
}

export function generateStaticParams() {
  return listEventPostParams().map(({ id }) => ({
    category: "event",
    slug: id,
  }));
}

export async function generateMetadata({ params }: ResourcePostRouteProps): Promise<Metadata> {
  const { category, slug } = await params;
  const canonicalPath = `/posts/${category}/${slug.replace(/\.html$/i, "")}`;

  if (!isLegacyEventCategory(category)) {
    return {};
  }

  const downloadPost = getResourceDownloadPost(category, slug);
  if (downloadPost) {
    return {
      title: `${downloadPost.title} | QueryPie AI`,
      description: downloadPost.title,
      alternates: {
        canonical: absoluteUrl(canonicalPath),
      },
    };
  }

  const post = getResourcePost(category, slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | QueryPie AI`,
    description: post.description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
    },
  };
}

export default async function ResourcePostRoute({ params }: ResourcePostRouteProps) {
  const { category, slug } = await params;

  if (!isLegacyEventCategory(category)) {
    notFound();
  }

  const downloadPost = getResourceDownloadPost(category, slug);
  if (downloadPost) {
    return (
      <main className="relative overflow-x-hidden bg-white text-slate-950">
        <SiteHeader />
        <ResourcePostDownloadPage post={downloadPost} />
        <SiteFooter />
      </main>
    );
  }

  const post = getResourcePost(category, slug);

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
