"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { PostStatus } from "@/stores/posts";
import { usePosts, useDeletePost } from "@/hooks/use-posts";
import { useAccounts } from "@/hooks/use-accounts";
import { toast } from "sonner";

type ViewMode = "calendar" | "list";

const statusConfig: Record<
  PostStatus,
  { label: string; color: string; dot: string }
> = {
  published: {
    label: "발행됨",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  scheduled: {
    label: "예약됨",
    color: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
  },
  draft: {
    label: "임시저장",
    color: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  failed: {
    label: "실패",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [activeFilters, setActiveFilters] = useState<PostStatus[]>([
    "published",
    "scheduled",
    "draft",
    "failed",
  ]);
  const [listTab, setListTab] = useState<"all" | PostStatus>("all");

  const { posts } = usePosts();
  const deletePost = useDeletePost();
  const { accounts } = useAccounts();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

  const getPostDate = (post: (typeof posts)[0]) => {
    return post.scheduledAt || post.publishedAt || post.createdAt;
  };

  const getPostsForDay = (d: Date) => {
    return posts.filter((post) => {
      if (!activeFilters.includes(post.status)) return false;
      const postDate = getPostDate(post);
      return postDate && isSameDay(parseISO(postDate), d);
    });
  };

  const filteredPosts = posts
    .filter((post) => {
      if (listTab !== "all" && post.status !== listTab) return false;
      const postDate = getPostDate(post);
      if (!postDate) return true;
      const d = parseISO(postDate);
      return d >= monthStart && d <= monthEnd;
    })
    .sort((a, b) => {
      const dateA = getPostDate(a) || "";
      const dateB = getPostDate(b) || "";
      return dateB.localeCompare(dateA);
    });

  const getAccountName = (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    return acc ? `@${acc.username}` : "알 수 없는 계정";
  };

  const todayPosts = posts.filter((post) => {
    const postDate = getPostDate(post);
    return (
      postDate &&
      isSameDay(parseISO(postDate), new Date()) &&
      post.status === "scheduled"
    );
  });

  const toggleFilter = (status: PostStatus) => {
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleDelete = (id: string) => {
    deletePost.mutate(id, {
      onSuccess: () => toast.success("게시물이 삭제되었습니다."),
      onError: () => toast.error("삭제에 실패했습니다."),
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">콘텐츠 캘린더</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            전체 {posts.length}개의 게시물
          </span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6 flex items-center gap-2 text-sm text-blue-700">
        <CalendarIcon size={16} />
        {todayPosts.length > 0
          ? `오늘 예정된 포스팅 ${todayPosts.length}건이 있습니다`
          : "오늘 예정된 포스팅이 없습니다"}
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all",
              viewMode === "calendar"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            )}
          >
            <CalendarIcon size={16} /> 캘린더
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all",
              viewMode === "list"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            )}
          >
            <List size={16} /> 리스트
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          {viewMode === "calendar" ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div />
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentDate(subMonths(currentDate, 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="이전 달"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-lg font-semibold">
                    {format(currentDate, "yyyy년 M월", { locale: ko })}
                  </h2>
                  <button
                    onClick={() =>
                      setCurrentDate(addMonths(currentDate, 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="다음 달"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  오늘
                </Button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50">
                  {weekDays.map((d) => (
                    <div
                      key={d}
                      className="py-3 text-center text-sm font-medium text-gray-500"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {days.map((d, i) => {
                    const dayPosts = getPostsForDay(d);
                    return (
                      <div
                        key={i}
                        className={cn(
                          "min-h-[100px] border-t border-r border-gray-100 p-2",
                          !isSameMonth(d, monthStart) && "bg-gray-50"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                            isToday(d) &&
                              "bg-violet-600 text-white font-bold",
                            !isSameMonth(d, monthStart) && "text-gray-300"
                          )}
                        >
                          {format(d, "d")}
                        </span>
                        <div className="mt-1 space-y-1">
                          {dayPosts.slice(0, 3).map((post) => {
                            const config = statusConfig[post.status];
                            return (
                              <div
                                key={post.id}
                                className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded truncate",
                                  config.color
                                )}
                                title={post.content}
                              >
                                {post.content.slice(0, 20)}
                              </div>
                            );
                          })}
                          {dayPosts.length > 3 && (
                            <p className="text-[10px] text-gray-400 pl-1">
                              +{dayPosts.length - 3}건
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">포스트</h2>
                <span className="text-sm text-gray-500">
                  {format(monthStart, "MMM dd")} -{" "}
                  {format(monthEnd, "MMM dd")}
                </span>
              </div>
              <div className="flex gap-1 mb-4 border-b border-gray-200">
                {(
                  [
                    { key: "all" as const, label: "전체" },
                    { key: "published" as const, label: "발행됨" },
                    { key: "scheduled" as const, label: "예약됨" },
                    { key: "draft" as const, label: "임시저장" },
                    { key: "failed" as const, label: "실패" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setListTab(tab.key)}
                    className={cn(
                      "px-4 py-2 text-sm transition-all border-b-2",
                      listTab === tab.key
                        ? "border-gray-900 text-gray-900 font-medium"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p>아직 생성된 게시물이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPosts.map((post) => {
                    const config = statusConfig[post.status];
                    const postDate = getPostDate(post);
                    return (
                      <div
                        key={post.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3"
                      >
                        <div
                          className={cn(
                            "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                            config.dot
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                config.color
                              )}
                            >
                              {config.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {getAccountName(post.accountId)} ·{" "}
                              {post.platform}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {post.content}
                          </p>
                          {postDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              {format(
                                parseISO(postDate),
                                "yyyy.MM.dd HH:mm",
                                { locale: ko }
                              )}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                          title="삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {viewMode === "calendar" && (
          <div className="w-64 space-y-4 hidden lg:block">
            <Link href="/scheduling">
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                <Plus size={16} className="mr-1" />새 콘텐츠 예약
              </Button>
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                상태 필터
              </p>
              <div className="space-y-2">
                {(Object.keys(statusConfig) as PostStatus[]).map(
                  (status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Checkbox
                        checked={activeFilters.includes(status)}
                        onCheckedChange={() => toggleFilter(status)}
                      />
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          statusConfig[status].dot
                        )}
                      />
                      {statusConfig[status].label}
                    </label>
                  )
                )}
              </div>
            </div>

            {posts.length === 0 && (
              <p className="text-sm text-gray-400 text-center">
                아직 생성된 게시물이 없습니다
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
