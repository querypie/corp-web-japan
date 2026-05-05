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

      <ResourceListHeroSection className="text-center">
        <ResourceListHeroTitle className="text-[56.25px] leading-[67.5px] tracking-[-0.04em] sm:text-[56.25px] sm:leading-[67.5px] sm:tracking-[-0.04em]">
          MDXコンテンツ一覧画面サンプル
        </ResourceListHeroTitle>
        <ResourceListHeroDescription className="max-w-none text-[16.875px] leading-[26.25px] text-slate-600">
          包括的なガイド、技術マニュアル、業界ホワイトペーパー、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceListSidebar className="lg:sticky lg:top-[128px] lg:w-[240px] lg:self-start">
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
            <ResourceListCtaTitle className="text-[48.75px] font-normal leading-[58.125px] tracking-normal sm:text-[48.75px]">
              Stop Thinking. Start Transforming.
            </ResourceListCtaTitle>
            <ResourceListCtaDescription className="mt-[18.75px] max-w-full text-[15px] font-light leading-[24.375px] tracking-[0.3375px] text-slate-600">
              Sign up in seconds and secure your 14-day free trial now.
            </ResourceListCtaDescription>
          </ResourceListCtaCopy>
          <ResourceListCtaActions>
            <BrandGradientCtaButton
              href="https://app.querypie.com"
              geometryClassName="min-h-[46.875px] gap-[9.375px] rounded-[5.625px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px]"
              labelClassName="text-[14.0625px] font-normal leading-[20.625px]"
              iconWrapClassName="inline-flex h-[11.25px] w-[11.25px] items-center justify-center"
              iconClassName="h-[11.25px] w-[6.5625px]"
            >
              Make It Happen
            </BrandGradientCtaButton>
          </ResourceListCtaActions>
        </ResourceListCtaContent>
      </ResourceListCtaSection>

      <SiteFooter />
    </main>
  );
}
