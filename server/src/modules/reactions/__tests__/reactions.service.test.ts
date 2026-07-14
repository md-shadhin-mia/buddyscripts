import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const postId = "post-1"
const commentId = "comment-1"

describe("ReactionsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("reactToPost", () => {
    it("creates a reaction on a post", async () => {
      const reaction = { id: "r1", type: "LIKE", postId, commentId: null, userId, createdAt: new Date() }
      mockPrisma.reaction.create.mockResolvedValue(reaction as any)

      const { reactToPost } = await import("../reactions.service")
      const result = await reactToPost(userId, postId, { type: "LIKE" })

      expect(result).toEqual(reaction)
      expect(mockPrisma.reaction.create).toHaveBeenCalledWith({
        data: { type: "LIKE", postId, userId },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      })
    })
  })

  describe("removePostReaction", () => {
    it("deletes the user's reaction on a post", async () => {
      mockPrisma.reaction.deleteMany.mockResolvedValue({ count: 1 } as any)

      const { removePostReaction } = await import("../reactions.service")
      await removePostReaction(userId, postId)

      expect(mockPrisma.reaction.deleteMany).toHaveBeenCalledWith({
        where: { postId, userId },
      })
    })
  })

  describe("getPostReactions", () => {
    it("returns reactions grouped by type", async () => {
      const reactions = [
        { id: "r1", type: "LIKE", userId: "u1", postId, commentId: null, createdAt: new Date(), user: { id: "u1", name: "Alice", avatar: null } },
        { id: "r2", type: "LOVE", userId: "u2", postId, commentId: null, createdAt: new Date(), user: { id: "u2", name: "Bob", avatar: null } },
      ]
      mockPrisma.reaction.findMany.mockResolvedValue(reactions as any)

      const { getPostReactions } = await import("../reactions.service")
      const result = await getPostReactions(postId)

      expect(result).toEqual(reactions)
    })
  })

  describe("reactToComment", () => {
    it("creates a reaction on a comment", async () => {
      const reaction = { id: "r3", type: "HAHA", postId: null, commentId, userId, createdAt: new Date() }
      mockPrisma.reaction.create.mockResolvedValue(reaction as any)

      const { reactToComment } = await import("../reactions.service")
      const result = await reactToComment(userId, commentId, { type: "HAHA" })

      expect(result).toEqual(reaction)
      expect(mockPrisma.reaction.create).toHaveBeenCalledWith({
        data: { type: "HAHA", commentId, userId },
      })
    })
  })

  describe("removeCommentReaction", () => {
    it("deletes the user's reaction on a comment", async () => {
      mockPrisma.reaction.deleteMany.mockResolvedValue({ count: 1 } as any)

      const { removeCommentReaction } = await import("../reactions.service")
      await removeCommentReaction(userId, commentId)

      expect(mockPrisma.reaction.deleteMany).toHaveBeenCalledWith({
        where: { commentId, userId },
      })
    })
  })

  describe("getCommentReactions", () => {
    it("returns reactions for a comment with user info", async () => {
      const reactions = [
        { id: "r1", type: "LIKE", userId: "u1", postId: null, commentId, createdAt: new Date(), user: { id: "u1", name: "Alice", avatar: null } },
        { id: "r2", type: "LOVE", userId: "u2", postId: null, commentId, createdAt: new Date(), user: { id: "u2", name: "Bob", avatar: null } },
      ]
      mockPrisma.reaction.findMany.mockResolvedValue(reactions as any)

      const { getCommentReactions } = await import("../reactions.service")
      const result = await getCommentReactions(commentId)

      expect(result).toEqual(reactions)
      expect(mockPrisma.reaction.findMany).toHaveBeenCalledWith({
        where: { commentId },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      })
    })
  })
})
