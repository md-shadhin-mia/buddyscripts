export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
};

export type UploadResult = {
  key: string;
  url: string;
};

export type PostMedia = {
  id: string;
  url: string;
  type: "image" | "video";
  order: number;
};

export type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: "PUBLIC" | "FRIENDS" | "PRIVATE";
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: Pick<User, "id" | "name" | "avatar">;
  media: PostMedia[];
  _count: {
    comments: number;
    reactions: number;
  };
  reactions: { type: string; userId: string; user?: Pick<User, "id" | "name" | "avatar"> }[];
  isSaved?: boolean;
  isHidden?: boolean;
};

export type CommentMedia = {
  id: string;
  url: string;
  type: "image" | "video";
  order: number;
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  createdAt: string;
  author: Pick<User, "id" | "name" | "avatar">;
  media?: CommentMedia[];
  _count?: { reactions: number };
  reactions?: { type: string; userId: string; user?: Pick<User, "id" | "name" | "avatar"> }[];
  myReaction?: string | null;
  replies?: Comment[];
};

export type Reaction = {
  id: string;
  type: string;
  userId: string;
  postId: string | null;
  commentId: string | null;
  user?: Pick<User, "id" | "name" | "avatar">;
};

export type Story = {
  id: string;
  imageUrl: string;
  content: string | null;
  authorId: string;
  viewCount: number;
  createdAt: string;
  author: Pick<User, "id" | "name" | "avatar">;
  viewers: { userId: string }[];
};

export type StoryGroup = {
  user: Pick<User, "id" | "name" | "avatar">;
  stories: Story[];
};

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  sender: Pick<User, "id" | "name" | "avatar">;
  receiver: Pick<User, "id" | "name" | "avatar">;
};

export type Friendship = {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  friend: Pick<User, "id" | "name" | "avatar">;
};

export type Notification = {
  id: string;
  userId: string;
  actorId: string;
  type: string;
  entityType: string;
  entityId: string;
  message: string | null;
  isRead: boolean;
  createdAt: string;
  actor: Pick<User, "id" | "name" | "avatar">;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  creatorId: string;
  creator: Pick<User, "id" | "name" | "avatar">;
  _count: { attendees: number };
  myStatus?: "GOING" | "MAYBE" | "NOT_GOING" | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  nextCursor: string | null;
  total?: number;
};
