import prisma from "../../config/database"
import { ApiError } from "../../lib/errors"
import { paginate } from "../../lib/pagination"
import { getIO } from "../../socket"
import { createNotification } from "../notifications/notifications.service"

export async function sendFriendRequest(senderId: string, receiverId: string) {
  if (senderId === receiverId) throw ApiError.badRequest("Cannot send request to yourself")

  const existing = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  })
  if (existing) throw ApiError.conflict("Friend request already exists")

  const alreadyFriends = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user1Id: senderId, user2Id: receiverId },
        { user1Id: receiverId, user2Id: senderId },
      ],
    },
  })
  if (alreadyFriends) throw ApiError.conflict("Already friends")

  const request = await prisma.friendRequest.create({
    data: { senderId, receiverId },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
  })

  getIO()?.to(`user:${receiverId}`).emit("friend_request:send", { request })

  await createNotification({
    userId: receiverId,
    actorId: senderId,
    type: "FRIEND_REQUEST",
    entityType: "FRIEND_REQUEST",
    entityId: request.id,
  })

  return request
}

export async function acceptFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } })
  if (!request) throw ApiError.notFound("Friend request not found")
  if (request.receiverId !== userId) throw ApiError.forbidden()

  const [user1Id, user2Id] = [request.senderId, request.receiverId].sort()

  const [friendship] = await Promise.all([
    prisma.friendship.create({
      data: { user1Id, user2Id },
    }),
    prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    }),
  ])

  getIO()?.to(`user:${request.senderId}`).emit("friend_request:accepted", { friendship })

  await createNotification({
    userId: request.senderId,
    actorId: userId,
    type: "FRIEND_ACCEPTED",
    entityType: "FRIEND_REQUEST",
    entityId: requestId,
  })

  return friendship
}

export async function declineFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } })
  if (!request) throw ApiError.notFound("Friend request not found")
  if (request.receiverId !== userId) throw ApiError.forbidden()

  await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: "DECLINED" },
  })

  getIO()?.to(`user:${request.senderId}`).emit("friend_request:declined", { requestId })
}

export async function getPendingRequests(userId: string) {
  const requests = await prisma.friendRequest.findMany({
    where: { receiverId: userId, status: "PENDING" },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  })
  return requests
}

export async function getSentRequests(userId: string) {
  const requests = await prisma.friendRequest.findMany({
    where: { senderId: userId, status: "PENDING" },
    include: { receiver: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  })
  return requests
}

export async function cancelFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } })
  if (!request) throw ApiError.notFound("Friend request not found")
  if (request.senderId !== userId) throw ApiError.forbidden()

  await prisma.friendRequest.delete({ where: { id: requestId } })
}

export async function getFriends(userId: string, params: { cursor?: string; take?: number }) {
  const where = {
    OR: [{ user1Id: userId }, { user2Id: userId }],
  }

  const friendships = await paginate<any>(prisma.friendship, { ...params, where })

  const friends = friendships.data.map((f) => {
    const friendId = f.user1Id === userId ? f.user2Id : f.user1Id
    return { id: f.id, user1Id: f.user1Id, user2Id: f.user2Id, createdAt: f.createdAt, friendId }
  })

  const friendIds = friends.map((f) => f.friendId)
  const friendUsers = friendIds.length > 0
    ? await prisma.user.findMany({ where: { id: { in: friendIds } }, select: { id: true, name: true, avatar: true } })
    : []

  const userMap = new Map(friendUsers.map((u) => [u.id, u]))
  const data = friends.map((f) => ({ ...f, friend: userMap.get(f.friendId) }))

  return { ...friendships, data }
}

export async function unfriend(userId: string, friendId: string) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: friendId },
        { user1Id: friendId, user2Id: userId },
      ],
    },
  })
  if (!friendship) throw ApiError.notFound("Friendship not found")

  await Promise.all([
    prisma.friendship.delete({ where: { id: friendship.id } }),
    prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    }),
  ])
}

export async function getSuggestions(userId: string) {
  const friendIds = (
    await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: { user1Id: true, user2Id: true },
    })
  ).map((f) => (f.user1Id === userId ? f.user2Id : f.user1Id))

  const requestedIds = (
    await prisma.friendRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: { senderId: true, receiverId: true },
    })
  ).flatMap((r) => (r.senderId === userId ? r.receiverId : r.senderId))

  const excludeIds = new Set([userId, ...friendIds, ...requestedIds])

  const suggestions = await prisma.user.findMany({
    where: { id: { notIn: [...excludeIds] } },
    select: { id: true, name: true, avatar: true, bio: true },
    take: 20,
  })
  return suggestions
}
