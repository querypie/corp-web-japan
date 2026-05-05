import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
  ResourceListSidebar,
  ResourceListSidebarItem,
  ResourceListSidebarLabel,
  ResourceListSidebarLink,
  ResourceListSidebarList,
  ResourceListSidebarNav,
  ResourceListSidebarViewport,
  type ResourceCategoryLink,
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

const sidebarLinks: readonly ResourceCategoryLink[] = [
  { label: "全て", href: "/resources" },
  { label: "紹介資料", href: "/introduction-deck" },
  { label: "用語集", href: "/glossary" },
  { label: "マニュアル", href: "/manuals" },
  { label: "ホワイトペーパー", href: "/whitepapers" },
  { label: "ブログ", href: "/blog", active: true },
] as const;

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
        <ResourceListSidebar>
          <ResourceListSidebarLabel>カテゴリー</ResourceListSidebarLabel>
          <ResourceListSidebarViewport>
            <ResourceListSidebarNav label="Sidebar Navigation">
              <ResourceListSidebarList>
                {sidebarLinks.map((link) => (
                  <ResourceListSidebarItem key={link.label}>
                    <ResourceListSidebarLink href={link.href} active={link.active} label={link.label}>
                      {link.label}
                    </ResourceListSidebarLink>
                  </ResourceListSidebarItem>
                ))}
              </ResourceListSidebarList>
            </ResourceListSidebarNav>
          </ResourceListSidebarViewport>
        </ResourceListSidebar>

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
