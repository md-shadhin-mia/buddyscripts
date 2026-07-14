"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { IconArrowRight, IconPlus, IconPlusMobile, IconX } from "../icons";
import { useAuth } from "@/lib/AuthContext";
import { useStories, useCreateStory, useViewStory, useDeleteStory } from "@/hooks/useStories";
import { uploadFile } from "@/lib/upload";
import { useToast } from "@/components/ui/Toast";
import type { Story, StoryGroup } from "@/lib/types";

function groupStories(stories: Story[]): StoryGroup[] {
  const map = new Map<string, StoryGroup>();
  for (const story of stories) {
    const key = story.authorId;
    if (!map.has(key)) {
      map.set(key, { user: story.author, stories: [] });
    }
    map.get(key)!.stories.push(story);
  }
  return Array.from(map.values());
}

export default function Stories() {
  const { user } = useAuth();
  const { data: stories, isLoading } = useStories();
  const createStory = useCreateStory();
  const viewStory = useViewStory();
  const deleteStory = useDeleteStory();
  const { showToast } = useToast();

  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number | null>(null);
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [createPreview, setCreatePreview] = useState<string | null>(null);
  const [createContent, setCreateContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const createInputRef = useRef<HTMLInputElement>(null);

  const groups = useMemo(() => groupStories(stories ?? []), [stories]);

  const selectedGroup = selectedGroupIdx !== null ? groups[selectedGroupIdx] : null;
  const currentStory = selectedGroup ? selectedGroup.stories[currentStoryIdx] : null;
  const isCurrentUser = currentStory?.authorId === user?.id;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (groupIdx: number, storyIdx: number) => {
      clearTimer();
      intervalRef.current = setInterval(() => {
        setCurrentStoryIdx((prev) => {
          const group = groups[groupIdx];
          if (!group) return prev;
          if (prev < group.stories.length - 1) {
            return prev + 1;
          }
          setSelectedGroupIdx(null);
          return prev;
        });
      }, 5000);
    },
    [groups, clearTimer]
  );

  useEffect(() => {
    if (selectedGroupIdx !== null && selectedGroup) {
      startTimer(selectedGroupIdx, currentStoryIdx);
    }
    return clearTimer;
  }, [selectedGroupIdx, currentStoryIdx, selectedGroup, startTimer, clearTimer]);

  useEffect(() => {
    if (currentStory && !currentStory.viewers.some((v) => v.userId === user?.id)) {
      viewStory.mutate(currentStory.id);
    }
  }, [currentStory, user?.id, viewStory]);

  const openStoryViewer = useCallback(
    (groupIdx: number) => {
      setSelectedGroupIdx(groupIdx);
      setCurrentStoryIdx(0);
    },
    []
  );

  const closeStoryViewer = useCallback(() => {
    setSelectedGroupIdx(null);
    setCurrentStoryIdx(0);
    clearTimer();
  }, [clearTimer]);

  const goNext = useCallback(() => {
    if (!selectedGroup) return;
    if (currentStoryIdx < selectedGroup.stories.length - 1) {
      setCurrentStoryIdx((prev) => prev + 1);
    } else {
      const nextGroup = selectedGroupIdx! + 1;
      if (nextGroup < groups.length) {
        setSelectedGroupIdx(nextGroup);
        setCurrentStoryIdx(0);
      } else {
        closeStoryViewer();
      }
    }
  }, [selectedGroup, selectedGroupIdx, currentStoryIdx, groups.length, closeStoryViewer]);

  const goPrev = useCallback(() => {
    if (currentStoryIdx > 0) {
      setCurrentStoryIdx((prev) => prev - 1);
    } else if (selectedGroupIdx! > 0) {
      const prevGroup = selectedGroupIdx! - 1;
      setSelectedGroupIdx(prevGroup);
      setCurrentStoryIdx(groups[prevGroup].stories.length - 1);
    }
  }, [currentStoryIdx, selectedGroupIdx, groups]);

  const handleSliderClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      if (x < rect.width / 2) {
        goPrev();
      } else {
        goNext();
      }
    },
    [goPrev, goNext]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedGroupIdx === null) return;
      if (e.key === "Escape") closeStoryViewer();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedGroupIdx, closeStoryViewer, goNext, goPrev]);

  const handleDeleteStory = useCallback(async () => {
    if (!currentStory) return;
    try {
      await deleteStory.mutateAsync(currentStory.id);
      showToast("Story deleted", "success");
      if (selectedGroup && selectedGroup.stories.length === 1) {
        closeStoryViewer();
      } else {
        goNext();
      }
    } catch {
      showToast("Failed to delete story");
    }
  }, [currentStory, selectedGroup, deleteStory, showToast, closeStoryViewer, goNext]);

  const handleCreateFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Only images are supported for stories");
      return;
    }
    setCreateImage(file);
    setCreatePreview(URL.createObjectURL(file));
  };

  const handleCreateSubmit = async () => {
    if (!createImage) return;
    setUploading(true);
    try {
      const imageUrl = await uploadFile(createImage);
      await createStory.mutateAsync({ imageUrl, content: createContent.trim() || undefined });
      showToast("Story created!", "success");
      setShowCreateModal(false);
      setCreateImage(null);
      setCreatePreview(null);
      setCreateContent("");
    } catch {
      showToast("Failed to create story");
    } finally {
      setUploading(false);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateImage(null);
    setCreatePreview(null);
    setCreateContent("");
  };

  // Desktop: show up to 4 groups (first = your story)
  const desktopGroups = groups.slice(0, 3);

  return (
    <>
      {/*For Desktop*/}
      <div className="_feed_inner_ppl_card _mar_b16">
        <div className="_feed_inner_story_arrow">
          <button type="button" className="_feed_inner_story_arrow_btn">
            <IconArrowRight />
          </button>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
            <div className="_feed_inner_profile_story _b_radious6">
              <div className="_feed_inner_profile_story_image">
                <img
                  src={user?.avatar || "/images/card_ppl1.png"}
                  alt="Your Story"
                  className="_profile_story_img"
                />
                <div className="_feed_inner_story_txt">
                  <div className="_feed_inner_story_btn">
                    <button
                      className="_feed_inner_story_btn_link"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <IconPlus />
                    </button>
                  </div>
                  <p className="_feed_inner_story_para">Your Story</p>
                </div>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="col" style={{ padding: "12px 16px" }}>
              <small>Loading stories...</small>
            </div>
          ) : (
            desktopGroups.map((group, idx) => {
              const allViewed = group.stories.every((s) =>
                s.viewers.some((v) => v.userId === user?.id)
              );
              return (
                <div
                  key={group.user.id}
                  className={`col-xl-3 col-lg-3 col-md-4 col-sm-4 col${idx >= 2 ? " _custom_none" : idx >= 1 ? " _custom_mobile_none" : ""}`}
                >
                  <div
                    className="_feed_inner_public_story _b_radious6"
                    style={{ cursor: "pointer" }}
                    onClick={() => openStoryViewer(idx)}
                  >
                    <div className="_feed_inner_public_story_image">
                      <img
                        src={group.stories[0].imageUrl}
                        alt="Story"
                        className="_public_story_img"
                      />
                      <div className="_feed_inner_pulic_story_txt">
                        <p className="_feed_inner_pulic_story_para">
                          {group.user.name}
                        </p>
                      </div>
                      <div
                        className="_feed_inner_public_mini"
                        style={{
                          borderRadius: "50%",
                          border: allViewed ? "3px solid #ccc " : "3px solid #0ACF83",
                        }}
                      >
                        <img
                          src={group.user.avatar || "/images/mini_pic.png"}
                          alt={group.user.name}
                          className="_public_mini_img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/*For Mobile*/}
      <div className="_feed_inner_ppl_card_mobile _mar_b16">
        <div className="_feed_inner_ppl_card_area">
          <ul className="_feed_inner_ppl_card_area_list">
            <li className="_feed_inner_ppl_card_area_item">
              <button
                className="_feed_inner_ppl_card_area_link"
                onClick={() => setShowCreateModal(true)}
                style={{ background: "none", border: "none", padding: 0, width: "100%" }}
              >
                <div className="_feed_inner_ppl_card_area_story">
                  <img
                    src={user?.avatar || "/images/mobile_story_img.png"}
                    alt="Your Story"
                    className="_card_story_img"
                  />
                  <div className="_feed_inner_ppl_btn">
                    <span className="_feed_inner_ppl_btn_link">
                      <IconPlusMobile />
                    </span>
                  </div>
                </div>
                <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
              </button>
            </li>
            {groups.map((group, idx) => {
              const allViewed = group.stories.every((s) =>
                s.viewers.some((v) => v.userId === user?.id)
              );
              return (
                <li key={group.user.id} className="_feed_inner_ppl_card_area_item">
                  <button
                    className="_feed_inner_ppl_card_area_link"
                    onClick={() => openStoryViewer(idx)}
                    style={{ background: "none", border: "none", padding: 0, width: "100%" }}
                  >
                    <div
                      className={allViewed ? "_feed_inner_ppl_card_area_story_inactive" : "_feed_inner_ppl_card_area_story_active"}
                    >
                      <img
                        src={group.stories[0].imageUrl}
                        alt={group.user.name}
                        className="_card_story_img1"
                      />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">
                      {group.user.name.length > 6
                        ? group.user.name.slice(0, 6) + "..."
                        : group.user.name}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Story Preview Modal */}
      {selectedGroup && currentStory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeStoryViewer}
        >
          <div
            ref={sliderRef}
            onClick={(e) => {
              e.stopPropagation();
              handleSliderClick(e);
            }}
            style={{
              position: "relative",
              width: "min(90vw, 420px)",
              height: "min(80vh, 700px)",
              background: "#111",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Progress bars */}
            <div style={{ display: "flex", gap: 4, padding: "10px 10px 0" }}>
              {selectedGroup.stories.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: i < currentStoryIdx ? "#fff" : i === currentStoryIdx ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 10px",
                color: "#fff",
              }}
            >
              <img
                src={currentStory.author.avatar || "/images/mini_pic.png"}
                alt={currentStory.author.name}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #0ACF83",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{currentStory.author.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  {formatTimeAgo(currentStory.createdAt)}
                </div>
              </div>
              {user?.id === currentStory.authorId && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteStory(); }}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); closeStoryViewer(); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <IconX size={22} />
              </button>
            </div>

            {/* Image */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={currentStory.imageUrl}
                alt="Story"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Content */}
            {currentStory.content && (
              <div
                style={{
                  padding: "12px 14px",
                  color: "#fff",
                  fontSize: 14,
                  textAlign: "center",
                  background: "rgba(0,0,0,0.4)",
                }}
              >
                {currentStory.content}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={closeCreateModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="_create_story_modal"
            style={{
              background: "var(--bg2)",
              borderRadius: 12,
              width: "min(90vw, 400px)",
              maxHeight: "90vh",
              overflow: "auto",
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 className="_create_story_modal_title" style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--color6)" }}>Create Story</h3>
              <button
                onClick={closeCreateModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <IconX size={20} />
              </button>
            </div>

            <input
              ref={createInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleCreateFile(e.target.files?.[0] ?? null)}
            />

            {!createPreview ? (
              <div
                onClick={() => createInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--bcolor2)",
                  borderRadius: 8,
                  padding: 40,
                  textAlign: "center",
                  cursor: "pointer",
                  color: "var(--color7)",
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                Click to upload an image
              </div>
            ) : (
              <div style={{ position: "relative", marginBottom: 16 }}>
                <img
                  src={createPreview}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: 8, maxHeight: 300, objectFit: "cover" }}
                />
                <button
                  onClick={() => {
                    URL.revokeObjectURL(createPreview);
                    setCreatePreview(null);
                    setCreateImage(null);
                  }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.6)",
                    border: "none",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconX size={16} />
                </button>
              </div>
            )}

            <textarea
              placeholder="Write something... (optional)"
              value={createContent}
              onChange={(e) => setCreateContent(e.target.value)}
              maxLength={500}
              rows={3}
              className="_create_story_modal_textarea"
              style={{
                width: "100%",
                border: "1px solid var(--bcolor2)",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 14,
                resize: "none",
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={handleCreateSubmit}
              disabled={!createImage || uploading}
              className="_create_story_modal_btn"
              style={{
                width: "100%",
                padding: "12px 0",
                background: !createImage || uploading ? "var(--bcolor2)" : "var(--color5)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: !createImage || uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Uploading..." : "Share Story"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
