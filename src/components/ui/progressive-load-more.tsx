import React from "react";

type ProgressiveLoadMoreProps = {
  currentCount: number;
  totalCount: number;
  onLoadMore: () => void;
  isLoading?: boolean;
};

export function ProgressiveLoadMore({
  currentCount,
  totalCount,
  onLoadMore,
  isLoading = false,
}: ProgressiveLoadMoreProps) {
  const safeTotalCount = Math.max(totalCount, 1);
  const progressPercentage = Math.min(Math.round((currentCount / safeTotalCount) * 100), 100);

  if (currentCount >= totalCount) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center space-y-8 py-12 font-sans">
      <div className="w-full max-w-sm space-y-3">
        <div className="flex items-end justify-between">
          <p className="text-[13px] font-medium tracking-tight text-slate-500">
            Displaying <span className="font-semibold text-slate-900">{currentCount}</span> of {totalCount} articles
          </p>
          <p className="text-[13px] font-bold tracking-tighter text-slate-900">{progressPercentage}%</p>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-700 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        className="group flex items-center justify-center space-x-2 rounded-md border border-slate-200 bg-white px-8 py-3 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        ) : (
          <span className="flex translate-x-[6px] items-center space-x-2">
            <span className="text-sm font-semibold text-slate-900">Load More</span>
            <svg
              className="h-4 w-4 text-slate-400 transition-all duration-200 group-hover:translate-y-0.5 group-hover:text-slate-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}

export default ProgressiveLoadMore;
