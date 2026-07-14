"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { Comment, PaginatedResponse } from "@/lib/types";

export function useComments(postId: string) {
  return useInfiniteQuery<PaginatedResponse<Comment>>({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;
      const path = cursor
        ? `/api/posts/${postId}/comments?limit=5&cursor=${cursor}`
        : `/api/posts/${postId}/comments?limit=5`;
      return api.get<PaginatedResponse<Comment>>(path);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCreateComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; parentId?: string; media?: { url: string; type: "image" | "video" }[] }) =>
      api.post<Comment>(`/api/posts/${postId}/comments`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}

export function useDeleteComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.delete(`/api/posts/${postId}/comments/${commentId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}

export function useReplyToComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ parentId, content, media }: { parentId: string; content: string; media?: { url: string; type: "image" | "video" }[] }) =>
      api.post<Comment>(`/api/posts/${postId}/comments/${parentId}/reply`, { content, media }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
  });
}
