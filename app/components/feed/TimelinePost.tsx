"use client";

import { useRef, useState } from "react";
import { Menu } from "@headlessui/react";
import { IconBookmarkFlag, IconBell, IconHide, IconEdit, IconDelete, IconThreeDots } from "../icons";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";
import ReactionsModal from "./ReactionsModal";
import type { Post } from "@/lib/types";
import Link from "next/link";

export default function TimelinePost({ post }: { post: Post }) {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const timeAgo = getTimeAgo(post.createdAt);
  const [showReactions, setShowReactions] = useState(false);

  const focusCommentInput = () => {
    commentInputRef.current?.focus();
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src={post.author.avatar || "/images/post_img.png"} alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{post.author.name}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {timeAgo} .
                <Link href="#0">{post.visibility === "PUBLIC" ? "Public" : post.visibility === "FRIENDS" ? "Friends" : "Private"}</Link>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <Menu as="div" className="_feed_timeline_post_dropdown">
              <Menu.Button className="_feed_timeline_post_dropdown_link">
                <IconThreeDots />
              </Menu.Button>
              <Menu.Items
                className={({ open }) =>
                  "_feed_timeline_dropdown _timeline_dropdown" + (open ? " show" : "")
                }
                unmount={false}
              >
                <ul className="_feed_timeline_dropdown_list">
                  <Menu.Item as="li" className="_feed_timeline_dropdown_item">
                    <Link href="#0" className="_feed_timeline_dropdown_link">
                      <span><IconBookmarkFlag /></span>
                      Save Post
                    </Link>
                  </Menu.Item>
                  <Menu.Item as="li" className="_feed_timeline_dropdown_item">
                    <Link href="#0" className="_feed_timeline_dropdown_link">
                      <span><IconBell /></span>
                      Turn On Notification
                    </Link>
                  </Menu.Item>
                  <Menu.Item as="li" className="_feed_timeline_dropdown_item">
                    <Link href="#0" className="_feed_timeline_dropdown_link">
                      <span><IconHide /></span>
                      Hide
                    </Link>
                  </Menu.Item>
                  <Menu.Item as="li" className="_feed_timeline_dropdown_item">
                    <Link href="#0" className="_feed_timeline_dropdown_link">
                      <span><IconEdit /></span>
                      Edit Post
                    </Link>
                  </Menu.Item>
                  <Menu.Item as="li" className="_feed_timeline_dropdown_item">
                    <Link href="#0" className="_feed_timeline_dropdown_link">
                      <span><IconDelete /></span>
                      Delete Post
                    </Link>
                  </Menu.Item>
                </ul>
              </Menu.Items>
            </Menu>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {post.media && post.media.length > 0 ? (
          <div className={`_feed_inner_timeline_media_grid ${post.media.length === 1 ? "_media_single" : post.media.length === 2 ? "_media_two" : post.media.length === 3 ? "_media_three" : "_media_many"}`}>
            {post.media.map((m) => (
              <div key={m.id} className="_feed_inner_timeline_media_item">
                {m.type === "video" ? (
                  <video src={m.url} controls className="_time_video" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                ) : (
                  <img src={m.url} alt="" className="_time_img" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                )}
              </div>
            ))}
          </div>
        ) : post.imageUrl ? (
          <div className="_feed_inner_timeline_image">
            {post.imageUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? (
              <video src={post.imageUrl} controls className="_time_video" style={{ width: "100%", borderRadius: 8 }} />
            ) : (
              <img src={post.imageUrl} alt="" className="_time_img" />
            )}
          </div>
        ) : null}
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div
          className="_feed_inner_timeline_total_reacts_image"
          style={{ cursor: "pointer" }}
          onClick={() => setShowReactions(true)}
        >
          {post.reactions && post.reactions.length > 0 ? (
            <>
              {post.reactions.slice(0, 5).map((r, i) => (
                <img
                  key={r.userId}
                  src={r.user?.avatar || "/images/react_img.png"}
                  alt=""
                  className={
                    i === 0 ? "_react_img1" : i >= 3 ? "_react_img _rect_img_mbl_none" : "_react_img"
                  }
                />
              ))}
              <p className="_feed_inner_timeline_total_reacts_para">{post._count.reactions}</p>
            </>
          ) : (
            <p className="_feed_inner_timeline_total_reacts_para">{post._count.reactions}</p>
          )}
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <Link href="#0"><span>{post._count.comments}</span> Comment{post._count.comments !== 1 ? "s" : ""}</Link>
          </p>
        </div>
      </div>
      <PostActions postId={post.id} reactions={post.reactions} onCommentClick={focusCommentInput} />
      <CommentSection postId={post.id} textareaRef={commentInputRef} />
      {showReactions && post.reactions && (
        <ReactionsModal
          reactions={post.reactions.map((r) => ({
            id: `${r.type}-${r.userId}`,
            type: r.type,
            userId: r.userId,
            postId: post.id,
            commentId: null,
            user: r.user as any,
          }))}
          onClose={() => setShowReactions(false)}
        />
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
