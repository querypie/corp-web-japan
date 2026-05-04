import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listBlogPublicationItems } from "@/lib/publications/blog-publication-records";

export const metadata: Metadata = {
  title: "Internal MDX List UX Demo | QueryPie AI",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InternalMdxListDemoPage() {
  const blogItems = await listBlogPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="MDX 컨텐츠의 List 화면 예시"
        description="MDX 기반 컨텐츠의 공통 List UX 예시입니다. 좌측 Sidebar 구성과 카드형 목록 레이아웃은 Documentation > Blog 화면을 기준으로 재사용합니다."
        activeCategory="blog"
        items={blogItems}
      />
      <SiteFooter />
    </main>
  );
}
