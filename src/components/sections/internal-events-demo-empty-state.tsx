export function InternalEventsDemoEmptyState() {
  return (
    <section className="mb-16 overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_100%)] p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div className="max-w-[560px]">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Coming Soon
          </span>
          <h2 className="mt-5 text-[32px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 lg:text-[40px]">
            まだ予定されているイベント、カンファレンス、ウェビナーはありません。
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 lg:text-[17px]">
            新しいイベントの公開準備中です。次回の開催情報が整い次第、このエリアにヒーローイベントとして表示されます。
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
            Event showcase is being prepared
          </div>
        </div>

        <div className="relative min-h-[260px] rounded-[24px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
            Preparing
          </div>

          <div className="flex h-full flex-col justify-between gap-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="h-4 w-24 rounded-full bg-slate-200" aria-hidden="true" />
                <div className="h-8 w-40 rounded-full bg-slate-900" aria-hidden="true" />
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sky-100 text-sky-700 shadow-inner shadow-sky-200/60">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3.75" y="5.25" width="16.5" height="15" rx="2.25" />
                  <path d="M8 3.75v3M16 3.75v3M3.75 9.75h16.5" />
                  <path d="M8.25 13h3M8.25 16h7.5" />
                </svg>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Next Webinar", value: "TBD" },
                { label: "Conference", value: "Planning" },
                { label: "Registration", value: "Opening Soon" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[20px] border border-dashed border-sky-200 bg-sky-50/80 px-5 py-4 text-sm leading-6 text-slate-600">
              Once a hero event is ready, this area will highlight the event image, category, event summary, and CTA.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
