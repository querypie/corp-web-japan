import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface ScheduledPost {
  id: string;
  accountId: string;
  platform: string;
  content: string;
  mediaUrls: string[];
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface PostsState {
  posts: ScheduledPost[];
  addPost: (post: Omit<ScheduledPost, "id" | "createdAt">) => void;
  updatePost: (id: string, updates: Partial<ScheduledPost>) => void;
  deletePost: (id: string) => void;
  syncFromSupabase: (dbPosts: ScheduledPost[]) => void;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set) => ({
      posts: [],
      addPost: (post) =>
        set((state) => ({
          posts: [
            {
              ...post,
              id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: new Date().toISOString(),
            },
            ...state.posts,
          ],
        })),
      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      // Supabase에서 가져온 posts로 교체 (로컬 임시 posts 보존)
      syncFromSupabase: (dbPosts) =>
        set((state) => {
          const dbIds = new Set(dbPosts.map((p) => p.id));
          const localOnly = state.posts.filter(
            (p) => p.id.startsWith("post-") && !dbIds.has(p.id)
          );
          return { posts: [...dbPosts, ...localOnly] };
        }),
    }),
    {
      name: "JP_WEB-posts",
      // 로컬 임시 posts만 localStorage에 저장 (Supabase posts는 제외)
      partialize: (state) => ({
        posts: state.posts.filter((p) => p.id.startsWith("post-")),
      }),
    }
  )
);
