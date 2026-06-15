import Image from "next/image";
import type { ReactNode } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type HeroLabel = {
  label: string;
  description: string;
};

type As400CobolHeroVisualProps = {
  imageSrc: string;
  imageAlt: string;
  labels: HeroLabel[];
  componentName?: string;
};

export function As400CobolHeroVisual({
  imageSrc,
  imageAlt,
  labels,
  componentName = "As400CobolHeroVisual",
}: As400CobolHeroVisualProps) {
  const debugProps =
    componentName === "As400CobolHeroVisual"
      ? componentNameDebugProps("As400CobolHeroVisual")
      : componentNameDebugProps(componentName);

  return (
    <figure
      {...debugProps}
      className="relative w-full overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_32px_90px_-52px_rgba(15,23,42,0.28)]"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={1672}
        height={941}
        priority
        sizes="(min-width: 1024px) 1120px, calc(100vw - 48px)"
        className="h-auto w-full"
      />
      <figcaption className="sr-only">{imageAlt}</figcaption>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 bottom-4 hidden grid-cols-3 gap-3 lg:grid"
      >
        {labels.map((label) => (
          <HeroOverlayLabel key={label.label}>
            <span className="block text-[13px] font-semibold leading-5 text-slate-950">
              {label.label}
            </span>
            <span className="mt-1 block text-[11px] font-medium leading-4 text-slate-600">
              {label.description}
            </span>
          </HeroOverlayLabel>
        ))}
      </div>
    </figure>
  );
}

function HeroOverlayLabel({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolHeroOverlayLabel")}
      className="rounded-[8px] border border-white/70 bg-white/88 px-4 py-3 text-left shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)] backdrop-blur-md"
    >
      {children}
    </div>
  );
}
