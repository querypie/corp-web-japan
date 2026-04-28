"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, BriefcaseBusiness, Building2, ChevronDown, ClipboardCheck, Code2, FileText, Handshake, Headset, Megaphone, MessageCircleHeart, Palette, PencilLine, Scale, SearchCheck, ShieldCheck, ShoppingCart, UserRoundCog, Wallet } from "lucide-react";

type RoleSlide = {
  department: string;
  firstName: string;
  displayName: string;
  titleEn: string;
  titleJa: string;
  painPoint: string;
  catchCopy: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  accent: "blue" | "orange" | "violet" | "emerald" | "rose" | "amber";
};

type RoleSlidesProps = {
  items: readonly RoleSlide[];
  note: string;
  customCta: {
    label: string;
    href: string;
  };
};

const departmentThemeMap: Record<string, { shell: string; badge: string; portraitBg: string }> = {
  "営業・事業開発": {
    shell: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    badge: "bg-[#f2f4f7] text-[#475467]",
    portraitBg: "#F8FAFC",
  },
  "コーポレート・管理": {
    shell: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    badge: "bg-[#f2f4f7] text-[#475467]",
    portraitBg: "#F8FAFC",
  },
  "開発・プロダクト": {
    shell: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    badge: "bg-[#f2f4f7] text-[#475467]",
    portraitBg: "#F8FAFC",
  },
  "マーケティング・CS": {
    shell: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    badge: "bg-[#f2f4f7] text-[#475467]",
    portraitBg: "#F8FAFC",
  },
  "広報・デザイン": {
    shell: "border-[#e4e7ec] bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)]",
    badge: "bg-[#f2f4f7] text-[#475467]",
    portraitBg: "#F8FAFC",
  },
} as const;

const categoryChipMap: Record<string, { active: string; idle: string }> = {
  "営業・事業開発": {
    active: "border-[#2f3a49] bg-[#2f3a49] text-white",
    idle: "border-[#d0d5dd] bg-white text-[#667085] hover:bg-[#f8fafc]",
  },
  "コーポレート・管理": {
    active: "border-[#2f3a49] bg-[#2f3a49] text-white",
    idle: "border-[#d0d5dd] bg-white text-[#667085] hover:bg-[#f8fafc]",
  },
  "開発・プロダクト": {
    active: "border-[#2f3a49] bg-[#2f3a49] text-white",
    idle: "border-[#d0d5dd] bg-white text-[#667085] hover:bg-[#f8fafc]",
  },
  "マーケティング・CS": {
    active: "border-[#2f3a49] bg-[#2f3a49] text-white",
    idle: "border-[#d0d5dd] bg-white text-[#667085] hover:bg-[#f8fafc]",
  },
  "広報・デザイン": {
    active: "border-[#2f3a49] bg-[#2f3a49] text-white",
    idle: "border-[#d0d5dd] bg-white text-[#667085] hover:bg-[#f8fafc]",
  },
};

const crewIconByName = {
  Anne: Headset,
  Liam: Handshake,
  Ken: ShieldCheck,
  Victor: BriefcaseBusiness,
  Emma: UserRoundCog,
  Oliver: Wallet,
  Sophia: Scale,
  Daniel: ShoppingCart,
  Grace: FileText,
  Hanna: ClipboardCheck,
  Teo: Building2,
  Jay: Code2,
  Zoe: SearchCheck,
  Clara: Megaphone,
  Noah: BarChart3,
  Mio: MessageCircleHeart,
  Ian: PencilLine,
  Ruby: Palette,
} as const;

const portraitImageByName = {
  Anne: "/crew/role/anna.png",
  Liam: "/crew/role/liam.png",
  Ken: "/crew/role/ken_2.png",
  Victor: "/crew/role/victor.png",
  Emma: "/crew/role/emma_2.png",
  Oliver: "/crew/role/oliver.png",
  Sophia: "/crew/role/sophia.png",
  Daniel: "/crew/role/daniel.png",
  Grace: "/crew/role/grace_2.png",
  Hanna: "/crew/role/hanna.png",
  Teo: "/crew/role/teo.png",
  Jay: "/crew/role/jay.png",
  Zoe: "/crew/role/zoe.png",
  Clara: "/crew/role/clara_2.png",
  Noah: "/crew/role/noah_2.png",
  Mio: "/crew/role/mio_2.png",
  Ian: "/crew/role/ian.png",
  Ruby: "/crew/role/ruby.png",
} as const;

const portraitAdjustments: Partial<
  Record<keyof typeof portraitImageByName, { position: string; scale: number; fit?: "cover" | "contain"; bg?: string; offsetY?: number }>
> = {
  Grace: { position: "center 0%", scale: 1.18, fit: "cover", offsetY: -4 },
  Mio: { position: "center 0%", scale: 1.17, fit: "cover", offsetY: -14 },
  Ken: { position: "center 0%", scale: 1.27, fit: "cover", offsetY: -12 },
  Emma: { position: "center 0%", scale: 1.17, fit: "cover", offsetY: -18 },
  Sophia: { position: "center 4%", scale: 1.08, fit: "cover", offsetY: -3 },
  Daniel: { position: "center 4%", scale: 1.08, fit: "cover", offsetY: -3 },
  Clara: { position: "center 0%", scale: 1.2, fit: "cover", offsetY: -14 },
  Noah: { position: "center 0%", scale: 1.1, fit: "cover", offsetY: -12 },
  Ruby: { position: "center 8%", scale: 1.08, fit: "cover", offsetY: -3 },
  Victor: { position: "center 8%", scale: 1.08, fit: "cover", offsetY: -3 },
};

export function RoleSlides({ items, note, customCta }: RoleSlidesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.department))), [items]);
  const filteredItems = useMemo(
    () => (selectedCategory === "all" ? items : items.filter((item) => item.department === selectedCategory)),
    [items, selectedCategory],
  );

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollPrev(container.scrollLeft > 4);
    setCanScrollNext(container.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({ left: 0, behavior: "auto" });
    const rafId = window.requestAnimationFrame(updateScrollState);
    const handleScroll = () => updateScrollState();

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [filteredItems.length, selectedCategory, updateScrollState]);

  function scrollSlides(direction: "prev" | "next") {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const amount = Math.max(container.clientWidth * 0.82, 320);
    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mx-auto max-w-[1232px]">
      <div className="mx-auto mb-8 flex max-w-[1240px] flex-nowrap items-center justify-center gap-2 overflow-x-auto px-4 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-3.5 py-2 text-[13px] font-semibold shadow-[0_12px_32px_-24px_rgba(15,23,42,0.18)] transition ${
            selectedCategory === "all"
              ? "border-[#2f3a49] bg-[#2f3a49] text-white"
              : "border-[#d7dde7] bg-white/92 text-[#475467] hover:bg-[#f8fafc]"
          }`}
        >
          すべて
        </button>
        {categories.map((category) => {
          const styles = categoryChipMap[category] ?? {
            active: "border-[#d7dde7] bg-[#f8fafc] text-[#344054]",
            idle: "border-[#d7dde7] bg-white/92 text-[#475467] hover:bg-[#f8fafc]",
          };

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-3.5 py-2 text-[13px] font-semibold shadow-[0_12px_32px_-24px_rgba(15,23,42,0.18)] transition ${
                selectedCategory === category ? styles.active : styles.idle
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="relative">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filteredItems.map((item) => {
          const theme = departmentThemeMap[item.department] ?? departmentThemeMap["営業・事業開発"];
          const Icon = crewIconByName[item.firstName as keyof typeof crewIconByName] ?? BriefcaseBusiness;
          const portrait = portraitImageByName[item.firstName as keyof typeof portraitImageByName];
          const adjustment = portraitAdjustments[item.firstName as keyof typeof portraitImageByName] ?? {
            position: "center 8%",
            scale: 1,
            fit: "cover" as const,
            offsetY: 0,
          };

          return (
            <article
              key={item.firstName}
              className={`min-w-[360px] max-w-[360px] snap-start overflow-hidden rounded-[2rem] border shadow-[0_28px_80px_-56px_rgba(15,23,42,0.24)] sm:min-w-[396px] sm:max-w-[396px] xl:min-w-[400px] xl:max-w-[400px] ${theme.shell}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${theme.badge}`}>
                    {item.department}
                  </p>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.badge}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5">
                  <div
                    className="relative h-[260px] overflow-hidden rounded-[1.5rem] border border-black/6 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.22)]"
                    style={{ background: `linear-gradient(180deg, ${theme.portraitBg} 0%, #ffffff 100%)` }}
                  >
                    <Image
                      src={portrait}
                      alt={`${item.firstName} portrait`}
                      fill
                      className="origin-top object-cover"
                      style={{
                        objectPosition: adjustment.position,
                        transform: `translateY(${adjustment.offsetY ?? 0}px) scale(${adjustment.scale})`,
                      }}
                      sizes="(min-width: 768px) 420px, 350px"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-end gap-3">
                    <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#0d121f]">{item.firstName}</p>
                    <p className="text-[15px] font-medium leading-none text-[#667085]">{item.displayName}</p>
                  </div>
                  <p className="mt-3 text-[14px] font-medium leading-6 text-[#667085]">
                    {item.titleEn} ｜ {item.titleJa}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="min-h-[56px] text-pretty text-[17px] font-semibold leading-[1.45] tracking-[-0.03em] text-[#0d121f] line-clamp-2 sm:text-[18px] xl:min-h-[58px] xl:text-[19px]">
                    {item.catchCopy}
                  </p>
                </div>

                <details className="group mt-5 rounded-[1.25rem] bg-white/88 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-semibold tracking-[0.14em] text-[#8a94a6] [&::-webkit-details-marker]:hidden">
                    <span>現場のペイン</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[14px] leading-7 text-[#596780]">{item.painPoint}</p>
                </details>

                <details className="group mt-4 rounded-[1.25rem] bg-white/88 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-semibold tracking-[0.14em] text-[#8a94a6] [&::-webkit-details-marker]:hidden">
                    <span>私ができること</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[14px] leading-7 text-[#596780]">{item.summary}</p>
                </details>

                <div className="mt-6">
                  <Link
                    href={item.ctaHref}
                    className="inline-flex w-full items-center justify-center rounded-[12px] bg-[#2f3a49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#25303d]"
                  >
                    {item.ctaLabel}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {canScrollPrev ? (
        <button
          type="button"
          className="absolute left-0 top-[214px] z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white/92 text-slate-900 shadow-lg transition hover:bg-white md:flex"
          onClick={() => scrollSlides("prev")}
          aria-label="Previous crew"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      ) : null}
      {canScrollNext ? (
        <button
          type="button"
          className="absolute right-0 top-[214px] z-10 hidden h-12 w-12 translate-x-1/2 items-center justify-center rounded-full bg-white/92 text-slate-900 shadow-lg transition hover:bg-white md:flex"
          onClick={() => scrollSlides("next")}
          aria-label="Next crew"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      ) : null}
      </div>

      <div className="mt-10 text-center">
        <p className="mx-auto max-w-[860px] text-sm leading-7 text-[#667085]">
          {note}
          <Link href={customCta.href} className="ml-2 inline-flex items-center font-semibold text-[#2f3a49] hover:text-[#ED602E]">
            {customCta.label}
          </Link>
        </p>
      </div>
    </div>
  );
}
