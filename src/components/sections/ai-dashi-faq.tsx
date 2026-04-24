"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { CONTACT_INQUIRY_URL } from "@/lib/contact";

const faqItems = [
  {
    question: "「データの所有権は？」",
    answer:
      "お預かりしたデータの所有権は、常にお客様に帰属します。AI Dashi はお客様のブランドと運用方針に合わせて提供され、学習データや利用データの取り扱いについても、導入時に要件に応じた運用設計をご案内します。",
  },
  {
    question: "「LLMのモデルは選べるか？」",
    answer:
      "はい。ご要件や運用方針に合わせて、利用モデルや構成方針をご相談いただけます。精度・コスト・応答速度のバランスを踏まえて、最適な選択肢をご提案します。",
  },
  {
    question: "「既存システムとの連携は？」",
    answer:
      "既存の業務システムやデータ基盤との連携を前提に設計可能です。導入時には、API や認証、データフローを含めた現行環境との接続方法をご一緒に整理します。",
  },
  {
    question: "「SLAはどうなるか？」",
    answer:
      "ご利用形態やサポートレベルに応じて、必要な SLA や運用条件をご相談いただけます。商用提供を前提とした安定運用のため、個別要件に合わせた体制設計が可能です。",
  },
  {
    question: "「エンドユーザー数に応じた従量課金か？」",
    answer:
      "料金体系は、想定ユーザー数や利用量、必要なサポート範囲に応じて個別に設計します。詳細はお問い合わせいただければ、最適なプランをご案内します。",
  },
] as const;

export function AIDashiFaq() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <div className="w-full max-w-[1120px] space-y-4">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article
            key={item.question}
            className={isOpen ? "rounded-[10px] bg-[#f9f9fb] px-8 py-6" : "px-8 py-6"}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-start gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex-1 text-[20px] font-semibold leading-8 tracking-[-0.02em] text-slate-950 md:text-[22px]">
                {item.question}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-950">
                {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </span>
            </button>

            {isOpen ? (
              <div className="pr-14">
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                <div className="mt-5">
                  <Link
                    href={CONTACT_INQUIRY_URL}
                    className="inline-flex items-center justify-center rounded-[8px] bg-[#15181d] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0f1216]"
                  >
                    お問い合わせ
                  </Link>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
