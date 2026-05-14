import type { Metadata } from "next";
import type { ComponentProps } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AICrewAvatar } from "@/components/sections/internal-demo/ai-crew-avatar";
import { AIDashiFaq } from "@/components/sections/internal-demo/ai-dashi-faq";
import { RoleSlides } from "@/components/sections/internal-demo/role-slides";
import { UseCaseShowcase } from "@/components/sections/internal-demo/use-case-showcase";
import { aiDashiConsultUrl } from "@/content/ai-dashi-links";

const roleSlidesDemoProps: ComponentProps<typeof RoleSlides> = {
  items: [
    {
      department: "営業・事業開発",
      firstName: "Liam",
      displayName: "リアム",
      titleEn: "Business Development",
      titleJa: "事業開発担当",
      painPoint:
        "提案前の顧客調査や競合整理に毎回時間がかかり、肝心の提案設計に十分な時間を回せない。",
      catchCopy: "提案前の情報収集を先回りし、商談準備の速度を上げる。",
      summary:
        "顧客情報の収集、業界動向の要約、提案ドラフトのたたき台作成までを先回りして支援し、営業担当が対話と判断に集中できる状態をつくります。",
      ctaLabel: "営業ユースケースを見る",
      ctaHref: "/demo/use-cases",
      accent: "blue",
    },
    {
      department: "コーポレート・管理",
      firstName: "Emma",
      displayName: "エマ",
      titleEn: "Operations Manager",
      titleJa: "管理部門責任者",
      painPoint:
        "社内規程や申請フローへの問い合わせ対応が属人化し、同じ確認対応に時間が取られている。",
      catchCopy: "社内ルールの一次案内を自動化し、確認対応の負荷を下げる。",
      summary:
        "社内規程の検索、問い合わせ一次回答、申請手順の案内をAI Crewが担当し、管理部門は例外判断や制度改善に時間を使えます。",
      ctaLabel: "導入相談をする",
      ctaHref: "/contact-us?inquiry=ai-consulting&product=ai-crew",
      accent: "emerald",
    },
    {
      department: "開発・プロダクト",
      firstName: "Jay",
      displayName: "ジェイ",
      titleEn: "Product Engineer",
      titleJa: "プロダクト開発担当",
      painPoint:
        "ログ確認、再現手順の整理、チケット下書きなどの周辺作業が多く、実際の修正や設計に使える時間が削られている。",
      catchCopy: "ログ整理と再現情報の要約を自動化し、開発の本作業に集中する。",
      summary:
        "ログ・チケット・仕様断片をまとめて再現条件や影響範囲を要約し、開発者がすぐ設計と修正に入れるよう支援します。",
      ctaLabel: "プロダクト活用を相談する",
      ctaHref: "/contact-us?inquiry=technical-question&product=ai-crew",
      accent: "violet",
    },
  ],
  note:
    "この role slider は home / solutions からは切り離したデモ用表示です。カード密度、 portrait crop、 category chip、 details disclosure の UI を internal route で単独確認できます。",
  customCta: {
    label: "お問い合わせ",
    href: "/contact-us?inquiry=demo-request&product=ai-crew",
  },
};

const useCaseShowcaseDemoProps: ComponentProps<typeof UseCaseShowcase> = {
  note:
    "この use-case showcase も公開導線とは分離した internal UI demo です。カード hover、 tab 切替、 modal video overlay、 CTA footer の構成を単独で確認できます。",
  primaryCta: {
    label: "AI Crew の相談をする",
    href: "/contact-us?inquiry=ai-consulting&product=ai-crew",
  },
  secondaryCta: {
    label: "ユースケース一覧を見る",
    href: "/demo/use-cases",
  },
  cards: [
    {
      category: "営業",
      title: "営業提案の事前調査を短時間で終える",
      body:
        "顧客サイト、公開IR、競合情報を横断して要点をまとめ、提案資料の最初の構成案まで準備します。",
      videoHref: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      detailHref: "/demo/use-cases",
      tabs: [
        {
          label: "初回商談",
          body: "初回商談前に企業概要、最近のニュース、想定課題をまとめて、ヒアリング項目のたたき台を作成します。",
          videoHref: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          detailHref: "/demo/use-cases",
        },
        {
          label: "提案書準備",
          body: "RFPや打ち合わせメモから構成案を生成し、提案書作成に入る前の準備時間を短縮します。",
          videoHref: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
          detailHref: "/demo/use-cases",
        },
      ],
    },
    {
      category: "バックオフィス",
      title: "社内問い合わせの一次回答を任せる",
      body:
        "規程、申請手順、FAQ を横断して、社内メンバーへの一次回答を整え、担当者の反復対応を減らします。",
      videoHref: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
      detailHref: "/demo/use-cases",
    },
    {
      category: "開発",
      title: "障害調査の初動を早める",
      body:
        "エラーログ、監視アラート、関連Issueをまとめて、原因候補と確認順序を一覧化します。",
      videoHref: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      detailHref: "/demo/use-cases",
    },
    {
      category: "マーケティング",
      title: "コンテンツ企画の材料を先に集める",
      body:
        "市場トレンド、競合発信、既存コンテンツのギャップを整理して、次に作るべきテーマ候補を提示します。",
      videoHref: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
      detailHref: "/demo/use-cases",
    },
  ],
};

const aiDashiFaqItems: ComponentProps<typeof AIDashiFaq>["items"] = [
  {
    question: "「データの所有権は？」",
    answer:
      "お預かりしたデータの所有権は、常にお客様に帰属します。AI Dashi はお客様のブランドと運用方針に合わせて提供され、学習データや利用データの取り扱いについても、導入時に要件に応じた運用設計をご案内します。",
  },
  {
    question: "「LLMのモデルは選べるか？」",
    answer:
      "はい。ご要件や運用方針に合わせて、利用モデルや構成方針をご相談いただけます。精度・コスト・応答速度のバランスを踏まえて、最適な選択肢をご提案します。",
  },
  {
    question: "「既存システムとの連携は？」",
    answer:
      "既存の業務システムやデータ基盤との連携を前提に設計可能です。導入時には、API や認証、データフローを含めた現行環境との接続方法をご一緒に整理します。",
  },
  {
    question: "「SLAはどうなるか？」",
    answer:
      "ご利用形態やサポートレベルに応じて、必要な SLA や運用条件をご相談いただけます。商用提供を前提とした安定運用のため、個別要件に合わせた体制設計が可能です。",
  },
  {
    question: "「エンドユーザー数に応じた従量課金か？」",
    answer:
      "料金体系は、想定ユーザー数や利用量、必要なサポート範囲に応じて個別に設計します。詳細はお問い合わせいただければ、最適なプランをご案内します。",
  },
] as const;

export const metadata: Metadata = {
  title: "Internal Demo Sections | QueryPie AI",
  alternates: {
    canonical: "/internal/demo-sections",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function InternalDemoSectionsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="px-6 pb-8 pt-20 sm:px-10 lg:px-16 lg:pb-10 lg:pt-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Internal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Demo Sections
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            PR 439 / issue 395 で orphan として残っていた section component を削除せず、internal 専用デモルートから明示的に接続し、単独の見た目を確認できるように保持したページです。
          </p>
          <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            このページは UI デザイン確認用の internal demo であり、検索エンジンのインデックス対象外です。
          </div>
        </div>
      </section>

      <section className="px-6 pb-18 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Role slider</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">RoleSlides component demo</h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                部署フィルター chip、横スクロール slider、portrait crop、expandable details、CTA row の組み合わせを確認できます。
              </p>
          </div>
          <RoleSlides {...roleSlidesDemoProps} />
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-18 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Use-case cards</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">UseCaseShowcase component demo</h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                カード型 video teaser、tabbed copy、modal overlay、footer CTA の構成を internal demo として分離して確認できます。
              </p>
          </div>
          <UseCaseShowcase {...useCaseShowcaseDemoProps} />
        </div>
      </section>

      <section className="border-t border-slate-200 px-6 py-18 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Issue 395 survivors</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Source-inspection test survivor demos
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">
              Issue 395 で残っていた source-inspection test 参照のみの section component 候補を、削除ではなく internal demo route に明示的に再接続した例です。canonical route へ戻す判断が出るまでは、このページで表示契約を確認します。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
            <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">AI Crew avatar</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">AICrewAvatar component demo</h3>
                  <p className="mt-4 text-[15px] leading-7 text-slate-600">
                    `src/components/sections/internal-demo/ai-crew-avatar.tsx` は crew role asset 契約を持つ internal demo 専用 visual primitive です。現時点では canonical route へ戻さず、internal demo で tone / size の描画確認対象として保持します。
                  </p>
                </div>
                <div className="shrink-0 rounded-[24px] bg-white p-4 shadow-sm">
                  <AICrewAvatar tone="gray" />
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 rounded-[22px] bg-white p-5">
                <div className="flex min-h-36 items-center justify-center rounded-[18px] bg-slate-100">
                  <AICrewAvatar size="mobile" tone="gray" alt="AI Crew mobile avatar demo" />
                </div>
                <div className="flex min-h-36 items-center justify-center rounded-[18px] bg-slate-900">
                  <AICrewAvatar size="mobile" tone="white" alt="AI Crew white avatar demo" />
                </div>
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">AI Dashi FAQ</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">AIDashiFaq component demo</h3>
                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                  `src/components/sections/internal-demo/ai-dashi-faq.tsx` は accordion interaction を持つ internal demo 専用 client component です。FAQ の文言と CTA は page.tsx が直接所有し、削除せず canonical route への再配置判断までは internal demo で挙動確認対象として保持します。
                </p>
              </div>
              <AIDashiFaq items={aiDashiFaqItems} ctaHref={aiDashiConsultUrl} ctaLabel="お問い合わせ" />
            </article>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
