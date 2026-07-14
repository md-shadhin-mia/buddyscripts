import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const postId = "post-1"
const otherUserId = "user-2"

describe("PostsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createPost", () => {
    it("creates a post successfully", async () => {
      const post = { id: postId, content: "Hello world", imageUrl: null, visibility: "PUBLIC", authorId: userId, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.post.create.mockResolvedValue(post)

      const { createPost } = await import("../posts.service")
      const result = await createPost(userId, { content: "Hello world" })

      expect(result).toEqual(post)
      expect(mockPrisma.post.create).toHaveBeenCalledWith({
        data: { content: "Hello world", imageUrl: undefined, visibility: "PUBLIC", authorId: userId },
        include: { author: { select: { id: true, name: true, avatar: true } }, media: { orderBy: { order: "asc" } } },
      })
    })
  })

  describe("getFeed", () => {
    it("returns public posts for non-friends", async () => {
      mockPrisma.friendship.findMany.mockResolvedValue([])
      mockPrisma.hiddenPost.findMany.mockResolvedValue([])
      mockPrisma.post.findMany.mockResolvedValue([])

      const { getFeed } = await import("../posts.service")
      const result = await getFeed(userId, {})

      expect(result.data).toEqual([])
    })
  })

  describe("getPost", () => {
    it("returns a post by id", async () => {
      const post = { id: postId, content: "Hello", authorId: userId, visibility: "PUBLIC", deletedAt: null, _count: { comments: 0, reactions: 0 } } as any
      mockPrisma.post.findUnique.mockResolvedValue(post)

      const { getPost } = await import("../posts.service")
      const result = await getPost(postId)

      expect(result).toEqual(post)
    })

    it("throws 404 if post not found", async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null)

      const { getPost } = await import("../posts.service")
      await expect(getPost(postId)).rejects.toMatchObject({ statusCode: 404 })
    })

    it("throws 404 if post is soft-deleted", async () => {
      mockPrisma.post.findUnique.mockResolvedValue({ id: postId, deletedAt: new Date() } as any)

      const { getPost } = await import("../posts.service")
      await expect(getPost(postId)).rejects.toMatchObject({ statusCode: 404 })
    })
  })

  describe("updatePost", () => {
    it("updates own post", async () => {
      const post = { id: postId, content: "Updated", visibility: "PUBLIC", authorId: userId } as any
      mockPrisma.post.findUnique.mockResolvedValue({ id: postId, authorId: userId, deletedAt: null })
      mockPrisma.post.update.mockResolvedValue(post)

      const { updatePost } = await import("../posts.service")
      const result = await updatePost(userId, postId, { content: "Updated" })

      expect(result).toEqual(post)
    })

    it("throws 403 when not the owner", async () => {
      mockPrisma.post.findUnique.mockResolvedValue({ id: postId, authorId: userId, deletedAt: null })

      const { updatePost } = await import("../posts.service")
      await expect(updatePost(otherUserId, postId, { content: "Hacked" })).rejects.toMatchObject({ statusCode: 403 })
    })
  })

  describe("deletePost", () => {
    it("soft deletes own post", async () => {
      mockPrisma.post.findUnique.mockResolvedValue({ id: postId, authorId: userId, deletedAt: null })
      mockPrisma.post.update.mockResolvedValue({} as any)

      const { deletePost } = await import("../posts.service")
      await deletePost(userId, postId)

      expect(mockPrisma.post.update).toHaveBeenCalledWith({
        where: { id: postId },
        data: { deletedAt: expect.any(Date) },
      })
    })
  })

  describe("savePost / unsavePost", () => {
    it("saves a post", async () => {
      mockPrisma.savedPost.create.mockResolvedValue({} as any)

      const { savePost } = await import("../posts.service")
      await savePost(userId, postId)

      expect(mockPrisma.savedPost.create).toHaveBeenCalledWith({
        data: { userId, postId },
      })
    })

    it("unsaves a post", async () => {
      mockPrisma.savedPost.delete.mockResolvedValue({} as any)

      const { unsavePost } = await import("../posts.service")
      await unsavePost(userId, postId)

      expect(mockPrisma.savedPost.delete).toHaveBeenCalledWith({
        where: { userId_postId: { userId, postId } },
      })
    })
  })
})
