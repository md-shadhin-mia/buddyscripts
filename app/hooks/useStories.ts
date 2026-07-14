"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { Story } from "@/lib/types";

export function useStories() {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => api.get<Story[]>("/api/stories"),
  });
}

export function useCreateStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { imageUrl: string; content?: string }) =>
      api.post<Story>("/api/stories", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stories"] }),
  });
}

export function useViewStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (storyId: string) => api.post(`/api/stories/${storyId}/view`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stories"] }),
  });
}

export function useDeleteStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (storyId: string) => api.delete(`/api/stories/${storyId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stories"] }),
  });
}
