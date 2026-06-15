import type { Metadata } from "next";
import As400CobolKoreanPage, {
  as400CobolKoreanMetadata,
} from "./page.ko";
import { As400CobolCtaAction } from "@/components/sections/as400-cobol/cta-action";
import { As400CobolHeroVisual } from "@/components/sections/as400-cobol/hero-visual";
import {
  As400CobolMigrationFlow,
  As400CobolMigrationStep,
  As400CobolPanel,
  As400CobolPanelGrid,
} from "@/components/sections/as400-cobol/migration-flow";
import {
  As400CobolBodyCopy,
  As400CobolContactActions,
  As400CobolContactDescription,
  As400CobolContactEyebrow,
  As400CobolContactSection,
  As400CobolContactTitle,
  As400CobolHeroActions,
  As400CobolHeroCopy,
  As400CobolHeroDescription,
  As400CobolHeroEyebrow,
  As400CobolHeroSection,
  As400CobolHeroSubtitle,
  As400CobolHeroTitle,
  As400CobolPageShell,
} from "@/components/sections/as400-cobol/page-sections";
import { As400CobolSection } from "@/components/sections/as400-cobol/section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type As400CobolServicePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

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

const as400CobolJapaneseMetadata: Metadata = {
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

function readLanguage(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const rawLang = searchParams?.lang;
  return Array.isArray(rawLang) ? rawLang[0] : rawLang;
}

export async function generateMetadata({
  searchParams,
}: As400CobolServicePageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  return readLanguage(resolvedSearchParams) === "ko"
    ? as400CobolKoreanMetadata
    : as400CobolJapaneseMetadata;
}

export default async function As400CobolServicePage({
  searchParams,
}: As400CobolServicePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  if (readLanguage(resolvedSearchParams) === "ko") {
    return <As400CobolKoreanPage />;
  }

  return (
    <As400CobolPageShell debugProps={componentNameDebugProps("As400CobolServicePage")}>
      <As400CobolHeroSection
        visual={
          <RevealOnScroll delayMs={120} className="w-full" variant="scale">
            <As400CobolHeroVisual
              imageSrc={heroImageSrc}
              imageAlt={heroImageAlt}
              labels={heroLabels}
            />
          </RevealOnScroll>
        }
      >
        <RevealOnScroll>
          <As400CobolHeroCopy>
            <As400CobolHeroEyebrow>IBM i Modernization</As400CobolHeroEyebrow>
            <As400CobolHeroTitle>
              IBM i（AS/400）
              <br />
              モダナイゼーション
            </As400CobolHeroTitle>
            <As400CobolHeroSubtitle>
              AS400 / COBOL マイグレーションを、現状分析から
              Java/API/Cloud移行、運用安定化まで支援
            </As400CobolHeroSubtitle>
            <As400CobolHeroDescription>
              QueryPie AIは、COBOL/RPG資産の解析・可視化、
              設計書・テストケース生成、DB2 / Oracle分析、
              PostgreSQL移行、Linux / OCI / AWS環境への移行まで
              段階的に支援します。
            </As400CobolHeroDescription>
            <As400CobolHeroActions>
              <As400CobolCtaAction href={contactHref}>相談する</As400CobolCtaAction>
            </As400CobolHeroActions>
          </As400CobolHeroCopy>
        </RevealOnScroll>
      </As400CobolHeroSection>

      <As400CobolSection
        muted
        componentName="As400CobolMarketBackgroundSection"
        eyebrow="Market Background"
        title="1万社規模のIBM i市場と、拡大するモダナイゼーション需要"
        lead="日本のIBM i（AS/400）顧客は、保守的には1万社、広義には1万5,000〜2万社規模と推定されます。IDCは、日本のITモダナイゼーションサービス市場を2025年に1兆3,044億円、2030年に2兆1,234億円と予測しています。"
      >
        <As400CobolBodyCopy componentName="As400CobolMarketBackgroundCopy">
          <p>
            IBM i（AS/400）は、製造、流通、物流、商社、卸売などの業務で
            長く使われてきた基幹業務プラットフォームです。市場推計では、
            IBM iユーザーの85〜92%がRPG資産を保有し、RPG利用顧客は
            1万〜1万4,000社程度が現実的な対象と見られます。
          </p>
          <p>
            COBOLについては、IBM i上での利用率が15〜16%程度と見られ、
            IBM i上のCOBOL利用顧客は1,500〜3,200社規模の推定です。
            一方、メインフレームやオープン系を含む日本のCOBOL利用顧客は
            4,000〜8,000社規模と見られ、金融・保険・公共・大手製造を
            中心に現在も基幹業務を支えています。
          </p>
          <p>
            市場規模が示すのは、単なるサーバー更改ではなく、業務ロジック、
            データ構造、ジョブ、帳票、周辺システム連携を理解し直す需要です。
            保守人材の不足、仕様の属人化、クラウド・API活用の遅れを解消するには、
            現行資産をAIで可視化し、段階的に移行範囲を判断するアプローチが
            必要になります。
          </p>
        </As400CobolBodyCopy>
      </As400CobolSection>

      <As400CobolSection
        id="service-scope"
        componentName="As400CobolServiceScopeSection"
        eyebrow="Service Scope"
        title="診断、PoC、変換、実装、運用安定化まで一貫して支援"
        lead="AS/400やCOBOL/RPGだけでなく、DB、インフラ、周辺システム連携まで含めた現実的な移行計画を設計します。"
      >
        <As400CobolPanelGrid componentName="As400CobolServiceScopeGrid">
          <As400CobolPanel
            componentName="As400CobolAssessmentPanel"
            eyebrow="Assessment"
            title="現状診断"
            body="IBM i（AS/400）上のアプリケーション、COBOL/RPG資産、DB2 / Oracle、周辺システム連携を整理し、移行優先度とリスクを明確にします。"
          />
          <As400CobolPanel
            componentName="As400CobolPocPanel"
            eyebrow="PoC"
            title="PoCと移行設計"
            body="変換対象、テスト範囲、データ移行、クラウド・オンプレミス構成を小さく検証し、段階的なロードマップに落とし込みます。"
          />
          <As400CobolPanel
            componentName="As400CobolMigrationPanel"
            eyebrow="Migration"
            title="変換・実装"
            body="COBOL/RPG資産の解析、設計書・テストケース生成、Java/API/Cloud移行、PostgreSQL移行を実装フェーズまで支援します。"
          />
          <As400CobolPanel
            componentName="As400CobolInfrastructurePanel"
            eyebrow="Infrastructure"
            title="Linux / OCI / AWS移行"
            body="既存基盤の制約を踏まえ、Linux、OCI、AWS環境への移行、運用設計、監視・権限・接続方式の整理まで対応します。"
          />
          <As400CobolPanel
            componentName="As400CobolStabilizationPanel"
            eyebrow="Stabilization"
            title="テストと運用安定化"
            body="業務影響を抑えるためのテスト、並行稼働、性能・障害対応、移行後の改善運用まで継続的に伴走します。"
          />
          <As400CobolPanel
            componentName="As400CobolConsultingPanel"
            eyebrow="Consulting"
            title="AI活用による資産可視化"
            body="属人化した仕様や膨大な既存コードを、AIによる解析・整理の対象にし、移行判断に必要な情報へ変換します。"
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolSection
        muted
        componentName="As400CobolMigrationFlowSection"
        eyebrow="Migration Flow"
        title="段階的なMigrationで、業務影響を抑えながら刷新する"
        lead="現状診断から資産分析、PoC、変換・実装、テスト、運用安定化まで、移行判断と実装を同じ流れで進めます。"
      >
        <As400CobolMigrationFlow>
          <As400CobolMigrationStep
            componentName="As400CobolAssessmentStep"
            stepNumber="01"
            icon="assessment"
            title="現状診断"
            body="AS/400、COBOL/RPG、DB、周辺連携を棚卸しします。"
          />
          <As400CobolMigrationStep
            componentName="As400CobolAnalysisStep"
            stepNumber="02"
            icon="analysis"
            title="資産分析"
            body="仕様、依存関係、データ構造、移行難易度を可視化します。"
          />
          <As400CobolMigrationStep
            componentName="As400CobolPocStep"
            stepNumber="03"
            icon="poc"
            title="PoC"
            body="対象範囲を絞り、変換・テスト・運用方式を検証します。"
          />
          <As400CobolMigrationStep
            componentName="As400CobolImplementationStep"
            stepNumber="04"
            icon="migration"
            title="変換・実装"
            body="Java/API/Cloud移行とPostgreSQL移行を段階的に進めます。"
          />
          <As400CobolMigrationStep
            componentName="As400CobolTestingStep"
            stepNumber="05"
            icon="test"
            title="テスト"
            body="業務ロジック、データ整合性、性能、連携を確認します。"
          />
          <As400CobolMigrationStep
            componentName="As400CobolStabilizationStep"
            stepNumber="06"
            icon="stabilization"
            title="運用安定化"
            body="並行稼働、監視、改善運用まで継続して支援します。"
            hasConnector={false}
          />
        </As400CobolMigrationFlow>
      </As400CobolSection>

      <As400CobolSection
        componentName="As400CobolScenarioSection"
        eyebrow="Scenario"
        title="匿名化された運用シナリオを前提に、実行可能な移行計画へ"
        lead="具体的な顧客名やベンダー名は出さず、AS/400、COBOL、RPG、DB2、Oracle、PostgreSQL、Java、API、Cloudといった技術要素を明確に扱います。"
      >
        <As400CobolPanelGrid componentName="As400CobolScenarioGrid">
          <As400CobolPanel
            componentName="As400CobolAssetVisibilityScenario"
            title="長年運用されたAS/400資産の可視化"
            body="部門ごとに使われてきたCOBOL/RPGプログラム、ジョブ、帳票、DB2 / Oracle構造を整理し、仕様の属人化を解消するための分析資料を作成します。"
          />
          <As400CobolPanel
            componentName="As400CobolPhasedMigrationScenario"
            title="周辺システム連携を前提にした段階移行"
            body="一括刷新ではなく、既存業務への影響を抑えながら、API連携、データ移行、Java化、クラウド基盤への移行を順番に進めます。"
          />
          <As400CobolPanel
            componentName="As400CobolStabilizationScenario"
            title="移行後の運用安定化まで伴走"
            body="新旧システムの並行稼働、テストケース拡充、障害時対応、運用ドキュメント整備まで含め、現場が使い続けられる状態を目指します。"
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolContactSection>
        <As400CobolContactEyebrow>Contact</As400CobolContactEyebrow>
        <As400CobolContactTitle>
          AS/400・COBOLモダナイゼーションを相談する
        </As400CobolContactTitle>
        <As400CobolContactDescription>
          既存資産の棚卸しからPoC、変換、実装、運用安定化まで、
          現在の状況に合わせて段階的な進め方を整理します。
        </As400CobolContactDescription>
        <As400CobolContactActions>
          <As400CobolCtaAction href={contactHref}>相談する</As400CobolCtaAction>
        </As400CobolContactActions>
      </As400CobolContactSection>
    </As400CobolPageShell>
  );
}
