"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BriefcaseBusiness,
  ChartColumnIncreasing,
  Link2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeatureItem = {
  label: string;
  heading: string;
  description: string;
  cta: string;
  tags: readonly string[];
  panelTitle: string;
  panelSubtitle: string;
  cards: readonly string[];
};

type FeatureShowcaseProps = {
  items: readonly FeatureItem[];
};

type FeatureVisualDraft = {
  badge: string;
  icon: LucideIcon;
  shellClassName: string;
  iconClassName: string;
  title: string;
  note: string;
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
  footerStats: string[];
};

const featureVisualDrafts: Record<string, FeatureVisualDraft> = {
  職務定義: {
    badge: "JD Draft",
    icon: BriefcaseBusiness,
    shellClassName: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    iconClassName: "bg-[#f2f4f7] text-[#344054]",
    title: "募集ポジションを定義",
    note: "どのAI Crewを迎えるべきかを、役割・成果物・評価軸で整理する設計イメージです。",
    leftTitle: "募集要件",
    leftItems: ["職種: Marketing", "担当業務: 調査 / 企画整理 / 草案作成", "成果物: 配信用ドラフト初稿"],
    rightTitle: "評価基準",
    rightItems: ["期待成果: 初稿を24時間以内に提出", "承認者: Marketing Leader", "連携範囲: Notion / Slack"],
    footerStats: ["担当業務", "成果物", "承認範囲"],
  },
  オンボーディング: {
    badge: "Onboarding",
    icon: Link2,
    shellClassName: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    iconClassName: "bg-[#f2f4f7] text-[#344054]",
    title: "現場の文脈を引き継ぐ",
    note: "アクセス権を付与し、AI Crewが最初から業務コンテキストを持った状態で働く想定図です。",
    leftTitle: "接続済みシステム",
    leftItems: ["Notion", "CRM", "Slack"],
    rightTitle: "引き継ぎ済みの前提",
    rightItems: ["過去の履歴", "社内ルール", "対応トーン"],
    footerStats: ["アクセス権付与", "履歴読込", "ゼロ説明なし"],
  },
  実務巻き取り: {
    badge: "Execution",
    icon: Sparkles,
    shellClassName: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    iconClassName: "bg-[#f2f4f7] text-[#344054]",
    title: "途中工程を自律処理",
    note: "人が判断する前の下準備を先回りして進め、次の一手が打てる状態まで整えるイメージです。",
    leftTitle: "受け取る依頼",
    leftItems: ["市場調査して", "資料の下書きを作成", "問い合わせを分類"],
    rightTitle: "返ってくる成果物",
    rightItems: ["論点整理メモ", "ドラフト初稿", "一次分類済みリスト"],
    footerStats: ["調査", "下書き", "分類"],
  },
  権限管理: {
    badge: "Governance",
    icon: ShieldCheck,
    shellClassName: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    iconClassName: "bg-[#f2f4f7] text-[#344054]",
    title: "任せても決裁権は保持",
    note: "AI Crewが勝手に実行しないよう、承認ルールと権限制御を前提にした運用設計です。",
    leftTitle: "権限ルール",
    leftItems: ["閲覧可能データを制限", "外部送信は承認必須", "役割別に操作範囲を分離"],
    rightTitle: "レビュー導線",
    rightItems: ["草案作成", "人レビュー", "承認後に実行"],
    footerStats: ["権限制御", "レビュー必須", "実行ログ"],
  },
  成果評価: {
    badge: "Performance",
    icon: ChartColumnIncreasing,
    shellClassName: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    iconClassName: "bg-[#f2f4f7] text-[#344054]",
    title: "貢献度を可視化",
    note: "利用回数ではなく、どれだけ業務を前に進めたかを追える評価ダッシュボードのイメージです。",
    leftTitle: "追う指標",
    leftItems: ["前進した業務数", "削減できた工数", "成果物の完了率"],
    rightTitle: "ROIの見え方",
    rightItems: ["役割ごとの稼働", "アウトプット品質", "投資対効果の説明"],
    footerStats: ["成果物数", "削減時間", "ROI"],
  },
};

export function FeatureShowcase({ items }: FeatureShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const activeDraft = featureVisualDrafts[activeItem.label];
  const DraftIcon = activeDraft.icon;

  return (
    <div className="mx-auto mt-6 max-w-[1120px]">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            className={cn(
              "min-w-[124px] rounded-[24px] border border-[#e4e7ec] bg-white px-5 py-2.5 text-[14px] font-medium text-[#475467] shadow-[0_12px_32px_-24px_rgba(15,23,42,0.12)] hover:bg-white",
              index === activeIndex &&
                "border-[#2f3a49] bg-[#2f3a49] text-[#f6f6f6] hover:bg-[#2f3a49] hover:text-[#f6f6f6]",
            )}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-7 lg:grid-cols-[560px_480px] lg:items-stretch lg:justify-between">
        <div className="flex h-full flex-col">
          <div className="min-h-[192px] lg:min-h-[206px]">
            <h3 className="max-w-[560px] text-[26px] font-medium leading-[1.14] tracking-[-0.04em] text-[#101828] sm:text-[30px] lg:text-[32px]">
              {activeItem.heading.split("\n").map((line, index) => (
                <span key={`${line}-${index}`} className="block md:whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-3 max-w-[540px] text-[15px] leading-7 text-[#667085]">{activeItem.description}</p>
          </div>

          <figure className="mt-3 overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)] lg:mt-auto">
            <div className="relative aspect-[16/9.2] bg-[#eef2f6]">
              <Image
                src="/images/ai-staff-team.jpg"
                alt="AI社員が既存社員と並んで働き、会議や資料作成を支えるイメージ"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 580px, 100vw"
              />
            </div>
            <figcaption className="px-5 py-3 text-[12px] leading-6 text-[#667085]">
              AI社員が現場の文脈を引き継ぎ、既存チームの右腕として実務を前に進めるイメージです。
            </figcaption>
          </figure>
        </div>

        <div className="h-full rounded-[1.8rem] bg-[#f8fafc] p-3 sm:p-3.5">
          <div className={cn("flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-3.5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.12)]", activeDraft.shellClassName)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-[13px]", activeDraft.iconClassName)}>
                  <DraftIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#98a2b3]">
                    {activeDraft.badge}
                  </p>
                  <h4 className="mt-1 text-[17px] font-semibold leading-tight text-[#101828]">
                    {activeDraft.title}
                  </h4>
                </div>
              </div>
              <div className="rounded-full border border-black/5 bg-white/90 px-3 py-1 text-[11px] font-medium text-[#667085]">
                Overview
              </div>
            </div>

            <p className="mt-3 text-[13px] leading-6 text-[#667085]">{activeDraft.note}</p>

            <div className="mt-3.5 flex flex-wrap gap-2">
              {activeItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/6 bg-white/88 px-3 py-1.5 text-[12px] font-medium text-[#667085]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-white/92 p-3.5">
                <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#101828]">{activeDraft.leftTitle}</p>
                <div className="mt-3 space-y-2.5">
                  {activeDraft.leftItems.map((item) => (
                    <div key={item} className="rounded-[14px] border border-black/5 bg-[#f8fafc] px-3.5 py-2.5 text-[12px] leading-5 text-[#667085]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.25rem] bg-white/92 p-3.5">
                <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#101828]">{activeDraft.rightTitle}</p>
                <div className="mt-3 space-y-2.5">
                  {activeDraft.rightItems.map((item) => (
                    <div key={item} className="rounded-[14px] border border-black/5 bg-[#fbfcfd] px-3.5 py-2.5 text-[12px] leading-5 text-[#667085]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3.5 rounded-[1.25rem] bg-white/92 p-3">
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#101828]">可視化したい要素</p>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {activeDraft.footerStats.map((item) => (
                  <div
                    key={item}
                    className="rounded-[12px] bg-[#f5f7fb] px-3 py-2.5 text-center text-[11px] font-medium text-[#667085]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
