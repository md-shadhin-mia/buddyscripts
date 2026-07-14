import prisma from "../../config/database"
import { ApiError } from "../../lib/errors"

interface CreateStoryInput {
  imageUrl: string
  content?: string
}

const storyInclude = {
  author: { select: { id: true, name: true, avatar: true } },
} as const

export async function createStory(userId: string, input: CreateStoryInput) {
  const story = await prisma.story.create({
    data: {
      imageUrl: input.imageUrl,
      content: input.content,
      authorId: userId,
    },
    include: storyInclude,
  })
  return story
}

export async function getActiveStories(currentUserId: string) {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const stories = await prisma.story.findMany({
    where: { createdAt: { gte: twentyFourHoursAgo } },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      viewers: { where: { userId: currentUserId } },
    },
    orderBy: { createdAt: "desc" },
  })
  return stories
}

export async function deleteStory(userId: string, storyId: string) {
  const story = await prisma.story.findUnique({ where: { id: storyId }, select: { authorId: true } })
  if (!story) throw ApiError.notFound("Story not found")
  if (story.authorId !== userId) throw ApiError.forbidden()

  await prisma.story.delete({ where: { id: storyId } })
}

export async function viewStory(userId: string, storyId: string) {
  await prisma.storyViewer.create({
    data: { storyId, userId },
  })

  await prisma.story.update({
    where: { id: storyId },
    data: { viewCount: { increment: 1 } },
  })
}
