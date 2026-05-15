import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AcpStaticPageShell({ children }: { children: ReactNode }) {
  return <main className="bg-white text-slate-950">{children}</main>;
}

export function AcpHeroSection({
  children,
  media,
  mediaTitle,
}: {
  children: ReactNode;
  media: { kind: "youtube"; src: string } | { kind: "image"; src: string; alt: string };
  mediaTitle: string;
}) {
  return (
    <section className="bg-slate-50 px-6 pb-20 pt-28 md:pb-24 md:pt-36">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12 text-center">
        <div className="flex max-w-[920px] flex-col items-center gap-6">{children}</div>
        {media.kind === "youtube" ? (
          <div className="aspect-video w-full overflow-hidden rounded-[28px] bg-slate-900 shadow-2xl shadow-slate-200">
            <iframe
              className="h-full w-full"
              src={media.src}
              title={mediaTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl shadow-slate-200">
            <Image src={media.src} alt={media.alt} width={1000} height={520} className="h-auto w-full" />
          </div>
        )}
      </div>
    </section>
  );
}

export function AcpHeroEyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">{children}</p>;
}

export function AcpHeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-[60px] md:leading-[1.12]">
      {children}
    </h1>
  );
}

export function AcpHeroLeadGroup({ children }: { children: ReactNode }) {
  return <div className="space-y-2 text-base font-light leading-8 text-slate-600 md:text-lg">{children}</div>;
}

export function AcpFeatureSection({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">{children}</div>
    </section>
  );
}

export function AcpSectionIntro({ children }: { children: ReactNode }) {
  return <div className="max-w-[900px] space-y-5">{children}</div>;
}

export function AcpSectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">{children}</h2>;
}

export function AcpSectionLeadGroup({ children }: { children: ReactNode }) {
  return <div className="space-y-2 text-base font-light leading-8 text-slate-600 md:text-lg">{children}</div>;
}

export function AcpFeatureGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function AcpFeatureCard({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
      <Image src={icon} alt="" width={44} height={44} className="mb-7 h-11 w-11" />
      {children}
    </article>
  );
}

export function AcpFeatureCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-xl font-semibold leading-7 text-slate-950">{children}</h3>;
}

export function AcpFeatureCardDescription({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-sm font-light leading-7 text-slate-600">{children}</p>;
}

export function AcpWorksSection({
  children,
  imageSrc,
  imageAlt,
}: {
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <section className="bg-slate-50 px-6 py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">
        {children}
        <div className="overflow-hidden rounded-[28px] bg-white p-6 shadow-xl shadow-slate-200/70">
          <Image src={imageSrc} alt={imageAlt} width={1000} height={520} className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}

export function AcpCapabilityGallery({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">{children}</div>
    </section>
  );
}

export function AcpCapabilityImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <Image src={src} alt={alt} width={640} height={360} className="h-auto w-full rounded-[18px]" />
    </div>
  );
}

export function AcpCapabilityGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

export function AcpPageCta({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-7 rounded-[32px] bg-slate-950 px-8 py-14 text-center text-white md:px-16">
        {children}
      </div>
    </section>
  );
}

export function AcpPageCtaTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{children}</h2>;
}

export function AcpPageCtaDescription({ children }: { children: ReactNode }) {
  return <p className="text-base font-light leading-8 text-slate-200 md:text-lg">{children}</p>;
}

export function AcpPageCtaLink({ children }: { children: ReactNode }) {
  return (
    <Link
      href="/contact-us?inquiry=demo-request&product=acp"
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
    >
      {children}
    </Link>
  );
}
