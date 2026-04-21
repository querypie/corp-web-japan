import Link from "next/link";

export type FloatingConversionCtaProps = {
  href: string;
  label?: string;
};

export function FloatingConversionCta({
  href,
  label = "導入相談・デモ依頼",
}: FloatingConversionCtaProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="fixed bottom-4 right-0 z-[1100] flex w-[50px] flex-col items-center justify-center rounded-l-[0.95rem] rounded-r-none border border-r-0 border-white/15 bg-[linear-gradient(180deg,#2f3a49_0%,#1f2937_46%,#15181d_100%)] px-1.5 py-4 text-center text-white shadow-[-14px_22px_48px_-26px_rgba(15,23,42,0.52)] transition duration-300 hover:-translate-x-1 hover:shadow-[-18px_28px_58px_-28px_rgba(15,23,42,0.62)] focus:outline-none focus:ring-2 focus:ring-slate-400/35 md:bottom-auto md:top-1/2 md:w-[54px] md:-translate-y-1/2 md:py-5"
    >
      <span className="text-[12px] font-semibold leading-[1.45] tracking-[0.04em] [writing-mode:vertical-rl] [text-orientation:upright] md:text-[13px]">
        {label}
      </span>
    </Link>
  );
}
