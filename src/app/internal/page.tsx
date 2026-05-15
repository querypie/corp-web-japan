import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const internalDemoCards = [
  {
    eyebrow: "Whitepaper gating",
    title: "Whitepaper Gating Demo",
    href: "/internal/whitepaper-gating-demo",
    description:
      "MDX 본문을 preview 와 gated 구간으로 나누고, unlock 상태에 따라 같은 페이지 안에서 이어서 보여주는 흐름을 확인할 수 있습니다.",
  },
  {
    eyebrow: "List UX",
    title: "MDX List Demo",
    href: "/internal/mdx-list-demo",
    description:
      "Sidebar, 카드형 목록, CTA 박스를 조합한 MDX 기반 리소스 리스트 UX 예시입니다. 공통 list 패턴을 route 단에서 어떻게 authoring 하는지 살펴볼 수 있습니다.",
  },
  {
    eyebrow: "Events",
    title: "Events Demo",
    href: "/internal/events-demo",
    description:
      "events 목록 페이지를 바꾸기 전에, 현재 local event publication 데이터를 그대로 사용한 리스트 구성을 internal 경로에서 먼저 확인할 수 있는 데모입니다.",
  },
  {
    eyebrow: "Interaction",
    title: "Load More Demo",
    href: "/internal/load-more",
    description:
      "공개 blog / whitepapers 동작을 건드리지 않고, internal 라우트에서만 load-more 버튼과 URL 복원 동작을 별도로 확인할 수 있는 데모입니다.",
  },
  {
    eyebrow: "Video",
    title: "Video Playback Demo",
    href: "/internal/video",
    description:
      "public 디렉터리의 MP4 파일을 native video player 로 재생하면서, 이후 CDN 기반 media URL 로 바꿀 수 있는 self-hosted video 계약을 확인하는 데모입니다.",
  },
  {
    eyebrow: "Sections",
    title: "Demo Sections",
    href: "/internal/demo-sections",
    description:
      "삭제 대신 보존한 orphan section component 들을 internal 경로에서 단독 렌더링해, card / slider / modal UI 디자인을 빠르게 확인할 수 있는 데모입니다.",
  },
] as const;

export const metadata: Metadata = {
  title: "Internal Demos | QueryPie AI",
  alternates: {
    canonical: "/internal",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function InternalPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="px-6 pb-8 pt-20 sm:px-10 lg:px-16 lg:pb-10 lg:pt-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Internal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            내부 데모와 검증용 페이지 모음
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            이 페이지는 공개 전환 대상이 아닌 internal 전용 허브입니다. 현재 사용 가능한 internal 데모 {internalDemoCards.length}
            개를 모아둔 허브로, UX 실험, MDX 렌더링 검증, 상호작용 확인을 빠르게 이동하면서 검토할 수 있도록 구성했습니다.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            모든 internal 페이지는 검색 엔진 색인에서 제외됩니다.
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {internalDemoCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-slate-500">{card.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-slate-700">
                {card.title}
              </h2>
              <p className="mt-3 text-xs font-medium tracking-wide text-slate-400">{card.href}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
