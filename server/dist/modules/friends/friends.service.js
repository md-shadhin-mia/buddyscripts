"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendRequest = sendFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.declineFriendRequest = declineFriendRequest;
exports.getPendingRequests = getPendingRequests;
exports.getSentRequests = getSentRequests;
exports.cancelFriendRequest = cancelFriendRequest;
exports.getFriends = getFriends;
exports.unfriend = unfriend;
exports.getSuggestions = getSuggestions;
const database_1 = __importDefault(require("../../config/database"));
const errors_1 = require("../../lib/errors");
const pagination_1 = require("../../lib/pagination");
const socket_1 = require("../../socket");
const notifications_service_1 = require("../notifications/notifications.service");
async function sendFriendRequest(senderId, receiverId) {
    if (senderId === receiverId)
        throw errors_1.ApiError.badRequest("Cannot send request to yourself");
    const existing = await database_1.default.friendRequest.findFirst({
        where: {
            OR: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        },
    });
    if (existing)
        throw errors_1.ApiError.conflict("Friend request already exists");
    const alreadyFriends = await database_1.default.friendship.findFirst({
        where: {
            OR: [
                { user1Id: senderId, user2Id: receiverId },
                { user1Id: receiverId, user2Id: senderId },
            ],
        },
    });
    if (alreadyFriends)
        throw errors_1.ApiError.conflict("Already friends");
    const request = await database_1.default.friendRequest.create({
        data: { senderId, receiverId },
        include: {
            sender: { select: { id: true, name: true, avatar: true } },
        },
    });
    (0, socket_1.getIO)()?.to(`user:${receiverId}`).emit("friend_request:send", { request });
    await (0, notifications_service_1.createNotification)({
        userId: receiverId,
        actorId: senderId,
        type: "FRIEND_REQUEST",
        entityType: "FRIEND_REQUEST",
        entityId: request.id,
    });
    return request;
}
async function acceptFriendRequest(userId, requestId) {
    const request = await database_1.default.friendRequest.findUnique({ where: { id: requestId } });
    if (!request)
        throw errors_1.ApiError.notFound("Friend request not found");
    if (request.receiverId !== userId)
        throw errors_1.ApiError.forbidden();
    const [user1Id, user2Id] = [request.senderId, request.receiverId].sort();
    const [friendship] = await Promise.all([
        database_1.default.friendship.create({
            data: { user1Id, user2Id },
        }),
        database_1.default.friendRequest.update({
            where: { id: requestId },
            data: { status: "ACCEPTED" },
        }),
    ]);
    (0, socket_1.getIO)()?.to(`user:${request.senderId}`).emit("friend_request:accepted", { friendship });
    await (0, notifications_service_1.createNotification)({
        userId: request.senderId,
        actorId: userId,
        type: "FRIEND_ACCEPTED",
        entityType: "FRIEND_REQUEST",
        entityId: requestId,
    });
    return friendship;
}
async function declineFriendRequest(userId, requestId) {
    const request = await database_1.default.friendRequest.findUnique({ where: { id: requestId } });
    if (!request)
        throw errors_1.ApiError.notFound("Friend request not found");
    if (request.receiverId !== userId)
        throw errors_1.ApiError.forbidden();
    await database_1.default.friendRequest.update({
        where: { id: requestId },
        data: { status: "DECLINED" },
    });
    (0, socket_1.getIO)()?.to(`user:${request.senderId}`).emit("friend_request:declined", { requestId });
}
async function getPendingRequests(userId) {
    const requests = await database_1.default.friendRequest.findMany({
        where: { receiverId: userId, status: "PENDING" },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
    });
    return requests;
}
async function getSentRequests(userId) {
    const requests = await database_1.default.friendRequest.findMany({
        where: { senderId: userId, status: "PENDING" },
        include: { receiver: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
    });
    return requests;
}
async function cancelFriendRequest(userId, requestId) {
    const request = await database_1.default.friendRequest.findUnique({ where: { id: requestId } });
    if (!request)
        throw errors_1.ApiError.notFound("Friend request not found");
    if (request.senderId !== userId)
        throw errors_1.ApiError.forbidden();
    await database_1.default.friendRequest.delete({ where: { id: requestId } });
}
async function getFriends(userId, params) {
    const where = {
        OR: [{ user1Id: userId }, { user2Id: userId }],
    };
    const friendships = await (0, pagination_1.paginate)(database_1.default.friendship, { ...params, where });
    const friends = friendships.data.map((f) => {
        const friendId = f.user1Id === userId ? f.user2Id : f.user1Id;
        return { id: f.id, user1Id: f.user1Id, user2Id: f.user2Id, createdAt: f.createdAt, friendId };
    });
    const friendIds = friends.map((f) => f.friendId);
    const friendUsers = friendIds.length > 0
        ? await database_1.default.user.findMany({ where: { id: { in: friendIds } }, select: { id: true, name: true, avatar: true } })
        : [];
    const userMap = new Map(friendUsers.map((u) => [u.id, u]));
    const data = friends.map((f) => ({ ...f, friend: userMap.get(f.friendId) }));
    return { ...friendships, data };
}
async function unfriend(userId, friendId) {
    const friendship = await database_1.default.friendship.findFirst({
        where: {
            OR: [
                { user1Id: userId, user2Id: friendId },
                { user1Id: friendId, user2Id: userId },
            ],
        },
    });
    if (!friendship)
        throw errors_1.ApiError.notFound("Friendship not found");
    await Promise.all([
        database_1.default.friendship.delete({ where: { id: friendship.id } }),
        database_1.default.friendRequest.deleteMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId },
                ],
            },
        }),
    ]);
}
async function getSuggestions(userId) {
    const friendIds = (await database_1.default.friendship.findMany({
        where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        select: { user1Id: true, user2Id: true },
    })).map((f) => (f.user1Id === userId ? f.user2Id : f.user1Id));
    const requestedIds = (await database_1.default.friendRequest.findMany({
        where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
        },
        select: { senderId: true, receiverId: true },
    })).flatMap((r) => (r.senderId === userId ? r.receiverId : r.senderId));
    const excludeIds = new Set([userId, ...friendIds, ...requestedIds]);
    const suggestions = await database_1.default.user.findMany({
        where: { id: { notIn: [...excludeIds] } },
        select: { id: true, name: true, avatar: true, bio: true },
        take: 20,
    });
    return suggestions;
}
//# sourceMappingURL=friends.service.js.map