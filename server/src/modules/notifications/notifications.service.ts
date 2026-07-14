import prisma from "../../config/database"
import { ApiError } from "../../lib/errors"
import { getIO } from "../../socket"

export async function createNotification(input: {
  userId: string
  actorId: string
  type: "FRIEND_REQUEST" | "FRIEND_ACCEPTED" | "POST_REACTION" | "POST_COMMENT" | "COMMENT_REPLY" | "EVENT_INVITE"
  entityType: "POST" | "COMMENT" | "FRIEND_REQUEST" | "EVENT"
  entityId: string
}) {
  const notification = await prisma.notification.create({
    data: input,
    include: { actor: { select: { id: true, name: true, avatar: true } } },
  })

  const io = getIO()
  io?.to(`user:${input.userId}`).emit("notification:new", { notification })

  return notification
}

export async function getNotifications(userId: string, params: { cursor?: string; take?: number }) {
  const take = params.take ?? 20
  const where: any = { userId }
  if (params.cursor) {
    where.createdAt = { lt: new Date(params.cursor) }
  }

  const [data, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: { actor: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      take: take + 1,
    }),
    prisma.notification.count({ where: { userId } }),
  ])

  const hasMore = data.length > take
  const items = hasMore ? data.slice(0, take) : data
  const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null

  return { data: items, nextCursor, hasMore, total }
}

export async function getUnreadCount(userId: string) {
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  })
  return count
}

export async function markAsRead(userId: string, notificationId: string) {
  const notif = await prisma.notification.findUnique({ where: { id: notificationId }, select: { userId: true } })
  if (!notif) throw ApiError.notFound("Notification not found")
  if (notif.userId !== userId) throw ApiError.forbidden()

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  })
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })
}
