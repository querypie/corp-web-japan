export function InternalEventsDemoEmptyState() {
  return (
    <section className="relative mb-16 min-h-[240px] overflow-hidden border bg-white" style={{ borderColor: "#f4efe6" }}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#f4efe6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#f4efe6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="flex min-h-[240px] items-center justify-center px-6 py-12 text-center md:px-10">
        <div className="relative z-10 mx-auto max-w-4xl -translate-y-[10px] bg-white/88 px-6 py-4 backdrop-blur-[1px]">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center text-slate-300">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3.75" y="5.25" width="16.5" height="15" rx="2.25" />
              <path d="M8 3.75v3M16 3.75v3M3.75 9.75h16.5" />
              <path d="M8.25 13h3M8.25 16h7.5" />
            </svg>
          </div>
          <h2 className="mb-2 text-[32px] font-semibold leading-[1.3] tracking-[-0.01em] text-slate-900">
            現在予定されているイベントはありません。
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.6] text-slate-500">
            最新のお知らせをお待ちください。業界リーダーのインサイトや技術セミナーの日程はまもなく更新される予定です。
          </p>
        </div>
      </div>
    </section>
  );
}
