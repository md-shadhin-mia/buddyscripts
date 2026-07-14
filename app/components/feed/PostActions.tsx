"use client";

import { useState, useRef } from "react";
import { IconComment, IconShare } from "../icons";
import { useToggleReaction, usePostReactions } from "@/hooks/useReactions";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/Toast";
import ReactionsModal from "./ReactionsModal";

const REACTIONS = [
  { type: "LIKE", emoji: "\u{1F44D}", label: "Like" },
  { type: "LOVE", emoji: "\u2764\uFE0F", label: "Love" },
  { type: "HAHA", emoji: "\u{1F604}", label: "Haha" },
  { type: "WOW", emoji: "\u{1F62E}", label: "Wow" },
  { type: "SAD", emoji: "\u{1F622}", label: "Sad" },
  { type: "ANGRY", emoji: "\u{1F621}", label: "Angry" },
];

export default function PostActions({
  postId,
  reactions,
  onCommentClick,
}: {
  postId: string;
  reactions?: { type: string; userId: string; user?: { id: string; name: string; avatar: string | null } }[];
  onCommentClick?: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const toggleReaction = useToggleReaction(postId);
  const { data: allReactions } = usePostReactions(postId);
  const [showReactions, setShowReactions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myReaction = reactions?.find((r) => r.userId === user?.id);
  const currentType = myReaction?.type ?? null;
  const currentEmoji = REACTIONS.find((r) => r.type === currentType)?.emoji ?? null;

  const cancelHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const delayedHide = () => {
    cancelHide();
    hideTimerRef.current = setTimeout(() => setShowReactions(false), 300);
  };

  const handleReact = (type: string) => {
    cancelHide();
    toggleReaction.mutate(type, {
      onError: () => showToast("Failed to add reaction. Please try again."),
    });
    setShowReactions(false);
  };

  const handleViewReactions = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="_feed_inner_timeline_reaction position-relative">
        <div
          className="_feed_reaction_wrap"
          onMouseEnter={() => { cancelHide(); setShowReactions(true); }}
          onMouseLeave={delayedHide}
        >
          <button
            className={
              "_feed_inner_timeline_reaction_emoji _feed_reaction" +
              (currentType ? " _feed_reaction_active" : "")
            }
            onMouseEnter={(e) => { e.stopPropagation(); cancelHide(); setShowReactions(true); }}
            disabled={toggleReaction.isPending}
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span>{currentEmoji ?? "Reaction"}</span>
            </span>
          </button>
          {showReactions && (
            <div className="_reaction_picker">
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  className={
                    "_reaction_picker_btn" +
                    (r.type === currentType ? " _reaction_picker_btn_active" : "")
                  }
                  onClick={(e) => { e.stopPropagation(); handleReact(r.type); }}
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction" onClick={onCommentClick}>
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <IconComment className="_reaction_svg" />
              Comment
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <IconShare size={24} className="_reaction_svg" />
              Share
            </span>
          </span>
        </button>
      </div>
      {showModal && allReactions && (
        <ReactionsModal reactions={allReactions as any} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
