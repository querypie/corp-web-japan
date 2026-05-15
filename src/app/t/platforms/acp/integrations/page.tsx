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
import {
  AcpPageCta,
  AcpPageCtaDescription,
  AcpPageCtaLink,
  AcpPageCtaTitle,
} from "@/components/sections/acp/static-page";

export const metadata: Metadata = {
  title: "QueryPie: インテグレーション | QueryPie AI",
  description: "データソースに直接接続し、すべてのシステム、アプリケーション、およびサービスを完全に把握することが可能です。",
  alternates: {
    canonical: "/t/platforms/acp/integrations",
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
  {
    "key": "category-0",
    "label": "データソース"
  },
  {
    "key": "category-1",
    "label": "コンテナとクラウドサービス"
  },
  {
    "key": "category-2",
    "label": "シングルサインオンとアイデンティティプロバイダー"
  },
  {
    "key": "category-3",
    "label": "SQL および BI ツール"
  },
  {
    "key": "category-4",
    "label": "通知"
  },
  {
    "key": "category-5",
    "label": "SIEM / SOAR"
  },
  {
    "key": "category-6",
    "label": "モニタリング"
  },
  {
    "key": "category-7",
    "label": "シークレットストア"
  }
] as const;

const legacyCategoryMap: Record<string, string> = {
  "0": "category-0",
  "1": "category-1",
  "2": "category-2",
  "3": "category-3",
  "4": "category-4",
  "5": "category-5",
  "6": "category-6",
  "7": "category-7"
};

const products: readonly IntegrationProduct[] = [
  {
    "categoryKeys": [
      "category-4"
    ],
    "label": "Agit",
    "svgFilename": "agit-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "AKS",
    "svgFilename": "aks-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Athena",
    "svgFilename": "athena-icon"
  },
  {
    "categoryKeys": [
      "category-2"
    ],
    "label": "Auth0",
    "svgFilename": "auth0-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "AWS",
    "svgFilename": "aws-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "Azure",
    "svgFilename": "azure-icon"
  },
  {
    "categoryKeys": [
      "category-2"
    ],
    "label": "Azure AD",
    "svgFilename": "azure-ad-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Azure SQL",
    "svgFilename": "azure-sql-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "BigQuery",
    "svgFilename": "big-query-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Cassandra",
    "svgFilename": "cassandra-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "ClickHouse",
    "svgFilename": "clickhouse"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "Cloud SQL",
    "svgFilename": "cloud-sql-icon"
  },
  {
    "categoryKeys": [
      "category-6"
    ],
    "label": "CloudWatch",
    "svgFilename": "cloud-watch-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Databricks",
    "svgFilename": "databricks-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "DataGrip",
    "svgFilename": "datagrip-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "DigitalOcean",
    "svgFilename": "digital-ocean-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "Docker",
    "svgFilename": "docker-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "DocumentDB",
    "svgFilename": "document-db-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Dr.Sum",
    "svgFilename": "dr-sum-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "DynamoDB",
    "svgFilename": "dynamo-db-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "ECS",
    "svgFilename": "ecs-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "EKS",
    "svgFilename": "eks-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "GCP",
    "svgFilename": "gcp-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "GKE",
    "svgFilename": "gke-icon"
  },
  {
    "categoryKeys": [
      "category-2"
    ],
    "label": "Gsuite",
    "svgFilename": "gsuite-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "HBase",
    "svgFilename": "h-base-icon"
  },
  {
    "categoryKeys": [
      "category-7"
    ],
    "label": "HashiCorp Vault",
    "svgFilename": "hashicorp-vault-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "Heroku",
    "svgFilename": "heroku-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Hive",
    "svgFilename": "hive-icon"
  },
  {
    "categoryKeys": [
      "category-4"
    ],
    "label": "HTTP",
    "svgFilename": "http-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Impala",
    "svgFilename": "impala-icon"
  },
  {
    "categoryKeys": [
      "category-1"
    ],
    "label": "Kubernetes",
    "svgFilename": "kubernetes-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Looker",
    "svgFilename": "looker-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "MariaDB",
    "svgFilename": "maria-db-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Mode",
    "svgFilename": "mode-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "MongoDB",
    "svgFilename": "mongodb-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "MySQL",
    "svgFilename": "mysql-icon"
  },
  {
    "categoryKeys": [
      "category-2"
    ],
    "label": "Okta",
    "svgFilename": "okta-icon"
  },
  {
    "categoryKeys": [
      "category-2"
    ],
    "label": "OneLogin",
    "svgFilename": "one-login-icon"
  },
  {
    "categoryKeys": [
      "category-2"
    ],
    "label": "OpenLDAP",
    "svgFilename": "open-ldap-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Oracle",
    "svgFilename": "oracle-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "PostgreSQL",
    "svgFilename": "postgresql-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Power BI",
    "svgFilename": "power-bi-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Presto",
    "svgFilename": "presto-icon"
  },
  {
    "categoryKeys": [
      "category-6"
    ],
    "label": "Prometheus",
    "svgFilename": "prometheus-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Redis",
    "svgFilename": "redis-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Redshift",
    "svgFilename": "redshift-icon"
  },
  {
    "categoryKeys": [
      "category-2"
    ],
    "label": "SAML",
    "svgFilename": "saml-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "SAP HANA",
    "svgFilename": "sap-hana-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "ScyllaDB",
    "svgFilename": "scylla-db-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "SingleStore",
    "svgFilename": "single-store-icon"
  },
  {
    "categoryKeys": [
      "category-4"
    ],
    "label": "Slack",
    "svgFilename": "slack-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Snowflake",
    "svgFilename": "snowflake-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Spanner",
    "svgFilename": "spanner-icon"
  },
  {
    "categoryKeys": [
      "category-5"
    ],
    "label": "Splunk",
    "svgFilename": "splunk-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "SQL Server",
    "svgFilename": "sql-server-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "SwivelSecure",
    "svgFilename": "swivel-secure-icon"
  },
  {
    "categoryKeys": [
      "category-5"
    ],
    "label": "Syslog",
    "svgFilename": "syslog-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Tableau",
    "svgFilename": "tableau-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "TmaxTibero",
    "svgFilename": "tmax-tibero-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Trino",
    "svgFilename": "trino-icon"
  },
  {
    "categoryKeys": [
      "category-0"
    ],
    "label": "Vertica",
    "svgFilename": "vertica-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Workbench",
    "svgFilename": "workbench-icon"
  },
  {
    "categoryKeys": [
      "category-3"
    ],
    "label": "Zeppelin",
    "svgFilename": "zeppelin-icon"
  }
] as const;

function readCurrentCategory(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const raw = searchParams?.category;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const normalizedValue = value ? (legacyCategoryMap[value] ?? value) : undefined;
  return normalizedValue && (normalizedValue === "all" || categories.some((category) => category.key === normalizedValue))
    ? normalizedValue
    : "all";
}

function getCategoryCount(categoryKey: string) {
  return products.filter((product) => product.categoryKeys.includes(categoryKey)).length;
}

export default async function AcpIntegrationsPage({ searchParams }: IntegrationsPageProps) {
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
          <AipIntegrationsHeroHeading>ACP統合機能</AipIntegrationsHeroHeading>
          <AipIntegrationsHeroLead>
            50種類以上の組み込み統合機能を装備し、アクセス制御を一元管理。
            <br />
            お使いのデータソースに直接接続し、すべてのシステム、アプリ、サービスを完全に可視化します。
            <br />
            データベース、サーバー、Kubernetes、Webアプリケーションなど、幅広く対応しています。
          </AipIntegrationsHeroLead>
        </AipIntegrationsHeroCopy>
        <AipIntegrationsContent>
          <AipIntegrationsCategoryList>
            <AipIntegrationsCategoryLink href="/t/platforms/acp/integrations?category=all" active={currentCategory === "all"}>
              すべて ({products.length})
            </AipIntegrationsCategoryLink>
            {categories.map((category) => (
              <AipIntegrationsCategoryLink
                key={category.key}
                href={`/t/platforms/acp/integrations?category=${category.key}`}
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
                iconSrc={`/platforms/acp/integrations/icons/${product.svgFilename}.svg`}
                label={product.label}
              />
            ))}
          </AipIntegrationsProductList>
        </AipIntegrationsContent>
      </AipIntegrationsHeroSection>
      <AcpPageCta>
        <AcpPageCtaTitle>QueryPie ACPを無料でお試しください</AcpPageCtaTitle>
        <AcpPageCtaDescription>
          アクセス制御、監査、統合管理をひとつのプラットフォームで確認できます。
        </AcpPageCtaDescription>
        <AcpPageCtaLink>デモを依頼</AcpPageCtaLink>
      </AcpPageCta>
      <SiteFooter />
    </main>
  );
}
