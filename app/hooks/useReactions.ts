"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { Reaction } from "@/lib/types";

export function useToggleReaction(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (type: string) => {
      await api.post(`/api/posts/${postId}/reactions`, { type });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useToggleCommentReaction(commentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (type: string) => {
      await api.post(`/api/comments/${commentId}/reactions`, { type });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function usePostReactions(postId: string) {
  return useQuery<Reaction[]>({
    queryKey: ["post-reactions", postId],
    queryFn: () => api.get(`/api/posts/${postId}/reactions`),
  });
}

export function useCommentReactions(commentId: string) {
  return useQuery<Reaction[]>({
    queryKey: ["comment-reactions", commentId],
    queryFn: () => api.get(`/api/comments/${commentId}/reactions`),
  });
}
