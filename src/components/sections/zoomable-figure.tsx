"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand, X } from "lucide-react";

type ZoomableFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  sizes?: string;
  modalScale?: number;
};

export function ZoomableFigure({
  src,
  alt,
  caption = "クリックで拡大表示",
  sizes = "(min-width: 1024px) 720px, 100vw",
  modalScale = 1,
}: ZoomableFigureProps) {
  const [open, setOpen] = useState(false);
  const modalMaxWidth = Math.round(1120 * modalScale);
  const modalMaxHeight = Math.round(840 * modalScale);

  return (
    <>
      <div className="w-full text-left">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full text-left"
          aria-label={`${alt} を拡大表示`}
        >
          <div className="rounded-[1.5rem] bg-[#f8fafc] p-1.5 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_50px_-40px_rgba(15,23,42,0.12)] sm:p-2 lg:p-2.5">
            <div className="relative mx-auto aspect-square w-full max-w-[720px] overflow-hidden rounded-[1.05rem] bg-transparent">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain p-0 transition duration-500 group-hover:scale-[1.01] sm:p-0.5 lg:p-1"
                sizes={sizes}
              />
              <div className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#2f3a49] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.22)]">
                <Expand className="h-4 w-4" />
              </div>
            </div>
          </div>
        </button>
        {caption ? (
          <p className="mt-3 text-center text-[12px] font-medium tracking-[0.04em] text-slate-500">
            {caption}
          </p>
        ) : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[1300] bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.28),rgba(2,6,23,0.88))] px-4 py-8 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white transition hover:bg-slate-950"
            aria-label="拡大表示を閉じる"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                minHeight: "100%",
              }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src={src}
                  alt={alt}
                  width={modalMaxWidth}
                  height={modalMaxHeight}
                  className="block h-auto w-auto max-w-full max-h-full object-contain"
                  style={{
                    maxWidth: `min(94vw, ${modalMaxWidth}px)`,
                    maxHeight: `min(88vh, ${modalMaxHeight}px)`,
                  }}
                  sizes={`min(94vw, ${modalMaxWidth}px)`}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
