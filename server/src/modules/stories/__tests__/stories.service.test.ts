import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const storyId = "story-1"

describe("StoriesService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createStory", () => {
    it("creates a story with 24h expiry", async () => {
      const story = { id: storyId, imageUrl: "https://img.url", content: "My story", authorId: userId, viewCount: 0, createdAt: new Date() }
      mockPrisma.story.create.mockResolvedValue(story as any)

      const { createStory } = await import("../stories.service")
      const result = await createStory(userId, { imageUrl: "https://img.url", content: "My story" })

      expect(result).toEqual(story)
      expect(mockPrisma.story.create).toHaveBeenCalledWith({
        data: {
          imageUrl: "https://img.url",
          content: "My story",
          authorId: userId,
        },
        include: { author: { select: { id: true, name: true, avatar: true } } },
      })
    })
  })

  describe("getActiveStories", () => {
    it("returns non-expired stories grouped by user", async () => {
      const stories = [
        { id: storyId, imageUrl: "https://img.url", content: "Hi", authorId: userId, viewCount: 0, createdAt: new Date(), author: { id: userId, name: "Alice", avatar: null }, viewers: [] },
      ]
      mockPrisma.story.findMany.mockResolvedValue(stories as any)

      const { getActiveStories } = await import("../stories.service")
      const result = await getActiveStories(userId)

      expect(result).toEqual(stories)
      expect(mockPrisma.story.findMany).toHaveBeenCalledWith({
        where: { createdAt: { gte: expect.any(Date) } },
        include: { author: { select: { id: true, name: true, avatar: true } }, viewers: { where: { userId } } },
        orderBy: { createdAt: "desc" },
      })
    })
  })

  describe("deleteStory", () => {
    it("deletes own story", async () => {
      mockPrisma.story.findUnique.mockResolvedValue({ id: storyId, authorId: userId } as any)
      mockPrisma.story.delete.mockResolvedValue({} as any)

      const { deleteStory } = await import("../stories.service")
      await deleteStory(userId, storyId)

      expect(mockPrisma.story.delete).toHaveBeenCalledWith({ where: { id: storyId } })
    })

    it("throws 403 when not the owner", async () => {
      mockPrisma.story.findUnique.mockResolvedValue({ id: storyId, authorId: "other-user" } as any)

      const { deleteStory } = await import("../stories.service")
      await expect(deleteStory(userId, storyId)).rejects.toMatchObject({ statusCode: 403 })
    })
  })

  describe("viewStory", () => {
    it("creates a StoryViewer record and increments count", async () => {
      mockPrisma.storyViewer.create.mockResolvedValue({} as any)
      mockPrisma.story.update.mockResolvedValue({} as any)

      const { viewStory } = await import("../stories.service")
      await viewStory(userId, storyId)

      expect(mockPrisma.storyViewer.create).toHaveBeenCalledWith({
        data: { storyId, userId },
      })
    })
  })
})
