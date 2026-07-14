import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const postId = "post-1"
const commentId = "comment-1"
const otherUserId = "user-2"

describe("CommentsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createComment", () => {
    it("creates a comment on a post", async () => {
      const comment = { id: commentId, content: "Nice post!", postId, authorId: userId, parentId: null, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.comment.create.mockResolvedValue(comment)

      const { createComment } = await import("../comments.service")
      const result = await createComment(userId, postId, { content: "Nice post!" })

      expect(result).toMatchObject({ id: commentId, myReaction: null })
      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: { content: "Nice post!", postId, authorId: userId },
        include: expect.objectContaining({
          author: { select: { id: true, name: true, avatar: true } },
          _count: { select: { reactions: true } },
        }),
      })
    })
  })

  describe("getComments", () => {
    it("returns comments for a post", async () => {
      mockPrisma.comment.findMany.mockResolvedValue([])

      const { getComments } = await import("../comments.service")
      const result = await getComments(postId, {})

      expect(result.data).toEqual([])
    })
  })

  describe("updateComment", () => {
    it("updates own comment", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: commentId, authorId: userId, deletedAt: null } as any)
      mockPrisma.comment.update.mockResolvedValue({ id: commentId, content: "Edited" } as any)

      const { updateComment } = await import("../comments.service")
      const result = await updateComment(userId, commentId, { content: "Edited" })

      expect(result).toMatchObject({ id: commentId, content: "Edited", myReaction: null })
    })

    it("throws 403 when not the owner", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: commentId, authorId: userId, deletedAt: null } as any)

      const { updateComment } = await import("../comments.service")
      await expect(updateComment(otherUserId, commentId, { content: "Hacked" })).rejects.toMatchObject({ statusCode: 403 })
    })
  })

  describe("deleteComment", () => {
    it("soft deletes own comment", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: commentId, authorId: userId, deletedAt: null } as any)

      const { deleteComment } = await import("../comments.service")
      await deleteComment(userId, commentId)

      expect(mockPrisma.comment.update).toHaveBeenCalledWith({
        where: { id: commentId },
        data: { deletedAt: expect.any(Date) },
      })
    })
  })

  describe("replyToComment", () => {
    it("creates a reply to a comment", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: commentId, postId, deletedAt: null } as any)
      const reply = { id: "reply-1", content: "Thanks!", postId, authorId: userId, parentId: commentId } as any
      mockPrisma.comment.create.mockResolvedValue(reply)

      const { replyToComment } = await import("../comments.service")
      const result = await replyToComment(userId, commentId, { content: "Thanks!" })

      expect(result).toMatchObject({ id: "reply-1", myReaction: null })
      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: { content: "Thanks!", postId, authorId: userId, parentId: commentId },
        include: expect.objectContaining({
          author: { select: { id: true, name: true, avatar: true } },
          _count: { select: { reactions: true } },
        }),
      })
    })
  })
})
