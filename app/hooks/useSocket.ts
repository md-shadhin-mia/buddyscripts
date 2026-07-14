"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { useAuth } from "@/lib/AuthContext";
import { getAccessToken } from "@/lib/apiClient";

export function useSocket() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setToken(null);
      return;
    }
    const t = getAccessToken();
    if (t) {
      setToken(t);
    } else {
      const id = setInterval(() => {
        const t2 = getAccessToken();
        if (t2) {
          setToken(t2);
          clearInterval(id);
        }
      }, 100);
      return () => clearInterval(id);
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);
    const handlers = {
      "notification:new": () => qc.invalidateQueries({ queryKey: ["notifications"] }),
      "notification:read": () => qc.invalidateQueries({ queryKey: ["notifications"] }),
      "friend_request:send": () => qc.invalidateQueries({ queryKey: ["friendRequests"] }),
      "friend_request:accepted": () => {
        qc.invalidateQueries({ queryKey: ["friendRequests"] });
        qc.invalidateQueries({ queryKey: ["friends"] });
      },
      "friend_request:declined": () => qc.invalidateQueries({ queryKey: ["friendRequests"] }),
    };

    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler);
    }

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && !socket.connected) {
        socket.connect();
      }
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      for (const [event, handler] of Object.entries(handlers)) {
        socket.off(event, handler);
      }
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [token, qc]);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
    }
  }, [user]);
}

export function useOnlineFriends(): string[] {
  const { user } = useAuth();
  const [online, setOnline] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    const handleOnline = ({ userId }: { userId: string }) => {
      setOnline((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    };

    const handleOffline = ({ userId }: { userId: string }) => {
      setOnline((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("presence:online", handleOnline);
    socket.on("presence:offline", handleOffline);

    return () => {
      socket.off("presence:online", handleOnline);
      socket.off("presence:offline", handleOffline);
    };
  }, [user]);

  return online;
}
