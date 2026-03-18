"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { usePostsStore } from "@/stores/posts";
import { useEffect } from "react";
import type { PostStatus, ScheduledPost } from "@/stores/posts";

export interface DbPost {
  id: string;
  content: string;
  media_urls: string[];
  media_type: string;
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  sns_account_id: string;
  sns_accounts?: {
    id: string;
    platform: string;
    username: string;
    display_name: string;
  };
}

/** DB row → 클라이언트 ScheduledPost */
function dbToLocal(row: DbPost): ScheduledPost {
  return {
    id: row.id,
    accountId: row.sns_account_id,
    platform: row.sns_accounts?.platform || "instagram",
    content: row.content || "",
    mediaUrls: row.media_urls || [],
    status: row.status,
    scheduledAt: row.scheduled_at,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

/** Supabase + Zustand 통합 게시물 hook */
export function usePosts(status?: PostStatus) {
  const store = usePostsStore();
  const supabase = createClient();

  const { data: dbPosts, isLoading } = useQuery<DbPost[]>({
    queryKey: ["posts", status ?? "all"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("posts")
        .select(`
          id, content, media_urls, media_type,
          status, scheduled_at, published_at, created_at,
          sns_account_id,
          sns_accounts:sns_account_id (
            id, platform, username, display_name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) {
        console.error("Failed to fetch posts:", error);
        return [];
      }
      return (data || []) as unknown as DbPost[];
    },
    staleTime: 30_000,
    retry: false,
  });

  // Supabase 데이터를 Zustand 스토어에 동기화
  useEffect(() => {
    if (!dbPosts) return;
    const localPosts = dbPosts.map(dbToLocal);
    // OAuth 게시물만 교체, 로컬 임시 게시물 유지
    store.syncFromSupabase?.(localPosts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbPosts]);

  // 스토어에 없는 DB 게시물 합치기
  const dbIds = new Set((dbPosts || []).map((p) => p.id));
  const localOnly = store.posts.filter((p) => !dbIds.has(p.id));
  const allPosts = [...(dbPosts || []).map(dbToLocal), ...localOnly];

  return { posts: allPosts, isLoading };
}

/** 게시물 생성 (Supabase 우선, 폴백은 로컬) */
export function useCreatePost() {
  const queryClient = useQueryClient();
  const addLocalPost = usePostsStore((s) => s.addPost);
  const supabase = createClient();

  return useMutation({
    mutationFn: async (payload: {
      sns_account_id: string;
      content: string;
      media_urls?: string[];
      media_type?: string;
      status: PostStatus;
      scheduled_at?: string | null;
      source_type?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "게시물 생성 실패");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (_, variables) => {
      // Supabase 실패 시 로컬에 저장 (데모 모드 폴백)
      addLocalPost({
        accountId: variables.sns_account_id,
        platform: "instagram",
        content: variables.content,
        mediaUrls: variables.media_urls || [],
        status: variables.status,
        scheduledAt: variables.scheduled_at || null,
        publishedAt: variables.status === "published" ? new Date().toISOString() : null,
      });
    },
  });
}

/** 게시물 삭제 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  const deleteLocal = usePostsStore((s) => s.deletePost);

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        // 로컬만 삭제
        deleteLocal(id);
        return;
      }
    },
    onSuccess: (_, id) => {
      deleteLocal(id);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (_, id) => {
      deleteLocal(id);
    },
  });
}
