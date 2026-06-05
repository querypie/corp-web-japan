import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SelfHostedVideoPlayer, type SelfHostedVideoSource } from "@/components/media/self-hosted-video-player";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const demoVideoSources = [
  {
    src: "/internal/video/querypie-aip-hero-youtube.mp4",
    type: "video/mp4",
    label: "Downloaded AIP hero YouTube video served from public/internal/video",
  },
] satisfies readonly SelfHostedVideoSource[];

const storageSteps = [
  {
    title: "Current demo contract",
    description:
      "The demo reads the downloaded AIP hero MP4 directly from public/internal/video so the player contract can be reviewed without adding media infrastructure to this PR.",
  },
  {
    title: "AIP hero visual contract",
    description:
      "The player shape mirrors the stage AIP hero: max-width 1024px, 16:9 aspect ratio, square corners, no card shadow, the same thumbnail, and the same centered play icon treatment.",
  },
  {
    title: "Production media contract",
    description:
      "Follow-up production rollout should move large video files to object storage behind a QueryPie-owned CDN domain such as media.querypie.ai.",
  },
] as const;

export const metadata: Metadata = {
  title: "Internal Video | QueryPie AI",
  description: "Internal self-hosted video playback page for the QueryPie AI Japan website.",
  alternates: {
    canonical: "/internal/video",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function InternalVideoPage() {
  return (
    <main {...componentNameDebugProps("InternalVideoPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="px-6 pb-[120px] pt-[134px] sm:px-10 lg:px-16 lg:pt-[144px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">
          <div className="flex max-w-[746px] flex-col items-center gap-[20px]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Internal video</p>
            <h1 className="text-[48px] font-normal leading-[56px] tracking-normal text-[#24292F] lg:text-[60px] lg:leading-[72px]">
              Self-hosted video playback demo
            </h1>
            <p className="text-[16px] font-light leading-[25px] tracking-[0.36px] text-[#57606A] lg:text-[18px] lg:leading-[28px]">
              This internal page validates issue 488 by replacing the temporary synthetic clip with the downloaded AIP
              hero video, while preserving the AIP hero thumbnail, player size, square corners, and poster-first play
              interaction.
            </p>
            <Link
              className="mt-[8px] inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              href="/internal"
            >
              Back to internal pages
            </Link>
          </div>

          <SelfHostedVideoPlayer
            title="QueryPie AIP - Secure Enterprise Agentic AI Platform"
            sources={demoVideoSources}
            poster="/services/aip/aip-video-thumb-jp.png"
            posterAlt="QueryPie AIP video thumbnail"
            className="mx-auto w-full max-w-[1024px]"
            frameClassName="aspect-video w-full"
            fallbackDownloadLabel="Download the downloaded AIP hero video"
            caption={
              <>
                Demo file source: <code className="rounded bg-slate-100 px-1.5 py-0.5">public/internal/video</code>. The
                production storage/CDN rollout remains outside this PR.
              </>
            }
          />
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1024px] gap-5 md:grid-cols-3">
          {storageSteps.map((step) => (
            <section key={step.title} className="rounded-[20px] border border-slate-200 bg-slate-50 p-6 text-left">
              <h2 className="text-base font-semibold text-slate-950">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
            </section>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
