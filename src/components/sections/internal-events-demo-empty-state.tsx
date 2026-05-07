export function InternalEventsDemoEmptyState() {
  return (
    <section className="relative mb-16 min-h-[400px] overflow-hidden border-b border-slate-100 bg-white">
      <div className="flex min-h-[400px] items-center justify-center px-6 py-16 text-center md:px-10">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center text-slate-300">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3.75" y="5.25" width="16.5" height="15" rx="2.25" />
              <path d="M8 3.75v3M16 3.75v3M3.75 9.75h16.5" />
              <path d="M8.25 13h3M8.25 16h7.5" />
            </svg>
          </div>
          <h2 className="mb-2 text-[32px] font-semibold leading-[1.3] tracking-[-0.01em] text-slate-900">
            현재 예정된 이벤트가 없습니다.
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.6] text-slate-500">
            새로운 소식을 기다려 주세요. 업계 리더들의 인사이트와 기술 세미나 일정이 곧 업데이트될 예정입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
