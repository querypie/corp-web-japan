import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CertificationCard,
  type CertificationItem,
  CertificationsGrid,
  CertificationsPageSection,
  CertificationsTrialCtaAction,
  CertificationsTrialCtaSection,
  CertificationsTrustCenterAction,
  CertificationsTrustCenterSection,
} from "@/components/sections/certifications-page";

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

const certifications: readonly CertificationItem[] = [
  {
    title: "SOC 2 Type II",
    description: ["System and Organization Controls 2", "Type II"],
    src: "/certifications/soc-2-type-2.png",
    alt: "SOC 2 Type II",
  },
  {
    title: "CSA-STAR",
    description: ["Security, Trust, Assurance and Risk", "(Level 1 - Bronze)"],
    src: "/certifications/csa-star-level-1.png",
    alt: "CSA-STAR",
  },
  {
    title: "CSA-STAR",
    description: ["Security, Trust, Assurance and Risk", "(Level 2 - Gold)"],
    src: "/certifications/csa-star-level-2.png",
    alt: "CSA-STAR",
  },
  {
    title: "PCI DSS",
    description: ["Payment Card Industry Data", "Security Standard"],
    src: "/certifications/pci-dss.png",
    alt: "PCI DSS",
  },
  {
    title: "ISO/IEC 27001",
    description: ["Information Security", "Management Systems"],
    src: "/certifications/iso-iec-27001.png",
    alt: "ISO/IEC 27001",
  },
  {
    title: "ISO 27701",
    description: ["Privacy Information", "Management System"],
    src: "/certifications/iso-iec-27701.png",
    alt: "ISO 27701",
  },
  {
    title: "ISO 27017",
    description: ["Information Security controls", "within a Cloud environment"],
    src: "/certifications/iso-iec-27017.png",
    alt: "ISO 27017",
  },
  {
    title: "ISO 27018",
    description: ["Privacy controls", "within a Cloud environment"],
    src: "/certifications/iso-iec-27018.png",
    alt: "ISO 27018",
  },
  {
    title: "ISO 22301",
    description: ["Business Continuity", "Management"],
    src: "/certifications/iso-22301.png",
    alt: "ISO 22301",
  },
  {
    title: "ISMS-P",
    description: ["Business Continuity", "Management"],
    src: "/certifications/isms-p.png",
    alt: "ISMS-P",
  },
  {
    title: "GOOD Software",
    description: ["Good Software", "Level 1"],
    src: "/certifications/good-software-level-1.png",
    alt: "GOOD Software",
  },
  {
    title: "KSEL",
    description: ["Korea Security Evaluation Lab.", "Security Functionality Certificate"],
    src: "/certifications/ksel.png",
    alt: "KSEL",
  },
] as const;

export default function CertificationsPreviewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <CertificationsPageSection>
        <div className="text-left">
          <h1 className="text-[44px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[52px] sm:leading-[1.15]">認証</h1>
          <div className="mt-5 text-[16.875px] font-light leading-[26.25px] tracking-[0.3375px] text-slate-500">
            <p>
              QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。
              <br />
              これにより、お客様のコンプライアンス遵守をサポートし、最も厳格な規制基準を満たします。
              <br />
              お客様のデータを、最高水準のセキュリティで保護することをお約束します。
            </p>
          </div>
        </div>

        <CertificationsGrid>
          {certifications.map((item, index) => (
            <CertificationCard key={`${item.title}-${item.src}-${index}`} {...item} />
          ))}
        </CertificationsGrid>

        <CertificationsTrustCenterSection>
          <h2 className="text-[37.5px] font-normal leading-[45px] text-slate-950">セキュリティ対策とコンプライアンスの詳細情報</h2>
          <CertificationsTrustCenterAction href="https://trust.querypie.com">Trust Center を見る</CertificationsTrustCenterAction>
        </CertificationsTrustCenterSection>
      </CertificationsPageSection>

      <CertificationsTrialCtaSection>
        <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <h2 className="text-[32px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[40px]">まずは小さく、失敗しないAXを始めよう</h2>
          <p className="mt-4 text-base leading-7 text-slate-500">簡単サインアップで、14日間の無料トライアルをお試しください</p>
          <CertificationsTrialCtaAction href="https://app.querypie.com">無料で試してみる</CertificationsTrialCtaAction>
        </div>
      </CertificationsTrialCtaSection>

      <SiteFooter />
    </main>
  );
}
