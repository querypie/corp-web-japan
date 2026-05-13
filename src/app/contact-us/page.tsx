import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactUsForm } from "@/components/sections/contact-us/form";
import {
  ContactUsChecklist,
  ContactUsChecklistItem,
  ContactUsFormPanel,
} from "@/components/sections/contact-us/page-section";
import {
  CompanyPageLayout,
  CompanyPageIntro,
  CompanyPageLead,
  CompanyPageSection,
  CompanyPageTitle,
} from "@/components/sections/company/page-primitives";
import { getPrefilledContactUsFormState } from "@/lib/contact-us";

export const metadata: Metadata = {
  title: "お問い合わせ | QueryPie AI",
  description:
    "QueryPie AI の製品導入相談、デモ依頼、資料ダウンロード、技術的なご質問を受け付けるお問い合わせフォームです。",
  alternates: {
    canonical: "/contact-us",
  },
};

type ContactUsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactUsPage({
  searchParams,
}: ContactUsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => urlSearchParams.append(key, item));
      continue;
    }

    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  }

  const initialPrefills = getPrefilledContactUsFormState(urlSearchParams);

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <CompanyPageSection padding="compactFooter">
        <CompanyPageLayout preset="equalColumns">
          <CompanyPageIntro className="gap-10 pt-[10px] lg:gap-[50px] lg:pt-0">
            <CompanyPageTitle>お問い合わせ</CompanyPageTitle>
            <CompanyPageLead>
              製品導入のご相談、デモのご依頼、資料ダウンロード、技術的なご質問などを受け付けています。
              下記フォームに必要事項をご入力ください。内容を確認のうえ、担当チームより1〜2営業日以内にご連絡いたします。
            </CompanyPageLead>
            <ContactUsChecklist>
              <ContactUsChecklistItem>製品や導入フェーズに応じて適切な担当が対応します。</ContactUsChecklistItem>
              <ContactUsChecklistItem>お問い合わせ内容に応じてデモ、資料送付、個別相談をご案内します。</ContactUsChecklistItem>
              <ContactUsChecklistItem>送信内容は確認後、順次メールにて返信いたします。</ContactUsChecklistItem>
            </ContactUsChecklist>
          </CompanyPageIntro>

          <ContactUsFormPanel>
            <ContactUsForm initialPrefills={initialPrefills} />
          </ContactUsFormPanel>
        </CompanyPageLayout>
      </CompanyPageSection>
      <SiteFooter />
    </main>
  );
}
