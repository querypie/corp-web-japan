import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListCtaActions,
  ResourceListCtaContent,
  ResourceListCtaCopy,
  ResourceListCtaDescription,
  ResourceListCtaSection,
  ResourceListCtaTitle,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";
import { listBlogPublicationItems } from "@/lib/publications/blog-publication-records";

export const metadata: Metadata = {
  title: "MDXコンテンツ一覧画面サンプル | QueryPie AI",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InternalMdxListDemoPage() {
  const blogItems = await listBlogPublicationItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>MDXコンテンツ一覧画面サンプル</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="ブログ" />

        <ResourceListItems items={blogItems} />
      </ResourceListContentSection>

      <ResourceListCtaSection>
        <ResourceListCtaContent>
          <ResourceListCtaCopy>
            <ResourceListCtaTitle>Stop Thinking. Start Transforming.</ResourceListCtaTitle>
            <ResourceListCtaDescription>Sign up in seconds and secure your 14-day free trial now.</ResourceListCtaDescription>
          </ResourceListCtaCopy>
          <ResourceListCtaActions>
            <BrandGradientCtaButton href="https://app.querypie.com">Make It Happen</BrandGradientCtaButton>
          </ResourceListCtaActions>
        </ResourceListCtaContent>
      </ResourceListCtaSection>

      <SiteFooter />
    </main>
  );
}
