import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
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

type CompanyLink = {
  label: string;
  href: string;
  active?: boolean;
};

const companyLinks: readonly CompanyLink[] = [
  { label: "私たちについて", href: "/about-us" },
  { label: "認証情報", href: "/t/certifications", active: true },
  { label: "ニュース", href: "/t/news" },
  { label: "お問い合わせ", href: "/contact-us" },
] as const;

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

function CompanySidebar() {
  return (
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
  );
}

function CertificationCard({
  label,
  description,
  src,
  width,
  height,
  className,
}: (typeof certifications)[number]) {
  return (
    <article className="flex h-full flex-col items-center rounded-[24px] border border-[#E5E7EB] bg-white px-6 py-8 text-center shadow-[0_18px_48px_-36px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_-40px_rgba(15,23,42,0.35)]">
      <div className="flex min-h-[138px] items-center justify-center">
        <Image src={src} alt={`${label} certification badge`} width={width} height={height} className={className} />
      </div>
      <div className="mt-6 flex flex-1 flex-col justify-start gap-2">
        <h2 className="text-[22px] font-medium leading-[1.35] tracking-[-0.02em] text-slate-950">{label}</h2>
        <div className="space-y-1 text-sm leading-6 text-slate-500">
          {description.map((line) => (
            <p key={`${label}-${line}`}>{line}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function TestCertificationsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[89px] pt-[82px] lg:px-[30px] lg:pb-[160px] lg:pt-[105px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] lg:flex-row lg:items-start lg:gap-[60px]">
          <CompanySidebar />

          <div className="min-w-0 flex-1">
            <div className="text-left">
              <h1 className="text-4xl font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                認証
              </h1>
              <div className="mt-5 max-w-[760px] space-y-3 text-base leading-7 text-slate-500">
                <p>QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。</p>
                <p>これにより、お客様のコンプライアンス遵守をサポートし、最も厳格な規制基準を満たします。</p>
                <p>お客様のデータを、最高水準のセキュリティで保護することをお約束します。</p>
              </div>
            </div>

            <div className="mt-[34px] grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {certifications.map((item) => (
                <CertificationCard key={`${item.label}-${item.src}`} {...item} />
              ))}
            </div>

            <section className="mt-14 rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[28px] font-medium leading-[1.3] tracking-[-0.03em] text-slate-950">
                    セキュリティ対策とコンプライアンスの詳細情報
                  </h2>
                  <p className="mt-3 max-w-[620px] text-sm leading-6 text-slate-500">
                    最新の認証、ポリシー、運用管理体制については Trust Center でご確認いただけます。
                  </p>
                </div>
                <Link
                  href="https://trust.querypie.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[12px] bg-[#15181d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0f1115]"
                >
                  Trust Center を見る
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
