import type { ResourceItem } from "../resources";

export type EventPostRecord = {
  id: string;
  slug: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date: string;
};

export function getEventPostHref(id: string, slug: string) {
  return `/events/${id}/${slug}`;
}

export const eventPostRecords: readonly EventPostRecord[] = [
  {
    id: "1",
    slug: "ai-agent-adoption-webinar",
    imageSrc: "/assets/image/events/1/thumbnail.png",
    badge: "イベント",
    title: "【ウェビナー】AIエージェント導入の現場から──失敗しない進め方と組織変革のリアル",
    description:
      "AIエージェントを業務に導入した企業の実践者が登壇。「小さく始めて大きく育てる」戦略の具体的な手順と、導入過程で直面した組織的課題・技術的課題の両面を赤裸々に語ります。",
    date: "2026年3月18日",
  },
  {
    id: "2",
    slug: "enterprise-ai-security-design-seminar",
    imageSrc: "/assets/image/events/2/thumbnail.png",
    badge: "イベント",
    title: "【オンラインセミナー】企業AIのセキュリティ設計入門──ゼロトラストとRAGの組み合わせ",
    description:
      "社内AIを安全に運用するためのゼロトラストアーキテクチャとRAG活用の基礎を解説。アクセス権限管理から監査ログの設計まで、実務担当者向けに体系的に紹介します。",
    date: "2026年3月5日",
  },
  {
    id: "3",
    slug: "querypie-ai-summit-2026",
    imageSrc: "/assets/image/events/3/thumbnail.png",
    badge: "イベント",
    title: "【東京開催】QueryPie AI Summit 2026──AIガバナンスと競争優位の新地平",
    description:
      "国内外のAIリーダーが集う年次カンファレンス。AIガバナンス・データ戦略・エージェント設計の最前線を、KeynoteとBreakout Sessionを通じて深掘りします。参加無料・事前登録制。",
    date: "2026年2月14日",
  },
  {
    id: "4",
    slug: "aip-mcp-hands-on-workshop",
    imageSrc: "/assets/image/events/4/thumbnail.png",
    badge: "イベント",
    title: "【ハンズオン】AIP×MCP実践ワークショップ──エージェントを30分で動かす",
    description:
      "QueryPie AIPとMCPを使ったAIエージェントの構築を、ハンズオン形式で体験。環境構築から最初のエージェント稼働まで、エンジニア・技術リーダー向けの少人数集中セッションです。",
    date: "2026年1月22日",
  },
  {
    id: "5",
    slug: "ai-dashi-saas-webinar-recording",
    imageSrc: "/assets/image/events/5/thumbnail.png",
    badge: "イベント",
    title: "【ウェビナー録画】SaaSベンダー向けAI出汁活用戦略──自社プロダクトにAIを組み込む方法",
    description:
      "AI出汁を活用してSaaSプロダクトにAI機能を組み込んだ事例を紹介。APIインテグレーションの設計ポイントと、顧客体験向上につながるAI活用の具体的なアプローチを解説します。",
    date: "2025年12月11日",
  },
  {
    id: "6",
    slug: "kansai-ai-meetup-vol-3",
    imageSrc: "/assets/image/events/6/thumbnail.png",
    badge: "イベント",
    title: "【大阪開催】関西AI実践ミートアップ Vol.3──現場エンジニアが語るLLMの本音",
    description:
      "関西圏のAI実践者が集まる交流イベント。LLM活用の現場ナレッジ・ハルシネーション対策・プロンプト設計のコツなど、教科書には載っていないリアルな知見を共有し合う場です。",
    date: "2025年11月28日",
  },
] as const;

export const eventItems: readonly ResourceItem[] = eventPostRecords.map((item) => ({
  href: getEventPostHref(item.id, item.slug),
  imageSrc: item.imageSrc,
  badge: item.badge,
  title: item.title,
  description: item.description,
  date: item.date,
}));
