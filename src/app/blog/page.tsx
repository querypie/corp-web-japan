import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/ResourceListPage";
import { listBlogPublicationItems } from "@/lib/publications/blog-publication-records";

export const metadata: Metadata = {
  title: "ブログ | QueryPie AI",
  description: "AI Staff に関する最新情報やインサイトをまとめたブログページです。",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const blogItems = await listBlogPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="ブログ"
        description="包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。"
        activeCategory="blog"
        items={blogItems}
      />
      <SiteFooter />
    </main>
  );
}
