"use client";

import { useState, useRef } from "react";
import { IconMic, IconGallery, IconThumbsUp, IconHeart, IconX } from "../icons";
import { useComments, useCreateComment, useReplyToComment } from "@/hooks/useComments";
import { useToggleCommentReaction } from "@/hooks/useReactions";
import { useAuth } from "@/lib/AuthContext";
import { getAccessToken } from "@/lib/apiClient";
import type { UploadResult, Comment } from "@/lib/types";
import ReactionsModal from "./ReactionsModal";
import Link from "next/link";

const REACTIONS = [
  { type: "LIKE", emoji: "\u{1F44D}" },
  { type: "LOVE", emoji: "\u2764\uFE0F" },
  { type: "HAHA", emoji: "\u{1F604}" },
  { type: "WOW", emoji: "\u{1F62E}" },
  { type: "SAD", emoji: "\u{1F622}" },
  { type: "ANGRY", emoji: "\u{1F621}" },
];

export default function CommentSection({ postId, textareaRef }: { postId: string; textareaRef?: React.RefObject<HTMLTextAreaElement | null> }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(postId);
  const createComment = useCreateComment(postId);
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video"; file?: File }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reactionsModal, setReactionsModal] = useState<{ comment: Comment } | null>(null);

  const comments = data?.pages.flatMap((p) => p.data) ?? [];

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${getAccessToken()}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    const result: UploadResult = json?.data ?? json;
    return result.url;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const type = file.type.startsWith("video/") ? "video" as const : "image" as const;
        const url = await uploadFile(file);
        setMedia((prev) => [...prev, { url, type }]);
      }
    } catch {
      console.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;
    createComment.mutate(
      { content: text, media: media.length > 0 ? media.map((m) => ({ url: m.url, type: m.type })) : undefined },
      {
        onSuccess: () => {
          setText("");
          setMedia([]);
        },
      }
    );
  };

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <img src={user?.avatar || "/images/comment_img.png"} alt="" className="_comment_img" />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  ref={textareaRef}
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                {media.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {media.map((m, i) => (
                      <div key={i} style={{ position: "relative", width: 64, height: 64 }}>
                        {m.type === "video" ? (
                          <video src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
                        ) : (
                          <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(i)}
                          style={{
                            position: "absolute", top: -6, right: -6, width: 18, height: 18,
                            borderRadius: "50%", border: "none", background: "#000", color: "#fff",
                            fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <IconX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <button type="button" className="_feed_inner_comment_box_icon_btn">
                <IconMic />
              </button>
              <button type="button" className="_feed_inner_comment_box_icon_btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? <span style={{ fontSize: 10 }}>...</span> : <IconGallery />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="_timline_comment_main">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            currentUserId={user?.id}
            onShowReactions={() => setReactionsModal({ comment })}
          />
        ))}
      </div>
      {reactionsModal && (
        <ReactionsModal
          reactions={(reactionsModal.comment.reactions || []) as any}
          onClose={() => setReactionsModal(null)}
        />
      )}
    </>
  );
}

function CommentItem({
  comment,
  postId,
  currentUserId,
  depth = 0,
  onShowReactions,
}: {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  depth?: number;
  onShowReactions: () => void;
}) {
  const toggleReaction = useToggleCommentReaction(comment.id);
  const replyMutation = useReplyToComment(postId);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const timeAgo = getTimeAgo(comment.createdAt);
  const myReaction = comment.myReaction;
  const reactionCount = comment._count?.reactions ?? 0;
  const reactionUsers = comment.reactions?.slice(0, 5) ?? [];

  const handleLikeToggle = () => {
    toggleReaction.mutate("LIKE");
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyMutation.mutate(
      { parentId: comment.id, content: replyText },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplyForm(false);
        },
      }
    );
  };

  const marginLeft = depth > 0 ? 40 : 0;

  return (
    <div className="_comment_main" style={{ marginLeft }}>
      <div className="_comment_image">
        <Link href="#0" className="_comment_image_link">
          <img src={comment.author.avatar || "/images/txt_img.png"} alt="" className="_comment_img1" />
        </Link>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <Link href="#0">
                <h4 className="_comment_name_title">{comment.author.name}</h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text"><span>{comment.content}</span></p>
          </div>
          {comment.media && comment.media.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {comment.media.map((m) => (
                <div key={m.id} style={{ width: 100, height: 100, borderRadius: 6, overflow: "hidden" }}>
                  {m.type === "video" ? (
                    <video src={m.url} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              ))}
            </div>
          )}
          <div
            className="_total_reactions"
            style={{ cursor: reactionCount > 0 ? "pointer" : "default" }}
            onClick={reactionCount > 0 ? onShowReactions : undefined}
          >
            <div className="_total_react">
              <span className="_reaction_like">
                <IconThumbsUp />
              </span>
              <span className="_reaction_heart">
                <IconHeart />
              </span>
            </div>
            <span className="_total">{reactionCount}</span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <span
                    onClick={handleLikeToggle}
                    style={{ cursor: "pointer", color: myReaction ? "#377DFF" : undefined, fontWeight: myReaction ? 600 : undefined }}
                  >
                    {myReaction ? "Liked" : "Like"}
                  </span>
                </li>
                <li>
                  <span onClick={() => setShowReplyForm(!showReplyForm)} style={{ cursor: "pointer" }}>Reply</span>
                </li>
                <li><span>Share</span></li>
                <li><span className="_time_link">.{timeAgo}</span></li>
              </ul>
            </div>
          </div>
        </div>
        {showReplyForm && (
            <div className="_feed_inner_comment_box" style={{ marginTop: 12 , marginBottom: 12}}>
              <form className="_feed_inner_comment_box_form" onSubmit={handleReply}>
                <div className="_feed_inner_comment_box_content">
                  <div className="_feed_inner_comment_box_content_image">
                    <img src={currentUserId ? "/images/comment_img.png" : "/images/comment_img.png"} alt="" className="_comment_img" />
                  </div>
                  <div className="_feed_inner_comment_box_content_txt">
                    <textarea
                      className="form-control _comment_textarea"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(e);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="_feed_inner_comment_box_icon">
                  <button type="button" className="_feed_inner_comment_box_icon_btn">
                    <IconMic />
                  </button>
                  <button type="button" className="_feed_inner_comment_box_icon_btn" onClick={() => fileInputRef.current?.click()}>
                    <IconGallery />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} />
                </div>
              </form>
            </div>
          )}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ width: "100%" }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
                depth={depth + 1}
                onShowReactions={onShowReactions}
              />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
