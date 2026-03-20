"use client";

import { useEffect, useRef } from "react";

type ResourcePostTocProps = {
  tocHtml: string;
};

const OFFSET = 100;

export function ResourcePostToc({ tocHtml }: ResourcePostTocProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const links = Array.from(
      wrap.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    );

    const sections = links
      .map((link) => {
        const id = decodeURIComponent(link.getAttribute("href")?.slice(1) ?? "");
        const el = document.getElementById(id);
        if (!el) return null;
        return { link, el };
      })
      .filter((entry): entry is { link: HTMLAnchorElement; el: HTMLElement } => Boolean(entry));

    const onClick = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const id = decodeURIComponent(link.getAttribute("href")?.slice(1) ?? "");
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - OFFSET,
        behavior: "smooth",
      });
    };

    const activate = () => {
      const marker = window.scrollY + OFFSET + 32;
      let current: HTMLAnchorElement | null = sections[0]?.link ?? null;

      for (const section of sections) {
        if (section.el.offsetTop <= marker) {
          current = section.link;
          continue;
        }
        break;
      }

      links.forEach((link) => link.classList.remove("is-active"));

      if (current) {
        current.classList.add("is-active");

        const container = scrollRef.current;
        if (container) {
          const linkRect = current.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          if (
            linkRect.top < containerRect.top ||
            linkRect.bottom > containerRect.bottom
          ) {
            container.scrollTop +=
              linkRect.top -
              containerRect.top -
              containerRect.height / 2 +
              linkRect.height / 2;
          }
        }
      }
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        activate();
        tickingRef.current = false;
      });
    };

    links.forEach((link) => link.addEventListener("click", onClick));
    window.addEventListener("scroll", onScroll, { passive: true });
    activate();

    return () => {
      links.forEach((link) => link.removeEventListener("click", onClick));
      window.removeEventListener("scroll", onScroll);
    };
  }, [tocHtml]);

  return (
    <div
      ref={scrollRef}
      className="max-h-[220px] overflow-y-auto pr-1 lg:max-h-[320px]"
    >
      <div
        ref={wrapRef}
        className={[
          "[&_ul]:m-0",
          "[&_ul]:pl-0",
          "[&_li]:list-none",
          "[&_ul.sidebar-toc-list>li]:mb-2",
          "[&_ul.sidebar-toc-list>li:last-child]:mb-0",
          "[&_ul.sidebar-toc-list>li>a]:flex [&_ul.sidebar-toc-list>li>a]:items-center [&_ul.sidebar-toc-list>li>a]:gap-[6px] [&_ul.sidebar-toc-list>li>a]:text-[13px] [&_ul.sidebar-toc-list>li>a]:leading-[1.4] [&_ul.sidebar-toc-list>li>a]:text-slate-950 [&_ul.sidebar-toc-list>li>a]:transition-colors",
          "[&_ul.sidebar-toc-list>li>a::before]:content-['•'] [&_ul.sidebar-toc-list>li>a::before]:text-[13px]",
          "[&_ul.sidebar-toc-list>li>a:hover]:text-[#2563EB]",
          "[&_ul.sidebar-toc-list>li>a.is-active]:text-[#2563EB]",
          "[&_ul.sidebar-toc-sub]:mt-[6px] [&_ul.sidebar-toc-sub]:space-y-[6px]",
          "[&_ul.sidebar-toc-sub_li]:flex [&_ul.sidebar-toc-sub_li]:items-center [&_ul.sidebar-toc-sub_li]:gap-[5px]",
          "[&_ul.sidebar-toc-sub_li::before]:content-['○'] [&_ul.sidebar-toc-sub_li::before]:text-[10px] [&_ul.sidebar-toc-sub_li::before]:text-slate-400",
          "[&_ul.sidebar-toc-sub_a]:text-[12px] [&_ul.sidebar-toc-sub_a]:leading-[1.4] [&_ul.sidebar-toc-sub_a]:text-[#4B5563] [&_ul.sidebar-toc-sub_a]:transition-colors",
          "[&_ul.sidebar-toc-sub_a:hover]:text-[#2563EB] [&_ul.sidebar-toc-sub_a:hover]:underline",
          "[&_ul.sidebar-toc-sub_a.is-active]:text-[#2563EB] [&_ul.sidebar-toc-sub_a.is-active]:underline",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: tocHtml }}
      />
    </div>
  );
}
