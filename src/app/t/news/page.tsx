import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsArticleList } from "@/components/sections/news-list-page";
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

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[89px] pt-[82px] lg:px-[30px] lg:pb-[160px] lg:pt-[105px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] lg:flex-row lg:items-start lg:gap-[60px]">
          <aside className="w-full pt-[20px] lg:w-[210px] lg:flex-shrink-0">
            <p className="sr-only">会社情報</p>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible">
              <ul className="flex min-w-max gap-3 lg:min-w-0 lg:flex-col lg:gap-0">
                {companyLinks.map((link) => (
                  <li key={link.label} className="lg:mt-0 lg:[&+li]:mt-3">
                    <Link
                      href={link.href}
                      className={`inline-flex rounded-[12px] px-4 py-3.5 text-[15px] leading-[1.467] transition lg:block lg:rounded-none lg:px-0 lg:py-0 ${
                        link.active
                          ? "bg-[#15181d] font-medium text-white lg:bg-transparent lg:text-[#15181d]"
                          : "bg-[#f9f9fb] font-normal text-slate-700 hover:text-slate-950 lg:bg-transparent lg:text-slate-950"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="text-left">
              <h1 className="text-4xl font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                News
              </h1>
              <p className="mt-5 max-w-[760px] text-base leading-7 text-slate-500">
                QueryPie AIの最新ニュース、公式発表、外部メディア掲載情報をご覧いただけます。
              </p>
            </div>

            <div className="mt-[34px] lg:mt-[55px]">
              <NewsArticleList items={newsItems} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F8FA] px-[22px] py-[72px] lg:px-[30px] lg:py-[112px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h2 className="text-[30px] font-medium leading-[1.35] tracking-[-0.03em] text-slate-950 sm:text-[38px] lg:text-[42px]">
            まずは小さく、失敗しないAXを始めよう
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500">
            簡単サインアップで、14日間の無料トライアルをお試しください
          </p>
          <a
            href="https://app.querypie.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-[9.375px] rounded-[5.625px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-medium text-[#F6F6F6] transition hover:brightness-[1.04]"
          >
            <span>無料で試してみる</span>
            <span aria-hidden="true" className="inline-flex items-center justify-center text-current">
              <svg viewBox="0 0 7 12" width="1em" height="1em" className="h-3 w-[7px]" focusable="false">
                <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
