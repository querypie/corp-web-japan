import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipIntegrationsCategoryLink,
  AipIntegrationsCategoryList,
  AipIntegrationsContent,
  AipIntegrationsHeroCopy,
  AipIntegrationsHeroHeading,
  AipIntegrationsHeroLead,
  AipIntegrationsHeroSection,
  AipIntegrationsProductCard,
  AipIntegrationsProductList,
} from "@/components/sections/aip-integrations-page";
import { CtaContent, CtaCopy, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

export const metadata: Metadata = {
  title: "QueryPie AI: インテグレーション",
  description:
    "MCPサーバーを介して業務ツールへ接続し、ワークフローを自動化する QueryPie AIP インテグレーション preview ページ。",
  alternates: {
    canonical: "/t/services/aip/integrations",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type IntegrationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type IntegrationCategory = {
  id: string;
  label: string;
};

type IntegrationProduct = {
  categoryIds: readonly string[];
  label: string;
  svgFilename: string;
};

const categories: readonly IntegrationCategory[] = [
  { id: "0", label: "ワークフロー自動化" },
  { id: "1", label: "コミュニケーション & コラボレーション" },
  { id: "2", label: "顧客関係管理" },
  { id: "3", label: "Googleサービス" },
  { id: "4", label: "Microsoftサービス" },
  { id: "5", label: "プロジェクト管理" },
  { id: "6", label: "開発 & DevOps" },
  { id: "7", label: "データベース接続" },
  { id: "8", label: "検索 & ナビゲーション" },
  { id: "9", label: "ローカル統合" },
] as const;

const products: readonly IntegrationProduct[] = [
  { categoryIds: ["7"], label: "AirTable", svgFilename: "airtable" },
  { categoryIds: ["6"], label: "AWS", svgFilename: "aws-icon" },
  { categoryIds: ["8"], label: "Brave Search", svgFilename: "brave-search" },
  { categoryIds: ["7"], label: "ClickHouse", svgFilename: "clickhouse" },
  { categoryIds: ["6"], label: "Code Executor", svgFilename: "querypie" },
  { categoryIds: ["5"], label: "Confluence Cloud", svgFilename: "confluence" },
  { categoryIds: ["6"], label: "Context7", svgFilename: "context7" },
  { categoryIds: ["6"], label: "Datadog", svgFilename: "datadog" },
  { categoryIds: ["8"], label: "Daum Search", svgFilename: "daum-search" },
  { categoryIds: ["0"], label: "Dify API Access", svgFilename: "dify" },
  { categoryIds: ["1"], label: "Discord", svgFilename: "discord" },
  { categoryIds: ["1"], label: "Discord with OAuth", svgFilename: "discord" },
  { categoryIds: ["6", "9"], label: "Filesystem", svgFilename: "mcp" },
  { categoryIds: ["1"], label: "GitHub", svgFilename: "github" },
  { categoryIds: ["3"], label: "Google Calendar", svgFilename: "google-calendar" },
  { categoryIds: ["3"], label: "Google Drive", svgFilename: "google-drive" },
  { categoryIds: ["3"], label: "Google Gmail", svgFilename: "google-gmail" },
  { categoryIds: ["3"], label: "Google Sheets", svgFilename: "google-sheets" },
  { categoryIds: ["3"], label: "Google Slides", svgFilename: "google-slides" },
  { categoryIds: ["6"], label: "Grafana", svgFilename: "grafana" },
  { categoryIds: ["5"], label: "Jira Cloud", svgFilename: "jira" },
  { categoryIds: ["8"], label: "Kakao Map", svgFilename: "kakao" },
  { categoryIds: ["8"], label: "Kakao Navigation", svgFilename: "kakao" },
  { categoryIds: ["6"], label: "Kubernetes", svgFilename: "kubernetes-icon" },
  { categoryIds: ["7"], label: "MariaDB", svgFilename: "maria-db-icon" },
  { categoryIds: ["4"], label: "Microsoft 365", svgFilename: "microsoft-365" },
  { categoryIds: ["7"], label: "MySQL", svgFilename: "mysql-icon" },
  { categoryIds: ["0"], label: "n8n Chat", svgFilename: "n8n-chat" },
  { categoryIds: ["0"], label: "n8n Webhook", svgFilename: "n8n-webhook" },
  { categoryIds: ["8"], label: "Naver Search", svgFilename: "naver-search" },
  { categoryIds: ["1"], label: "Notion", svgFilename: "notion" },
  { categoryIds: ["7"], label: "Oracle Database", svgFilename: "oracle-icon" },
  { categoryIds: ["8"], label: "Perplexity Ask", svgFilename: "perplexity-ask" },
  { categoryIds: ["7"], label: "PostgreSQL", svgFilename: "postgresql-icon" },
  { categoryIds: ["6"], label: "QueryPie Customer Center", svgFilename: "querypie" },
  { categoryIds: ["7"], label: "Redis", svgFilename: "redis-icon" },
  { categoryIds: ["2"], label: "Salesforce", svgFilename: "salesforce" },
  { categoryIds: ["2"], label: "Salesforce with OAuth", svgFilename: "salesforce" },
  { categoryIds: ["0"], label: "Sequential Thinking", svgFilename: "querypie" },
  { categoryIds: ["1"], label: "Slack", svgFilename: "slack-icon" },
  { categoryIds: ["7"], label: "Snowflake", svgFilename: "snowflake-icon" },
  { categoryIds: ["7"], label: "SQL Server", svgFilename: "sql-server-icon" },
  { categoryIds: ["6"], label: "SSH", svgFilename: "ssh" },
  { categoryIds: ["6", "7"], label: "Supabase", svgFilename: "supabase" },
  { categoryIds: ["6", "9"], label: "Terminal", svgFilename: "ssh" },
] as const;

function readCurrentCategory(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const raw = searchParams?.category;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && (value === "all" || categories.some((category) => category.id === value)) ? value : "all";
}

function getCategoryCount(categoryId: string) {
  return products.filter((product) => product.categoryIds.includes(categoryId)).length;
}

export default async function AipIntegrationsPreviewPage({ searchParams }: IntegrationsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentCategory = readCurrentCategory(resolvedSearchParams);
  const filteredProducts = products
    .filter((product) => currentCategory === "all" || product.categoryIds.includes(currentCategory))
    .sort((left, right) => left.label.localeCompare(right.label));

  return (
    <main className="bg-white text-slate-950">
      <SiteHeader />

      <AipIntegrationsHeroSection>
        <AipIntegrationsHeroCopy>
          <AipIntegrationsHeroHeading>AIPインテグレーション</AipIntegrationsHeroHeading>
          <AipIntegrationsHeroLead>
            MCPサーバーを介してお使いのビジネスツールに接続。システム、アプリ、サービス間のワークフローを自動化します。
            <br />
            Slack、GitHub、AWS、データベース、ワークフロープラットフォームなど、AI統合であらゆるニーズに対応します。
          </AipIntegrationsHeroLead>
        </AipIntegrationsHeroCopy>

        <AipIntegrationsContent>
          <AipIntegrationsCategoryList>
            <AipIntegrationsCategoryLink href="/t/services/aip/integrations?category=all" active={currentCategory === "all"}>
              全て ({products.length})
            </AipIntegrationsCategoryLink>
            {categories.map((category) => (
              <AipIntegrationsCategoryLink
                key={category.id}
                href={`/t/services/aip/integrations?category=${category.id}`}
                active={currentCategory === category.id}
              >
                {category.label} ({getCategoryCount(category.id)})
              </AipIntegrationsCategoryLink>
            ))}
          </AipIntegrationsCategoryList>
        </AipIntegrationsContent>

        <AipIntegrationsContent>
          <AipIntegrationsProductList>
            {filteredProducts.map((product) => (
              <AipIntegrationsProductCard
                key={`${product.label}-${product.svgFilename}`}
                iconSrc={`/services/aip/integrations/icons/${product.svgFilename}.svg`}
                label={product.label}
              />
            ))}
          </AipIntegrationsProductList>
        </AipIntegrationsContent>
      </AipIntegrationsHeroSection>

      <SimpleCtaSection style={{ padding: "120px 24px" }}>
        <CtaContent className="gap-[40px]">
          <CtaCopy>
            <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
            <p className="mt-[20px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#24292F]">
              簡単サインアップで、14日間の無料トライアルをお試しください
            </p>
          </CtaCopy>
          <div className="flex justify-center">
            <BrandGradientCtaButton href="https://app.querypie.com/">無料で試してみる</BrandGradientCtaButton>
          </div>
        </CtaContent>
      </SimpleCtaSection>

      <SiteFooter />
    </main>
  );
}
