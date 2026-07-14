"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { Post, PaginatedResponse } from "@/lib/types";

export function useFeed() {
  return useInfiniteQuery<PaginatedResponse<Post>>({
    queryKey: ["feed"],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;
      const path = cursor ? `/api/posts?limit=10&cursor=${cursor}` : "/api/posts?limit=10";
      return api.get<PaginatedResponse<Post>>(path);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; imageUrl?: string; media?: { url: string; type: "image" | "video" }[]; visibility?: string }) =>
      api.post<Post>("/api/posts", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.delete(`/api/posts/${postId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useSavePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.post(`/api/posts/${postId}/save`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useUnsavePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.delete(`/api/posts/${postId}/save`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}
