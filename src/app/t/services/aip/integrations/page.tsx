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
} from "@/components/sections/aip/integrations-page";
import { CtaContent, CtaCopy, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

export const metadata: Metadata = {
  title: "QueryPie AI: インテグレーション",
  description:
    "MCPサーバーを介して業務ツールへ接続し、ワークフローを自動化する QueryPie AIP インテグレーションページ。",
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
  key: string;
  label: string;
};

type IntegrationProduct = {
  categoryKeys: readonly string[];
  label: string;
  svgFilename: string;
};

const categories: readonly IntegrationCategory[] = [
  { key: "workflow-automation", label: "ワークフロー自動化" },
  { key: "collaboration", label: "コミュニケーション & コラボレーション" },
  { key: "crm", label: "顧客関係管理" },
  { key: "google-workspace", label: "Googleサービス" },
  { key: "microsoft-365", label: "Microsoftサービス" },
  { key: "project-management", label: "プロジェクト管理" },
  { key: "devops", label: "開発 & DevOps" },
  { key: "databases", label: "データベース接続" },
  { key: "search-navigation", label: "検索 & ナビゲーション" },
  { key: "local-tools", label: "ローカル統合" },
] as const;

const products: readonly IntegrationProduct[] = [
  { categoryKeys: ["databases"], label: "AirTable", svgFilename: "airtable" },
  { categoryKeys: ["devops"], label: "AWS", svgFilename: "aws-icon" },
  { categoryKeys: ["search-navigation"], label: "Brave Search", svgFilename: "brave-search" },
  { categoryKeys: ["databases"], label: "ClickHouse", svgFilename: "clickhouse" },
  { categoryKeys: ["devops"], label: "Code Executor", svgFilename: "querypie" },
  { categoryKeys: ["project-management"], label: "Confluence Cloud", svgFilename: "confluence" },
  { categoryKeys: ["devops"], label: "Context7", svgFilename: "context7" },
  { categoryKeys: ["devops"], label: "Datadog", svgFilename: "datadog" },
  { categoryKeys: ["search-navigation"], label: "Daum Search", svgFilename: "daum-search" },
  { categoryKeys: ["workflow-automation"], label: "Dify API Access", svgFilename: "dify" },
  { categoryKeys: ["collaboration"], label: "Discord", svgFilename: "discord" },
  { categoryKeys: ["collaboration"], label: "Discord with OAuth", svgFilename: "discord" },
  { categoryKeys: ["devops", "local-tools"], label: "Filesystem", svgFilename: "mcp" },
  { categoryKeys: ["collaboration"], label: "GitHub", svgFilename: "github" },
  { categoryKeys: ["google-workspace"], label: "Google Calendar", svgFilename: "google-calendar" },
  { categoryKeys: ["google-workspace"], label: "Google Drive", svgFilename: "google-drive" },
  { categoryKeys: ["google-workspace"], label: "Google Gmail", svgFilename: "google-gmail" },
  { categoryKeys: ["google-workspace"], label: "Google Sheets", svgFilename: "google-sheets" },
  { categoryKeys: ["google-workspace"], label: "Google Slides", svgFilename: "google-slides" },
  { categoryKeys: ["devops"], label: "Grafana", svgFilename: "grafana" },
  { categoryKeys: ["project-management"], label: "Jira Cloud", svgFilename: "jira" },
  { categoryKeys: ["search-navigation"], label: "Kakao Map", svgFilename: "kakao" },
  { categoryKeys: ["search-navigation"], label: "Kakao Navigation", svgFilename: "kakao" },
  { categoryKeys: ["devops"], label: "Kubernetes", svgFilename: "kubernetes-icon" },
  { categoryKeys: ["databases"], label: "MariaDB", svgFilename: "maria-db-icon" },
  { categoryKeys: ["microsoft-365"], label: "Microsoft 365", svgFilename: "microsoft-365" },
  { categoryKeys: ["databases"], label: "MySQL", svgFilename: "mysql-icon" },
  { categoryKeys: ["workflow-automation"], label: "n8n Chat", svgFilename: "n8n-chat" },
  { categoryKeys: ["workflow-automation"], label: "n8n Webhook", svgFilename: "n8n-webhook" },
  { categoryKeys: ["search-navigation"], label: "Naver Search", svgFilename: "naver-search" },
  { categoryKeys: ["collaboration"], label: "Notion", svgFilename: "notion" },
  { categoryKeys: ["databases"], label: "Oracle Database", svgFilename: "oracle-icon" },
  { categoryKeys: ["search-navigation"], label: "Perplexity Ask", svgFilename: "perplexity-ask" },
  { categoryKeys: ["databases"], label: "PostgreSQL", svgFilename: "postgresql-icon" },
  { categoryKeys: ["devops"], label: "QueryPie Customer Center", svgFilename: "querypie" },
  { categoryKeys: ["databases"], label: "Redis", svgFilename: "redis-icon" },
  { categoryKeys: ["crm"], label: "Salesforce", svgFilename: "salesforce" },
  { categoryKeys: ["crm"], label: "Salesforce with OAuth", svgFilename: "salesforce" },
  { categoryKeys: ["workflow-automation"], label: "Sequential Thinking", svgFilename: "querypie" },
  { categoryKeys: ["collaboration"], label: "Slack", svgFilename: "slack-icon" },
  { categoryKeys: ["databases"], label: "Snowflake", svgFilename: "snowflake-icon" },
  { categoryKeys: ["databases"], label: "SQL Server", svgFilename: "sql-server-icon" },
  { categoryKeys: ["devops"], label: "SSH", svgFilename: "ssh" },
  { categoryKeys: ["devops", "databases"], label: "Supabase", svgFilename: "supabase" },
  { categoryKeys: ["devops", "local-tools"], label: "Terminal", svgFilename: "ssh" },
] as const;

function readCurrentCategory(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const raw = searchParams?.category;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && (value === "all" || categories.some((category) => category.key === value)) ? value : "all";
}

function getCategoryCount(categoryKey: string) {
  return products.filter((product) => product.categoryKeys.includes(categoryKey)).length;
}

export default async function AipIntegrationsPage({ searchParams }: IntegrationsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentCategory = readCurrentCategory(resolvedSearchParams);
  const filteredProducts = products
    .filter((product) => currentCategory === "all" || product.categoryKeys.includes(currentCategory))
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
                key={category.key}
                href={`/t/services/aip/integrations?category=${category.key}`}
                active={currentCategory === category.key}
              >
                {category.label} ({getCategoryCount(category.key)})
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
