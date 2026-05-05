import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listBlogPublicationItems } from "@/lib/publications/blog-publication-records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "ブログ | QueryPie AI",
  description: "AI Staff に関する最新情報やインサイトをまとめたブログページです。",
  alternates: {
    canonical: "/blog",
  },
};

type BlogPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [blogItems, resolvedSearchParams] = await Promise.all([listBlogPublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(blogItems, resolvedSearchParams?.until);

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ブログ</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="ブログ" />

        <ResourceListLoadMore
          key={`blog:${initialVisibleCount}`}
          items={blogItems}
          initialVisibleCount={initialVisibleCount}
        />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}

