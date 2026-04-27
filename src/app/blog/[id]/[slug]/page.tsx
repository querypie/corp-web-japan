import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BlogPostPage } from "@/components/sections/blog-post-page";
import { getBlogPost, listBlogPostParams } from "@/lib/blog-posts";

type PageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return listBlogPostParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, slug } = await params;
  const post = await getBlogPost(id, slug);
  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | QueryPie AI`,
    description: post.description,
    alternates: {
      canonical: post.href,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.imageSrc],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id, slug } = await params;
  const post = await getBlogPost(id, slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <BlogPostPage post={post} />
      <SiteFooter />
    </main>
  );
}
