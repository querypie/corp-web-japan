import type { Metadata } from "next";
import { homePageContent } from "@/content/home";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseShowcase } from "@/components/sections/use-case-showcase";

export const metadata: Metadata = {
  title: "活用事例 | QueryPie AI",
  description: "QueryPie AI Crew の代表的なユースケースを紹介するページです。",
};

export default function UseCasesPage() {
  const { roles } = homePageContent;

  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1120px] text-center">
          <h1 className="text-4xl font-semibold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px]">
            {roles.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[42px]">
            {roles.body}
          </p>
        </div>

        <UseCaseShowcase
          note={roles.note}
          primaryCta={roles.primaryCta}
          secondaryCta={roles.secondaryCta}
          cards={roles.cards}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
