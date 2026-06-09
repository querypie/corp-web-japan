import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { As400CobolCtaAction } from "@/components/sections/as400-cobol/cta-action";
import { As400CobolHeroVisual } from "@/components/sections/as400-cobol/hero-visual";
import {
  As400CobolMigrationFlow,
  As400CobolPanel,
  As400CobolPanelGrid,
} from "@/components/sections/as400-cobol/migration-flow";
import { As400CobolSection } from "@/components/sections/as400-cobol/section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const contactHref = "/contact-us";
const heroImageSrc = "/services/as400-cobol/hero-modernization-flow.png";
const heroImageAlt =
  "AS/400とCOBOL資産を分析し、Java、API、クラウド環境へ段階的に移行するモダナイゼーションの流れ";

const heroLabels = [
  {
    label: "AS/400・COBOL資産",
    description: "長年運用されてきた基幹システムを可視化",
  },
  {
    label: "解析・設計・テスト",
    description: "AIを活用して設計書とテストケースを生成",
  },
  {
    label: "Java / API / Cloud移行",
    description: "段階的な変換と運用安定化まで支援",
  },
];

const serviceScopes = [
  {
    eyebrow: "Assessment",
    title: "現状診断",
    body: "IBM i（AS/400）上のアプリケーション、COBOL/RPG資産、DB2 / Oracle、周辺システム連携を整理し、移行優先度とリスクを明確にします。",
  },
  {
    eyebrow: "PoC",
    title: "PoCと移行設計",
    body: "変換対象、テスト範囲、データ移行、クラウド・オンプレミス構成を小さく検証し、段階的なロードマップに落とし込みます。",
  },
  {
    eyebrow: "Migration",
    title: "変換・実装",
    body: "COBOL/RPG資産の解析、設計書・テストケース生成、Java/API/Cloud移行、PostgreSQL移行を実装フェーズまで支援します。",
  },
  {
    eyebrow: "Infrastructure",
    title: "Linux / OCI / AWS移行",
    body: "既存基盤の制約を踏まえ、Linux、OCI、AWS環境への移行、運用設計、監視・権限・接続方式の整理まで対応します。",
  },
  {
    eyebrow: "Stabilization",
    title: "テストと運用安定化",
    body: "業務影響を抑えるためのテスト、並行稼働、性能・障害対応、移行後の改善運用まで継続的に伴走します。",
  },
  {
    eyebrow: "Consulting",
    title: "AI活用による資産可視化",
    body: "属人化した仕様や膨大な既存コードを、AIによる解析・整理の対象にし、移行判断に必要な情報へ変換します。",
  },
];

const migrationSteps = [
  {
    title: "現状診断",
    body: "AS/400、COBOL/RPG、DB、周辺連携を棚卸しします。",
  },
  {
    title: "資産分析",
    body: "仕様、依存関係、データ構造、移行難易度を可視化します。",
  },
  {
    title: "PoC",
    body: "対象範囲を絞り、変換・テスト・運用方式を検証します。",
  },
  {
    title: "変換・実装",
    body: "Java/API/Cloud移行とPostgreSQL移行を段階的に進めます。",
  },
  {
    title: "テスト",
    body: "業務ロジック、データ整合性、性能、連携を確認します。",
  },
  {
    title: "運用安定化",
    body: "並行稼働、監視、改善運用まで継続して支援します。",
  },
];

const scenarioPanels = [
  {
    title: "長年運用されたAS/400資産の可視化",
    body: "部門ごとに使われてきたCOBOL/RPGプログラム、ジョブ、帳票、DB2 / Oracle構造を整理し、仕様の属人化を解消するための分析資料を作成します。",
  },
  {
    title: "周辺システム連携を前提にした段階移行",
    body: "一括刷新ではなく、既存業務への影響を抑えながら、API連携、データ移行、Java化、クラウド基盤への移行を順番に進めます。",
  },
  {
    title: "移行後の運用安定化まで伴走",
    body: "新旧システムの並行稼働、テストケース拡充、障害時対応、運用ドキュメント整備まで含め、現場が使い続けられる状態を目指します。",
  },
];

export const metadata: Metadata = {
  title:
    "IBM i（AS/400）モダナイゼーション | AS400 / COBOL マイグレーション | QueryPie AI",
  description:
    "QueryPie AIは、IBM i（AS/400）上のCOBOL/RPG資産を分析し、設計書・テストケース生成からJava/API/Cloud移行、DB2 / Oracle分析、PostgreSQL移行まで段階的に支援します。",
  alternates: {
    canonical: "/services/as400-cobol",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function As400CobolServicePage() {
  return (
    <main
      {...componentNameDebugProps("As400CobolServicePage")}
      className="relative overflow-x-hidden bg-white text-slate-950"
    >
      <SiteHeader />

      <section className="px-6 pb-20 pt-[112px] lg:px-0 lg:pb-24 lg:pt-[136px]">
        <div className="mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <RevealOnScroll>
            <div className="max-w-[620px]">
              <p className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0f766e]">
                IBM i Modernization
              </p>
              <h1 className="mt-4 text-[42px] font-semibold leading-[50px] tracking-normal text-slate-950 md:text-[56px] md:leading-[66px]">
                IBM i（AS/400）
                <br />
                モダナイゼーション
              </h1>
              <p className="mt-5 text-[20px] font-semibold leading-8 text-slate-800">
                AS400 / COBOL マイグレーションを、現状分析から
                Java/API/Cloud移行、運用安定化まで支援
              </p>
              <p className="mt-5 text-[16px] font-normal leading-8 text-slate-600">
                QueryPie AIは、COBOL/RPG資産の解析・可視化、
                設計書・テストケース生成、DB2 / Oracle分析、
                PostgreSQL移行、Linux / OCI / AWS環境への移行まで
                段階的に支援します。
              </p>
              <div className="mt-8">
                <As400CobolCtaAction href={contactHref}>相談する</As400CobolCtaAction>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full" variant="scale">
            <As400CobolHeroVisual
              imageSrc={heroImageSrc}
              imageAlt={heroImageAlt}
              labels={heroLabels}
            />
          </RevealOnScroll>
        </div>
      </section>

      <As400CobolSection
        muted
        eyebrow="Market Background"
        title="AS/400とCOBOL資産は、今も基幹システムの重要テーマです"
        lead="日本では、IBM i（AS/400）を利用する企業が約15,000社以上あるとされ、COBOL/AS400を利用する企業も約4,000〜5,000社規模に上るといわれています。"
      >
        <div className="mx-auto max-w-[860px] space-y-5 text-[16px] leading-8 text-slate-600">
          <p>
            長年運用されてきた基幹システムは、保守人材の不足、
            属人化した仕様、周辺システムとの連携、クラウド移行への対応など、
            DX推進における重要な検討テーマになっています。
          </p>
          <p>
            METIのDXレポートで示された「2025年の崖」も、レガシーシステム刷新を
            後回しにするリスクを考えるうえで重要な文脈です。数値や出典は、
            公開前レビューの過程で別途確認します。
          </p>
        </div>
      </As400CobolSection>

      <As400CobolSection
        id="service-scope"
        eyebrow="Service Scope"
        title="診断、PoC、変換、実装、運用安定化まで一貫して支援"
        lead="AS/400やCOBOL/RPGだけでなく、DB、インフラ、周辺システム連携まで含めた現実的な移行計画を設計します。"
      >
        <As400CobolPanelGrid>
          {serviceScopes.map((scope) => (
            <As400CobolPanel
              key={scope.title}
              eyebrow={scope.eyebrow}
              title={scope.title}
              body={scope.body}
            />
          ))}
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolSection
        muted
        eyebrow="Migration Flow"
        title="段階的なMigrationで、業務影響を抑えながら刷新する"
        lead="現状診断から資産分析、PoC、変換・実装、テスト、運用安定化まで、移行判断と実装を同じ流れで進めます。"
      >
        <As400CobolMigrationFlow steps={migrationSteps} />
      </As400CobolSection>

      <As400CobolSection
        eyebrow="Scenario"
        title="匿名化された運用シナリオを前提に、実行可能な移行計画へ"
        lead="具体的な顧客名やベンダー名は出さず、AS/400、COBOL、RPG、DB2、Oracle、PostgreSQL、Java、API、Cloudといった技術要素を明確に扱います。"
      >
        <As400CobolPanelGrid>
          {scenarioPanels.map((scenario) => (
            <As400CobolPanel
              key={scenario.title}
              title={scenario.title}
              body={scenario.body}
            />
          ))}
        </As400CobolPanelGrid>
      </As400CobolSection>

      <section className="bg-slate-50 px-6 py-20 text-center lg:px-0">
        <div className="mx-auto flex max-w-[760px] flex-col items-center">
          <p className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0f766e]">
            Contact
          </p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[44px] text-slate-950 md:text-[46px] md:leading-[56px]">
            AS/400・COBOLモダナイゼーションを相談する
          </h2>
          <p className="mt-5 text-[16px] leading-8 text-slate-600">
            既存資産の棚卸しからPoC、変換、実装、運用安定化まで、
            現在の状況に合わせて段階的な進め方を整理します。
          </p>
          <div className="mt-8">
            <As400CobolCtaAction href={contactHref}>相談する</As400CobolCtaAction>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
