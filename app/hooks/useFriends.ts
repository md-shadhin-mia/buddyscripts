"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { FriendRequest, Friendship } from "@/lib/types";

export function useFriends() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: () => api.get<{ data: Friendship[] }>("/api/friends?limit=50"),
  });
}

export function useFriendRequests() {
  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: () => api.get<{ data: FriendRequest[] }>("/api/friend-requests"),
  });
}

export function useSendFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (receiverId: string) =>
      api.post("/api/friend-requests", { receiverId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friendRequests"] }),
  });
}

export function useAcceptFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/api/friend-requests/${id}/accept`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["friendRequests"] });
      qc.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}

export function useDeclineFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/api/friend-requests/${id}/decline`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friendRequests"] }),
  });
}

export function useUnfriend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => api.delete(`/api/friends/${friendId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}
