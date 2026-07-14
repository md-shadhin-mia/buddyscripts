"use client";

import CreatePost from "./CreatePost";
import Stories from "./Stories";
import TimelinePost from "./TimelinePost";
import { useFeed } from "@/hooks/useFeed";
import { useSocket } from "@/hooks/useSocket";

export default function FeedContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();
  useSocket();

  const posts = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="_feed_inner_middle_area_middle">
      <Stories />
      <CreatePost />
      {posts.map((post) => (
        <TimelinePost key={post.id} post={post} />
      ))}
      {hasNextPage && (
        <div className="_load_more">
          <button
            className="_load_more_btn"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
