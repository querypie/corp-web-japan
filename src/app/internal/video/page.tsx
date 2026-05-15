import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SelfHostedVideoPlayer, type SelfHostedVideoSource } from "@/components/media/self-hosted-video-player";

const demoVideoSources = [
  {
    src: "/internal/video/querypie-self-hosted-video-demo.mp4",
    type: "video/mp4",
    label: "MP4 demo file served from public/internal/video",
  },
] satisfies readonly SelfHostedVideoSource[];

const storageSteps = [
  {
    title: "Current demo contract",
    description:
      "The demo reads a small MP4 directly from public/internal/video so the player contract can be reviewed without adding media infrastructure to this PR.",
  },
  {
    title: "Production media contract",
    description:
      "Follow-up production rollout should move large video files to object storage behind a QueryPie-owned CDN domain such as media.querypie.ai.",
  },
  {
    title: "Playback migration path",
    description:
      "The player accepts typed source records today and can later receive CDN MP4 or HLS URLs without changing page-level authoring patterns.",
  },
] as const;

export const metadata: Metadata = {
  title: "Internal Video Demo | QueryPie AI",
  description: "Internal self-hosted video playback demo for the QueryPie AI Japan website.",
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
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="px-6 pb-16 pt-20 sm:px-10 lg:px-16 lg:pb-20 lg:pt-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Internal video</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Self-hosted video playback demo
            </h1>
            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
              This internal page validates the first implementation step for issue 488: render a production-ready native
              video player while reading the demo file from the repository public directory. The long-term storage and CDN
              plan stays outside this PR.
            </p>
          </div>
          <Link
            className="inline-flex w-fit items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            href="/internal"
          >
            Back to internal demos
          </Link>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <SelfHostedVideoPlayer
            title="QueryPie self-hosted video playback demo"
            sources={demoVideoSources}
            poster="/internal/video/querypie-self-hosted-video-poster.svg"
            frameClassName="aspect-video rounded-[28px]"
            fallbackDownloadLabel="Download the self-hosted demo video"
            caption={
              <>
                Demo file source: <code className="rounded bg-slate-100 px-1.5 py-0.5">public/internal/video</code>. The
                component uses native controls, <code className="rounded bg-slate-100 px-1.5 py-0.5">playsInline</code>, and{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5">preload=&quot;metadata&quot;</code> by default.
              </>
            }
          />

          <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Storage notes</p>
            <div className="mt-5 space-y-5">
              {storageSteps.map((step) => (
                <section key={step.title} className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/70">
                  <h2 className="text-base font-semibold text-slate-950">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </section>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-blue-100 bg-blue-50 p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Out of scope for this PR</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">CDN-backed production storage</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            This PR intentionally keeps the file in public for demo review only. The next implementation step should replace
            the demo source URL with a QueryPie-owned media URL backed by object storage, CDN caching, and an HLS-first
            encoding workflow where appropriate.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
