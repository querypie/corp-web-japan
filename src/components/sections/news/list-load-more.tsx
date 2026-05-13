"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProgressiveLoadMore } from "@/components/ui/progressive-load-more";
import type { NewsPublicationListItem } from "@/lib/publications/news/records";
import {
  DEFAULT_RESOURCE_LIST_CHUNK_SIZE,
  getResourceListLoadedRange,
  getResourceListNextVisibleCount,
} from "@/lib/resource-list-load-more";
import { NewsArticleList } from "./list-page";

type NewsArticleLoadMoreProps = {
  items: readonly NewsPublicationListItem[];
  initialVisibleCount: number;
  chunkSize?: number;
};

export function NewsArticleLoadMore({
  items,
  initialVisibleCount,
  chunkSize = DEFAULT_RESOURCE_LIST_CHUNK_SIZE,
}: NewsArticleLoadMoreProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState(() => Math.min(Math.max(initialVisibleCount, 0), items.length));

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

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
    if (visibleCount >= items.length) {
      return;
    }

    const nextVisibleCount = getResourceListNextVisibleCount(visibleCount, items.length, chunkSize);
    setVisibleCount(nextVisibleCount);

    startTransition(() => {
      updateUntilParam(nextVisibleCount);
    });
  }

  return (
    <>
      <NewsArticleList items={visibleItems} />
      <ProgressiveLoadMore
        currentCount={visibleItems.length}
        totalCount={items.length}
        onLoadMore={handleLoadMore}
        isLoading={isPending}
      />
    </>
  );
}
