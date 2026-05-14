import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type CapabilityImage = {
  src: string;
  alt: string;
};

export function AcpStaticPageShell({ children }: { children: ReactNode }) {
  return <main className="bg-white text-slate-950">{children}</main>;
}

export function AcpHeroSection({
  title,
  description,
  media,
}: {
  title: string;
  description: readonly string[];
  media: { kind: "youtube"; src: string } | { kind: "image"; src: string; alt: string };
}) {
  return (
    <section className="bg-slate-50 px-6 pb-20 pt-28 md:pb-24 md:pt-36">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12 text-center">
        <div className="flex max-w-[920px] flex-col items-center gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">QueryPie ACP</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-[60px] md:leading-[1.12]">
            {title}
          </h1>
          <div className="space-y-2 text-base font-light leading-8 text-slate-600 md:text-lg">
            {description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        {media.kind === "youtube" ? (
          <div className="aspect-video w-full overflow-hidden rounded-[28px] bg-slate-900 shadow-2xl shadow-slate-200">
            <iframe
              className="h-full w-full"
              src={media.src}
              title={title}
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

export function AcpFeatureSection({
  heading,
  intro,
  features,
}: {
  heading: string;
  intro: readonly string[];
  features: readonly Feature[];
}) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">
        <div className="max-w-[900px] space-y-5">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">{heading}</h2>
          <div className="space-y-2 text-base font-light leading-8 text-slate-600 md:text-lg">
            {intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
              <Image src={feature.icon} alt="" width={44} height={44} className="mb-7 h-11 w-11" />
              <h3 className="text-xl font-semibold leading-7 text-slate-950">{feature.title}</h3>
              <p className="mt-4 text-sm font-light leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AcpWorksSection({
  heading,
  body,
  imageSrc,
  imageAlt,
}: {
  heading: string;
  body: readonly string[];
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <section className="bg-slate-50 px-6 py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">
        <div className="max-w-[900px] space-y-5">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">{heading}</h2>
          <div className="space-y-2 text-base font-light leading-8 text-slate-600 md:text-lg">
            {body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[28px] bg-white p-6 shadow-xl shadow-slate-200/70">
          <Image src={imageSrc} alt={imageAlt} width={1000} height={520} className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}

export function AcpCapabilityGallery({
  heading,
  images,
}: {
  heading: string;
  images: readonly CapabilityImage[];
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">{heading}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {images.map((image) => (
            <div key={image.src} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <Image src={image.src} alt={image.alt} width={640} height={360} className="h-auto w-full rounded-[18px]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AcpPageCta() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-7 rounded-[32px] bg-slate-950 px-8 py-14 text-center text-white md:px-16">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">QueryPie ACPを無料でお試しください</h2>
        <p className="text-base font-light leading-8 text-slate-200 md:text-lg">
          アクセス制御、監査、統合管理をひとつのプラットフォームで確認できます。
        </p>
        <Link
          href="/contact-us?inquiry=demo-request&product=acp"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          デモを依頼
        </Link>
      </div>
    </section>
  );
}
