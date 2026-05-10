import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CertificationCard,
  CertificationCardContent,
  CertificationCardDescription,
  CertificationCardDescriptionLine,
  CertificationCardImage,
  CertificationCardTitle,
  CertificationsGrid,
  CertificationsIntroSection,
  CertificationsPageDescription,
  CertificationsPageSection,
  CertificationsPageTitle,
  CertificationsTrialCtaAction,
  CertificationsTrialCtaContent,
  CertificationsTrialCtaDescription,
  CertificationsTrialCtaSection,
  CertificationsTrialCtaTitle,
  CertificationsTrustCenterAction,
  CertificationsTrustCenterSection,
  CertificationsTrustCenterTitle,
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

export default function CertificationsPreviewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <CertificationsPageSection>
        <CertificationsIntroSection>
          <CertificationsPageTitle>認証</CertificationsPageTitle>
          <CertificationsPageDescription>
            <p>
              QueryPie AIは、数々の最高レベルの国際および国内セキュリティ認証を取得しています。
              <br />
              これにより、お客様のコンプライアンス遵守をサポートし、最も厳格な規制基準を満たします。
              <br />
              お客様のデータを、最高水準のセキュリティで保護することをお約束します。
            </p>
          </CertificationsPageDescription>
        </CertificationsIntroSection>

        <CertificationsGrid>
          <CertificationCard>
            <CertificationCardImage src="/certifications/soc-2-type-2.png" alt="SOC 2 Type II" width={120} height={120} className="w-[120px]" />
            <CertificationCardContent>
              <CertificationCardTitle>SOC 2 Type II</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>System and Organization Controls 2</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Type II</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/csa-star-level-1.png" alt="CSA-STAR" width={120} height={120} className="w-[120px]" />
            <CertificationCardContent>
              <CertificationCardTitle>CSA-STAR</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Security, Trust, Assurance and Risk</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>(Level 1 - Bronze)</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/csa-star-level-2.png" alt="CSA-STAR" width={120} height={120} className="w-[120px]" />
            <CertificationCardContent>
              <CertificationCardTitle>CSA-STAR</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Security, Trust, Assurance and Risk</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>(Level 2 - Gold)</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/pci-dss.png" alt="PCI DSS" width={238} height={72} className="w-[180px] sm:w-[238px]" />
            <CertificationCardContent>
              <CertificationCardTitle>PCI DSS</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Payment Card Industry Data</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Security Standard</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27001.png" alt="ISO/IEC 27001" width={200} height={127} className="w-[160px] sm:w-[200px]" />
            <CertificationCardContent>
              <CertificationCardTitle>ISO/IEC 27001</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Information Security</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Management Systems</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27701.png" alt="ISO 27701" width={200} height={127} className="w-[160px] sm:w-[200px]" />
            <CertificationCardContent>
              <CertificationCardTitle>ISO 27701</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Privacy Information</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Management System</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27017.png" alt="ISO 27017" width={120} height={130} className="w-[120px]" />
            <CertificationCardContent>
              <CertificationCardTitle>ISO 27017</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Information Security controls</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>within a Cloud environment</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27018.png" alt="ISO 27018" width={120} height={130} className="w-[120px]" />
            <CertificationCardContent>
              <CertificationCardTitle>ISO 27018</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Privacy controls</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>within a Cloud environment</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-22301.png" alt="ISO 22301" width={200} height={127} className="w-[160px] sm:w-[200px]" />
            <CertificationCardContent>
              <CertificationCardTitle>ISO 22301</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Business Continuity</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Management</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/isms-p.png" alt="ISMS-P" width={173} height={120} className="w-[140px] sm:w-[173px]" />
            <CertificationCardContent>
              <CertificationCardTitle>ISMS-P</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Business Continuity</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Management</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/good-software-level-1.png" alt="GOOD Software" width={190} height={96} className="w-[160px] sm:w-[190px]" />
            <CertificationCardContent>
              <CertificationCardTitle>GOOD Software</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Good Software</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Level 1</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/ksel.png" alt="KSEL" width={120} height={120} className="w-[120px]" />
            <CertificationCardContent>
              <CertificationCardTitle>KSEL</CertificationCardTitle>
              <CertificationCardDescription>
                <CertificationCardDescriptionLine>Korea Security Evaluation Lab.</CertificationCardDescriptionLine>
                <CertificationCardDescriptionLine>Security Functionality Certificate</CertificationCardDescriptionLine>
              </CertificationCardDescription>
            </CertificationCardContent>
          </CertificationCard>
        </CertificationsGrid>

        <CertificationsTrustCenterSection>
          <CertificationsTrustCenterTitle>セキュリティ対策とコンプライアンスの詳細情報</CertificationsTrustCenterTitle>
          <CertificationsTrustCenterAction href="https://trust.querypie.com">Trust Center を見る</CertificationsTrustCenterAction>
        </CertificationsTrustCenterSection>
      </CertificationsPageSection>

      <CertificationsTrialCtaSection>
        <CertificationsTrialCtaContent>
          <CertificationsTrialCtaTitle>まずは小さく、失敗しないAXを始めよう</CertificationsTrialCtaTitle>
          <CertificationsTrialCtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</CertificationsTrialCtaDescription>
          <CertificationsTrialCtaAction href="https://app.querypie.com">無料で試してみる</CertificationsTrialCtaAction>
        </CertificationsTrialCtaContent>
      </CertificationsTrialCtaSection>

      <SiteFooter />
    </main>
  );
}
