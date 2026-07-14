import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const otherId = "user-2"
const requestId = "fr-1"

describe("FriendsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("sendFriendRequest", () => {
    it("creates a pending friend request", async () => {
      mockPrisma.friendRequest.findFirst.mockResolvedValue(null)
      mockPrisma.friendship.findFirst.mockResolvedValue(null)
      const request = { id: requestId, senderId: userId, receiverId: otherId, status: "PENDING" } as any
      mockPrisma.friendRequest.create.mockResolvedValue(request)

      const { sendFriendRequest } = await import("../friends.service")
      const result = await sendFriendRequest(userId, otherId)

      expect(result).toEqual(request)
    })

    it("throws 409 if request already exists", async () => {
      mockPrisma.friendRequest.findFirst.mockResolvedValue({ id: "existing" } as any)

      const { sendFriendRequest } = await import("../friends.service")
      await expect(sendFriendRequest(userId, otherId)).rejects.toMatchObject({ statusCode: 409 })
    })

    it("throws 409 if already friends", async () => {
      mockPrisma.friendRequest.findFirst.mockResolvedValue(null)
      mockPrisma.friendship.findFirst.mockResolvedValue({ id: "friendship" } as any)

      const { sendFriendRequest } = await import("../friends.service")
      await expect(sendFriendRequest(userId, otherId)).rejects.toMatchObject({ statusCode: 409 })
    })

    it("throws 400 when sending to self", async () => {
      const { sendFriendRequest } = await import("../friends.service")
      await expect(sendFriendRequest(userId, userId)).rejects.toMatchObject({ statusCode: 400 })
    })
  })

  describe("acceptFriendRequest", () => {
    it("creates a friendship and updates status", async () => {
      mockPrisma.friendRequest.findUnique.mockResolvedValue({ id: requestId, senderId: otherId, receiverId: userId, status: "PENDING" } as any)
      mockPrisma.friendRequest.update.mockResolvedValue({} as any)
      mockPrisma.friendship.create.mockResolvedValue({} as any)

      const { acceptFriendRequest } = await import("../friends.service")
      await acceptFriendRequest(userId, requestId)

      expect(mockPrisma.friendship.create).toHaveBeenCalled()
      expect(mockPrisma.friendRequest.update).toHaveBeenCalledWith({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      })
    })
  })

  describe("declineFriendRequest", () => {
    it("updates status to DECLINED", async () => {
      mockPrisma.friendRequest.findUnique.mockResolvedValue({ id: requestId, receiverId: userId } as any)
      mockPrisma.friendRequest.update.mockResolvedValue({} as any)

      const { declineFriendRequest } = await import("../friends.service")
      await declineFriendRequest(userId, requestId)

      expect(mockPrisma.friendRequest.update).toHaveBeenCalledWith({
        where: { id: requestId },
        data: { status: "DECLINED" },
      })
    })
  })

  describe("getFriends", () => {
    it("returns friends list", async () => {
      mockPrisma.friendship.findMany.mockResolvedValue([])

      const { getFriends } = await import("../friends.service")
      const result = await getFriends(userId, {})

      expect(result.data).toEqual([])
    })
  })

  describe("unfriend", () => {
    it("deletes the friendship", async () => {
      mockPrisma.friendship.findFirst.mockResolvedValue({ id: "fs-1", user1Id: userId, user2Id: otherId } as any)
      mockPrisma.friendship.delete.mockResolvedValue({} as any)
      mockPrisma.friendRequest.deleteMany.mockResolvedValue({ count: 0 })

      const { unfriend } = await import("../friends.service")
      await unfriend(userId, otherId)

      expect(mockPrisma.friendship.delete).toHaveBeenCalled()
    })
  })
})
