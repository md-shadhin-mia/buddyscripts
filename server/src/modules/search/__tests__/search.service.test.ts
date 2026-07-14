import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

describe("SearchService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("search", () => {
    it("searches users by name", async () => {
      mockPrisma.user.findMany.mockResolvedValue([{ id: "u1", name: "Alice", avatar: null, bio: null }])
      mockPrisma.post.findMany.mockResolvedValue([])
      mockPrisma.event.findMany.mockResolvedValue([])

      const { search } = await import("../search.service")
      const result = await search("alice")

      expect(result.users).toHaveLength(1)
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: "alice", mode: "insensitive" } },
              { email: { contains: "alice", mode: "insensitive" } },
            ],
          },
        }),
      )
    })

    it("searches posts by content", async () => {
      mockPrisma.post.findMany.mockResolvedValue([{ id: "p1", content: "hello world", createdAt: new Date(), author: { id: "u1", name: "Alice", avatar: null } }])

      const { search } = await import("../search.service")
      const result = await search("hello", "posts")

      expect(result.posts).toHaveLength(1)
      expect(mockPrisma.post.findMany).toHaveBeenCalled()
    })

    it("searches events by title", async () => {
      mockPrisma.event.findMany.mockResolvedValue([{ id: "e1", title: "Party", description: null, startDate: new Date(), location: null, creator: { id: "u1", name: "Alice", avatar: null } }])

      const { search } = await import("../search.service")
      const result = await search("party", "events")

      expect(result.events).toHaveLength(1)
      expect(mockPrisma.event.findMany).toHaveBeenCalled()
    })

    it("returns empty results when nothing matches", async () => {
      mockPrisma.user.findMany.mockResolvedValue([])
      mockPrisma.post.findMany.mockResolvedValue([])
      mockPrisma.event.findMany.mockResolvedValue([])

      const { search } = await import("../search.service")
      const result = await search("zzzzz")

      expect(result.users).toEqual([])
      expect(result.posts).toEqual([])
      expect(result.events).toEqual([])
    })
  })
})
