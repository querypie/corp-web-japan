"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ResourceItem } from "@/content/resources";
import {
  DEFAULT_RESOURCE_LIST_CHUNK_SIZE,
  getResourceListLoadedRange,
  getResourceListNextVisibleCount,
} from "@/lib/resource-list-load-more";
import { ResourceListItems } from "./resource-list-section";

type ResourceListLoadMoreProps = {
  items: readonly ResourceItem[];
  initialVisibleCount: number;
  chunkSize?: number;
};

export function ResourceListLoadMore({
  items,
  initialVisibleCount,
  chunkSize = DEFAULT_RESOURCE_LIST_CHUNK_SIZE,
}: ResourceListLoadMoreProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState(() => Math.min(Math.max(initialVisibleCount, 0), items.length));

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const loadedRange = getResourceListLoadedRange(items, visibleCount);
  const canLoadMore = visibleCount < items.length;
  const remainingCount = Math.max(items.length - visibleCount, 0);

  const summaryLabel = canLoadMore
    ? `${items.length}件中 ${visibleItems.length}件を表示しています`
    : `全${items.length}件を表示しています`;
  const loadMoreLabel = `さらに${Math.min(chunkSize, remainingCount)}件を見る`;

  function updateUntilParam(nextVisibleCount: number) {
    const nextLoadedRange = getResourceListLoadedRange(items, nextVisibleCount);
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (nextLoadedRange && nextVisibleCount > Math.min(chunkSize, items.length)) {
      nextSearchParams.set("until", nextLoadedRange.oldestId);
    } else {
      nextSearchParams.delete("until");
    }

    const nextQueryString = nextSearchParams.toString();
    router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, { scroll: false });
  }

  function handleLoadMore() {
    if (!canLoadMore) {
      return;
    }

    const nextVisibleCount = getResourceListNextVisibleCount(visibleCount, items.length, chunkSize);
    setVisibleCount(nextVisibleCount);

    startTransition(() => {
      updateUntilParam(nextVisibleCount);
    });
  }

  return (
    <div className="min-w-0 flex-1">
      <ResourceListItems items={visibleItems} />

      {loadedRange ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50/80 px-5 py-5 text-center lg:mt-10 lg:px-6">
          <p className="text-sm font-medium leading-6 text-slate-700">{summaryLabel}</p>

          {canLoadMore ? (
            <p className="text-sm leading-6 text-slate-500">残り{remainingCount}件のコンテンツを続けてご覧いただけます。</p>
          ) : (
            <p className="text-sm leading-6 text-slate-500">気になる記事を選んで詳細をご確認ください。</p>
          )}

          {canLoadMore ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isPending}
              className="mt-1 inline-flex min-h-[52px] items-center justify-center rounded-[999px] border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "読み込み中..." : loadMoreLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
