import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

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
            이 페이지는 공개 전환 대상이 아닌 internal 전용 허브입니다. 현재 저장소에 있는 하위 데모 페이지를 한곳에 모아,
            UX 실험, MDX 렌더링 검증, 상호작용 확인을 빠르게 이동하면서 검토할 수 있도록 구성했습니다.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <Link
            href={"/internal/whitepaper-gating-demo"}
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-500">Whitepaper gating</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-slate-700">
              Whitepaper Gating Demo
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              MDX 본문을 preview 와 gated 구간으로 나누고, unlock 상태에 따라 같은 페이지 안에서 이어서 보여주는 흐름을
              확인할 수 있습니다.
            </p>
          </Link>

          <Link
            href={"/internal/mdx-list-demo"}
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-500">List UX</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-slate-700">
              MDX List Demo
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Sidebar, 카드형 목록, CTA 박스를 조합한 MDX 기반 리소스 리스트 UX 예시입니다. 공통 list 패턴을 route 단에서
              어떻게 authoring 하는지 살펴볼 수 있습니다.
            </p>
          </Link>

          <Link
            href={"/internal/load-more"}
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-500">Interaction</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 group-hover:text-slate-700">
              Load More Demo
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              공개 blog / whitepapers 동작을 건드리지 않고, internal 라우트에서만 load-more 버튼과 URL 복원 동작을
              별도로 확인할 수 있는 데모입니다.
            </p>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
