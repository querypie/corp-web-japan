import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
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
  McpGatewayHeroEyebrow,
  McpGatewayHeroHeading,
  McpGatewayHeroSection,
  McpGatewayHeroVisual,
  McpGatewayPageShell,
} from "@/components/sections/mcp-gateway/section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "MCP Gateway｜MCPを全社で安全に統制 | QueryPie AI",
  description:
    "QueryPie AIPのMCP Gatewayは、MCPサーバーとAIツールへの接続、権限、利用状況を一元管理。ポリシー適用と監査ログで、AIエージェントの安全な業務利用を支えます。",
  alternates: {
    canonical: "/platforms/aip/mcp-gateway",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function McpGatewayPage() {
  return (
    <McpGatewayPageShell {...componentNameDebugProps("McpGatewayPage")}>
      <SiteHeader />

      <McpGatewayHeroSection>
        <RevealOnScroll>
          <McpGatewayHeroCopy>
            <McpGatewayHeroEyebrow>統合型MCPゲートウェイ</McpGatewayHeroEyebrow>
            <McpGatewayHeroHeading>MCPを、全社でつなぎ、統制する。</McpGatewayHeroHeading>
          </McpGatewayHeroCopy>
        </RevealOnScroll>

        <RevealOnScroll delayMs={60}>
          <McpGatewayHeroBody>
            MCPサーバーやAIツールが分散しても、接続・権限・利用状況を一つの基盤で管理。
            複雑な連携を裏側で吸収し、既存の技術環境をまたぐAIワークフローを、安全に展開できます。
          </McpGatewayHeroBody>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <McpGatewayHeroVisual />
        </RevealOnScroll>
      </McpGatewayHeroSection>

      <McpGatewayFeatureBand muted>
        <McpGatewayFeatureLayout>
          <McpGatewayFeatureCopy className="w-full lg:w-[450px]">
            <McpGatewayFeatureTitle>社内システムへ、安全に接続する</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              セキュアなトンネリングにより、既存のセキュリティ環境を変えずに、ファイアウォールで保護された社内リソースへ接続できます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-full lg:w-[540px]">
            <McpGatewayFeatureImage
              src="https://www.querypie.com/assets/products/aip/mcp-gateway/aip_function_tunneling.gif"
              alt="社内システムへ安全に接続するSmart Edge Tunneling"
              width={540}
              height={304}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand>
        <McpGatewayFeatureLayout reverse>
          <McpGatewayFeatureCopy className="w-full lg:w-[413px]">
            <McpGatewayFeatureTitle>MCPプロキシで、外部ツールから使う</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              セキュアなローカルMCPプロキシを通じて、外部ツールからMCPプリセットを利用できます。Cursor、Claude Desktop、Windsurfなどにもシームレスに接続できます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-full lg:w-[580px]">
            <McpGatewayFeatureImage
              src="https://www.querypie.com/assets/products/aip/mcp-gateway/aip_function_mcpproxy.gif"
              alt="MCPプロキシによる外部ツールからのアクセス"
              width={580}
              height={326}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand muted>
        <McpGatewayFeatureLayout>
          <McpGatewayFeatureCopy className="w-full lg:w-[445px]">
            <McpGatewayFeatureTitle>組織単位で、MCP利用を統制する</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              誰がどのMCPツールを使えるかを、きめ細かな権限で制御。MCPの有効化・無効化から、組織全体のAIツール利用まで一元管理できます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-full lg:w-[520px]">
            <McpGatewayFeatureImage
              src="https://www.querypie.com/assets/products/aip/mcp-gateway/aip_function_mcpmanagement.gif"
              alt="組織単位でMCPを一元管理"
              width={520}
              height={293}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand>
        <McpGatewayFeatureLayout reverse>
          <McpGatewayFeatureCopy className="w-full lg:w-[390px]">
            <McpGatewayFeatureTitle>すべての実行を、監査可能にする</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              組織内で発生するイベントを可視化し、ユーザーの操作やシステム変更を追跡。セキュリティとコンプライアンスのための監査証跡を残せます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-full lg:w-[580px]">
            <McpGatewayFeatureImage
              src="https://www.querypie.com/assets/products/aip/mcp-gateway/aip_function_audit.gif"
              alt="MCP利用の監査ログ"
              width={580}
              height={326}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <McpGatewayFeatureBand muted>
        <McpGatewayFeatureLayout>
          <McpGatewayFeatureCopy className="w-full lg:w-[533px]">
            <McpGatewayFeatureTitle>AI対話への機密情報入力を防ぐ</McpGatewayFeatureTitle>
            <McpGatewayFeatureDescription>
              機密データがAIとの対話に入力されることを自動でブロック。クレジットカード番号、APIキー、個人情報、機密情報の露出を防ぎます。
            </McpGatewayFeatureDescription>
            <McpGatewayFeatureChecklist />
          </McpGatewayFeatureCopy>

          <McpGatewayFeatureVisual className="w-full lg:w-[520px]">
            <McpGatewayFeatureImage
              src="https://www.querypie.com/assets/products/aip/mcp-gateway/aip_function_dlp.gif"
              alt="AI対話への機密情報入力を防ぐDLP"
              width={520}
              height={293}
            />
          </McpGatewayFeatureVisual>
        </McpGatewayFeatureLayout>
      </McpGatewayFeatureBand>

      <AipFreeTrialCtaSection background="white" />

      <SiteFooter />
    </McpGatewayPageShell>
  );
}
