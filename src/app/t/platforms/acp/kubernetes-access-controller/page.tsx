import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AcpCapabilityGallery,
  AcpFeatureSection,
  AcpHeroSection,
  AcpPageCta,
  AcpStaticPageShell,
  AcpWorksSection,
} from "@/components/sections/acp/static-page";

export const metadata: Metadata = {
  title: "QueryPie KAC:  Kubernetes Access Controller | QueryPie AI",
  description: "QueryPie KAC は、Kubernetes API 保護や AWS EKS、オンプレミスクラスタなどのクーバネティスを管理します。",
  alternates: {
    canonical: "/t/platforms/acp/kubernetes-access-controller",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const heroDescription = ["QueryPie KAC はクバネティスAPI保護ソリューションで、AWS EKS のようなクラウドインフラおよびオンプレミスクラスターの", "集中管理を可能にします。管理者はアクセス管理、API リクエストの監視、実行したコンテナコマンドの再生を行うことができます。"] as const;

const featureIntro = ["QueryPie KAC は、クバネティスの正確なアクセス管理のために、RBAC およびABAC のコントロールを提供し、IAM パーミッションを自動的に取得します。", "また、監査ログやセッション記録、効率的なマルチクラスターアクセスを通じてリアルタイムで状況を把握することが可能です。"] as const;

const keyFeatures = [
  {
    "title": "RBAC / ABACベースのアクセス制御",
    "description": "クバネティス クラスタに対して、役割ベースアクセス制御（RBAC）を実装し、API アクセスをカスタマイズしたポリシーで管理します。また、属性ベースアクセス制御（ABAC）を使用して、ユーザー属性に基づいた権限に適合させます。",
    "icon": "/platforms/acp/icons/iam.svg"
  },
  {
    "title": "自動化されたアクセス許可",
    "description": "AWS EKS のようなクラウドベースのクバネティス クラスタに対して、IAM 権限を割り当てるだけで、管理者のアクセス権限を自動的に登録します。",
    "icon": "/platforms/acp/icons/gateway.svg"
  },
  {
    "title": "監査ログとセッションの記録",
    "description": "監査ログとポッドセッションの記録を通じて、複数のクラスタにわたるユーザーの行動をほぼリアルタイムで可視化します。",
    "icon": "/platforms/acp/icons/audit.svg"
  },
  {
    "title": "マルチクラスターアクセスの集中化",
    "description": "ユーザーがコンテナに接続した際のセッションを自動的に記録し、ユーザーのアクションを監視。標準の K8S RBAC ではサポートされていない、K8S(クバネティス)リソース名（RegEx）に基づくアクセス制御ルールを適用します。",
    "icon": "/platforms/acp/icons/cluster.svg"
  },
  {
    "title": "自動 KUBECONFIG の設定",
    "description": "分散リソースを同期し、複数のクバネティス統合を管理することで、クラウド環境を最適化します。スケジューリング機能により、リソースの同期を自動化し、変更履歴を追跡します。",
    "icon": "/platforms/acp/icons/config.svg"
  }
] as const;

const worksBody = ["QueryPie KAC は、強力なアクセス制御と監査機能を備えたKubernetes クラスタにユーザーをシームレスに接続します。", "QueryPie Agent はセキュアなkubeconfig ファイルを生成し、ユーザはkubectl、Lens などのツールを使用して簡単にKubernetes クラスタに接続できます。", "QueryPie KAC は、コントロール ハブとして機能し、すべてのKubernetes アクティビティに対する正確なロールベース アクセス管理と包括的な監査を保証します。"] as const;

const capabilityImages = [
  {
    "src": "/platforms/acp/kubernetes-access-controller/protect-k8s.png",
    "alt": "protect k8s"
  },
  {
    "src": "/platforms/acp/kubernetes-access-controller/cloud-sync.png",
    "alt": "cloud sync"
  },
  {
    "src": "/platforms/acp/kubernetes-access-controller/management-env.png",
    "alt": "management env"
  },
  {
    "src": "/platforms/acp/kubernetes-access-controller/management-policy.png",
    "alt": "management policy"
  },
  {
    "src": "/platforms/acp/kubernetes-access-controller/logging-api.png",
    "alt": "logging api"
  },
  {
    "src": "/platforms/acp/kubernetes-access-controller/session-replay.png",
    "alt": "session replay"
  },
  {
    "src": "/platforms/acp/kubernetes-access-controller/auto-setup.png",
    "alt": "auto setup"
  }
] as const;

export default function KubernetesAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection
        title="Kubernetes Access Controller"
        description={heroDescription}
        media={{"kind": "youtube", "src": "https://www.youtube.com/embed/OzxB0qqmCTQ?si=qbFYGIDUg2GPuzfU"}}
      />
      <AcpFeatureSection heading="KACの注目機能" intro={featureIntro} features={keyFeatures} />
      <AcpWorksSection
        heading="QueryPie KAC の仕組み"
        body={worksBody}
        imageSrc="/platforms/acp/kubernetes-access-controller/works.png"
        imageAlt="QueryPie KAC の仕組み"
      />
      <AcpCapabilityGallery heading="主な機能" images={capabilityImages} />
      <AcpPageCta />
      <SiteFooter />
    </AcpStaticPageShell>
  );
}
