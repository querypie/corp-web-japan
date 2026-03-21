"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Calculator, MessagesSquare, Receipt, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PricingCalculatorPage() {
  const [monthlyInquiries, setMonthlyInquiries] = useState(400);
  const [monthlyDocs, setMonthlyDocs] = useState(120);
  const [monthlyResearchTasks, setMonthlyResearchTasks] = useState(24);

  const simulation = useMemo(() => {
    const monthlyCredits = monthlyInquiries * 1 + monthlyDocs * 2 + monthlyResearchTasks * 12;
    const yearlyCredits = monthlyCredits * 12;
    const assistedHoursPerMonth =
      monthlyInquiries * 0.18 + monthlyDocs * 0.3 + monthlyResearchTasks * 1.5;
    const yearlyHours = Math.round(assistedHoursPerMonth * 12);

    return {
      monthlyCredits,
      yearlyCredits,
      yearlyHours,
      suggestedStart:
        monthlyCredits < 1200
          ? "1部門からの小規模導入"
          : monthlyCredits < 2500
            ? "2〜3部門での横展開"
            : "全社横断での本格導入",
    };
  }, [monthlyDocs, monthlyInquiries, monthlyResearchTasks]);

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1920px] px-6 pb-20 pt-[112px] lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#ED602E]">Pricing Calculator</p>
            <h1 className="mt-5 text-[38px] font-semibold leading-[1.15] tracking-[-0.04em] text-slate-950 sm:text-[52px]">
              自社の業務量に合わせた
              <br />
              AI Crew の概算コストを確認する
            </h1>
            <p className="mx-auto mt-5 max-w-[860px] text-left text-base leading-7 text-slate-500">
              月に何件の問い合わせ対応があるか、どれくらいの書類チェックが発生するかなど、具体的な業務量を入力するだけで、
              AI Crew を採用した場合の年間シミュレーションを概算で確認できます。
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef2f7] text-[#2f3a49]">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-slate-950">
                    業務ボリュームを入力
                  </h2>
                  <p className="text-sm leading-6 text-slate-500">
                    まずは一番ボトルネックになっている部門から想定してください。
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">月間の問い合わせ対応件数</span>
                    <span className="text-sm font-medium text-slate-500">{monthlyInquiries} 件</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={3000}
                    step={50}
                    value={monthlyInquiries}
                    onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                    className="mt-3 w-full accent-[#ED602E]"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">月間の書類チェック・精算件数</span>
                    <span className="text-sm font-medium text-slate-500">{monthlyDocs} 件</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={1000}
                    step={10}
                    value={monthlyDocs}
                    onChange={(e) => setMonthlyDocs(Number(e.target.value))}
                    className="mt-3 w-full accent-[#ED602E]"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">月間の市場調査・資料準備タスク</span>
                    <span className="text-sm font-medium text-slate-500">{monthlyResearchTasks} 件</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={120}
                    step={2}
                    value={monthlyResearchTasks}
                    onChange={(e) => setMonthlyResearchTasks(Number(e.target.value))}
                    className="mt-3 w-full accent-[#ED602E]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] bg-[#2f3a49] p-7 text-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.24)]">
              <h2 className="text-[24px] font-semibold tracking-[-0.03em]">概算シミュレーション</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/8 p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-white/60">月間想定クレジット</p>
                  <p className="mt-3 text-[32px] font-semibold tracking-[-0.04em]">{simulation.monthlyCredits.toLocaleString()}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/8 p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-white/60">年間想定クレジット</p>
                  <p className="mt-3 text-[32px] font-semibold tracking-[-0.04em]">{simulation.yearlyCredits.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/8 p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-white/60">年間で削減できる準備工数の目安</p>
                  <p className="mt-3 text-[32px] font-semibold tracking-[-0.04em]">{simulation.yearlyHours.toLocaleString()} 時間</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/8 p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-white/60">おすすめの始め方</p>
                  <p className="mt-3 text-xl font-semibold tracking-[-0.03em]">{simulation.suggestedStart}</p>
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5">
                <p className="text-sm leading-7 text-white/78">
                  このシミュレーションは、問い合わせ一次対応・書類確認・市場調査のような代表業務をもとにした概算です。
                  正式なお見積もりは、対象部署やワークフローを踏まえて個別にご案内します。
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-[12px] bg-white px-5 py-3 text-sm font-semibold text-[#2f3a49] transition hover:bg-[#f4f6f8]"
                >
                  この条件で相談する
                </Link>
                <Link
                  href="/#roles"
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/18 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  活用例を見る
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: MessagesSquare,
                title: "問い合わせ量から試算",
                body: "一次対応や振り分けの件数を入れると、サポート部門の負荷軽減イメージを把握できます。",
              },
              {
                icon: Receipt,
                title: "書類処理量から試算",
                body: "経費精算や請求書確認など、定型チェック業務のボリュームをもとに概算できます。",
              },
              {
                icon: ShieldCheck,
                title: "安全に小さく始める",
                body: "最も詰まっている役割から小さく導入し、効果を確認しながら横展開できます。",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[1.6rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
