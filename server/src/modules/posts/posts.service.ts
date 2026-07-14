import prisma from "../../config/database"
import { ApiError } from "../../lib/errors"
import { paginate } from "../../lib/pagination"

interface MediaInput {
  url: string
  type: "image" | "video"
}

interface CreatePostInput {
  content: string
  imageUrl?: string
  media?: MediaInput[]
  visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE"
}

interface UpdatePostInput {
  content?: string
  imageUrl?: string
  visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE"
}

const postInclude = {
  author: { select: { id: true, name: true, avatar: true } },
  media: { orderBy: { order: "asc" as const } },
} as const

export async function createPost(userId: string, input: CreatePostInput) {
  const post = await prisma.post.create({
    data: {
      content: input.content,
      imageUrl: input.imageUrl,
      visibility: input.visibility ?? "PUBLIC",
      authorId: userId,
      media: input.media
        ? {
            create: input.media.map((m, i) => ({
              url: m.url,
              type: m.type,
              order: i,
            })),
          }
        : undefined,
    },
    include: postInclude,
  })
  return post
}

export async function getFeed(userId: string, params: { cursor?: string; take?: number }) {
  const friendIds = (
    await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: { user1Id: true, user2Id: true },
    })
  ).map((f) => (f.user1Id === userId ? f.user2Id : f.user1Id))

  const hiddenIds = (
    await prisma.hiddenPost.findMany({
      where: { userId },
      select: { postId: true },
    })
  ).map((h) => h.postId)

  const where: any = {
    deletedAt: null,
    id: { notIn: hiddenIds },
    OR: [
      { visibility: "PUBLIC" },
      { visibility: "FRIENDS", authorId: { in: friendIds } },
      { authorId: userId },
    ],
  }

  const result = await paginate(prisma.post, { ...params, where }, 20, {
    include: {
      ...postInclude,
      _count: { select: { comments: true, reactions: true } },
      reactions: {
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          type: true,
          userId: true,
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  })
  return result
}

export async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      ...postInclude,
      _count: { select: { comments: true, reactions: true } },
      reactions: {
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          type: true,
          userId: true,
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  })
  if (!post || post.deletedAt) throw ApiError.notFound("Post not found")
  return post
}

export async function updatePost(userId: string, id: string, input: UpdatePostInput) {
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } })
  if (!post || post.deletedAt) throw ApiError.notFound("Post not found")
  if (post.authorId !== userId) throw ApiError.forbidden()

  const updated = await prisma.post.update({
    where: { id },
    data: input,
    include: postInclude,
  })
  return updated
}

export async function deletePost(userId: string, id: string) {
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } })
  if (!post || post.deletedAt) throw ApiError.notFound("Post not found")
  if (post.authorId !== userId) throw ApiError.forbidden()

  await prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

export async function savePost(userId: string, postId: string) {
  await prisma.savedPost.create({
    data: { userId, postId },
  })
}

export async function unsavePost(userId: string, postId: string) {
  await prisma.savedPost.delete({
    where: { userId_postId: { userId, postId } },
  })
}

export async function getSavedPosts(userId: string, params: { cursor?: string; take?: number }) {
  const result = await paginate(prisma.savedPost, {
    ...params,
    where: { userId },
  })
  return result
}
