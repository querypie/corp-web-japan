import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "認証 | QueryPie AI",
  description: "QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。",
  alternates: {
    canonical: "/t/certifications",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "認証 | QueryPie AI",
    description: "QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。",
    type: "website",
  },
  twitter: {
    title: "認証 | QueryPie AI",
    description: "QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。",
    card: "summary_large_image",
  },
};

const certifications = [
  {
    label: "SOC 2 Type II",
    description: ["System and Organization Controls 2", "Type II"],
    src: "/t/certifications/soc-2-type-2.png",
    width: 120,
    height: 120,
    className: "w-[120px]",
  },
  {
    label: "CSA-STAR",
    description: ["Security, Trust, Assurance and Risk", "(Level 1 - Bronze)"],
    src: "/t/certifications/csa-star-level-1.png",
    width: 120,
    height: 120,
    className: "w-[120px]",
  },
  {
    label: "CSA-STAR",
    description: ["Security, Trust, Assurance and Risk", "(Level 2 - Gold)"],
    src: "/t/certifications/csa-star-level-2.png",
    width: 120,
    height: 120,
    className: "w-[120px]",
  },
  {
    label: "PCI DSS",
    description: ["Payment Card Industry Data", "Security Standard"],
    src: "/t/certifications/pci-dss.png",
    width: 238,
    height: 72,
    className: "w-[180px] sm:w-[238px]",
  },
  {
    label: "ISO/IEC 27001",
    description: ["Information Security", "Management Systems"],
    src: "/t/certifications/iso-iec-27001.png",
    width: 200,
    height: 127,
    className: "w-[160px] sm:w-[200px]",
  },
  {
    label: "ISO 27701",
    description: ["Privacy Information", "Management System"],
    src: "/t/certifications/iso-iec-27701.png",
    width: 200,
    height: 127,
    className: "w-[160px] sm:w-[200px]",
  },
  {
    label: "ISO 27017",
    description: ["Information Security controls", "within a Cloud environment"],
    src: "/t/certifications/iso-iec-27017.png",
    width: 120,
    height: 130,
    className: "w-[120px]",
  },
  {
    label: "ISO 27018",
    description: ["Privacy controls", "within a Cloud environment"],
    src: "/t/certifications/iso-iec-27018.png",
    width: 120,
    height: 130,
    className: "w-[120px]",
  },
  {
    label: "ISO 22301",
    description: ["Business Continuity", "Management"],
    src: "/t/certifications/iso-22301.png",
    width: 200,
    height: 127,
    className: "w-[160px] sm:w-[200px]",
  },
  {
    label: "ISMS-P",
    description: ["Business Continuity", "Management"],
    src: "/t/certifications/isms-p.png",
    width: 173,
    height: 120,
    className: "w-[140px] sm:w-[173px]",
  },
  {
    label: "GOOD Software",
    description: ["Good Software", "Level 1"],
    src: "/t/certifications/good-software-level-1.png",
    width: 190,
    height: 96,
    className: "w-[160px] sm:w-[190px]",
  },
  {
    label: "KSEL",
    description: ["Korea Security Evaluation Lab.", "Security Functionality Certificate"],
    src: "/t/certifications/ksel.png",
    width: 120,
    height: 120,
    className: "w-[120px]",
  },
] as const;

function CertificationCard({
  label,
  description,
  src,
  width,
  height,
  className,
}: (typeof certifications)[number]) {
  return (
    <article className="flex h-[375px] flex-col items-center justify-start rounded-[24px] bg-[#f5f7fa] px-8 pb-8 pt-10 text-center">
      <div className="flex min-h-[148px] items-center justify-center">
        <Image src={src} alt={label} width={width} height={height} className={className} />
      </div>
      <div className="mt-7 flex flex-1 flex-col items-center justify-start">
        <h2 className="text-[20px] font-medium leading-[1.4] tracking-[-0.02em] text-slate-950">{label}</h2>
        <div className="mt-3 space-y-0 text-[15px] leading-[1.6] text-slate-500">
          {description.map((line) => (
            <p key={`${label}-${line}`}>{line}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

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
          className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(90deg,#2563eb_0%,#7c3aed_100%)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-95"
        >
          無料で試してみる
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function TestCertificationsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1200px] pb-24 pt-[86px] lg:pb-28 lg:pt-[108px]">
        <div className="text-left">
          <h1 className="text-[44px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[52px] sm:leading-[1.15]">
            認証
          </h1>
          <div className="mt-5 max-w-[760px] text-[16.875px] font-light leading-[26.25px] text-slate-500">
            <p>
              QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。
              <br />
              これにより、お客様のコンプライアンス遵守をサポートし、最も厳格な規制基準を満たします。
              <br />
              お客様のデータを、最高水準のセキュリティで保護することをお約束します。
            </p>
          </div>
        </div>

        <div className="mt-[44px] grid gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
          {certifications.map((item) => (
            <CertificationCard key={`${item.label}-${item.src}`} {...item} />
          ))}
        </div>

        <section className="flex flex-col items-center px-6 pb-2 pt-20 text-center lg:px-0 lg:pt-24">
          <h2 className="text-[32px] font-medium leading-[1.3] tracking-[-0.03em] text-slate-950 sm:text-[38px]">
            セキュリティ対策とコンプライアンスの詳細情報
          </h2>
          <Link
            href="https://trust.querypie.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[12px] border border-[#d7dce5] bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-50"
          >
            Trust Center を見る
            <ExternalLink className="h-4 w-4" />
          </Link>
        </section>
      </section>

      <TrialCtaSection />
      <SiteFooter />
    </main>
  );
}
