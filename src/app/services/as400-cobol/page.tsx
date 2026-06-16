import type { Metadata } from "next";
import As400CobolKoreanPage, {
  as400CobolKoreanMetadata,
} from "./page.ko";
import {
  As400CobolArchitectureBand,
  As400CobolBodyText,
  As400CobolDiagramArrow,
  As400CobolDiagramRail,
  As400CobolDiagramStage,
  As400CobolInsightItem,
  As400CobolInsightList,
  As400CobolMiniList,
  As400CobolMiniListItem,
  As400CobolPathCard,
  As400CobolPathGrid,
  As400CobolStatCard,
  As400CobolStatGrid,
  As400CobolTextColumns,
} from "@/components/sections/as400-cobol/diagrams";
import { As400CobolCtaAction } from "@/components/sections/as400-cobol/cta-action";
import { As400CobolHeroVisual } from "@/components/sections/as400-cobol/hero-visual";
import {
  As400CobolPanel,
  As400CobolPanelGrid,
} from "@/components/sections/as400-cobol/migration-flow";
import {
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
  "AS/400とCOBOL資産を分析し、Java、API、クラウド環境へ段階的に移行する流れ";

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
    label: "Java / API / クラウド移行",
    description: "段階的な変換と運用安定化まで支援",
  },
];

const as400CobolJapaneseMetadata: Metadata = {
  title:
    "IBM i（AS/400）モダナイゼーション | AS400 / COBOL マイグレーション | QueryPie AI",
  description:
    "QueryPie AIは、IBM i（AS/400）上のCOBOL/RPG資産を分析し、設計書・テストケース生成からJava/API/クラウド移行、DB2 / Oracle分析、PostgreSQL移行まで段階的に支援します。",
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
            <As400CobolHeroEyebrow>IBM i モダナイゼーション</As400CobolHeroEyebrow>
            <As400CobolHeroTitle>
              IBM i（AS/400）
              <br />
              モダナイゼーション
            </As400CobolHeroTitle>
            <As400CobolHeroSubtitle>
              AS400 / COBOL マイグレーションを、現状分析から
              Java/API/クラウド移行、運用安定化まで支援
            </As400CobolHeroSubtitle>
            <As400CobolHeroDescription>
              QueryPie AIは、COBOL/RPG資産の解析・可視化、
              設計書・テストケース生成、DB2 / Oracle分析、
              PostgreSQL移行、Linux / OCI / AWS環境への移行まで、
              既存業務を止めない段階的な刷新を支援します。
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
        eyebrow="市場背景"
        title={
          <>
            AS/400とCOBOL資産は、
            <br />
            今も基幹システムの重要テーマです
          </>
        }
        lead={
          <>
            AS/400（現在のIBM i）は、IBM Power上で動作する統合型の基幹業務プラットフォームです。
            <br />
            RPG、COBOL、CL、Db2 for i、ジョブ、帳票、5250画面などが業務と深く結びついているため、
            <br />
            単なるサーバー更改ではなく、業務ロジックを理解したうえでの段階的なモダナイゼーションが必要です。
          </>
        }
      >
        <div className="space-y-8">
          <As400CobolStatGrid>
            <As400CobolStatCard
              value="国内約2万社"
              label="国内IBM i利用企業"
              description="日本IBM関係者の公開資料では、世界約15万社、国内約2万社で利用されると説明されています。"
            />
            <As400CobolStatCard
              value="約70%"
              label="基幹業務の過半をIBM iで運用"
              description="Fortraの2026年調査では、IBM i利用企業の約70%が基幹業務アプリケーションの半数以上をIBM iで運用しています。"
            />
            <As400CobolStatCard
              value="最大12兆円/年"
              label="2025年以降の経済損失リスク"
              description="経済産業省のDXレポートが示した、レガシーシステムの複雑化・ブラックボックス化に関する警告です。"
            />
            <As400CobolStatCard
              value="1兆3,044億円"
              label="2025年ITモダナイゼーション市場"
              description="IDCの日本ITモダナイゼーションサービス市場予測を、全体市場の背景として扱います。"
            />
          </As400CobolStatGrid>

          <As400CobolTextColumns>
            <As400CobolBodyText>
              <p>
                日本企業に残るIBM i（AS/400）やCOBOL/RPGの基幹システムは、
                古いから残っているのではありません。受発注、在庫、会計、決済、
                給与、顧客管理といった止められない業務を、長期間安定して
                支えてきたからこそ、簡単には置き換えられない資産になっています。
              </p>
              <p>
                一方で、長年の改修で仕様が属人化し、プログラム、テーブル、
                ジョブ、帳票、外部連携の関係が見えにくくなると、改修や移行の
                影響範囲を判断しにくくなります。経済産業省のDXレポートが
                指摘した「2025年の崖」も、レガシーシステムの複雑化と
                ブラックボックス化を放置するリスクを考えるうえで重要な文脈です。
              </p>
            </As400CobolBodyText>
            <As400CobolInsightList>
              <As400CobolInsightItem icon="host" title="IBM iは統合型プラットフォーム">
                OS、Db2 for i、ジョブ管理、セキュリティ、5250画面、RPG/COBOL/CLが
                一体で運用されるため、Linux移行やデータベース移行だけでは全体像を説明できません。
              </As400CobolInsightItem>
              <As400CobolInsightItem icon="database" title="データと業務ロジックが近い">
                Db2 for i、DB2 / Oracle、帳票、バッチ、周辺システム連携まで含めて、
                どの業務がどの資産に依存しているかを整理する必要があります。
              </As400CobolInsightItem>
              <As400CobolInsightItem icon="brain" title="AI分析の入口が明確">
                コード説明、仕様書生成、依存関係整理、影響度分析、テスト範囲の抽出は、
                段階的な移行判断の前提になります。
              </As400CobolInsightItem>
            </As400CobolInsightList>
          </As400CobolTextColumns>
        </div>
      </As400CobolSection>

      <As400CobolSection
        componentName="As400CobolWhyModernizeSection"
        eyebrow="刷新が必要な理由"
        title={
          <>なぜ今、AS400 / COBOL モダナイゼーションが必要なのか</>
        }
        lead={
          <>
            課題は、システムが動かないことではありません。安定して動いているからこそ、変える判断が遅れ、
            <br />
            保守人材、コスト、仕様のブラックボックス化、DX施策との接続が同時に難しくなることです。
          </>
        }
      >
        <As400CobolInsightList>
          <As400CobolInsightItem icon="legacy" title="「動いているから触らない」が限界に近づく">
            長年稼働してきた基幹システムは、業務に深く組み込まれています。
            しかし担当者の退職、ベンダー依存、改修履歴の蓄積が進むほど、
            触らない判断そのものが将来のリスクになります。
          </As400CobolInsightItem>
          <As400CobolInsightItem icon="route" title="影響範囲が分からず、改修判断が遅れる">
            1つの画面や帳票の変更でも、プログラム、ファイル、ジョブ、外部連携、
            テスト範囲が連鎖します。見えない依存関係を可視化しなければ、
            小さな改修も大きなリスクになります。
          </As400CobolInsightItem>
          <As400CobolInsightItem icon="api" title="クラウド、API、データ活用につながりにくい">
            既存IBM iを残しながらAPIで外部化するのか、Java化するのか、
            PostgreSQLやLinux / OCI / AWSへ移すのか。選択肢を比較するには、
            現行資産の構造理解が必要です。
          </As400CobolInsightItem>
        </As400CobolInsightList>
      </As400CobolSection>

      <As400CobolSection
        muted
        componentName="As400CobolAiApproachSection"
        eyebrow="AI活用"
        title={
          <>
            全面再開発ではなく、
            <br />
            まずAIで現行システムを理解する
          </>
        }
        lead={
          <>
            QueryPie AIは、既存資産をただ置き換えるのではなく、
            <br />
            コード、データベース、ジョブ、帳票、外部連携を読み解き、移行判断に必要な情報へ変換します。
          </>
        }
      >
        <As400CobolDiagramRail>
          <As400CobolDiagramStage icon="source" eyebrow="入力情報" title="既存資産を集める">
            <As400CobolMiniList>
              <As400CobolMiniListItem>COBOL / RPG / CLプログラム</As400CobolMiniListItem>
              <As400CobolMiniListItem>Db2 for i、DB2 / Oracle、ファイル定義</As400CobolMiniListItem>
              <As400CobolMiniListItem>ジョブ、帳票、画面、外部連携</As400CobolMiniListItem>
            </As400CobolMiniList>
          </As400CobolDiagramStage>
          <As400CobolDiagramArrow />
          <As400CobolDiagramStage icon="analysis" eyebrow="分析" title="AIで構造化する">
            <As400CobolMiniList>
              <As400CobolMiniListItem>業務ロジックと処理フローの説明</As400CobolMiniListItem>
              <As400CobolMiniListItem>テーブル、プログラム、バッチの依存関係整理</As400CobolMiniListItem>
              <As400CobolMiniListItem>改修・移行時の影響度分析</As400CobolMiniListItem>
            </As400CobolMiniList>
          </As400CobolDiagramStage>
          <As400CobolDiagramArrow />
          <As400CobolDiagramStage icon="book" eyebrow="出力" title="判断材料に変える">
            <As400CobolMiniList>
              <As400CobolMiniListItem>現行仕様書、データモデル、移行対象分類</As400CobolMiniListItem>
              <As400CobolMiniListItem>テストケース、テスト範囲、優先順位</As400CobolMiniListItem>
              <As400CobolMiniListItem>PoC計画、移行ロードマップ、実装方針</As400CobolMiniListItem>
            </As400CobolMiniList>
          </As400CobolDiagramStage>
        </As400CobolDiagramRail>
      </As400CobolSection>

      <As400CobolSection
        componentName="As400CobolDeliverablesSection"
        eyebrow="成果物"
        title={
          <>
            設計書、影響度、テストケースまで
            <br />
            移行判断に必要な成果物をそろえる
          </>
        }
        lead={
          <>
            AI分析の目的は、単にコードを説明することではありません。
            <br />
            現行業務を止めずに、どこから着手し、何を残し、何を移すかを判断できる状態を作ることです。
          </>
        }
      >
        <As400CobolPanelGrid componentName="As400CobolDeliverablesGrid">
          <As400CobolPanel
            componentName="As400CobolSpecificationPanel"
            eyebrow="仕様書"
            title="現行仕様書の生成"
            body="COBOL/RPGプログラムの処理内容、入力、出力、例外処理、業務ルールを読み解き、担当者が確認できる現行仕様として整理します。"
          />
          <As400CobolPanel
            componentName="As400CobolDependencyPanel"
            eyebrow="依存関係"
            title="依存関係と影響度の整理"
            body="プログラム、テーブル、ジョブ、帳票、外部連携の関係を可視化し、改修や移行時に影響を受ける範囲を確認します。"
          />
          <As400CobolPanel
            componentName="As400CobolDataModelPanel"
            eyebrow="データモデル"
            title="データベース・データモデル分析"
            body="Db2 for i、DB2 / Oracle、ファイル定義、データ項目の関係を整理し、PostgreSQL移行やAPI化の前提を作ります。"
          />
          <As400CobolPanel
            componentName="As400CobolTestCasePanel"
            eyebrow="テスト"
            title="テストケース生成"
            body="業務ロジックとデータ整合性を確認するためのテスト観点、正常系・例外系、移行後の比較検証範囲を整理します。"
          />
          <As400CobolPanel
            componentName="As400CobolRoadmapPanel"
            eyebrow="ロードマップ"
            title="移行対象の分類"
            body="残す機能、外部化する機能、Java化する機能、データベース移行が必要な領域を分け、PoCと段階移行の優先順位を作ります。"
          />
          <As400CobolPanel
            componentName="As400CobolKnowledgePanel"
            eyebrow="知識継承"
            title="業務知識の検索・継承"
            body="属人化した仕様やベテラン担当者の知識を、検索・確認しやすい形に変換し、新しい担当者のオンボーディングを支援します。"
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolSection
        muted
        componentName="As400CobolMigrationArchitectureSection"
        eyebrow="移行設計"
        title={
          <>
            Java / PostgreSQL / Linux / クラウドへ、
            <br />
            状況に応じた移行ルートを設計する
          </>
        }
        lead={
          <>
            最初から全体を置き換えるのではなく、既存IBM iを残す選択肢も含めて、
            <br />
            API化、Java化、データ移行、クラウド移行を段階的に組み合わせます。
          </>
        }
      >
        <div className="space-y-8">
          <As400CobolArchitectureBand>
            <As400CobolDiagramStage icon="host" eyebrow="現行" title="IBM i（AS/400）">
              <As400CobolMiniList>
                <As400CobolMiniListItem>RPG / COBOL / CL</As400CobolMiniListItem>
                <As400CobolMiniListItem>Db2 for i、DB2 / Oracle</As400CobolMiniListItem>
                <As400CobolMiniListItem>5250画面、ジョブ、帳票</As400CobolMiniListItem>
              </As400CobolMiniList>
            </As400CobolDiagramStage>
            <As400CobolDiagramArrow />
            <As400CobolDiagramStage icon="brain" eyebrow="橋渡し" title="AI分析とPoC">
              <As400CobolMiniList>
                <As400CobolMiniListItem>業務影響と移行難易度を評価</As400CobolMiniListItem>
                <As400CobolMiniListItem>変換精度とテスト可能性を検証</As400CobolMiniListItem>
                <As400CobolMiniListItem>優先順位と実装単位を決定</As400CobolMiniListItem>
              </As400CobolMiniList>
            </As400CobolDiagramStage>
            <As400CobolDiagramArrow />
            <As400CobolDiagramStage icon="cloud" eyebrow="移行先" title="次世代アーキテクチャ">
              <As400CobolMiniList>
                <As400CobolMiniListItem>Java / API / クラウド</As400CobolMiniListItem>
                <As400CobolMiniListItem>PostgreSQL / Linux</As400CobolMiniListItem>
                <As400CobolMiniListItem>OCI / AWS / オンプレミス併用</As400CobolMiniListItem>
              </As400CobolMiniList>
            </As400CobolDiagramStage>
          </As400CobolArchitectureBand>

          <As400CobolPathGrid>
            <As400CobolPathCard icon="api" title="APIで外部化">
              既存IBM iをすぐに置き換えず、必要な機能からAPIで外部システムと接続します。
            </As400CobolPathCard>
            <As400CobolPathCard icon="code" title="COBOL/RPGからJavaへ">
              変換対象を絞り、PoCで精度、例外処理、テスト可能性を確認しながら進めます。
            </As400CobolPathCard>
            <As400CobolPathCard icon="database" title="PostgreSQLへデータ移行">
              テーブル、ファイル、データ項目、整合性チェックを整理し、段階的に移行します。
            </As400CobolPathCard>
            <As400CobolPathCard icon="cloud" title="Linux / OCI / AWSへ展開">
              運用、監視、権限、接続方式を含めて、移行後に使い続けられる基盤を設計します。
            </As400CobolPathCard>
          </As400CobolPathGrid>
        </div>
      </As400CobolSection>

      <As400CobolSection
        id="service-scope"
        componentName="As400CobolServiceScopeSection"
        eyebrow="サービス範囲"
        title={
          <>
            現行理解から段階移行まで、
            <br />
            サービス範囲を一つの流れで支援
          </>
        }
        lead={
          <>
            受発注、在庫、請求、バッチ、帳票、外部連携といった業務単位に沿って現行資産を理解し、
            <br />
            AI分析、PoC、移行設計、実装、並行稼働、運用安定化までつなげます。
          </>
        }
      >
        <As400CobolPanelGrid componentName="As400CobolServiceScopeGrid">
          <As400CobolPanel
            componentName="As400CobolAssessmentPanel"
            eyebrow="01 棚卸し"
            title="現行業務と技術資産の棚卸し"
            body="受発注、在庫、請求、給与などの業務単位で、COBOL/RPGプログラム、DB2 / Oracle、ジョブ、帳票、ファイル連携を整理し、移行の全体像を把握します。"
          />
          <As400CobolPanel
            componentName="As400CobolAnalysisPanel"
            eyebrow="02 分析"
            title="AI分析と影響度整理"
            body="コード構造、業務ロジック、データモデル、依存関係、改修時の影響範囲をAIで整理し、仕様書、データモデル、テスト観点として確認できる状態にします。"
          />
          <As400CobolPanel
            componentName="As400CobolPlanningPanel"
            eyebrow="03 計画"
            title="移行対象と残す領域の切り分け"
            body="Java化、API化、PostgreSQL移行、クラウド移行に進める領域と、当面IBM i上に残す領域を分け、業務影響と優先度に基づいて段階的なロードマップを作ります。"
          />
          <As400CobolPanel
            componentName="As400CobolPocPanel"
            eyebrow="04 検証"
            title="小さく検証するPoC"
            body="在庫照会、取引先マスタ、請求状況など、業務影響を抑えやすい範囲から、変換精度、データ整合性、API連携、移行後の運用イメージを検証します。"
          />
          <As400CobolPanel
            componentName="As400CobolImplementationPanel"
            eyebrow="05 実装"
            title="変換・実装と基盤移行"
            body="PoCで確認した範囲から、COBOL/RPGのJava化、API連携、PostgreSQL移行、Linux / OCI / AWS環境への展開、周辺システム連携を進めます。"
          />
          <As400CobolPanel
            componentName="As400CobolStabilizationPanel"
            eyebrow="06 安定化"
            title="テスト、並行稼働、運用安定化"
            body="新旧システムの照合テスト、性能確認、並行稼働、切り戻し、監視、障害対応、運用ドキュメント整備まで、現場が使い続けられる状態を目指します。"
          />
        </As400CobolPanelGrid>
      </As400CobolSection>

      <As400CobolContactSection>
        <As400CobolContactEyebrow>お問い合わせ</As400CobolContactEyebrow>
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
