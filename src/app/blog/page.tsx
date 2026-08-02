import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listBlogPublicationItems } from "@/lib/publications/blog/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "ブログ | QueryPie AI",
  description: "AI、セキュリティ、エンタープライズ導入に関する最新情報と実践的なインサイトをお届けするブログです。",
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
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
    <main {...componentNameDebugProps("BlogPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="!mx-0 max-w-[760px]">ブログ</ResourceListHeroTitle>
        <ResourceListHeroDescription className="!mx-0 max-w-[760px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          AI、セキュリティ、エンタープライズ導入に関する最新情報と実践的なインサイトをお届けします。
          製品アップデートや技術解説、AI活用を進めるためのヒントをご覧ください。
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
