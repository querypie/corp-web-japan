import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { publicationBodyClassName } from "@/components/sections/publication-post-page";
import { renderTermsOfServicePreviewMdx } from "@/lib/legal-preview/terms-of-service";

export const metadata: Metadata = {
  title: "QueryPie Terms of Service | QueryPie AI",
  description: "QueryPie Terms of Service",
  alternates: {
    canonical: "/t/terms-of-service",
  },
  robots: {
    index: false,
    follow: false,
  },
};

function TrialCtaSection() {
  return (
    <section className="bg-[#f5f7fa] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
        <h2 className="text-[32px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[40px]">
          まずは小さく、失敗しないAXを始めよう
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-500">
          簡単サインアップで、14日間の無料トライアルをお試しください
        </p>
        <Link
          href="https://app.querypie.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-[5.625px] bg-[linear-gradient(90deg,#2563eb_0%,#7c3aed_100%)] px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px] text-white transition hover:opacity-95"
        >
          無料で試してみる
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default async function PreviewTermsOfServicePage() {
  const evaluation = await renderTermsOfServicePreviewMdx();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className={`mx-auto max-w-[920px] ${publicationBodyClassName} [&_h1:first-child]:mt-0`}>{evaluation.content}</div>
      </section>
      <TrialCtaSection />
      <SiteFooter />
    </main>
  );
}
