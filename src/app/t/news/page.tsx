import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsArticleList } from "@/components/sections/news-list-page";
import {
  NewsFinalCtaAction,
  NewsFinalCtaBody,
  NewsFinalCtaSection,
  NewsFinalCtaShell,
  NewsFinalCtaTitle,
  NewsPageContent,
  NewsPageIntro,
  NewsPageLayout,
  NewsPageLead,
  NewsPageListArea,
  NewsPageNav,
  NewsPageNavItem,
  NewsPageSection,
  NewsPageSidebar,
  NewsPageSidebarLabel,
  NewsPageTitle,
} from "@/components/sections/news-page-section";
import { listNewsPublicationItems } from "@/content/publications/news-publication-records";
import {
  PREVIEW_NAVIGATION_COOKIE,
  getPreviewNavigationState,
  t,
} from "@/lib/preview-navigation";

export const metadata: Metadata = {
  title: "ニュース | QueryPie AI",
  description: "QueryPie AIの最新ニュース、公式発表、外部メディア掲載情報をご覧いただけます。",
  alternates: {
    canonical: "/t/news",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type CompanyLink = {
  label: string;
  href: string;
  active?: boolean;
};

function getCompanyLinks(previewModeEnabled: boolean): readonly CompanyLink[] {
  return [
    { label: "私たちについて", href: t("/about-us", previewModeEnabled) },
    { label: "認証情報", href: t("/certifications", previewModeEnabled) },
    { label: "ニュース", href: t("/news", previewModeEnabled), active: true },
    { label: "お問い合わせ", href: "/contact-us" },
  ] as const;
}

export default async function TestNewsPage() {
  const cookieStore = await cookies();
  const previewCookieValue = cookieStore.get(PREVIEW_NAVIGATION_COOKIE)?.value;
  const { enabled: previewModeEnabled } = getPreviewNavigationState(previewCookieValue);
  const companyLinks = getCompanyLinks(previewModeEnabled);
  const newsItems = listNewsPublicationItems();
  const newsTrialUrl = "https://app.querypie.com/";

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <NewsPageSection>
        <NewsPageLayout>
          <NewsPageSidebar>
            <NewsPageSidebarLabel>会社情報</NewsPageSidebarLabel>
            <NewsPageNav>
              {companyLinks.map((link) => (
                <NewsPageNavItem key={link.label} href={link.href} active={link.active}>
                  {link.label}
                </NewsPageNavItem>
              ))}
            </NewsPageNav>
          </NewsPageSidebar>

          <NewsPageContent>
            <NewsPageIntro>
              <NewsPageTitle>News</NewsPageTitle>
              <NewsPageLead>
                QueryPie AIの最新ニュース、公式発表、外部メディア掲載情報をご覧いただけます。
              </NewsPageLead>
            </NewsPageIntro>

            <NewsPageListArea>
              <NewsArticleList items={newsItems} />
            </NewsPageListArea>
          </NewsPageContent>
        </NewsPageLayout>
      </NewsPageSection>

      <NewsFinalCtaSection>
        <NewsFinalCtaShell>
          <NewsFinalCtaTitle>まずは小さく、失敗しないAXを始めよう</NewsFinalCtaTitle>
          <NewsFinalCtaBody>
            簡単サインアップで、14日間の無料トライアルをお試しください
          </NewsFinalCtaBody>
          <NewsFinalCtaAction href={newsTrialUrl}>無料で試してみる</NewsFinalCtaAction>
        </NewsFinalCtaShell>
      </NewsFinalCtaSection>

      <SiteFooter />
    </main>
  );
}
