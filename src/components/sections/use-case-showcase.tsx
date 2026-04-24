"use client";

import { useEffect, useMemo, useState } from "react";
import { Blocks, Brain, ChartColumnIncreasing, FileSearch, Play, Search, Wallet, X } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

type UseCaseTab = {
  label: string;
  body: string;
  videoHref: string;
  detailHref: string;
};

type UseCaseCard = {
  category: string;
  title: string;
  body: string;
  videoHref?: string;
  detailHref?: string;
  tabs?: readonly UseCaseTab[];
};

type UseCaseShowcaseProps = {
  note: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  cards: readonly UseCaseCard[];
};

const icons = [Search, Wallet, Brain, ChartColumnIncreasing, FileSearch, Blocks] as const;

const aiCrewPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]";

const aiCrewSecondaryButtonClass =
  "inline-flex items-center justify-center rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]";

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([^?&/]+)/);
  return match?.[1] ?? "";
}

function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
}

function getYouTubeEmbed(url: string) {
  const videoId = getYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : "";
}

export function UseCaseShowcase({ note, primaryCta, secondaryCta, cards }: UseCaseShowcaseProps) {
  const [activeTabs, setActiveTabs] = useState<Record<string, number>>({});
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVideo(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeVideo]);

  const normalizedCards = useMemo(
    () =>
      cards.map((card) => {
        const tabIndex = activeTabs[card.title] ?? 0;
        const activeTab = card.tabs?.[tabIndex];

        return {
          ...card,
          activeBody: activeTab?.body ?? card.body,
          activeVideoHref: activeTab?.videoHref ?? card.videoHref ?? "",
          activeDetailHref: activeTab?.detailHref ?? card.detailHref ?? "",
        };
      }),
    [activeTabs, cards],
  );

  return (
    <>
      <div className="relative mx-auto mt-10 max-w-[980px]">
        <div className="grid gap-4 md:grid-cols-2">
        {normalizedCards.map((card, index) => {
          const Icon = icons[index % icons.length];
          const thumbnail = getYouTubeThumbnail(card.activeVideoHref);

          return (
            <RevealOnScroll
              key={card.title}
              delayMs={index * 90}
            >
              <article
                role="button"
                tabIndex={0}
                aria-label={`${card.title} の動画を見る`}
                onClick={() => setActiveVideo(card.activeVideoHref)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveVideo(card.activeVideoHref);
                  }
                }}
                className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_-52px_rgba(15,23,42,0.18)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/35 lg:p-7"
              >
                <div className="group block overflow-hidden rounded-[1.25rem] text-left">
                <div
                  className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-[#2f3a49] bg-cover bg-center"
                  style={thumbnail ? { backgroundImage: `linear-gradient(rgba(15,23,42,0.34),rgba(15,23,42,0.34)), url(${thumbnail})` } : undefined}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[#2f3a49] shadow-lg transition group-hover:scale-105">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </div>
                  </div>
                </div>
                </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#2f3a49]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="inline-flex rounded-full border border-black/6 bg-white px-3 py-1 text-[12px] font-semibold text-slate-600">
                  {card.category}
                </div>
              </div>

              <h3 className="mt-5 text-pretty text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-slate-800">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.85] text-slate-600">{card.activeBody}</p>

              {card.tabs?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tabs.map((tab, tabIndex) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveTabs((prev) => ({ ...prev, [card.title]: tabIndex }));
                      }}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                        (activeTabs[card.title] ?? 0) === tabIndex
                          ? "bg-[#2f3a49] text-white"
                          : "border border-black/6 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              ) : null}

                <div className="mt-5 flex items-center justify-end gap-3">
                  <a
                    href={card.activeDetailHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#475467] transition hover:text-[#101828]"
                  >
                    詳しく見る
                  </a>
                </div>
              </article>
            </RevealOnScroll>
          );
        })}
      </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1120px] text-center">
        <p className="mx-auto max-w-[860px] text-[15px] leading-7 text-slate-600">{note}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={primaryCta.href}
            className={aiCrewPrimaryButtonClass}
          >
            {primaryCta.label}
          </a>
          <a
            href={secondaryCta.href}
            className={aiCrewSecondaryButtonClass}
          >
            {secondaryCta.label}
          </a>
        </div>
      </div>

      {activeVideo ? (
        <div className="fixed inset-0 z-[1200] bg-black/70 px-4 py-10 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <div
            className="mx-auto flex h-full max-w-[960px] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-black shadow-[0_32px_90px_-40px_rgba(0,0,0,0.65)]">
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbed(activeVideo)}
                  title="Use case demo video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
