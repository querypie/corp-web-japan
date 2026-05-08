import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  McpGatewayCtaActions,
  McpGatewayCtaButton,
  McpGatewayCtaContent,
  McpGatewayCtaCopy,
  McpGatewayCtaDescription,
  McpGatewayCtaSection,
  McpGatewayCtaTitle,
  McpGatewayFeatureBand,
  McpGatewayFeatureChecklist,
  McpGatewayFeatureCopy,
  McpGatewayFeatureDescription,
  McpGatewayFeatureImage,
  McpGatewayFeatureLayout,
  McpGatewayFeatureTitle,
  McpGatewayFeatureVisual,
  McpGatewayHeroBody,
  McpGatewayHeroCopy,
  McpGatewayHeroHeading,
  McpGatewayHeroSection,
  McpGatewayHeroVisual,
} from "@/components/sections/mcp-gateway-page";

export const metadata: Metadata = {
  title: "QueryPie AIP：すべてを接続するMCPハブ",
  description:
    "既存システムとAIツールを安全につなぎ、社内接続・権限制御・監査・DLPまで一元化する QueryPie AIP の統合型AIゲートウェイページ。",
  alternates: {
    canonical: "/t/solutions/aip/mcp-gateway",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function McpGatewayPage() {
  return (
    <main className="bg-white text-slate-950">
      <SiteHeader />

      <McpGatewayHeroSection>
        <McpGatewayHeroCopy>
          <McpGatewayHeroHeading>
            QueryPie AIP
            <br />
            統合型AIゲートウェイ
          </McpGatewayHeroHeading>
          <McpGatewayHeroBody>
            AIによる業務最適化には、既存システムとの連携が必須。でも、大規模なシステム再構築は不要です。
            <br />
            QueryPie AIPなら、45種類以上の構築済みツールとカスタムツールを統合して一元管理できます。
            <br />
            複雑な接続処理はプラットフォームが担当し、既存システム全体のAIワークフローを効率化します。
          </McpGatewayHeroBody>
        </McpGatewayHeroCopy>
        <McpGatewayHeroVisual />
      </McpGatewayHeroSection>

      <McpGatewayFeatureBand muted>
        <McpGatewayFeatureLayout>
          <McpGatewayFeatureCopy className="w-[422px]">
            <McpGatewayFeatureTitle>
              セキュアな社内システム接続
              <br />
              （スマートエッジトンネリング）
            </McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              トンネリングを通じて、社内システムへ安全にアクセス。
              <br />
              既存のセキュリティ環境を変更せずに、
              <br />
              ファイアウォールで保護されたリソースに接続できます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-[540px]">
            <McpGatewayFeatureImage
              src="/solutions/aip/mcp-gateway/tunneling.gif"
              alt="セキュアな社内システム接続（スマートエッジトンネリング）"
              width={540}
              height={304}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand>
        <McpGatewayFeatureLayout reverse>
          <McpGatewayFeatureCopy className="w-[388px]">
            <McpGatewayFeatureTitle>外部ツールとの連携</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              安全なローカルプロキシサーバーを介して、
              <br />
              外部開発ツールからQueryPie AIPのMCP設定を利用可能。
              <br />
              Cursor IDE、Claude Desktop、Windsurfなどから、
              <br />
              シームレスにアクセスできます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-[580px]">
            <McpGatewayFeatureImage
              src="/solutions/aip/mcp-gateway/external-tools.gif"
              alt="外部ツールとの連携"
              width={580}
              height={326}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand muted>
        <McpGatewayFeatureLayout>
          <McpGatewayFeatureCopy className="w-[418px]">
            <McpGatewayFeatureTitle>組織全体を一元管理</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              詳細な権限設定で、誰がどのツールにアクセスできるかを制御。
              <br />
              組織全体のすべてのAIツール利用を、一元的に管理できます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-[520px]">
            <McpGatewayFeatureImage
              src="/solutions/aip/mcp-gateway/management.gif"
              alt="組織全体を一元管理"
              width={520}
              height={293}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand>
        <McpGatewayFeatureLayout reverse>
          <McpGatewayFeatureCopy className="w-[366px]">
            <McpGatewayFeatureTitle>
              組織全体のすべての操作を、
              <br />
              完全に可視化して追跡。
            </McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              ユーザーの活動とシステム変更を監視し、
              <br />
              セキュリティとコンプライアンスを強化します。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-[580px]">
            <McpGatewayFeatureImage
              src="/solutions/aip/mcp-gateway/audit.gif"
              alt="組織全体のすべての操作を、完全に可視化して追跡。"
              width={580}
              height={326}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand muted>
        <McpGatewayFeatureLayout>
          <McpGatewayFeatureCopy className="w-[500px]">
            <McpGatewayFeatureTitle>データ漏洩防止（DLP）</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              機密データがAIチャットに入り込むことを自動的にブロック。
              <br />
              クレジットカード番号、APIキー、個人情報などの露出を瞬時に防止します。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-[520px]">
            <McpGatewayFeatureImage
              src="/solutions/aip/mcp-gateway/dlp.gif"
              alt="データ漏洩防止（DLP）"
              width={520}
              height={293}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayCtaSection>
        <McpGatewayCtaContent>
          <McpGatewayCtaCopy>
            <McpGatewayCtaTitle>まずは小さく、失敗しないAXを始めよう</McpGatewayCtaTitle>
            <McpGatewayCtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</McpGatewayCtaDescription>
          </McpGatewayCtaCopy>
          <McpGatewayCtaActions>
            <McpGatewayCtaButton href="https://app.querypie.com">無料で試してみる</McpGatewayCtaButton>
          </McpGatewayCtaActions>
        </McpGatewayCtaContent>
      </McpGatewayCtaSection>

      <SiteFooter />
    </main>
  );
}
