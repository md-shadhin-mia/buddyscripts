import prisma from "../../config/database"
import { createNotification } from "../notifications/notifications.service"

interface CreateReactionInput {
  type: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY"
}

export async function reactToPost(userId: string, postId: string, input: CreateReactionInput) {
  const existing = await prisma.reaction.findFirst({
    where: { postId, userId },
  })

  if (existing) {
    if (existing.type === input.type) {
      await prisma.reaction.delete({ where: { id: existing.id } })
      return { removed: true, type: input.type }
    }
    await prisma.reaction.update({
      where: { id: existing.id },
      data: { type: input.type },
    })
    return { removed: false, type: input.type }
  }

  const reaction = await prisma.reaction.create({
    data: {
      type: input.type,
      postId,
      userId,
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  })

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })
  if (post && post.authorId !== userId) {
    await createNotification({
      userId: post.authorId,
      actorId: userId,
      type: "POST_REACTION",
      entityType: "POST",
      entityId: postId,
    })
  }

  return reaction
}

export async function removePostReaction(userId: string, postId: string) {
  await prisma.reaction.deleteMany({
    where: { postId, userId },
  })
}

export async function getPostReactions(postId: string) {
  const reactions = await prisma.reaction.findMany({
    where: { postId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  })
  return reactions
}

export async function reactToComment(userId: string, commentId: string, input: CreateReactionInput) {
  const existing = await prisma.reaction.findFirst({
    where: { commentId, userId },
  })

  if (existing) {
    if (existing.type === input.type) {
      await prisma.reaction.delete({ where: { id: existing.id } })
      return { removed: true, type: input.type }
    }
    await prisma.reaction.update({
      where: { id: existing.id },
      data: { type: input.type },
    })
    return { removed: false, type: input.type }
  }

  const reaction = await prisma.reaction.create({
    data: {
      type: input.type,
      commentId,
      userId,
    },
  })

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  })
  if (comment && comment.authorId !== userId) {
    await createNotification({
      userId: comment.authorId,
      actorId: userId,
      type: "POST_REACTION",
      entityType: "COMMENT",
      entityId: commentId,
    })
  }

  return reaction
}

export async function removeCommentReaction(userId: string, commentId: string) {
  await prisma.reaction.deleteMany({
    where: { commentId, userId },
  })
}

export async function getCommentReactions(commentId: string) {
  const reactions = await prisma.reaction.findMany({
    where: { commentId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  })
  return reactions
}
