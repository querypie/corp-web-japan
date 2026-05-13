"use client";

import { useEffect, useState, type ReactNode } from "react";

type ResourceListMobileSidebarDrawerProps = {
  title: string;
  activeLabel?: string;
  children: ReactNode;
};

export function ResourceListMobileSidebarDrawer({
  title,
  activeLabel,
  children,
}: ResourceListMobileSidebarDrawerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-left text-[15px] font-medium leading-6 text-slate-950 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]"
          aria-expanded={open}
          aria-controls="resource-list-mobile-sidebar-drawer"
          onClick={() => setOpen(true)}
        >
          <span className="flex min-w-0 flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{title}</span>
            <span className="mt-1 truncate text-[15px] leading-6 text-slate-950">{activeLabel ?? title}</span>
          </span>
          <span className="ml-4 text-sm font-medium text-slate-600">開く</span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" aria-hidden={!open}>
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 cursor-pointer"
            aria-label={`${title}メニューを閉じる`}
            onClick={() => setOpen(false)}
          />
          <div
            id="resource-list-mobile-sidebar-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-6 pb-8 pt-5 shadow-[0_-24px_60px_-24px_rgba(15,23,42,0.45)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{title}</p>
                <p className="mt-1 text-base font-medium leading-7 text-slate-950">{activeLabel ?? title}</p>
              </div>
              <button
                type="button"
                className="cursor-pointer rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
                onClick={() => setOpen(false)}
              >
                閉じる
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
