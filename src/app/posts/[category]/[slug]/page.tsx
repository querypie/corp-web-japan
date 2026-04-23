import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourcePostDownloadPage } from "@/components/sections/resource-post-download-page";
import { ResourcePostPage } from "@/components/sections/resource-post-page";
import {
  getResourceDownloadPost,
  getResourcePost,
  getWhitepaperExternalUrl,
  isResourcePostCategory,
  listResourcePostParams,
} from "@/lib/resource-posts";

type ResourcePostRouteProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listResourcePostParams();
}

export async function generateMetadata({ params }: ResourcePostRouteProps): Promise<Metadata> {
  const { category, slug } = await params;

  if (!isResourcePostCategory(category)) {
    return {};
  }

  const whitepaperExternalUrl =
    category === "whitepaper" ? getWhitepaperExternalUrl(slug) : null;
  if (whitepaperExternalUrl) {
    return {
      title: "Redirecting to QueryPie | AI Staff",
      description: "This whitepaper is available on querypie.com/ja.",
    };
  }

  const downloadPost = getResourceDownloadPost(category, slug);
  if (downloadPost) {
    return {
      title: `${downloadPost.title} | AI Staff`,
      description: downloadPost.title,
    };
  }

  const post = getResourcePost(category, slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | AI Staff`,
    description: post.description,
  };
}

export default async function ResourcePostRoute({ params }: ResourcePostRouteProps) {
  const { category, slug } = await params;

  if (!isResourcePostCategory(category)) {
    notFound();
  }

  const whitepaperExternalUrl =
    category === "whitepaper" ? getWhitepaperExternalUrl(slug) : null;
  if (whitepaperExternalUrl) {
    permanentRedirect(whitepaperExternalUrl);
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
      <ResourcePostPage post={post} />
      <SiteFooter />
    </main>
  );
}
