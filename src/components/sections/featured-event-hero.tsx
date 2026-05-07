import Image from "next/image";
import Link from "next/link";

type FeaturedEventHeroProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
  eyebrow?: string;
  ctaLabel?: string;
};

export function FeaturedEventHero({
  href,
  imageSrc,
  imageAlt,
  badge,
  title,
  description,
  date,
  eyebrow = "Featured Event",
  ctaLabel = "詳細を見る",
}: FeaturedEventHeroProps) {
  return (
    <section className="mb-16">
      <div className="relative overflow-hidden rounded-lg bg-[#f2f4f6]">
        <Link
          href={href}
          aria-label={`${title} ${ctaLabel}`}
          className="peer absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
        />

        <div
          className="relative z-10 flex pointer-events-none flex-col items-stretch peer-hover:[&_.featured-event-hero-image]:scale-[1.02] peer-focus:[&_.featured-event-hero-image]:scale-[1.02] peer-focus-visible:[&_.featured-event-hero-image]:scale-[1.02] lg:flex-row"
        >
          <div className="aspect-video w-full overflow-hidden lg:w-3/5 lg:aspect-auto">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={675}
              className="featured-event-hero-image h-full w-full object-cover transition-transform duration-500"
            />
          </div>

          <div className="flex w-full flex-col justify-center p-6 lg:w-2/5 lg:p-8">
            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-slate-500 backdrop-blur-sm">
              {badge}
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
              <h2 className="text-2xl font-black leading-tight tracking-tighter text-slate-900 lg:text-3xl">{title}</h2>
              <p className="line-clamp-4 text-sm leading-relaxed text-slate-600 lg:text-base">{description}</p>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-6">
              <span className="text-sm font-medium text-slate-400">{date}</span>
              <Link
                href={href}
                className="pointer-events-auto inline-flex items-center rounded-lg bg-black px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition-all hover:scale-[1.03] hover:bg-[#1E3A8A] hover:shadow-[0_10px_22px_rgba(30,58,138,0.20)] focus-visible:scale-[1.03] focus-visible:bg-[#1E3A8A] focus-visible:shadow-[0_10px_22px_rgba(30,58,138,0.20)] focus-visible:outline-none"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
