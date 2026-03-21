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
    shellClassName: "border-[#f3dec9] bg-[linear-gradient(180deg,#fffaf6_0%,#ffffff_100%)]",
    iconClassName: "bg-[#ffe9d6] text-[#a6561a]",
    title: "募集ポジションを定義",
    note: "どのAI社員を採用するかを、役割・成果物・評価軸で整理する下書きです。",
    leftTitle: "募集要件",
    leftItems: ["職種: AI Marketing Staff", "担当業務: 調査 / 企画整理 / 草案作成", "成果物: 配信用ドラフト"],
    rightTitle: "評価基準",
    rightItems: ["期待成果: 初稿24h以内", "承認者: Marketing Lead", "連携範囲: Notion / Slack"],
    footerStats: ["担当業務", "成果物", "承認範囲"],
  },
  オンボーディング: {
    badge: "Onboarding",
    icon: Link2,
    shellClassName: "border-[#d9e8f7] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]",
    iconClassName: "bg-[#e8f3ff] text-[#245b8f]",
    title: "現場の文脈を引き継ぐ",
    note: "アクセス権を付与し、AI社員が最初から業務コンテキストを持った状態で働く想定図です。",
    leftTitle: "接続済みシステム",
    leftItems: ["Notion", "CRM", "Slack"],
    rightTitle: "引き継ぎ済みの前提",
    rightItems: ["過去の履歴", "社内ルール", "対応トーン"],
    footerStats: ["アクセス権付与", "履歴読込", "ゼロ説明なし"],
  },
  実務巻き取り: {
    badge: "Execution",
    icon: Sparkles,
    shellClassName: "border-[#e7dcfb] bg-[linear-gradient(180deg,#fbf9ff_0%,#ffffff_100%)]",
    iconClassName: "bg-[#f1eafe] text-[#6d3db8]",
    title: "途中工程を自律処理",
    note: "人が判断する前の下準備を先回りして進め、次の一手を打てる状態にするドラフトです。",
    leftTitle: "受け取る依頼",
    leftItems: ["市場調査して", "資料の下書きを作成", "問い合わせを分類"],
    rightTitle: "返ってくる成果物",
    rightItems: ["論点整理メモ", "ドラフト初稿", "一次分類済みリスト"],
    footerStats: ["調査", "下書き", "分類"],
  },
  権限管理: {
    badge: "Governance",
    icon: ShieldCheck,
    shellClassName: "border-[#dfe9d7] bg-[linear-gradient(180deg,#fafcf7_0%,#ffffff_100%)]",
    iconClassName: "bg-[#edf5e4] text-[#4f6b2f]",
    title: "任せても決裁権は保持",
    note: "AI社員が勝手に実行しないよう、承認ルールと権限制御を前提にした運用設計です。",
    leftTitle: "権限ルール",
    leftItems: ["閲覧可能データを制限", "外部送信は承認必須", "役割別に操作範囲を分離"],
    rightTitle: "レビュー導線",
    rightItems: ["草案作成", "人間レビュー", "承認後に実行"],
    footerStats: ["権限制御", "レビュー必須", "実行ログ"],
  },
  成果評価: {
    badge: "Performance",
    icon: ChartColumnIncreasing,
    shellClassName: "border-[#f2dfc8] bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_100%)]",
    iconClassName: "bg-[#fff0dd] text-[#a85d1c]",
    title: "貢献度を可視化",
    note: "利用回数ではなく、どれだけ業務を前進させたかを追える評価ダッシュボードのラフです。",
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
    <div className="mx-auto mt-8 max-w-[1120px]">
      <div className="flex flex-wrap items-center justify-center gap-[10px]">
        {items.map((item, index) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            className={cn(
              "min-w-[132px] rounded-[26px] bg-[#f9f9fb] px-6 py-3 text-[15px] font-medium text-[#24292f] hover:bg-[#f9f9fb]",
              index === activeIndex &&
                "bg-[#2f3a49] text-[#f6f6f6] hover:bg-[#2f3a49] hover:text-[#f6f6f6]",
            )}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[580px_500px] lg:items-stretch lg:justify-between">
        <div className="flex h-full flex-col">
          <div className="min-h-[228px] lg:min-h-[250px]">
            <h3 className="max-w-[580px] text-[28px] font-medium leading-[1.08] tracking-[-0.04em] text-[#0d121f] sm:text-[32px] lg:text-[34px]">
              {activeItem.heading.split("\n").map((line, index) => (
                <span key={`${line}-${index}`} className="block md:whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-4 max-w-[560px] text-base leading-6 text-[#596780]">{activeItem.description}</p>
          </div>

          <figure className="mt-7 overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)] lg:mt-auto">
            <div className="relative aspect-[16/10] bg-[#eef2f6]">
              <Image
                src="/images/ai-staff-team.jpg"
                alt="AI社員が既存社員と並んで働き、会議や資料作成を支えるイメージ"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 580px, 100vw"
              />
            </div>
            <figcaption className="px-5 py-4 text-[13px] leading-6 text-[#667085]">
              AI社員が現場の文脈を引き継ぎ、既存チームの右腕として実務を前に進めるイメージです。
            </figcaption>
          </figure>
        </div>

        <div className="h-full rounded-[1.8rem] bg-[#f9f9fb] p-4 sm:p-5">
          <div className={cn("flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.18)]", activeDraft.shellClassName)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-[14px]", activeDraft.iconClassName)}>
                  <DraftIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a8798]">
                    {activeDraft.badge}
                  </p>
                  <h4 className="mt-1 text-[18px] font-semibold leading-tight text-[#0d121f]">
                    {activeDraft.title}
                  </h4>
                </div>
              </div>
              <div className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-[#5f6b7b]">
                Draft image
              </div>
            </div>

            <p className="mt-4 text-[14px] leading-6 text-[#5f6b7b]">{activeDraft.note}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {activeItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/6 bg-white/85 px-3 py-1.5 text-[12px] font-medium text-[#445062]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-white/88 p-4">
                <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#0d121f]">{activeDraft.leftTitle}</p>
                <div className="mt-4 space-y-3">
                  {activeDraft.leftItems.map((item) => (
                    <div key={item} className="rounded-[14px] bg-[#f8fafc] px-3.5 py-3 text-[13px] leading-5 text-[#4b5563]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.25rem] bg-white/88 p-4">
                <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#0d121f]">{activeDraft.rightTitle}</p>
                <div className="mt-4 space-y-3">
                  {activeDraft.rightItems.map((item) => (
                    <div key={item} className="rounded-[14px] border border-black/5 bg-[#fbfcfd] px-3.5 py-3 text-[13px] leading-5 text-[#4b5563]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-white/90 p-4">
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#0d121f]">可視化したい要素</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {activeDraft.footerStats.map((item) => (
                  <div
                    key={item}
                    className="rounded-[12px] bg-[#f5f7fb] px-3 py-3 text-center text-[12px] font-medium text-[#4b5563]"
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
