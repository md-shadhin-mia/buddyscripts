"use client";

import { useState, useRef, useCallback } from "react";
import { IconEditText, IconPhoto, IconVideo, IconSend, IconX, IconCheck, IconAlertCircle, IconRefresh, IconChevronDown } from "../icons";
import { useCreatePost } from "@/hooks/useFeed";
import { useAuth } from "@/lib/AuthContext";
import { uploadFile } from "@/lib/upload";
import { useToast } from "@/components/ui/Toast";

type MediaStatus = "uploading" | "done" | "failed";

type MediaItem = {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
  status: MediaStatus;
  progress: number;
  url?: string;
};

type Visibility = "PUBLIC" | "FRIENDS" | "PRIVATE";

const VISIBILITY_LABELS: Record<Visibility, string> = {
  PUBLIC: "Public",
  FRIENDS: "Friends",
  PRIVATE: "Private",
};

let mediaIdCounter = 0;

export default function CreatePost() {
  const { user } = useAuth();
  const createPost = useCreatePost();
  const { showToast } = useToast();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [posting, setPosting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const uploadMediaItem = useCallback(async (item: MediaItem) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: "uploading", progress: 0 } : m))
    );
    try {
      const url = await uploadFile(item.file, (progress) => {
        setMedia((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, progress } : m))
        );
      });
      setMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: "done", progress: 100, url } : m))
      );
    } catch {
      setMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: "failed" } : m))
      );
    }
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: MediaItem[] = Array.from(files).map((file) => ({
      id: String(++mediaIdCounter),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      status: "uploading" as MediaStatus,
      progress: 0,
    }));
    setMedia((prev) => [...prev, ...newItems]);
    newItems.forEach(uploadMediaItem);
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(media[index].preview);
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setContent("");
    setMedia([]);
  };

  const handlePost = async () => {
    if (!content.trim() && media.length === 0) return;
    setPosting(true);
    try {
      const doneItems = media.filter((m) => m.status === "done");
      const mediaData = doneItems.map((m) => ({ url: m.url!, type: m.type }));
      await createPost.mutateAsync({ content, media: mediaData.length > 0 ? mediaData : undefined, visibility });
      resetForm();
    } catch {
      showToast("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const allUploaded = media.every((m) => m.status === "done");
  const hasUnuploaded = media.some((m) => m.status !== "done");

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img src={user?.avatar || "/images/txt_img.png"} alt="Image" className="_txt_img" />
        </div>
        <div className="_feed_inner_text_area_box_form">
          <textarea
            className="_textarea"
            placeholder="..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
          {!content && (
            <span className="_feed_textarea_label">
              <IconEditText /> Write something ...
            </span>
          )}
        </div>
      </div>

      {media.length > 0 && (
        <div className="_create_post_media_grid" style={{ margin: "8px 0" }}>
          {media.map((item, i) => (
            <div className="_create_post_media_item" key={item.id}>
              {item.status === "uploading" && (
                <div className="_create_post_media_overlay">
                  <svg className="_create_post_media_progress" viewBox="0 0 40 40">
                    <circle className="_create_post_media_progress_bg" cx="20" cy="20" r="17" />
                    <circle
                      className="_create_post_media_progress_fg"
                      cx="20" cy="20" r="17"
                      strokeDasharray={`${106.8}`}
                      strokeDashoffset={`${106.8 - (item.progress / 100) * 106.8}`}
                    />
                  </svg>
                  <span className="_create_post_media_progress_text">{item.progress}%</span>
                </div>
              )}
              {item.status === "done" && (
                <div className="_create_post_media_overlay _create_post_media_overlay_done">
                  <IconCheck size={28} />
                </div>
              )}
              {item.status === "failed" && (
                <div className="_create_post_media_overlay _create_post_media_overlay_failed">
                  <IconAlertCircle size={22} />
                  <button
                    type="button"
                    className="_create_post_media_retry"
                    onClick={() => uploadMediaItem(item)}
                    title="Retry"
                  >
                    <IconRefresh size={16} />
                  </button>
                </div>
              )}
              {item.type === "image" ? (
                <img src={item.preview} alt="" className="_create_post_media_img" />
              ) : (
                <video src={item.preview} className="_create_post_media_video" />
              )}
              <button type="button" className="_create_post_media_remove" onClick={() => removeMedia(i)}>
                <IconX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />

      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          <div className="_feed_inner_text_area_bottom_photo _feed_common">
            <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => imageInputRef.current?.click()}>
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img"><IconPhoto /></span>
              Photo
            </button>
          </div>
          <div className="_feed_inner_text_area_bottom_video _feed_common">
            <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => videoInputRef.current?.click()}>          
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img"><IconVideo /></span>
              Video
            </button>
          </div>
          <div className="_feed_common" style={{ position: "relative" }}>
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
              onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
              onMouseEnter={() => setShowVisibilityDropdown(true)}
              style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}
            >
              {VISIBILITY_LABELS[visibility]}
              <IconChevronDown />
            </button>
            {showVisibilityDropdown && (
              <div
                style={{
                  position: "absolute", bottom: "100%", left: 0, background: "#fff",
                  borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.15)", zIndex: 10,
                  minWidth: 120, overflow: "hidden",
                }}
                onMouseLeave={() => setShowVisibilityDropdown(false)}
              >
                {(Object.entries(VISIBILITY_LABELS) as [Visibility, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    style={{
                      display: "block", width: "100%", padding: "8px 12px", border: "none",
                      background: visibility === key ? "#f0f0f0" : "#fff",
                      cursor: "pointer", fontSize: 13, textAlign: "left",
                    }}
                    onClick={() => { setVisibility(key); setShowVisibilityDropdown(false); }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#f5f5f5"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.background = visibility === key ? "#f0f0f0" : "#fff"; }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="_feed_inner_text_area_btn">
          <button
            type="button"
            className="_feed_inner_text_area_btn_link"
            onClick={handlePost}
            disabled={posting || (!content.trim() && media.length === 0) || (media.length > 0 && !allUploaded)}
          >
            <IconSend className="_mar_img" /> <span>{posting ? "Posting..." : hasUnuploaded ? "Uploading..." : "Post"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
