import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CertificationCard,
  CertificationCardImage,
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
          <CertificationCard>
            <CertificationCardImage src="/certifications/soc-2-type-2.png" alt="SOC 2 Type II" width={120} height={120} className="w-[120px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">SOC 2 Type II</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>System and Organization Controls 2</p>
                <p>Type II</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/csa-star-level-1.png" alt="CSA-STAR" width={120} height={120} className="w-[120px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">CSA-STAR</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Security, Trust, Assurance and Risk</p>
                <p>(Level 1 - Bronze)</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/csa-star-level-2.png" alt="CSA-STAR" width={120} height={120} className="w-[120px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">CSA-STAR</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Security, Trust, Assurance and Risk</p>
                <p>(Level 2 - Gold)</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/pci-dss.png" alt="PCI DSS" width={238} height={72} className="w-[180px] sm:w-[238px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">PCI DSS</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Payment Card Industry Data</p>
                <p>Security Standard</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27001.png" alt="ISO/IEC 27001" width={200} height={127} className="w-[160px] sm:w-[200px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">ISO/IEC 27001</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Information Security</p>
                <p>Management Systems</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27701.png" alt="ISO 27701" width={200} height={127} className="w-[160px] sm:w-[200px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">ISO 27701</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Privacy Information</p>
                <p>Management System</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27017.png" alt="ISO 27017" width={120} height={130} className="w-[120px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">ISO 27017</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Information Security controls</p>
                <p>within a Cloud environment</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-iec-27018.png" alt="ISO 27018" width={120} height={130} className="w-[120px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">ISO 27018</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Privacy controls</p>
                <p>within a Cloud environment</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/iso-22301.png" alt="ISO 22301" width={200} height={127} className="w-[160px] sm:w-[200px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">ISO 22301</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Business Continuity</p>
                <p>Management</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/isms-p.png" alt="ISMS-P" width={173} height={120} className="w-[140px] sm:w-[173px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">ISMS-P</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Business Continuity</p>
                <p>Management</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/good-software-level-1.png" alt="GOOD Software" width={190} height={96} className="w-[160px] sm:w-[190px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">GOOD Software</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Good Software</p>
                <p>Level 1</p>
              </div>
            </div>
          </CertificationCard>

          <CertificationCard>
            <CertificationCardImage src="/certifications/ksel.png" alt="KSEL" width={120} height={120} className="w-[120px]" />
            <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
              <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">KSEL</h2>
              <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
                <p>Korea Security Evaluation Lab.</p>
                <p>Security Functionality Certificate</p>
              </div>
            </div>
          </CertificationCard>
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
