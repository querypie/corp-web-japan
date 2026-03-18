"use client";

import { HomePageSections } from "@/components/sections/home-page-sections";

export function DashboardClient({ displayName }: { displayName: string }) {
  return (
    <div className="space-y-10 py-6 lg:py-0">
      <div className="mx-auto max-w-7xl px-2 lg:px-0">
        <div className="rounded-[1.75rem] border border-black/6 bg-white px-6 py-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.14)]">
          <p className="text-sm font-medium text-gray-500">안녕하세요, {displayName}님!</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            공개 메인과 동일한 홈 섹션입니다.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            랜딩에서 보여주는 핵심 메시지와 섹션 구성을 메인 홈에서도 그대로 확인할 수 있도록 연결했습니다.
          </p>
        </div>
      </div>
      <div className="-mx-4 lg:-mx-8">
        <HomePageSections />
      </div>
    </div>
  );
}
