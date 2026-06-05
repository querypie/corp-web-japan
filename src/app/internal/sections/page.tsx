import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AICrewAvatar } from "@/components/sections/internal-demo/ai-crew-avatar";
import { AIDashiFaq, AIDashiFaqQuestion } from "@/components/sections/internal-demo/ai-dashi-faq";
import {
  SectionShowcaseAvatarFrame,
  SectionShowcaseAvatarSwatch,
  SectionShowcaseAvatarSwatches,
  SectionShowcaseBody,
  SectionShowcaseCard,
  SectionShowcaseCardGrid,
  SectionShowcaseCardHeader,
  SectionShowcaseEyebrow,
  SectionShowcaseIntro,
  SectionShowcaseNotice,
  SectionShowcaseSection,
  SectionShowcaseSplitHeader,
  SectionShowcaseTitle,
} from "@/components/sections/internal-demo/section-showcase-primitives";
import { RoleCatchCopy, RolePainPoint, RoleSlide, RoleSlides, RoleSummary } from "@/components/sections/internal-demo/role-slides";
import { UseCaseBody, UseCaseCard, UseCaseShowcase, UseCaseTab } from "@/components/sections/internal-demo/use-case-showcase";
import { aiDashiConsultUrl } from "@/content/ai-dashi-links";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "Internal Sections | QueryPie AI",
  alternates: {
    canonical: "/internal/sections",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SectionsPage() {
  return (
    <main {...componentNameDebugProps("SectionsPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <SectionShowcaseSection compactBottom>
        <SectionShowcaseEyebrow wide>Internal</SectionShowcaseEyebrow>
        <SectionShowcaseTitle level={1}>Sections</SectionShowcaseTitle>
        <SectionShowcaseBody lead>
          PR 439 / issue 395 で orphan として残っていた section component を削除せず、internal 専用デモルートから明示的に接続し、単独の見た目を確認できるように保持したページです。
        </SectionShowcaseBody>
        <SectionShowcaseNotice>
          このページは UI デザイン確認用の internal demo であり、検索エンジンのインデックス対象外です。
        </SectionShowcaseNotice>
      </SectionShowcaseSection>

      <SectionShowcaseSection>
        <SectionShowcaseIntro>
          <SectionShowcaseEyebrow>Role slider</SectionShowcaseEyebrow>
          <SectionShowcaseTitle>RoleSlides component demo</SectionShowcaseTitle>
          <SectionShowcaseBody>
            部署フィルター chip、横スクロール slider、portrait crop、expandable details、CTA row の組み合わせを確認できます。
          </SectionShowcaseBody>
        </SectionShowcaseIntro>

        <RoleSlides
          note="この role slider は home / solutions からは切り離したデモ用表示です。カード密度、 portrait crop、 category chip、 details disclosure の UI を internal route で単独確認できます。"
          ctaLabel="お問い合わせ"
          ctaHref="/contact-us?inquiry=demo-request&product=ai-crew"
        >
          <RoleSlide
            department="営業・事業開発"
            firstName="Liam"
            displayName="リアム"
            titleEn="Business Development"
            titleJa="事業開発担当"
            ctaLabel="営業ユースケースを見る"
            ctaHref="/use-cases"
            accent="blue"
          >
            <RolePainPoint>
              提案前の顧客調査や競合整理に毎回時間がかかり、肝心の提案設計に十分な時間を回せない。
            </RolePainPoint>
            <RoleCatchCopy>提案前の情報収集を先回りし、商談準備の速度を上げる。</RoleCatchCopy>
            <RoleSummary>
              顧客情報の収集、業界動向の要約、提案ドラフトのたたき台作成までを先回りして支援し、営業担当が対話と判断に集中できる状態をつくります。
            </RoleSummary>
          </RoleSlide>

          <RoleSlide
            department="コーポレート・管理"
            firstName="Emma"
            displayName="エマ"
            titleEn="Operations Manager"
            titleJa="管理部門責任者"
            ctaLabel="導入相談をする"
            ctaHref="/contact-us?inquiry=ai-consulting&product=ai-crew"
            accent="emerald"
          >
            <RolePainPoint>
              社内規程や申請フローへの問い合わせ対応が属人化し、同じ確認対応に時間が取られている。
            </RolePainPoint>
            <RoleCatchCopy>社内ルールの一次案内を自動化し、確認対応の負荷を下げる。</RoleCatchCopy>
            <RoleSummary>
              社内規程の検索、問い合わせ一次回答、申請手順の案内をAI Crewが担当し、管理部門は例外判断や制度改善に時間を使えます。
            </RoleSummary>
          </RoleSlide>

          <RoleSlide
            department="開発・プロダクト"
            firstName="Jay"
            displayName="ジェイ"
            titleEn="Product Engineer"
            titleJa="プロダクト開発担当"
            ctaLabel="プロダクト活用を相談する"
            ctaHref="/contact-us?inquiry=technical-question&product=ai-crew"
            accent="violet"
          >
            <RolePainPoint>
              ログ確認、再現手順の整理、チケット下書きなどの周辺作業が多く、実際の修正や設計に使える時間が削られている。
            </RolePainPoint>
            <RoleCatchCopy>ログ整理と再現情報の要約を自動化し、開発の本作業に集中する。</RoleCatchCopy>
            <RoleSummary>
              ログ・チケット・仕様断片をまとめて再現条件や影響範囲を要約し、開発者がすぐ設計と修正に入れるよう支援します。
            </RoleSummary>
          </RoleSlide>
        </RoleSlides>
      </SectionShowcaseSection>

      <SectionShowcaseSection bordered>
        <SectionShowcaseIntro>
          <SectionShowcaseEyebrow>Use-case cards</SectionShowcaseEyebrow>
          <SectionShowcaseTitle>UseCaseShowcase component demo</SectionShowcaseTitle>
          <SectionShowcaseBody>
            カード型 video teaser、tabbed copy、modal overlay、footer CTA の構成を internal demo として分離して確認できます。
          </SectionShowcaseBody>
        </SectionShowcaseIntro>

        <UseCaseShowcase
          note="この use-case showcase も公開導線とは分離した internal UI demo です。カード hover、 tab 切替、 modal video overlay、 CTA footer の構成を単独で確認できます。"
          primaryCtaLabel="AI Crew の相談をする"
          primaryCtaHref="/contact-us?inquiry=ai-consulting&product=ai-crew"
          secondaryCtaLabel="ユースケース一覧を見る"
          secondaryCtaHref="/use-cases"
        >
          <UseCaseCard
            category="営業"
            title="営業提案の事前調査を短時間で終える"
            videoHref="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            detailHref="/use-cases"
          >
            <UseCaseBody>
              顧客サイト、公開IR、競合情報を横断して要点をまとめ、提案資料の最初の構成案まで準備します。
            </UseCaseBody>
            <UseCaseTab
              label="初回商談"
              videoHref="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              detailHref="/use-cases"
            >
              初回商談前に企業概要、最近のニュース、想定課題をまとめて、ヒアリング項目のたたき台を作成します。
            </UseCaseTab>
            <UseCaseTab
              label="提案書準備"
              videoHref="https://www.youtube.com/watch?v=oHg5SJYRHA0"
              detailHref="/use-cases"
            >
              RFPや打ち合わせメモから構成案を生成し、提案書作成に入る前の準備時間を短縮します。
            </UseCaseTab>
          </UseCaseCard>

          <UseCaseCard
            category="バックオフィス"
            title="社内問い合わせの一次回答を任せる"
            videoHref="https://www.youtube.com/watch?v=oHg5SJYRHA0"
            detailHref="/use-cases"
          >
            <UseCaseBody>
              規程、申請手順、FAQ を横断して、社内メンバーへの一次回答を整え、担当者の反復対応を減らします。
            </UseCaseBody>
          </UseCaseCard>

          <UseCaseCard
            category="開発"
            title="障害調査の初動を早める"
            videoHref="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            detailHref="/use-cases"
          >
            <UseCaseBody>
              エラーログ、監視アラート、関連Issueをまとめて、原因候補と確認順序を一覧化します。
            </UseCaseBody>
          </UseCaseCard>

          <UseCaseCard
            category="マーケティング"
            title="コンテンツ企画の材料を先に集める"
            videoHref="https://www.youtube.com/watch?v=oHg5SJYRHA0"
            detailHref="/use-cases"
          >
            <UseCaseBody>
              市場トレンド、競合発信、既存コンテンツのギャップを整理して、次に作るべきテーマ候補を提示します。
            </UseCaseBody>
          </UseCaseCard>
        </UseCaseShowcase>
      </SectionShowcaseSection>

      <SectionShowcaseSection bordered>
        <SectionShowcaseIntro>
          <SectionShowcaseEyebrow>Issue 395 survivors</SectionShowcaseEyebrow>
          <SectionShowcaseTitle>Source-inspection test survivor demos</SectionShowcaseTitle>
          <SectionShowcaseBody>
            Issue 395 で残っていた source-inspection test 参照のみの section component 候補を、削除ではなく internal demo route に明示的に再接続した例です。canonical route へ戻す判断が出るまでは、このページで表示契約を確認します。
          </SectionShowcaseBody>
        </SectionShowcaseIntro>

        <SectionShowcaseCardGrid>
          <SectionShowcaseCard muted>
            <SectionShowcaseSplitHeader>
              <div>
                <SectionShowcaseEyebrow>AI Crew avatar</SectionShowcaseEyebrow>
                <SectionShowcaseTitle level={3}>AICrewAvatar component demo</SectionShowcaseTitle>
                <SectionShowcaseBody>
                  `src/components/sections/internal-demo/ai-crew-avatar.tsx` は crew role asset 契約を持つ internal demo 専用 visual primitive です。現時点では canonical route へ戻さず、internal demo で tone / size の描画確認対象として保持します。
                </SectionShowcaseBody>
              </div>
              <SectionShowcaseAvatarFrame>
                <AICrewAvatar tone="gray" />
              </SectionShowcaseAvatarFrame>
            </SectionShowcaseSplitHeader>

            <SectionShowcaseAvatarSwatches>
              <SectionShowcaseAvatarSwatch>
                <AICrewAvatar size="mobile" tone="gray" alt="AI Crew mobile avatar demo" />
              </SectionShowcaseAvatarSwatch>
              <SectionShowcaseAvatarSwatch dark>
                <AICrewAvatar size="mobile" tone="white" alt="AI Crew white avatar demo" />
              </SectionShowcaseAvatarSwatch>
            </SectionShowcaseAvatarSwatches>
          </SectionShowcaseCard>

          <SectionShowcaseCard>
            <SectionShowcaseCardHeader>
              <SectionShowcaseEyebrow>AI Dashi FAQ</SectionShowcaseEyebrow>
              <SectionShowcaseTitle level={3}>AIDashiFaq component demo</SectionShowcaseTitle>
              <SectionShowcaseBody>
                `src/components/sections/internal-demo/ai-dashi-faq.tsx` は accordion interaction を持つ internal demo 専用 client component です。FAQ の文言と CTA は page.tsx が直接所有し、削除せず canonical route への再配置判断までは internal demo で挙動確認対象として保持します。
              </SectionShowcaseBody>
            </SectionShowcaseCardHeader>

            <AIDashiFaq ctaHref={aiDashiConsultUrl} ctaLabel="お問い合わせ">
              <AIDashiFaqQuestion question="「データの所有権は？」">
                お預かりしたデータの所有権は、常にお客様に帰属します。AI Dashi はお客様のブランドと運用方針に合わせて提供され、学習データや利用データの取り扱いについても、導入時に要件に応じた運用設計をご案内します。
              </AIDashiFaqQuestion>
              <AIDashiFaqQuestion question="「LLMのモデルは選べるか？」">
                はい。ご要件や運用方針に合わせて、利用モデルや構成方針をご相談いただけます。精度・コスト・応答速度のバランスを踏まえて、最適な選択肢をご提案します。
              </AIDashiFaqQuestion>
              <AIDashiFaqQuestion question="「既存システムとの連携は？」">
                既存の業務システムやデータ基盤との連携を前提に設計可能です。導入時には、API や認証、データフローを含めた現行環境との接続方法をご一緒に整理します。
              </AIDashiFaqQuestion>
              <AIDashiFaqQuestion question="「SLAはどうなるか？」">
                ご利用形態やサポートレベルに応じて、必要な SLA や運用条件をご相談いただけます。商用提供を前提とした安定運用のため、個別要件に合わせた体制設計が可能です。
              </AIDashiFaqQuestion>
              <AIDashiFaqQuestion question="「エンドユーザー数に応じた従量課金か？」">
                料金体系は、想定ユーザー数や利用量、必要なサポート範囲に応じて個別に設計します。詳細はお問い合わせいただければ、最適なプランをご案内します。
              </AIDashiFaqQuestion>
            </AIDashiFaq>
          </SectionShowcaseCard>
        </SectionShowcaseCardGrid>
      </SectionShowcaseSection>

      <SiteFooter />
    </main>
  );
}
