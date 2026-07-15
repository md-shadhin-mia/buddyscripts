import { describe, it, expect, vi, beforeEach } from "vitest"
import { createMockPrisma } from "../../__tests__/setup-mocks"

vi.mock("../../../config/database", () => ({ default: createMockPrisma() }))

const mockPrisma = vi.mocked((await import("../../../config/database")).default)

const userId = "user-1"
const notifId = "notif-1"

describe("NotificationsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getNotifications", () => {
    it("returns notifications for user", async () => {
      const notifs = [{ id: notifId, userId, type: "FRIEND_REQUEST", isRead: false, createdAt: new Date() }]
      mockPrisma.notification.findMany.mockResolvedValue(notifs as any)
      mockPrisma.notification.count.mockResolvedValue(1)

      const { getNotifications } = await import("../notifications.service")
      const result = await getNotifications(userId, {})

      expect(result.data).toEqual(notifs)
    })
  })

  describe("getUnreadCount", () => {
    it("returns count of unread notifications", async () => {
      mockPrisma.notification.count.mockResolvedValue(5)

      const { getUnreadCount } = await import("../notifications.service")
      const result = await getUnreadCount(userId)

      expect(result).toBe(5)
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId, isRead: false },
      })
    })
  })

  describe("markAsRead", () => {
    it("marks a notification as read", async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({ id: notifId, userId } as any)
      mockPrisma.notification.update.mockResolvedValue({} as any)

      const { markAsRead } = await import("../notifications.service")
      await markAsRead(userId, notifId)

      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: notifId },
        data: { isRead: true },
      })
    })

    it("throws 403 when not the recipient", async () => {
      mockPrisma.notification.findUnique.mockResolvedValue({ id: notifId, userId: "other-user" } as any)

      const { markAsRead } = await import("../notifications.service")
      await expect(markAsRead(userId, notifId)).rejects.toMatchObject({ statusCode: 403 })
    })
  })

  describe("markAllAsRead", () => {
    it("marks all notifications as read for the user", async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 } as any)

      const { markAllAsRead } = await import("../notifications.service")
      await markAllAsRead(userId)

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId, isRead: false },
        data: { isRead: true },
      })
    })
  })
})
