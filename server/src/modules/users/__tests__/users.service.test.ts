import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const otherUserId = "user-2"

describe("UsersService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getProfile", () => {
    it("returns user profile by ID", async () => {
      const user = { id: userId, email: "alice@test.com", name: "Alice", avatar: null, bio: "Hi", createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.user.findUnique.mockResolvedValue(user)

      const { getProfile } = await import("../users.service")
      const result = await getProfile(userId)

      expect(result).toEqual(user)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: { id: true, email: true, name: true, avatar: true, bio: true, createdAt: true },
      })
    })

    it("throws 404 when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const { getProfile } = await import("../users.service")
      await expect(getProfile("nonexistent")).rejects.toMatchObject({ statusCode: 404 })
    })
  })

  describe("updateProfile", () => {
    it("updates and returns profile", async () => {
      const updated = { id: userId, name: "Alice Updated", bio: "New bio" }
      mockPrisma.user.update.mockResolvedValue(updated)

      const { updateProfile } = await import("../users.service")
      const result = await updateProfile(userId, { name: "Alice Updated", bio: "New bio" })

      expect(result).toEqual(updated)
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: "Alice Updated", bio: "New bio" },
        select: { id: true, email: true, name: true, avatar: true, bio: true, createdAt: true },
      })
    })
  })

  describe("getUserPosts", () => {
    it("returns posts with cursor pagination", async () => {
      const posts = [{ id: "p1", content: "Post 1", authorId: userId, createdAt: new Date(), updatedAt: new Date(), deletedAt: null }]
      mockPrisma.post.findMany.mockResolvedValue(posts)
      mockPrisma.post.count.mockResolvedValue(1)

      const { getUserPosts } = await import("../users.service")
      const result = await getUserPosts(userId, { take: 20 })

      expect(result.data).toEqual(posts)
      expect(mockPrisma.post.findMany).toHaveBeenCalled()
    })
  })
})
