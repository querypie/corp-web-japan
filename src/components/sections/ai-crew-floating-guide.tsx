"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AICrewAvatar } from "@/components/sections/ai-crew-avatar";

type GuideItem = {
  sectionId: string;
  role?: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  external?: boolean;
  progressItems?: readonly string[];
};

const guideItems: readonly GuideItem[] = [
  {
    sectionId: "hero",
    role: "案内 Crew",
    message: "貴社に合う進め方をご案内します。",
    ctaLabel: "活用事例を見る",
    ctaHref: "/demo/use-cases",
    progressItems: [
      "業務課題を整理中",
      "必要なデータを確認中",
      "出力形式を設計中",
      "業務例を表示中",
      "PoCの進め方を準備中",
    ],
  },
  {
    sectionId: "roles",
    role: "業務案内 Crew",
    message: "実際の動きは動画で確認できます。",
    ctaLabel: "すべてのデモを見る",
    ctaHref: "/demo/use-cases",
  },
  {
    sectionId: "process",
    role: "導入支援 Crew",
    message: "PoCから小さく始められます。",
    ctaLabel: "進め方を相談する",
    ctaHref: "/contact-us?inquiry=ai-consulting&product=ai-crew",
  },
] as const;

const sectionToneMap: Record<string, "white" | "gray"> = {
  hero: "white",
  roles: "gray",
  process: "white",
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useCurrentGuideSection() {
  const [currentId, setCurrentId] = useState<string | null>("hero");

  useEffect(() => {
    const update = () => {
      const offset = window.scrollY + window.innerHeight * 0.36;
      let active: string | null = null;

      for (const item of guideItems) {
        const section = document.getElementById(item.sectionId);
        if (!section) continue;
        if (section.offsetTop <= offset) {
          active = item.sectionId;
        }
      }

      setCurrentId(active);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return currentId;
}

export function AICrewFloatingGuide() {
  const reducedMotion = useReducedMotion();
  const currentId = useCurrentGuideSection();
  const [activeProgress, setActiveProgress] = useState(0);

  const currentGuide = useMemo(
    () => guideItems.find((item) => item.sectionId === currentId) ?? null,
    [currentId],
  );

  useEffect(() => {
    if (!currentGuide?.progressItems?.length || reducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveProgress((prev) => (prev + 1) % currentGuide.progressItems!.length);
    }, 3400);

    return () => window.clearInterval(timer);
  }, [currentGuide, reducedMotion]);

  if (!currentGuide) {
    return null;
  }

  const bubble = (
    <div
      className="rounded-[1rem] border border-[#dde6ef] bg-white/94 px-4 py-3 text-[#475467] shadow-[0_18px_42px_-28px_rgba(15,23,42,0.18)] backdrop-blur"
    >
      {currentGuide.role ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#98a2b3]">
          {currentGuide.role}
        </p>
      ) : null}
      <p className="mt-1 text-[13px] leading-5">{currentGuide.message}</p>
      {currentGuide.progressItems?.length ? (
        <div className="mt-2 rounded-full bg-[#f6f9fd] px-3 py-1.5 text-[12px] font-medium text-[#2f3a49]">
          {currentGuide.progressItems[activeProgress]}
        </div>
      ) : null}
      {currentGuide.ctaLabel && currentGuide.ctaHref ? (
        currentGuide.external ? (
          <a
            href={currentGuide.ctaHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB] hover:text-[#163A7A]"
          >
            {currentGuide.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <a
            href={currentGuide.ctaHref}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB] hover:text-[#163A7A]"
          >
            {currentGuide.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )
      ) : null}
    </div>
  );

  return (
    <>
      <div
        key={currentGuide.sectionId}
        className={`fixed bottom-5 right-5 z-[90] hidden flex-col items-end gap-2 md:flex ${reducedMotion ? "" : "animate-[crewCue_5.2s_ease-out_forwards]"}`}
      >
        <div className="max-w-[220px]">{bubble}</div>
        <AICrewAvatar
          size="desktop"
          tone={sectionToneMap[currentGuide.sectionId] ?? "white"}
        />
      </div>

      <div className="fixed bottom-4 right-4 z-[90] md:hidden">
        <div key={`mobile-${currentGuide.sectionId}`} className={`${reducedMotion ? "" : "animate-[crewCue_5.2s_ease-out_forwards]"}`}>
          <div className="pointer-events-none absolute bottom-[88px] right-0 w-[200px]">
            {bubble}
          </div>
          <AICrewAvatar
            size="mobile"
            tone={sectionToneMap[currentGuide.sectionId] ?? "white"}
          />
        </div>
      </div>
    </>
  );
}
