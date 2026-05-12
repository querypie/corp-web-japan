import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CertificationCard,
  type CertificationItem,
  CertificationsGrid,
  CertificationsIntroDescription,
  CertificationsIntroSection,
  CertificationsPageSection,
  CertificationsTrialCtaAction,
  CertificationsTrialCtaContent,
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
    id: "soc-2-type-ii",
    title: "SOC 2 Type II",
    description: ["System and Organization Controls 2", "Type II"],
    src: "/certifications/soc-2-type-2.png",
    alt: "SOC 2 Type II",
    imageWidth: 120,
    imageHeight: 120,
    displayWidth: "112.5px",
    displayHeight: "112.5px",
  },
  {
    id: "csa-star-level-1",
    title: "CSA-STAR",
    description: ["Security, Trust, Assurance and Risk", "(Level 1 - Bronze)"],
    src: "/certifications/csa-star-level-1.svg",
    alt: "CSA-STAR",
    imageWidth: 120,
    imageHeight: 120,
    displayWidth: "112.5px",
    displayHeight: "112.5px",
  },
  {
    id: "csa-star-level-2",
    title: "CSA-STAR",
    description: ["Security, Trust, Assurance and Risk", "(Level 2 - Gold)"],
    src: "/certifications/csa-star-level-2.svg",
    alt: "CSA-STAR",
    imageWidth: 120,
    imageHeight: 120,
    displayWidth: "112.5px",
    displayHeight: "112.5px",
  },
  {
    id: "pci-dss",
    title: "PCI DSS",
    description: ["Payment Card Industry Data", "Security Standard"],
    src: "/certifications/pci-dss.svg",
    alt: "PCI DSS",
    imageWidth: 238,
    imageHeight: 72,
    displayWidth: "222.9px",
    displayHeight: "67.42px",
  },
  {
    id: "iso-iec-27001",
    title: "ISO/IEC 27001",
    description: ["Information Security", "Management Systems"],
    src: "/certifications/iso-iec-27001.png",
    alt: "ISO/IEC 27001",
    imageWidth: 200,
    imageHeight: 127,
    displayWidth: "187.5px",
    displayHeight: "119.38px",
  },
  {
    id: "iso-27701",
    title: "ISO 27701",
    description: ["Privacy Information", "Management System"],
    src: "/certifications/iso-iec-27701.png",
    alt: "ISO 27701",
    imageWidth: 200,
    imageHeight: 127,
    displayWidth: "187.5px",
    displayHeight: "119.38px",
  },
  {
    id: "iso-27017",
    title: "ISO 27017",
    description: ["Information Security controls", "within a Cloud environment"],
    src: "/certifications/iso-iec-27017.png",
    alt: "ISO 27017",
    imageWidth: 120,
    imageHeight: 130,
    displayWidth: "112.5px",
    displayHeight: "121.88px",
  },
  {
    id: "iso-27018",
    title: "ISO 27018",
    description: ["Privacy controls", "within a Cloud environment"],
    src: "/certifications/iso-iec-27018.png",
    alt: "ISO 27018",
    imageWidth: 120,
    imageHeight: 130,
    displayWidth: "112.5px",
    displayHeight: "121.88px",
  },
  {
    id: "iso-22301",
    title: "ISO 22301",
    description: ["Business Continuity", "Management"],
    src: "/certifications/iso-22301.png",
    alt: "ISO 22301",
    imageWidth: 200,
    imageHeight: 127,
    displayWidth: "187.5px",
    displayHeight: "120.11px",
  },
  {
    id: "isms-p",
    title: "ISMS-P",
    description: ["Business Continuity", "Management"],
    src: "/certifications/isms-p.png",
    alt: "ISMS-P",
    imageWidth: 173,
    imageHeight: 120,
    displayWidth: "119.84px",
    displayHeight: "82.86px",
  },
  {
    id: "good-software-level-1",
    title: "GOOD Software",
    description: ["Good Software", "Level 1"],
    src: "/certifications/good-software-level-1.png",
    alt: "GOOD Software",
    imageWidth: 190,
    imageHeight: 96,
    displayWidth: "177.89px",
    displayHeight: "89.63px",
  },
  {
    id: "ksel",
    title: "KSEL",
    description: ["Korea Security Evaluation Lab.", "Security Functionality Certificate"],
    src: "/certifications/ksel.png",
    alt: "KSEL",
    imageWidth: 120,
    imageHeight: 120,
    displayWidth: "112.5px",
    displayHeight: "112.5px",
  },
] as const;

export default function CertificationsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <CertificationsPageSection>
        <CertificationsIntroSection>
          <h1 className="text-[44px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[52px] sm:leading-[1.15]">認証</h1>
          <CertificationsIntroDescription>
            <p>
              QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。
              <br />
              これにより、お客様のコンプライアンス遵守をサポートし、最も厳格な規制基準を満たします。
              <br />
              お客様のデータを、最高水準のセキュリティで保護することをお約束します。
            </p>
          </CertificationsIntroDescription>
        </CertificationsIntroSection>

        <CertificationsGrid>
          {certifications.map((item) => (
            <CertificationCard key={item.id} {...item} />
          ))}
        </CertificationsGrid>

        <CertificationsTrustCenterSection>
          <h2 className="text-[37.5px] font-normal leading-[45px] text-slate-950">セキュリティ対策とコンプライアンスの詳細情報</h2>
          <CertificationsTrustCenterAction href="https://trust.querypie.com">Trust Center を見る</CertificationsTrustCenterAction>
        </CertificationsTrustCenterSection>
      </CertificationsPageSection>

      <CertificationsTrialCtaSection>
        <CertificationsTrialCtaContent>
          <h2 className="text-[32px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[40px]">まずは小さく、失敗しないAXを始めよう</h2>
          <p className="mt-4 text-base leading-7 text-slate-500">簡単サインアップで、14日間の無料トライアルをお試しください</p>
          <CertificationsTrialCtaAction href="https://app.querypie.com">無料で試してみる</CertificationsTrialCtaAction>
        </CertificationsTrialCtaContent>
      </CertificationsTrialCtaSection>

      <SiteFooter />
    </main>
  );
}
