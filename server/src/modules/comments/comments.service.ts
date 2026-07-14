import prisma from "../../config/database"
import { ApiError } from "../../lib/errors"
import { paginate } from "../../lib/pagination"
import { createNotification } from "../notifications/notifications.service"

interface CreateCommentInput {
  content: string
  media?: { url: string; type: string }[]
}

interface UpdateCommentInput {
  content: string
}

const commentInclude = (userId?: string) => ({
  author: { select: { id: true, name: true, avatar: true } },
  media: { orderBy: { order: "asc" as const } },
  _count: { select: { reactions: true } },
  reactions: {
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      type: true,
      userId: true,
      user: { select: { id: true, name: true, avatar: true } },
    },
  },
} as const)

async function getMyReaction(userId: string | undefined, entityId: string, entityField: "postId" | "commentId") {
  if (!userId) return null
  const reaction = await prisma.reaction.findFirst({
    where: { [entityField]: entityId, userId },
    select: { type: true },
  })
  return reaction?.type ?? null
}

export async function createComment(userId: string, postId: string, input: CreateCommentInput) {
  const comment = await prisma.comment.create({
    data: {
      content: input.content,
      postId,
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
    include: commentInclude(),
  })

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })
  if (post && post.authorId !== userId) {
    await createNotification({
      userId: post.authorId,
      actorId: userId,
      type: "POST_COMMENT",
      entityType: "COMMENT",
      entityId: comment.id,
    })
  }

  return { ...comment, myReaction: null }
}

export async function getComments(postId: string, params: { cursor?: string; take?: number }, userId?: string) {
  const where = { postId, parentId: null, deletedAt: null }
  const result = await paginate(prisma.comment, { ...params, where }, 20, {
    include: {
      ...commentInclude(),
      replies: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        include: {
          ...commentInclude(),
          replies: false,
        },
      },
    },
  })

  const enriched = await Promise.all(
    result.data.map(async (comment: any) => {
      const myReaction = await getMyReaction(userId, comment.id, "commentId")
      const repliesWithReaction = comment.replies
        ? await Promise.all(
            comment.replies.map(async (reply: any) => {
              const replyReaction = await getMyReaction(userId, reply.id, "commentId")
              return { ...reply, myReaction: replyReaction }
            })
          )
        : []
      return { ...comment, myReaction, replies: repliesWithReaction }
    })
  )

  return { ...result, data: enriched }
}

export async function updateComment(userId: string, id: string, input: UpdateCommentInput) {
  const comment = await prisma.comment.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } })
  if (!comment || comment.deletedAt) throw ApiError.notFound("Comment not found")
  if (comment.authorId !== userId) throw ApiError.forbidden()

  const updated = await prisma.comment.update({
    where: { id },
    data: input,
    include: commentInclude(),
  })
  return { ...updated, myReaction: null }
}

export async function deleteComment(userId: string, id: string) {
  const comment = await prisma.comment.findUnique({ where: { id }, select: { authorId: true, deletedAt: true } })
  if (!comment || comment.deletedAt) throw ApiError.notFound("Comment not found")
  if (comment.authorId !== userId) throw ApiError.forbidden()

  await prisma.comment.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

export async function replyToComment(userId: string, parentId: string, input: CreateCommentInput) {
  const parent = await prisma.comment.findUnique({ where: { id: parentId }, select: { postId: true, authorId: true, deletedAt: true } })
  if (!parent || parent.deletedAt) throw ApiError.notFound("Parent comment not found")

  const reply = await prisma.comment.create({
    data: {
      content: input.content,
      postId: parent.postId,
      authorId: userId,
      parentId,
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
    include: commentInclude(),
  })

  if (parent.authorId !== userId) {
    await createNotification({
      userId: parent.authorId,
      actorId: userId,
      type: "COMMENT_REPLY",
      entityType: "COMMENT",
      entityId: reply.id,
    })
  }

  return { ...reply, myReaction: null }
}
